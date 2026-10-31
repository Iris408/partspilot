
namespace PartsPilot.Api.Endpoints;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", () => Results.Ok(new
        {
            status = "ok",
            service = "partspilot-api",
            version = "3.0.0"
        }));

        return app;
    }
}
