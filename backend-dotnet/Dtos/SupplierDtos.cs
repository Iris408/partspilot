using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Dtos;

public class SupplierCreateDto
{
    [Required, StringLength(150, MinimumLength = 1)]
    public string Name { get; set; } = "";

    [StringLength(100)]
    public string? ContactName { get; set; }

    [StringLength(150)]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? Phone { get; set; }

    [StringLength(255)]
    public string? Website { get; set; }

    [Required, StringLength(100, MinimumLength = 1)]
    public string Category { get; set; } = "";

    [StringLength(50)]
    public string Status { get; set; } = "Active";

    public string? Notes { get; set; }
}

public class SupplierUpdateDto
{
    [StringLength(150, MinimumLength = 1)]
    public string? Name { get; set; }

    [StringLength(100)]
    public string? ContactName { get; set; }

    [StringLength(150)]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? Phone { get; set; }

    [StringLength(255)]
    public string? Website { get; set; }

    [StringLength(100, MinimumLength = 1)]
    public string? Category { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }

    public string? Notes { get; set; }
}

public class SupplierResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? ContactName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string Category { get; set; } = "";
    public string Status { get; set; } = "";
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}