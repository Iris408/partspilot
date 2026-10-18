using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace PartsPilot.IntegrationTests.Infrastructure;

[Collection(ApiCollection.Name)]
public abstract partial class ApiTestBase : IAsyncLifetime
{
    protected ApiTestBase(ApiFixture fixture)
    {
        Fixture = fixture;
        Client = fixture.Factory.CreateClient();
    }

    protected ApiFixture Fixture { get; }

    protected HttpClient Client { get; }

    public Task InitializeAsync() => Fixture.ResetDatabaseAsync();

    public Task DisposeAsync()
    {
        Client.Dispose();
        return Task.CompletedTask;
    }

    protected async Task SeedItemsAsync()
    {
        var response = await Client.PostAsync("/dev/seed-items", null);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    protected Task<HttpResponseMessage> SendJsonAsync(HttpMethod method, string path, string json) =>
        Client.SendAsync(new HttpRequestMessage(method, path)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        });

    /// <summary>
    /// Asserts status code, JSON content type and the exact response body. Timestamps generated
    /// at request time are replaced with &lt;ts&gt; before comparison.
    /// </summary>
    protected static async Task AssertJsonAsync(
        HttpResponseMessage response,
        HttpStatusCode expectedStatus,
        string expectedBody)
    {
        Assert.Equal(expectedStatus, response.StatusCode);
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());

        var body = await response.Content.ReadAsStringAsync();
        Assert.Equal(expectedBody, NormaliseTimestamps(body));
    }

    protected static string NormaliseTimestamps(string body) =>
        GeneratedTimestamp().Replace(body, match => $"\"{match.Groups[1].Value}\":\"<ts>\"");

    [GeneratedRegex("\"(created_at|updated_at)\":\"(?!2026-01-0)[^\"]+\"")]
    private static partial Regex GeneratedTimestamp();
}
