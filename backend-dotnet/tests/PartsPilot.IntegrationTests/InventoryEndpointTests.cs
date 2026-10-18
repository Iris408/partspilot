using System.Net;
using PartsPilot.IntegrationTests.Infrastructure;

namespace PartsPilot.IntegrationTests;

public class InventoryEndpointTests(ApiFixture fixture) : ApiTestBase(fixture)
{
    private const string BrakePads =
        """{"id":1,"name":"Brake Pad Set","sku":"BRK-PAD-001","category":"Braking","quantity":4,"min_threshold":5,"price":49.99,"stock_status":"Low Stock","created_at":"<ts>","updated_at":"<ts>"}""";

    private const string OilFilter =
        """{"id":2,"name":"Oil Filter","sku":"OIL-FLT-001","category":"Engine","quantity":18,"min_threshold":6,"price":12.50,"stock_status":"In Stock","created_at":"<ts>","updated_at":"<ts>"}""";

    private const string WiperBlades =
        """{"id":3,"name":"Wiper Blade Pair","sku":"WPR-BLD-001","category":"Exterior","quantity":0,"min_threshold":4,"price":21.75,"stock_status":"Out of Stock","created_at":"<ts>","updated_at":"<ts>"}""";

    private const string ValidationMessage =
        """{"message":"Provide a name, SKU, and category. Quantity, minimum threshold, and price must be zero or greater."}""";

    private const string DuplicateSkuMessage =
        """{"message":"An inventory item with this SKU already exists."}""";

    [Fact]
    public async Task Sample_returns_static_item()
    {
        await AssertJsonAsync(await Client.GetAsync("/items/sample"), HttpStatusCode.OK, BrakePads);
    }

    [Fact]
    public async Task Seed_creates_items_once()
    {
        var created = await Client.PostAsync("/dev/seed-items", null);

        await AssertJsonAsync(created, HttpStatusCode.Created, $"[{BrakePads},{OilFilter},{WiperBlades}]");
        Assert.Equal("/items", created.Headers.Location?.OriginalString);

        await AssertJsonAsync(
            await Client.PostAsync("/dev/seed-items", null),
            HttpStatusCode.Conflict,
            """{"message":"Inventory items already exist."}""");
    }

    [Fact]
    public async Task Read_endpoints_on_empty_database()
    {
        await AssertJsonAsync(await Client.GetAsync("/items"), HttpStatusCode.OK, "[]");
        await AssertJsonAsync(await Client.GetAsync("/items/low-stock"), HttpStatusCode.OK, "[]");
        await AssertJsonAsync(await Client.GetAsync("/items/recent"), HttpStatusCode.OK, "[]");
        await AssertJsonAsync(await Client.GetAsync("/items/category-summary"), HttpStatusCode.OK, "{}");
        await AssertJsonAsync(await Client.GetAsync("/items/category-value"), HttpStatusCode.OK, "{}");
        await AssertJsonAsync(await Client.GetAsync("/items/summary/value"), HttpStatusCode.OK,
            """{"total_inventory_value":0}""");
        await AssertJsonAsync(await Client.GetAsync("/items/stats"), HttpStatusCode.OK,
            """{"total_products":0,"total_quantity":0,"total_inventory_value":0,"average_item_price":0,"in_stock_count":0,"low_stock_count":0,"out_of_stock_count":0}""");
        await AssertJsonAsync(await Client.GetAsync("/items/highest-value"), HttpStatusCode.NotFound,
            """{"detail":"No items found"}""");
        await AssertJsonAsync(await Client.GetAsync("/items/lowest-stock"), HttpStatusCode.NotFound,
            """{"detail":"No items found"}""");
    }

    [Theory]
    [InlineData("/items", $"[{BrakePads},{OilFilter},{WiperBlades}]")]
    [InlineData("/items?search=BRK", $"[{BrakePads}]")]
    [InlineData("/items?search=filter", $"[{OilFilter}]")]
    [InlineData("/items?category=brak", $"[{BrakePads}]")]
    [InlineData("/items?sort_by=price&order=descending", $"[{BrakePads},{WiperBlades},{OilFilter}]")]
    [InlineData("/items?sort_by=quantity", $"[{WiperBlades},{BrakePads},{OilFilter}]")]
    [InlineData("/items?limit=2&offset=1", $"[{OilFilter},{WiperBlades}]")]
    [InlineData("/items/1", BrakePads)]
    [InlineData("/items/low-stock", $"[{BrakePads}]")]
    [InlineData("/items/recent?limit=1", $"[{BrakePads}]")]
    [InlineData("/items/stats", """{"total_products":3,"total_quantity":22,"total_inventory_value":424.96,"average_item_price":19.32,"in_stock_count":1,"low_stock_count":1,"out_of_stock_count":1}""")]
    [InlineData("/items/category-summary", """{"Braking":4,"Engine":18,"Exterior":0}""")]
    [InlineData("/items/category-value", """{"Braking":"199.96","Engine":"225.00","Exterior":"0.00"}""")]
    [InlineData("/items/highest-value", """{"name":"Oil Filter","category":"Engine","inventory_value":"225.00"}""")]
    [InlineData("/items/lowest-stock", """{"name":"Wiper Blade Pair","category":"Exterior","quantity":0,"stock_status":"Out of Stock"}""")]
    [InlineData("/items/summary/value", """{"total_inventory_value":424.96}""")]
    public async Task Read_endpoints_after_seed(string path, string expectedBody)
    {
        await SeedItemsAsync();

        await AssertJsonAsync(await Client.GetAsync(path), HttpStatusCode.OK, expectedBody);
    }

    [Theory]
    [InlineData("/items?limit=0")]
    [InlineData("/items?offset=-1")]
    public async Task List_rejects_invalid_paging(string path)
    {
        await AssertJsonAsync(await Client.GetAsync(path), HttpStatusCode.BadRequest,
            """{"message":"Limit must be greater than zero and offset cannot be negative."}""");
    }

    [Fact]
    public async Task Get_by_id_returns_not_found_for_missing_item()
    {
        await AssertJsonAsync(await Client.GetAsync("/items/999"), HttpStatusCode.NotFound,
            """{"message":"Inventory item with id 999 was not found."}""");
    }

    [Fact]
    public async Task Create_trims_and_persists_item()
    {
        await SeedItemsAsync();

        var response = await SendJsonAsync(HttpMethod.Post, "/items",
            """{"name":"  Spark Plug  ","sku":"SPK-PLG-001","category":"Engine","quantity":10,"min_threshold":3,"price":7.25}""");

        await AssertJsonAsync(response, HttpStatusCode.Created,
            """{"id":4,"name":"Spark Plug","sku":"SPK-PLG-001","category":"Engine","quantity":10,"min_threshold":3,"price":7.25,"stock_status":"In Stock","created_at":"<ts>","updated_at":"<ts>"}""");
        Assert.Equal("/items/4", response.Headers.Location?.OriginalString);
    }

    [Fact]
    public async Task Create_applies_defaults_for_missing_numbers()
    {
        var response = await SendJsonAsync(HttpMethod.Post, "/items",
            """{"name":"Defaults","sku":"X-3","category":"Engine"}""");

        await AssertJsonAsync(response, HttpStatusCode.Created,
            """{"id":1,"name":"Defaults","sku":"X-3","category":"Engine","quantity":0,"min_threshold":5,"price":0,"stock_status":"Out of Stock","created_at":"<ts>","updated_at":"<ts>"}""");
    }

    [Theory]
    [InlineData("""{"name":"","sku":"X-1","category":"Engine","quantity":1,"min_threshold":1,"price":1}""")]
    [InlineData("""{"name":"Neg","sku":"X-2","category":"Engine","quantity":-1,"min_threshold":1,"price":1}""")]
    public async Task Create_rejects_invalid_item(string json)
    {
        await AssertJsonAsync(await SendJsonAsync(HttpMethod.Post, "/items", json),
            HttpStatusCode.BadRequest, ValidationMessage);
    }

    [Fact]
    public async Task Create_rejects_duplicate_sku()
    {
        await SeedItemsAsync();

        var response = await SendJsonAsync(HttpMethod.Post, "/items",
            """{"name":"Dup","sku":"BRK-PAD-001","category":"Engine","quantity":1,"min_threshold":1,"price":1}""");

        await AssertJsonAsync(response, HttpStatusCode.Conflict, DuplicateSkuMessage);
    }

    [Fact]
    public async Task Update_replaces_item_fields()
    {
        await SeedItemsAsync();

        var response = await SendJsonAsync(HttpMethod.Put, "/items/1",
            """{"name":" Brake Pad Set HD ","sku":"BRK-PAD-002","category":"Braking","quantity":2,"min_threshold":3,"price":59.99}""");

        var expected =
            """{"id":1,"name":"Brake Pad Set HD","sku":"BRK-PAD-002","category":"Braking","quantity":2,"min_threshold":3,"price":59.99,"stock_status":"Low Stock","created_at":"<ts>","updated_at":"<ts>"}""";

        await AssertJsonAsync(response, HttpStatusCode.OK, expected);
        await AssertJsonAsync(await Client.GetAsync("/items/1"), HttpStatusCode.OK, expected);
    }

    [Fact]
    public async Task Update_returns_errors_for_invalid_missing_and_duplicate()
    {
        await SeedItemsAsync();

        await AssertJsonAsync(
            await SendJsonAsync(HttpMethod.Put, "/items/1",
                """{"name":"N","sku":"N-2","category":"","quantity":1,"min_threshold":1,"price":1}"""),
            HttpStatusCode.BadRequest, ValidationMessage);

        await AssertJsonAsync(
            await SendJsonAsync(HttpMethod.Put, "/items/999",
                """{"name":"N","sku":"N-1","category":"C","quantity":1,"min_threshold":1,"price":1}"""),
            HttpStatusCode.NotFound,
            """{"message":"Inventory item with id 999 was not found."}""");

        await AssertJsonAsync(
            await SendJsonAsync(HttpMethod.Put, "/items/1",
                """{"name":"N","sku":"OIL-FLT-001","category":"C","quantity":1,"min_threshold":1,"price":1}"""),
            HttpStatusCode.Conflict, DuplicateSkuMessage);
    }

    [Fact]
    public async Task Delete_removes_item_then_returns_not_found()
    {
        await SeedItemsAsync();

        var deleted = await Client.DeleteAsync("/items/3");
        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        Assert.Equal(string.Empty, await deleted.Content.ReadAsStringAsync());

        await AssertJsonAsync(await Client.DeleteAsync("/items/3"), HttpStatusCode.NotFound,
            """{"message":"Inventory item with id 3 was not found."}""");
        await AssertJsonAsync(await Client.GetAsync("/items"), HttpStatusCode.OK, $"[{BrakePads},{OilFilter}]");
    }

    [Fact]
    public async Task Non_integer_id_does_not_match_route()
    {
        var response = await Client.GetAsync("/items/abc");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
