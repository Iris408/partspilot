namespace backend_dotnet.Services;

public static class InventoryStatusService
{
    public static string GetStockStatus(int quantity, int MinThreshold)
    {
        if (quantity == 0)
        {
            return "Out of Stock";
        }

        if (quantity <= MinThreshold)
        {
            return "Low Stock";
        }

        return "In Stock";
    }
}