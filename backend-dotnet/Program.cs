using System.Text.Json;
using backend_dotnet.Models;
using backend_dotnet.Services;
using backend_dotnet.Dtos;
using backend_dotnet.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    service = "partspilot-api",
    version = "v3.0.0"
}));

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

app.MapGet("/items", async (AppDbContext db) =>
{
    var items = await db.InventoryItems
        .OrderBy(item => item.Id)
        .ToListAsync();

    var response = items
        .Select(InventoryItemMapper.ToResponseDto)
        .ToList();

    return Results.Ok(response);
});

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

app.Run();