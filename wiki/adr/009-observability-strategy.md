# ADR 009: Observability Strategy

## Status
Proposed

## Context
Our distributed system using Dapr workflows, Azure Functions, and .NET Aspire requires comprehensive observability to monitor, debug, and optimize performance across services.

## Decision
We will implement a multi-layered observability strategy using:

1. **OpenTelemetry** as the instrumentation standard
2. **.NET Aspire Dashboard** for local development observability
3. **Azure Application Insights** for production telemetry
4. **Dapr observability** for workflow and service-to-service traces

### Observability Pillars

#### Metrics
- Application metrics via OpenTelemetry
- Dapr metrics (workflow execution, service invocation)
- Azure Functions metrics (executions, duration, failures)
- Custom business metrics

#### Logs
- Structured logging using `Microsoft.Extensions.Logging`
- Dapr sidecar logs
- Azure Functions logs
- Correlation IDs across all logs

#### Traces
- Distributed tracing via OpenTelemetry
- Dapr service invocation traces
- Workflow activity traces
- End-to-end request tracing

#### Health Checks
- Dapr health endpoints
- Custom application health checks
- Dependencies health monitoring

## Implementation

### .NET Aspire Configuration
```csharp
builder.AddServiceDefaults() // Adds OTEL, health checks, service discovery
```

### OpenTelemetry Setup
- Automatic instrumentation for HTTP, gRPC
- Custom activity sources for business operations
- Export to Azure Application Insights

### Dapr Integration
- Use Dapr observability configuration
- Zipkin/OTLP exporter for traces
- Prometheus endpoint for metrics

## Consequences

### Positive
- Unified observability across all services
- Better debugging and troubleshooting
- Performance optimization insights
- Production incident response improvement

### Negative
- Additional infrastructure overhead
- Learning curve for team
- Data storage costs

## References
- [.NET Aspire Observability](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/telemetry)
- [Dapr Observability](https://docs.dapr.io/operations/observability/)
- [OpenTelemetry .NET](https://opentelemetry.io/docs/languages/net/)
