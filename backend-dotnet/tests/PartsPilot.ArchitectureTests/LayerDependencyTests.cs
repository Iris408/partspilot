using System.Reflection;
using NetArchTest.Rules;
using PartsPilot.Api.Endpoints;
using PartsPilot.Application.Inventory;
using PartsPilot.Domain.Inventory;
using PartsPilot.Infrastructure.Persistence;

namespace PartsPilot.ArchitectureTests;

public class LayerDependencyTests
{
    private static readonly Assembly DomainAssembly = typeof(InventoryItem).Assembly;
    private static readonly Assembly ApplicationAssembly = typeof(InventoryItemMapper).Assembly;
    private static readonly Assembly InfrastructureAssembly = typeof(AppDbContext).Assembly;
    private static readonly Assembly ApiAssembly = typeof(HealthEndpoints).Assembly;

    private static readonly string[] InfrastructureConcerns =
    [
        "Microsoft.AspNetCore",
        "Microsoft.EntityFrameworkCore",
        "Npgsql",
        "Amazon",
        "AWSSDK"
    ];

    public static TheoryData<string> DomainForbiddenDependencies =>
    [
        "PartsPilot.Application",
        "PartsPilot.Infrastructure",
        "PartsPilot.Api",
        .. InfrastructureConcerns
    ];

    public static TheoryData<string> ApplicationForbiddenDependencies =>
    [
        "PartsPilot.Infrastructure",
        "PartsPilot.Api",
        "Microsoft.AspNetCore",
        "Microsoft.EntityFrameworkCore",
        "Npgsql"
    ];

    [Theory]
    [MemberData(nameof(DomainForbiddenDependencies))]
    public void Domain_types_do_not_depend_on(string dependency)
    {
        AssertNoTypeDependency(DomainAssembly, dependency);
    }

    [Theory]
    [MemberData(nameof(DomainForbiddenDependencies))]
    public void Domain_assembly_does_not_reference(string dependency)
    {
        AssertNoAssemblyReference(DomainAssembly, dependency);
    }

    [Theory]
    [MemberData(nameof(ApplicationForbiddenDependencies))]
    public void Application_types_do_not_depend_on(string dependency)
    {
        AssertNoTypeDependency(ApplicationAssembly, dependency);
    }

    [Theory]
    [MemberData(nameof(ApplicationForbiddenDependencies))]
    public void Application_assembly_does_not_reference(string dependency)
    {
        AssertNoAssemblyReference(ApplicationAssembly, dependency);
    }

    [Fact]
    public void Infrastructure_does_not_depend_on_Api()
    {
        AssertNoTypeDependency(InfrastructureAssembly, "PartsPilot.Api");
        AssertNoAssemblyReference(InfrastructureAssembly, "PartsPilot.Api");
    }

    [Fact]
    public void Api_references_Application_and_Infrastructure()
    {
        var references = ApiAssembly.GetReferencedAssemblies().Select(name => name.Name).ToList();

        Assert.Contains("PartsPilot.Application", references);
        Assert.Contains("PartsPilot.Infrastructure", references);
    }

    private static void AssertNoTypeDependency(Assembly assembly, string dependency)
    {
        var result = Types.InAssembly(assembly)
            .ShouldNot()
            .HaveDependencyOn(dependency)
            .GetResult();

        Assert.True(
            result.IsSuccessful,
            $"{assembly.GetName().Name} must not depend on {dependency}. Offending types: " +
            string.Join(", ", result.FailingTypeNames ?? []));
    }

    private static void AssertNoAssemblyReference(Assembly assembly, string dependency)
    {
        var offending = assembly.GetReferencedAssemblies()
            .Select(name => name.Name ?? string.Empty)
            .Where(name => name == dependency || name.StartsWith(dependency + ".", StringComparison.Ordinal))
            .ToList();

        Assert.True(
            offending.Count == 0,
            $"{assembly.GetName().Name} must not reference {dependency}. Found: {string.Join(", ", offending)}");
    }
}
