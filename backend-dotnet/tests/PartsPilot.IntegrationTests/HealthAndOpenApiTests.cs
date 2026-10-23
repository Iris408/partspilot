using System.Net;
using System.Text.Json;
using PartsPilot.IntegrationTests.Infrastructure;

namespace PartsPilot.IntegrationTests;

public class HealthAndOpenApiTests(ApiFixture fixture) : ApiTestBase(fixture)
{
    [Fact]
    public async Task Health_returns_service_status()
    {
        var response = await Client.GetAsync("/health");

        await AssertJsonAsync(response, HttpStatusCode.OK,
            """{"status":"ok","service":"partspilot-api","version":"3.0.0"}""");
    }

    [Fact]
    public async Task OpenApi_document_is_served_in_development_and_lists_existing_routes()
    {
        var response = await Client.GetAsync("/openapi/v1.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var paths = document.RootElement.GetProperty("paths")
            .EnumerateObject()
            .Select(path => path.Name)
            .Order(StringComparer.Ordinal)
            .ToArray();

        Assert.Equal(
            [
                "/dev/seed-items",
                "/health",
                "/items",
                "/items/category-summary",
                "/items/category-value",
                "/items/highest-value",
                "/items/low-stock",
                "/items/lowest-stock",
                "/items/recent",
                "/items/sample",
                "/items/stats",
                "/items/summary/value",
                "/items/{id}",
                "/suppliers",
                "/suppliers/{id}"
            ],
            paths);
    }
}
