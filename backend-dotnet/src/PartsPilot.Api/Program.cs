using System.Text.Json;
using PartsPilot.Api.Endpoints;
using PartsPilot.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
});

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapHealthEndpoints();
app.MapInventoryEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapDevEndpoints();
}

app.MapSupplierEndpoints();

app.Run();
