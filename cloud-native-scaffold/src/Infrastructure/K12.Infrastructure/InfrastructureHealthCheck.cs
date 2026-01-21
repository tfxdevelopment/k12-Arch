using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace K12.Infrastructure;

/// <summary>
/// Health check for infrastructure services.
/// </summary>
public sealed class InfrastructureHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        // In a real implementation, this would check:
        // - Database connectivity
        // - Message bus availability
        // - Storage service health

        return Task.FromResult(HealthCheckResult.Healthy("Infrastructure is healthy"));
    }
}
