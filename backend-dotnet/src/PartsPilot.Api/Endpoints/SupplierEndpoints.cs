using PartsPilot.Domain.Suppliers;
using PartsPilot.Application.Suppliers;
using PartsPilot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace PartsPilot.Api.Endpoints;

public static class SupplierEndpoints
{
    public static IEndpointRouteBuilder MapSupplierEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/suppliers", async (AppDbContext db) =>
        {
            var suppliers = await db.Set<Supplier>()
                .OrderBy(supplier => supplier.Name)
                .Select(supplier => new SupplierResponseDto
                {
                    Id = supplier.Id,
                    Name = supplier.Name,
                    ContactName = supplier.ContactName,
                    Email = supplier.Email,
                    Phone = supplier.Phone,
                    Website = supplier.Website,
                    Category = supplier.Category,
                    Status = supplier.Status,
                    Notes = supplier.Notes,
                    CreatedAt = supplier.CreatedAt,
                    UpdatedAt = supplier.UpdatedAt
                })
                .ToListAsync();

            return Results.Ok(suppliers);
        });

        app.MapGet("/suppliers/{id:int}", async (int id, AppDbContext db) =>
        {
            var supplier = await db.Suppliers.FindAsync(id);

            if (supplier is null)
            {
                return Results.NotFound(new
                {
                    detail = "Supplier not found"
                });
            }

            return Results.Ok(new SupplierResponseDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactName = supplier.ContactName,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Website = supplier.Website,
                Category = supplier.Category,
                Status = supplier.Status,
                Notes = supplier.Notes,
                CreatedAt = supplier.CreatedAt,
                UpdatedAt = supplier.UpdatedAt
            });
        });

        return app;
    }
}
