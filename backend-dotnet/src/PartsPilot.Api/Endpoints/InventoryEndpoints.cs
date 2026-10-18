using System.Globalization;
using PartsPilot.Domain.Inventory;
using PartsPilot.Application.Inventory;
using PartsPilot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace PartsPilot.Api.Endpoints;

public static class InventoryEndpoints
{
    public static IEndpointRouteBuilder MapInventoryEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/items/sample", () =>
        {
            var item = new InventoryItem
            {
                Id = 1,
                Name = "Brake Pad Set",
                Sku = "BRK-PAD-001",
                Category = "Braking",
                Quantity = 4,
                MinThreshold = 5,
                Price = 49.99m,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return Results.Ok(InventoryItemMapper.ToResponseDto(item));
        });

        app.MapGet("/items", async (
            AppDbContext db,
            string search = "",
            string category = "",
            string sort_by = "id",
            string order = "ascending",
            int limit = 10,
            int offset = 0) =>
        {
            if (limit < 1 || offset < 0)
            {
                return Results.BadRequest(new
                {
                    message = "Limit must be greater than zero and offset cannot be negative."
                });
            }

            var query = db.InventoryItems.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchTerm = $"%{search}%";

                query = query.Where(item =>
                    EF.Functions.ILike(item.Name, searchTerm) ||
                    EF.Functions.ILike(item.Sku, searchTerm));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                var categoryTerm = $"%{category}%";
                query = query.Where(item =>
                    EF.Functions.ILike(item.Category, categoryTerm));
            }

            var descending = order == "descending";

            query = sort_by switch
            {
                "price" => descending
                    ? query.OrderByDescending(item => item.Price)
                    : query.OrderBy(item => item.Price),

                "quantity" => descending
                    ? query.OrderByDescending(item => item.Quantity)
                    : query.OrderBy(item => item.Quantity),

                _ => descending
                    ? query.OrderByDescending(item => item.Id)
                    : query.OrderBy(item => item.Id)
            };

            var items = await query
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            var response = items
                .Select(InventoryItemMapper.ToResponseDto)
                .ToList();

            return Results.Ok(response);
        });

        app.MapGet("/items/{id:int}", async (int id, AppDbContext db) =>
        {
            var item = await db.InventoryItems.FindAsync(id);

            if (item is null)
            {
                return Results.NotFound(new
                {
                    message = $"Inventory item with id {id} was not found."
                });
            }

            return Results.Ok(InventoryItemMapper.ToResponseDto(item));
        });

        app.MapPost("/items", async (InventoryItemCreateDto request, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Sku) ||
                string.IsNullOrWhiteSpace(request.Category) ||
                request.Quantity < 0 ||
                request.MinThreshold < 0 ||
                request.Price < 0)
            {
                return Results.BadRequest(new
                {
                    message = "Provide a name, SKU, and category. Quantity, minimum threshold, and price must be zero or greater."
                });
            }

            var skuExists = await db.InventoryItems
                .AnyAsync(item => item.Sku == request.Sku);

            if (skuExists)
            {
                return Results.Conflict(new
                {
                    message = "An inventory item with this SKU already exists."
                });
            }

            var now = DateTime.UtcNow;

            var item = new InventoryItem
            {
                Name = request.Name.Trim(),
                Sku = request.Sku.Trim(),
                Category = request.Category.Trim(),
                Quantity = request.Quantity,
                MinThreshold = request.MinThreshold,
                Price = request.Price,
                CreatedAt = now,
                UpdatedAt = now
            };

            db.InventoryItems.Add(item);
            await db.SaveChangesAsync();

            return Results.Created(
                $"/items/{item.Id}",
                InventoryItemMapper.ToResponseDto(item)
            );
        });

        app.MapGet("/items/low-stock", async (AppDbContext db) =>
        {
            var items = await db.InventoryItems
                .Where(item => item.Quantity > 0 &&
                               item.Quantity <= item.MinThreshold)
                .OrderBy(item => item.Id)
                .ToListAsync();

            var response = items
                .Select(InventoryItemMapper.ToResponseDto)
                .ToList();

            return Results.Ok(response);
        });

        app.MapGet("/items/stats", async (AppDbContext db) =>
        {
            var items = await db.InventoryItems.ToListAsync();

            var totalQuantity = items.Sum(item => item.Quantity);
            var totalInventoryValue = items.Sum(item => item.Quantity * item.Price);

            var inStockCount = items.Count(item =>
                item.Quantity > item.MinThreshold);

            var lowStockCount = items.Count(item =>
                item.Quantity > 0 &&
                item.Quantity <= item.MinThreshold);

            var outOfStockCount = items.Count(item =>
                item.Quantity == 0);

            var averageItemPrice = totalQuantity > 0
                ? totalInventoryValue / totalQuantity
                : 0m;

            return Results.Ok(new
            {
                totalProducts = items.Count,
                totalQuantity,
                totalInventoryValue = Math.Round(totalInventoryValue, 2),
                averageItemPrice = Math.Round(averageItemPrice, 2),
                inStockCount,
                lowStockCount,
                outOfStockCount
            });
        });

        app.MapPut("/items/{id:int}", async (
            int id,
            InventoryItemCreateDto request,
            AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Sku) ||
                string.IsNullOrWhiteSpace(request.Category) ||
                request.Quantity < 0 ||
                request.MinThreshold < 0 ||
                request.Price < 0)
            {
                return Results.BadRequest(new
                {
                    message = "Provide a name, SKU, and category. Quantity, minimum threshold, and price must be zero or greater."
                });
            }

            var item = await db.InventoryItems.FindAsync(id);

            if (item is null)
            {
                return Results.NotFound(new
                {
                    message = $"Inventory item with id {id} was not found."
                });
            }

            var skuExists = await db.InventoryItems
                .AnyAsync(existing => existing.Sku == request.Sku && existing.Id != id);

            if (skuExists)
            {
                return Results.Conflict(new
                {
                    message = "An inventory item with this SKU already exists."
                });
            }

            item.Name = request.Name.Trim();
            item.Sku = request.Sku.Trim();
            item.Category = request.Category.Trim();
            item.Quantity = request.Quantity;
            item.MinThreshold = request.MinThreshold;
            item.Price = request.Price;
            item.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(InventoryItemMapper.ToResponseDto(item));
        });

        app.MapDelete("/items/{id:int}", async (int id, AppDbContext db) =>
        {
            var item = await db.InventoryItems.FindAsync(id);

            if (item is null)
            {
                return Results.NotFound(new
                {
                    message = $"Inventory item with id {id} was not found."
                });
            }

            db.InventoryItems.Remove(item);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        app.MapGet("/items/recent", async (AppDbContext db, int limit = 5) =>
        {
            var items = await db.InventoryItems
                .OrderByDescending(item => item.CreatedAt)
                .Take(limit)
                .ToListAsync();

            var response = items
                .Select(InventoryItemMapper.ToResponseDto)
                .ToList();

            return Results.Ok(response);
        });

        app.MapGet("/items/category-summary", async (AppDbContext db) =>
        {
            var items = await db.InventoryItems.ToListAsync();

            var summary = items
                .GroupBy(item => item.Category)
                .ToDictionary(
                    group => group.Key,
                    group => group.Sum(item => item.Quantity)
                );

            return Results.Ok(summary);
        });

        app.MapGet("/items/category-value", async (AppDbContext db) =>
        {
            var items = await db.InventoryItems.ToListAsync();

            var categoryValues = items
                .GroupBy(item => item.Category)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .Sum(item => item.Quantity * item.Price)
                        .ToString("F2", CultureInfo.InvariantCulture)
                );

            return Results.Ok(categoryValues);
        });

        app.MapGet("/items/highest-value", async (AppDbContext db) =>
        {
            var items = await db.InventoryItems.ToListAsync();

            var highestItem = items
                .OrderByDescending(item => item.Quantity * item.Price)
                .ThenBy(item => item.Id)
                .FirstOrDefault();

            if (highestItem is null)
            {
                return Results.NotFound(new
                {
                    detail = "No items found"
                });
            }

            return Results.Ok(new
            {
                highestItem.Name,
                highestItem.Category,
                inventoryValue = (highestItem.Quantity * highestItem.Price)
                    .ToString("F2", CultureInfo.InvariantCulture)
            });
        });

        app.MapGet("/items/lowest-stock", async (AppDbContext db) =>
        {
            var lowestItem = await db.InventoryItems
                .OrderBy(item => item.Quantity)
                .ThenBy(item => item.Id)
                .FirstOrDefaultAsync();

            if (lowestItem is null)
            {
                return Results.NotFound(new
                {
                    detail = "No items found"
                });
            }

            var itemResponse = InventoryItemMapper.ToResponseDto(lowestItem);

            return Results.Ok(new
            {
                itemResponse.Name,
                itemResponse.Category,
                itemResponse.Quantity,
                itemResponse.StockStatus
            });
        });

        app.MapGet("/items/summary/value", async (AppDbContext db) =>
        {
            var items = await db.InventoryItems.ToListAsync();
            var totalValue = items.Sum(item => item.Quantity * item.Price);

            return Results.Ok(new
            {
                totalInventoryValue = totalValue
            });
        });

        return app;
    }
}
