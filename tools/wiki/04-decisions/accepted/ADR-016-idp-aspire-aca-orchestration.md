# ADR-016: IDP Aspire-First ACA Orchestration (Scope 1)

Status: Accepted
Date: 2026-02-20
Owner: K12 Architecture + IDP Delivery
Scope: `tools/wiki/apps/portal`, `tools/wiki/apps/docs`, `tools/wiki/apps/storybook`, `tools/wiki/apps/scalar`

## Context

The K12 Internal Developer Portal (IDP) is composed of four Node-based frontend applications that must be deployed as a cohesive unit to Azure Container Apps (ACA). We need a local development orchestration and ACA deployment strategy that:

- Provides a single control plane for local development and ACA manifest generation.
- Routes all external traffic through a single public ingress.
- Keeps the four apps independently buildable and deployable without coupling their source code.
- Aligns with the existing `.NET Aspire` toolchain already in use for backend services.

## Decision

Use `.NET Aspire AppHost` (`K12.Idp.AppHost`) as the orchestrator for the four IDP applications. Each app is registered as a Dockerized container resource with explicit port bindings and health checks. The `portal` service is the sole public ACA ingress and reverse-proxies to the other three using Aspire-injected upstream environment variables.

## Topology

| Service     | Port | Runtime | Public Ingress | Route via portal |
|-------------|------|---------|----------------|-----------------|
| `portal`    | 3000 | Node    | Yes            | `/`              |
| `docs`      | 4321 | Node    | Internal only  | `/docs`          |
| `scalar`    | 5050 | Node    | Internal only  | `/api-reference` |
| `storybook` | 6006 | Node    | Internal only  | `/storybook`     |

`portal` is the only service with `WithExternalHttpEndpoints()`. The other three are reachable exclusively via cluster-internal URLs injected by Aspire into `portal`'s runtime environment.

## AppHost Implementation

```csharp
// cloud-native-scaffold/src/K12.Idp.AppHost/Program.cs
var docs      = builder.AddDockerfile("docs",      "…/apps/docs")
    .WithHttpEndpoint(port: 4321).WithHttpHealthCheck("/");

var scalar    = builder.AddDockerfile("scalar",    "…/apps/scalar")
    .WithHttpEndpoint(port: 5050).WithHttpHealthCheck("/");

var storybook = builder.AddDockerfile("storybook", "…/apps/storybook")
    .WithHttpEndpoint(port: 6006).WithHttpHealthCheck("/");

var portal    = builder.AddDockerfile("portal",    "…/apps/portal")
    .WithEnvironment("IDP_DOCS_UPSTREAM",      docs.GetEndpoint("http"))
    .WithEnvironment("IDP_SCALAR_UPSTREAM",    scalar.GetEndpoint("http"))
    .WithEnvironment("IDP_STORYBOOK_UPSTREAM", storybook.GetEndpoint("http"))
    .WithHttpEndpoint(port: 3000)
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/");
```

## Rationale

- **Single control plane**: Aspire manages service discovery, health, and env injection identically for local dev and ACA manifests — no separate docker-compose or manual env files needed.
- **Minimal ACA surface**: Only `portal` has external ingress; internal services stay on the cluster network, reducing attack surface.
- **Scope isolation**: A dedicated `K12.Idp.AppHost` keeps IDP orchestration separate from backend domain services — no cross-contamination of concerns.
- **ACA manifest generation**: `aspire publish` from this AppHost generates ACA YAML for all four services, enabling GitOps-style deployment.

## Consequences

- `portal` is a reverse-proxy runtime dependency for all four IDP services; its availability is the single availability gate.
- Storybook is dev-server-like — Node version and startup command must be locked in its Dockerfile to avoid runtime drift.
- Upstream URLs in `portal` differ between environments (localhost vs. cluster-internal) but are always injected by Aspire — never hardcoded.
- A follow-up ADR is needed once the ACA Aspire extension API stabilises to automate the ACA publish step end-to-end.

## Alternatives Considered

| Option | Rejected Because |
|--------|-----------------|
| `docker-compose` only | No ACA manifest generation; separate toolchain from Aspire backend |
| Separate Aspire hosts per app | Fragmented orchestration; no unified health/dashboard view |
| NGINX static proxy | Incompatible with Node runtime requirement; harder to update routes |
| Merge into existing backend AppHost | Pollutes domain model with frontend/tooling topology |

## Validation Checklist

- [ ] `dotnet run --project K12.Idp.AppHost` starts all four services
- [ ] `portal` serves `/`, `/docs`, `/api-reference`, `/storybook` — all return 200
- [ ] `aspire publish` generates valid ACA manifests for all four services
- [ ] Only `portal` has `ExternalHttpEndpoints` in the ACA manifest
- [ ] All four health check endpoints return 200

## Architecture Diagram

> Eraser.io live diagram: https://app.eraser.io/workspace/R1aql8dqEXvHoaF8UJvA

## References

- [Plan: IDP Aspire ACA Orchestration Scope](../../../docs/plans/2026-02-20-idp-aspire-aca-orchestration-scope.md)
- [ADR-002: Aspire Nx Multi-App](ADR-002-aspire-nx-multi-app.md)
- [ADR-003: API to Azure Container Apps](ADR-003-api-to-azure-container-apps.md)
- [ASPIRE-01: AppHost Setup](../../03-target-architecture/aspire/ASPIRE-01-apphost-setup.md)
