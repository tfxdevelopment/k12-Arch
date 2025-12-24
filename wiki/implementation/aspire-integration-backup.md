# .NET Aspire 13.1 Integration with Azure Functions

## Overview
Comprehensive integration guide for .NET 10, Aspire 13.1, and Azure Functions 2.x following [Microsoft's official guidance](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-aspire-integration).

## Prerequisites
- .NET 10 SDK ([Download](https://dotnet.microsoft.com/download/dotnet/10.0))
- Aspire 13.1 CLI: `curl -fsSL https://aspire.dev/install.sh | bash`
- Azure Functions Core Tools v4.1044.0+ (for ContainerApps secret provider)
- Dapr CLI 1.14+

## Key Changes in Aspire 13.1

- **Simplified SDK declaration**: `<Project Sdk="Aspire.AppHost.Sdk/13.1.0">` (no explicit `Aspire.Hosting.AppHost` package)
- **Azure Functions official support**: No longer preview, full production support
- **AddAzureFunctionsProject()**: Use this instead of generic `AddProject()` for Functions
- **WithHostStorage()**: Explicit host storage configuration for Functions
- **IHostApplicationBuilder pattern**: Required for service defaults integration

## Project Setup

### 1. Create Aspire App Host

```csharp
// K12.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Add Application Insights
var appInsights = builder.AddConnectionString("appInsights");

// Add Dapr components
builder.AddDapr(options =>
{
    options.EnableTelemetry = true;
});

// Add Redis for state store
var redis = builder.AddRedis("statestore");

// Add workflow service
var workflows = builder.AddProject<Projects.K12_Workflows>("workflows")
    .WithDaprSidecar(new DaprSidecarOptions
    {
        AppId = "workflows",
        MetricsPort = 9090
    })
    .WithReference(redis)
    .WithReference(appInsights);

// Add Azure Functions
var functions = builder.AddAzureFunctionsProject<Projects.K12_Functions>("functions")
    .WithDaprSidecar(new DaprSidecarOptions
    {
        AppId = "functions",
        MetricsPort = 9091
    })
    .WithReference(workflows)
    .WithReference(redis)
    .WithReference(appInsights)
    .WithExternalHttpEndpoints(); // For local testing

builder.Build().Run();
```

### 2. Configure Azure Functions for Aspire

```csharp
// K12.Functions/Program.cs
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.AddServiceDefaults(); // Adds OTEL, health checks, service discovery

builder.ConfigureFunctionsWebApplication();

// Configure Dapr
builder.Services.AddDaprClient();

// Configure Application Insights
builder.Services.AddApplicationInsightsTelemetryWorkerService();
builder.Services.ConfigureFunctionsApplicationInsights();

builder.Build().Run();
```

### 3. Service Defaults Configuration

```csharp
// K12.ServiceDefaults/Extensions.cs
public static class Extensions
{
    public static IHostApplicationBuilder AddServiceDefaults(
        this IHostApplicationBuilder builder)
    {
        // Configure OpenTelemetry
        builder.Services.AddOpenTelemetry()
            .WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddRuntimeInstrumentation();
            })
            .WithTracing(tracing =>
            {
                tracing.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddSource("Dapr.*");
            });

        // Configure health checks
        builder.Services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy());

        // Service discovery
        builder.Services.AddServiceDiscovery();
        
        builder.Services.ConfigureHttpClientDefaults(http =>
        {
            http.AddStandardResilienceHandler();
            http.AddServiceDiscovery();
        });

        return builder;
    }
}
```

## Local Development

### Run with Aspire Dashboard

```bash
cd src/K12.AppHost
dotnet run
```

Access Aspire Dashboard at: http://localhost:15888

### View Observability Data

The Aspire Dashboard provides:
- **Resources**: All running services and their status
- **Logs**: Structured logs from all services with correlation
- **Traces**: Distributed traces across services
- **Metrics**: Performance metrics and custom counters

## Deployment

### Azure Container Apps

```csharp
// Configure for Azure Container Apps deployment
var functions = builder.AddAzureFunctionsProject<Projects.K12_Functions>("functions")
    .PublishAsAzureContainerApp((module, containerApp) =>
    {
        containerApp.WithDapr(dapr =>
        {
            dapr.AppId = "functions";
            dapr.EnableApiLogging = true;
        });
    });
```

### Configuration

```json
// appsettings.json
{
  "Aspire": {
    "Azure": {
      "ApplicationInsights": {
        "ConnectionString": "InstrumentationKey=..."
      }
    }
  },
  "Dapr": {
    "WorkflowComponent": "statestore"
  }
}
```

## Benefits

1. **Unified Development Experience**: Single dashboard for all services
2. **Automatic Service Discovery**: Services find each other automatically
3. **Built-in Observability**: OTEL integration out of the box
4. **Simplified Configuration**: Connection strings managed by Aspire
5. **Local-to-Cloud Parity**: Same patterns work locally and in Azure

## References
- [.NET Aspire Azure Functions Integration](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-aspire-integration)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [Dapr with Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/frameworks/dapr)
