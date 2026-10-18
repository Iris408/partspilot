using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Supplier> Suppliers => Set<Supplier>();

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

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.ToTable("suppliers");
            entity.HasKey(supplier => supplier.Id);

            entity.HasIndex(supplier => supplier.Name);

            entity.Property(supplier => supplier.Name)
                .HasColumnName("name")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(supplier => supplier.ContactName)
                .HasColumnName("contact_name")
                .HasMaxLength(100);

            entity.Property(supplier => supplier.Email)
                .HasColumnName("email")
                .HasMaxLength(150);

            entity.Property(supplier => supplier.Phone)
                .HasColumnName("phone")
                .HasMaxLength(50);

            entity.Property(supplier => supplier.Website)
                .HasColumnName("website")
                .HasMaxLength(255);

            entity.Property(supplier => supplier.Category)
                .HasColumnName("category")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(supplier => supplier.Status)
                .HasColumnName("status")
                .HasMaxLength(50)
                .HasDefaultValue("Active")
                .IsRequired();

            entity.Property(supplier => supplier.Notes)
                .HasColumnName("notes")
                .HasColumnType("text");

            entity.Property(supplier => supplier.CreatedAt)
                .HasColumnName("created_at");

            entity.Property(supplier => supplier.UpdatedAt)
                .HasColumnName("updated_at");
        });
    }
}