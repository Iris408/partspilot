namespace PartsPilot.Domain.Suppliers;

public class Supplier
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? ContactName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public required string Category { get; set; }
    public string Status { get; set; } = "Active";
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}