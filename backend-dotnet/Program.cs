using System.Text.Json;
using backend_dotnet.Models;
using backend_dotnet.Services;
using System.Text.Json;
using backend_dotnet.Data;
using backend_dotnet.Services;
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
        .Select(item => InventoryItemMapper.ToResponseDto(item))
        .ToListAsync();

    return Results.Ok(items);
});

app.Run();