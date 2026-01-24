using K12.BuildingBlocks.Messaging;
using K12.Infrastructure.Messaging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace K12.Infrastructure;

/// <summary>
/// Infrastructure dependency injection configuration.
/// Registers core infrastructure services.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Event Bus (Dapr Pub/Sub)
        services.AddScoped<IEventBus, DaprEventBus>();

        // Add health checks for infrastructure dependencies
        services.AddHealthChecks()
            .AddCheck<InfrastructureHealthCheck>("infrastructure");

        return services;
    }
}
