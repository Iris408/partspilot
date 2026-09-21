using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InventoryItem>(entity =>
        {
            entity.ToTable("items");

            entity.HasKey(item => item.Id);

            entity.Property(item => item.Name)
                .HasColumnName("name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(item => item.Sku)
                .HasColumnName("sku")
                .HasMaxLength(50)
                .IsRequired();

            entity.HasIndex(item => item.Sku)
                .IsUnique();

            entity.Property(item => item.Category)
                .HasColumnName("category")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(item => item.Quantity)
                .HasColumnName("quantity")
                .IsRequired();

            entity.Property(item => item.MinThreshold)
                .HasColumnName("min_threshold")
                .HasDefaultValue(5)
                .IsRequired();

            entity.Property(item => item.Price)
                .HasColumnName("price")
                .HasPrecision(10, 2)
                .IsRequired();

            entity.Property(item => item.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(item => item.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();
        });
    }
}