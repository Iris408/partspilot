using System.Net;
using Microsoft.Extensions.DependencyInjection;
using PartsPilot.Domain.Suppliers;
using PartsPilot.Infrastructure.Persistence;
using PartsPilot.IntegrationTests.Infrastructure;

namespace PartsPilot.IntegrationTests;

public class SupplierEndpointTests(ApiFixture fixture) : ApiTestBase(fixture)
{
    private const string ZetaParts =
        """{"id":1,"name":"Zeta Parts","contact_name":"Ann Lee","email":"ann@zeta.test","phone":"555-0100","website":"https://zeta.test","category":"Braking","status":"Active","notes":"Primary","created_at":"2026-01-01T00:00:00Z","updated_at":"2026-01-02T00:00:00Z"}""";

    private const string AcmeAuto =
        """{"id":2,"name":"Acme Auto","contact_name":null,"email":null,"phone":null,"website":null,"category":"Engine","status":"Active","notes":null,"created_at":"2026-01-03T00:00:00Z","updated_at":"2026-01-03T00:00:00Z"}""";

    [Fact]
    public async Task Endpoints_on_empty_database()
    {
        await AssertJsonAsync(await Client.GetAsync("/suppliers"), HttpStatusCode.OK, "[]");
        await AssertJsonAsync(await Client.GetAsync("/suppliers/1"), HttpStatusCode.NotFound,
            """{"detail":"Supplier not found"}""");
    }

    [Fact]
    public async Task List_orders_by_name_and_get_returns_single_supplier()
    {
        await SeedSuppliersAsync();

        await AssertJsonAsync(await Client.GetAsync("/suppliers"), HttpStatusCode.OK, $"[{AcmeAuto},{ZetaParts}]");
        await AssertJsonAsync(await Client.GetAsync("/suppliers/1"), HttpStatusCode.OK, ZetaParts);
        await AssertJsonAsync(await Client.GetAsync("/suppliers/2"), HttpStatusCode.OK, AcmeAuto);
        await AssertJsonAsync(await Client.GetAsync("/suppliers/999"), HttpStatusCode.NotFound,
            """{"detail":"Supplier not found"}""");
    }

    private async Task SeedSuppliersAsync()
    {
        using var scope = Fixture.Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        db.Suppliers.Add(new Supplier
        {
            Name = "Zeta Parts",
            ContactName = "Ann Lee",
            Email = "ann@zeta.test",
            Phone = "555-0100",
            Website = "https://zeta.test",
            Category = "Braking",
            Notes = "Primary",
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc)
        });
        await db.SaveChangesAsync();

        db.Suppliers.Add(new Supplier
        {
            Name = "Acme Auto",
            Category = "Engine",
            CreatedAt = new DateTime(2026, 1, 3, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 1, 3, 0, 0, 0, DateTimeKind.Utc)
        });
        await db.SaveChangesAsync();
    }
}
