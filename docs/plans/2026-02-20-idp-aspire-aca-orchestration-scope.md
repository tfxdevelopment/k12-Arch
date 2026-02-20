# IDP Aspire ACA Orchestration Design (Scope 1)

Date: 2026-02-20
Status: In Progress
Owner: K12 Architecture + IDP Delivery
Scope: `tools/wiki/apps/portal`, `tools/wiki/apps/docs`, `tools/wiki/apps/storybook`, `tools/wiki/apps/scalar`

## Selected Approach

Option 1: Aspire-first orchestration using containerized services and ACA as the deployment target.

## Why this option

- Single control plane for local dev and deployment manifest generation.
- Keeps orchestration logic separate from app code.
- Supports current scope without changing API ownership or existing service behavior.
- ACA output can be generated from the same model used for local Aspire runs.

## Target Topology

### Services under orchestration

- `portal` (Nuxt shell + proxy)
  - Runtime: Node
  - Target Port: `3000`
- `docs` (Astro)
  - Runtime: Node
  - Target Port: `4321`
- `scalar` (static Scalar reference server)
  - Runtime: Node
  - Target Port: `5050`
- `storybook` (Storybook)
  - Runtime: Node
  - Target Port: `6006`

### Runtime wiring

- `portal` remains the public entrypoint; ACA ingress is exposed only for `portal`.
- `portal` reaches other services via internal service discovery using Aspire-generated URLs.
- Upstream env values remain centralized in portal runtime config:
  - `IDP_DOCS_UPSTREAM`
  - `IDP_SCALAR_UPSTREAM`
  - `IDP_STORYBOOK_UPSTREAM`
- For ACA, upstream URLs become cluster-internal service URLs instead of localhost.

## Build & container strategy

- Add one Dockerfile per service in each app folder:
  - `tools/wiki/apps/portal/Dockerfile`
  - `tools/wiki/apps/docs/Dockerfile`
  - `tools/wiki/apps/scalar/Dockerfile`
  - `tools/wiki/apps/storybook/Dockerfile`
- Use multi-stage Node builds where available to keep images small.
- Enforce explicit host/port binding:
  - `HOST=0.0.0.0`
  - `PORT=<service port>`
- Add health check endpoints/paths per service for Aspire and ACA readiness/liveness:
  - `portal`: `/`
  - `docs`: `/`
  - `scalar`: `/`
  - `storybook`: `/`

## Aspire AppHost implementation plan

- Add a new AppHost project dedicated to IDP scope (do not overload backend domain model), e.g.:
  - `cloud-native-scaffold/src/K12.Idp.AppHost/Program.cs`
  - `cloud-native-scaffold/src/K12.Idp.AppHost/K12.Idp.AppHost.csproj`
  - `cloud-native-scaffold/src/K12.Idp.AppHost/appsettings.json`
- For each service, register as container-backed resources with:
  - Dockerfile path and build context.
  - Stable container app resource names.
  - HTTP endpoint and health checks.
  - Optional replica and resource settings via Aspire parameters.
- Register dependencies:
  - `portal` references docs/scalar/storybook container URLs as upstream parameters.
  - Keep current out-of-scope services untouched.
- Add ACA publish surface hooks from Aspire when package/version support allows (Azure Container Apps extension call). If extension API is not present, keep generation steps as manifest-first fallback and capture follow-up ADR.

## ACA deployment baseline

- Single Azure Container Apps Environment for the four services.
- Public ingress:
  - only `portal` exposed.
  - internal traffic for `portal -> docs/scalar/storybook` stays private.
- Secrets/config:
  - move static secrets to Key Vault or ACA managed secrets.
  - keep local defaults in `.env`/`appsettings.Development.json` only for local development.
- Logging/metrics:
  - keep default Application Insights integration enabled for portal initially.
- Scale policy:
  - start with 1 replica each.
  - `portal` can scale later by CPU/memory or queue depth once telemetry is established.

## Delivery scope

In scope:
- Aspire host for exactly four IDP apps.
- ACA-targeted manifest generation.
- Per-app Dockerfiles.
- End-to-end route and health validation.

Out of scope:
- Backend API services.
- Dapr topology changes.
- Redis/SQL/Auth integrations for this pass.

## Validation

- Local
  - `dotnet run` AppHost starts all four services.
  - Validate `portal` serves `/`, `/docs`, `/api-reference`, `/storybook` with stable upstream routing.
- ACA dry-run
  - generate manifest artifacts and verify resource definitions for all four services.
  - ensure only one public ingress and stable internal URLs.
- Post-deploy smoke
  - `GET /` portal 200
  - `/docs`, `/api-reference`, `/storybook` return 200 via proxy.

## Risks and mitigations

- Runtime API surface drift across local and ACA (hosts, ports):
  - use Aspire parameters for all host/port values.
- Storybook container behavior is dev-server-like:
  - lock startup command/version and document assumptions.
- Build-time instability:
  - lock Node major versions in Dockerfiles and use corepack/npm ci.

