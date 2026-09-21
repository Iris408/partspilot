using backend_dotnet.Dtos;
using backend_dotnet.Models;

namespace backend_dotnet.Services;

public static class InventoryItemMapper
{
    public static InventoryItemResponseDto ToResponseDto(InventoryItem item)
    {
        return new InventoryItemResponseDto
        {
            Id = item.Id,
            Name = item.Name,
            Sku = item.Sku,
            Category = item.Category,
            Quantity = item.Quantity,
            MinThreshold = item.MinThreshold,
            Price = item.Price,
            StockStatus = InventoryStatusService.GetStockStatus(
                item.Quantity,
                item.MinThreshold
            ),
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }
}