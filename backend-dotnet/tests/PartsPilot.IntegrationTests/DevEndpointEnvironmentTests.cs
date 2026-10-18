using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using PartsPilot.IntegrationTests.Infrastructure;

namespace PartsPilot.IntegrationTests;

public class DevEndpointEnvironmentTests(ApiFixture fixture) : ApiTestBase(fixture)
{
    private const string SeedRoute = "/dev/seed-items";

    [Fact]
    public void Seed_endpoint_is_registered_in_Development()
    {
        Assert.True(IsSeedEndpointRegistered(Fixture.Factory));
    }

    [Theory]
    [InlineData("Production")]
    [InlineData("Staging")]
    public async Task Seed_endpoint_is_not_registered_outside_Development(string environment)
    {
        await using var factory = CreateFactory(environment);

        Assert.False(IsSeedEndpointRegistered(factory));
    }

    [Theory]
    [InlineData("Production")]
    [InlineData("Staging")]
    public async Task Seed_request_outside_Development_returns_not_found_and_does_not_seed(string environment)
    {
        await using var factory = CreateFactory(environment);
        using var client = factory.CreateClient();

        var post = await client.PostAsync(SeedRoute, null);
        var get = await client.GetAsync(SeedRoute);

        Assert.Equal(HttpStatusCode.NotFound, post.StatusCode);
        Assert.Equal(string.Empty, await post.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);

        await AssertJsonAsync(await client.GetAsync("/items"), HttpStatusCode.OK, "[]");
    }

    [Theory]
    [InlineData("Production")]
    [InlineData("Staging")]
    public async Task Health_still_works_outside_Development(string environment)
    {
        await using var factory = CreateFactory(environment);
        using var client = factory.CreateClient();

        await AssertJsonAsync(await client.GetAsync("/health"), HttpStatusCode.OK,
            """{"status":"ok","service":"partspilot-api","version":"v3.0.0"}""");
    }

    private WebApplicationFactory<Program> CreateFactory(string environment) =>
        Fixture.Factory.WithWebHostBuilder(builder => builder.UseEnvironment(environment));

    private static bool IsSeedEndpointRegistered(WebApplicationFactory<Program> factory) =>
        factory.Services.GetRequiredService<EndpointDataSource>()
            .Endpoints
            .OfType<RouteEndpoint>()
            .Any(endpoint =>
                endpoint.RoutePattern.RawText == SeedRoute &&
                endpoint.Metadata.GetMetadata<IHttpMethodMetadata>()?.HttpMethods.Contains("POST") == true);
}
