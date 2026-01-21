# K12 Architecture Documentation - .NET Aspire Workspace

This directory contains the .NET Aspire orchestration solution for the K12 Architecture Documentation workspace.

## Overview

The Aspire solution provides a local development environment with:

- **K12.AppHost** - Orchestrator that coordinates all services
- **K12.ServiceDefaults** - Shared configurations for OpenTelemetry, health checks, and service discovery
- **K12.Docs.Api** - Optional API for serving markdown metadata and content
- **Dapr Integration** - For function orchestration and service-to-service communication
- **Local APIM Emulator** - For API gateway simulation
- **Angular Documentation Site** - The k12-docs Nuxt application

## Project Structure

```
CFI.K12/
├── src/
│   ├── AppHosts/              # Aspire orchestrators
│   |   ├── Core/              # Aspire orchestrators
│   │       ├── Program.cs            # Main orchestration logic
│   │       ├── appsettings.json      # Configuration
│   │       └── .config/          # APIM emulator configuration
│   │          └── apim.json         # API definitions
│   ├── K12.ServiceDefaults/      # Shared service configurations
│   │   └── Extensions.cs         # OpenTelemetry, health checks, service discovery
│   └── K12.Docs.Api/             # Documentation API
│       └── Program.cs            # Minimal API for markdown serving
├── .aspire/
│   └── manifest.json             # Aspire manifest for deployment
└── K12.CFI.sln                # Solution file
```

## Prerequisites

- .NET 10.0 SDK or later
- Docker Desktop (for APIM emulator and Dapr)
- Node.js 18+ (for Angular documentation site)
- Visual Studio 2022 17.9+ or Visual Studio Code with C# Dev Kit

## Getting Started

### 1. Install .NET Aspire Workload

```bash
dotnet workload update
dotnet workload install aspire
```

### 2. Restore Dependencies

```bash
cd c:/Projects/CFI/K12/k12-Arch
dotnet restore K12.Aspire.sln
```

### 3. Run the Aspire Dashboard

```bash
cd src/K12.AppHost
dotnet run
```

This will start:
- Aspire Dashboard at `https://localhost:17241`
- APIM Emulator at `http://localhost:8080`
- Docs API at `http://localhost:5000`
- Angular Documentation Site at `http://localhost:4200`
- Dapr sidecar at `http://localhost:3500`

### 4. Access the Dashboard

Navigate to `https://localhost:17241` to view:
- Service health status
- Distributed tracing (OpenTelemetry)
- Logs aggregation
- Metrics and performance data

## Key Features

### Dapr Integration

The solution includes Dapr for:
- **Service Invocation**: Call services using Dapr's service-to-service invocation
- **State Management**: Store and retrieve state across services
- **Pub/Sub**: Publish and subscribe to events
- **Observability**: Built-in distributed tracing and metrics

Dapr configuration:
- gRPC Port: `50001`
- HTTP Port: `3500`
- Telemetry: Enabled

### Local APIM Emulator

The APIM emulator provides:
- API routing and gateway functionality
- Request/response transformation
- Rate limiting (in full APIM)
- API versioning

Configuration: `src/K12.AppHost/apim-config/apim.json`

### Docs API

The Docs API provides endpoints for:
- `/api/docs/list` - List all markdown files in the wiki
- `/api/docs/{path}` - Get markdown content and HTML rendering

Uses:
- **Markdig** for markdown to HTML conversion
- **YamlDotNet** for frontmatter parsing
- **Aspire.Azure.AI.OpenAI** for future AI-powered documentation features

### Service Defaults

All services inherit common configurations:
- **OpenTelemetry**: Distributed tracing, metrics, and logging
- **Health Checks**: `/health` and `/alive` endpoints
- **Service Discovery**: Automatic service resolution
- **Resilience**: Retry policies, circuit breakers, and timeouts

## Development Workflow

### Running Individual Services

```bash
# Run only the Docs API
cd src/K12.Docs.Api
dotnet run

# Run only the AppHost (orchestrates all services)
cd src/K12.AppHost
dotnet run
```

### Debugging in Visual Studio

1. Open `K12.Aspire.sln`
2. Set `K12.AppHost` as the startup project
3. Press F5 to start debugging
4. The Aspire Dashboard will open automatically

### Debugging in VS Code

1. Open the workspace in VS Code
2. Use the "Run and Debug" panel
3. Select ".NET Core Launch (AppHost)"
4. Press F5

## Deployment

### Generate Manifest for Azure Deployment

```bash
cd src/K12.AppHost
dotnet run --publisher manifest --output-path ../../.aspire/manifest.json
```

This generates a manifest file that can be used with Azure Developer CLI (azd):

```bash
azd init
azd infra synth
azd up
```

### Azure Resources Created

The manifest will provision:
- Azure Container Apps for each service
- Azure Container Registry for images
- Azure Log Analytics workspace
- Azure Application Insights for monitoring

## Configuration

### Environment Variables

Configure services via `appsettings.json` or environment variables:

```json
{
  "OTEL_EXPORTER_OTLP_ENDPOINT": "https://your-otel-collector:4317",
  "ASPNETCORE_ENVIRONMENT": "Development"
}
```

### Dapr Components

Dapr components are configured in the AppHost:
- State stores (Redis, Azure Cosmos DB)
- Pub/Sub (Azure Service Bus, RabbitMQ)
- Secrets (Azure Key Vault)

### APIM Configuration

Edit `src/K12.AppHost/apim-config/apim.json` to:
- Add new APIs
- Configure routing rules
- Set up products and subscriptions

## Monitoring and Observability

### Aspire Dashboard

The dashboard provides:
- **Traces**: Distributed tracing across all services
- **Metrics**: CPU, memory, request rates, response times
- **Logs**: Aggregated logs from all services
- **Resources**: Service health and dependencies

### OpenTelemetry

All services emit:
- **Traces**: W3C Trace Context compatible
- **Metrics**: Prometheus-compatible metrics
- **Logs**: Structured logging with correlation IDs

### Health Checks

Each service exposes:
- `/health` - Comprehensive health check
- `/alive` - Liveness probe (Kubernetes-compatible)

## Troubleshooting

### Services Not Starting

1. Check Docker is running
2. Verify ports are not in use:
   ```bash
   netstat -ano | findstr "4200 5000 8080 3500 50001"
   ```
3. Check Aspire Dashboard logs at `https://localhost:17241`

### Dapr Issues

```bash
# Check Dapr installation
dapr --version

# Initialize Dapr (if not already done)
dapr init

# Check Dapr containers
docker ps | grep dapr
```

### APIM Emulator Issues

```bash
# Check APIM container logs
docker logs apim-emulator

# Verify configuration
cat src/K12.AppHost/apim-config/apim.json
```

## Additional Resources

- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Dapr Documentation](https://docs.dapr.io/)
- [Azure API Management](https://learn.microsoft.com/azure/api-management/)
- [OpenTelemetry .NET](https://opentelemetry.io/docs/instrumentation/net/)

## Contributing

When adding new services:

1. Create a new project in `src/`
2. Reference `K12.ServiceDefaults`
3. Call `builder.AddServiceDefaults()` in `Program.cs`
4. Add project reference to `K12.AppHost`
5. Register service in `K12.AppHost/Program.cs`

## License

Copyright (c) 2024 CFI Group. All rights reserved.
