using PartsPilot.Domain.Inventory;

namespace PartsPilot.UnitTests.Inventory;

public class InventoryStatusServiceTests
{
    [Theory]
    [InlineData(0, 5, "Out of Stock")]
    [InlineData(0, 0, "Out of Stock")]
    [InlineData(1, 5, "Low Stock")]
    [InlineData(5, 5, "Low Stock")]
    [InlineData(6, 5, "In Stock")]
    [InlineData(1, 0, "In Stock")]
    public void GetStockStatus_returns_status_for_quantity_and_threshold(
        int quantity,
        int minThreshold,
        string expected)
    {
        var status = InventoryStatusService.GetStockStatus(quantity, minThreshold);

        Assert.Equal(expected, status);
    }
}
