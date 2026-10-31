using PartsPilot.Domain.Inventory;
using PartsPilot.Application.Inventory;
using PartsPilot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace PartsPilot.Api.Endpoints;

public static class DevEndpoints
{
    public static IEndpointRouteBuilder MapDevEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/dev/seed-items", async (AppDbContext db) =>
        {
            if (await db.InventoryItems.AnyAsync())
            {
                return Results.Conflict(new
                {
                    message = "Inventory items already exist."
                });
            }

            var now = DateTime.UtcNow;

            var items = new List<InventoryItem>
            {
                new()
                {
                    Name = "Brake Pad Set",
                    Sku = "BRK-PAD-001",
                    Category = "Braking",
                    Quantity = 4,
                    MinThreshold = 5,
                    Price = 49.99m,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    Name = "Oil Filter",
                    Sku = "OIL-FLT-001",
                    Category = "Engine",
                    Quantity = 18,
                    MinThreshold = 6,
                    Price = 12.50m,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    Name = "Wiper Blade Pair",
                    Sku = "WPR-BLD-001",
                    Category = "Exterior",
                    Quantity = 0,
                    MinThreshold = 4,
                    Price = 21.75m,
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            db.InventoryItems.AddRange(items);
            await db.SaveChangesAsync();

            var response = items
                .Select(InventoryItemMapper.ToResponseDto)
                .ToList();

            return Results.Created("/items", response);
        });

        return app;
    }
}
