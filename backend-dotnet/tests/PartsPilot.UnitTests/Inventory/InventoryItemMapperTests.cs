using PartsPilot.Application.Inventory;
using PartsPilot.Domain.Inventory;

namespace PartsPilot.UnitTests.Inventory;

public class InventoryItemMapperTests
{
    [Fact]
    public void ToResponseDto_copies_all_fields_and_derives_stock_status()
    {
        var createdAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var updatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc);

        var item = new InventoryItem
        {
            Id = 7,
            Name = "Brake Pad Set",
            Sku = "BRK-PAD-001",
            Category = "Braking",
            Quantity = 4,
            MinThreshold = 5,
            Price = 49.99m,
            CreatedAt = createdAt,
            UpdatedAt = updatedAt
        };

        var dto = InventoryItemMapper.ToResponseDto(item);

        Assert.Equal(7, dto.Id);
        Assert.Equal("Brake Pad Set", dto.Name);
        Assert.Equal("BRK-PAD-001", dto.Sku);
        Assert.Equal("Braking", dto.Category);
        Assert.Equal(4, dto.Quantity);
        Assert.Equal(5, dto.MinThreshold);
        Assert.Equal(49.99m, dto.Price);
        Assert.Equal("Low Stock", dto.StockStatus);
        Assert.Equal(createdAt, dto.CreatedAt);
        Assert.Equal(updatedAt, dto.UpdatedAt);
    }
}
