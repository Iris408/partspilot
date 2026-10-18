using System.ComponentModel.DataAnnotations;

namespace PartsPilot.Application.Inventory;

public class InventoryItemCreateDto
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 1)]
    public string Sku { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Category { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(0, int.MaxValue)]
    public int MinThreshold { get; set; } = 5;

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal Price { get; set; }
}

public class InventoryItemResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Sku { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public int MinThreshold { get; set; }

    public decimal Price { get; set; }

    public string StockStatus { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}