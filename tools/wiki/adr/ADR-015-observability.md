# ADR-015: Observability Strategy (.NET Aspire + OpenTelemetry + Azure Monitor)

**Status:** Proposed
**Date:** 2026-01-24
**Deciders:** CFI Architecture Team
**Technical Story:** K12 Cloud-Native Modernization

## Context and Problem Statement

K12 MyPortal requires unified, low-latency observability across containerized services, Dapr sidecars, and Dapr Workflow. Current logging is fragmented, lacks trace correlation, and does not provide actionable dashboards or SLO-driven alerts.

## Decision Drivers

- Reliability and SLOs (p95 latency, error rate, availability)
- End-to-end trace correlation (user → API → DAB → workflow → external systems)
- Developer experience (Aspire dashboard locally, familiar App Insights in Azure)
- Compliance and auditability (PII-safe logging, retention policies)
- Cost efficiency and simplicity (first-party Azure tooling)

## Considered Options

- Option 1: OpenTelemetry + Azure Application Insights + Azure Monitor (Workbooks/Alerts)
- Option 2: Elastic Stack (ELK) on AKS or Elastic Cloud
- Option 3: Datadog (logs, metrics, APM)
- Option 4: DIY logging + custom dashboards

## Decision Outcome

**Chosen option:** OpenTelemetry + Application Insights + Azure Monitor with .NET Aspire in dev, because it provides first-party integration, low operational overhead, rich APM features, and native support for Dapr and .NET.

### Consequences

- Good: Unified traces/logs/metrics, W3C trace context propagation through Dapr; Aspire dashboard for local; minimal ops overhead; strong query/alert capabilities.
- Bad: App Insights query costs at high volume; requires careful sampling and PII scrubbing.
- Neutral: Vendor lock-in to Azure monitoring stack for production environments.

## Technical Details

### Architecture

- Local dev: .NET Aspire Dashboard (logs, traces, resource health) + OpenTelemetry exporters.
- Production: Application Insights for traces/logs/metrics; Azure Monitor Workbooks for dashboards; Alerts (Action Groups) for SLO breaches.
- Dapr: Enable tracing and metrics in sidecars; export to OpenTelemetry/App Insights.

### Implementation

- .NET (Functions/APIs)
  - Use OpenTelemetry SDK (Tracing, Metrics, Logging) with W3C context.
  - Auto-instrument HTTP, ASP.NET Core, SQL Client; custom spans around business operations.
  - Configure sampling (e.g., 10% traces default; 100% for error requests).
- Dapr
  - Enable `app-id`, tracing headers, and metrics in sidecar.
  - Use App Insights exporter via OpenTelemetry Collector or direct SDK.
- Aspire
  - Wire `Aspire.Hosting.Azure.ApplicationInsights` and `Aspire.Hosting` resources.
  - Use dashboard in dev; disable verbose logging in prod.

### Logging Standards

- JSON structured logs with fields: `traceId`, `spanId`, `workflowId`, `userId` (hashed), `requestId`, `operation`, `status`, `durationMs`.
- PII policy: no sensitive values in logs; redact email, names, addresses; use IDs.
- Log levels: Info (business milestones), Debug (dev only), Error (exceptions), Warning (retries/timeouts).

### Metrics & SLOs

- API: p95 latency < 2s, error rate < 1%, throughput targets by enrollment month.
- Workflow: step success rate ≥ 99%, retry recovery ≥ 95%, orchestration overhead < 100ms.
- Infrastructure: container CPU/memory thresholds, Redis hit rate ≥ 65%.

### Dashboards & Alerts

- Workbooks: Enrollment funnel, API performance, Workflow health, Error hotspots.
- Alerts: p95 latency, error rate spikes, dead-letter queues, workflow stuck states.
- Action Groups: Email/SMS/Teams; on-call rotation integrations.

### Sample Configuration (C#)

```csharp
builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("k12-functions"))
    .WithMetrics(m => m.AddAspNetCoreInstrumentation())
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSqlClientInstrumentation()
        .SetSampler(new TraceIdRatioBasedSampler(0.10))
        .AddAzureMonitorTraceExporter(o => o.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"]))
    .WithLogging(l => l.AddOpenTelemetry(o => o.IncludeFormattedMessage = true));
```

### Dapr Sidecar (tracing excerpt)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: default
spec:
  tracing:
    samplingRate: "0.1"
    stdOut: false
    zipkin:
      endpointAddress: "http://otel-collector:9411" # or App Insights exporter via OTEL
metrics:
  enabled: true
```

## Validation

- Baseline and compare KPIs pre/post rollout; alerting dry-runs; chaos tests for workflow retries.
- Developer feedback on Aspire dashboards and query usability.

## Related Decisions

- ADR-014: Dapr Workflow for Orchestration
- ADR-PROP-002: .NET Aspire Orchestration

## References

- .NET Aspire Observability
- OpenTelemetry .NET SDK
- Azure Monitor and Application Insights
- Dapr Observability docs
