using System.Reflection;
using FluentValidation;
using K12.Infrastructure;
using K12.Infrastructure.Azure;
using Mapster;

namespace K12.Api.Programs;

/// <summary>
/// Dependency injection configuration for the Programs API.
/// Follows the Dependency Inversion Principle (SOLID).
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // MediatR for CQRS (Command Query Responsibility Segregation)
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(assembly);
        });

        // FluentValidation for request validation
        services.AddValidatorsFromAssembly(assembly);

        // Mapster for object mapping (high-performance alternative to AutoMapper)
        services.AddMapster();

        // Infrastructure services (SQL, Storage, Messaging)
        services.AddInfrastructureServices(configuration);
        services.AddAzureInfrastructureServices(configuration);

        return services;
    }
}
