# ADR-005: Local Dev APIM Bypass (No Proxy)

Status: Proposed
Date: 2025-12-24

## Context
APIM adds complexity and dependency during local development. Developers need fast, single-origin iterations.

## Decision
Skip reverse proxy for local development. Run Nx apps and API on separate origins with CORS enabled. Use Dapr for backend service invocation only. Bypass APIM locally; derive APIM policies/routes from Dapr configuration for production using the Dapr APIM integration approach.

## Rationale
- Simplicity: Avoid introducing proxy complexity locally.
- Parity: Dapr config informs APIM policies in production.
- Flexibility: Nx apps keep their defaults; Aspire supplies endpoints via environment.

## Consequences
- Requires CORS configuration for local client → API calls.
- Ensure that prod behaves via Front Door → APIM → ACA with policies derived from Dapr.

## Alternatives
- Keep APIM in dev (slow setup).
- Per-app `serve` with CORS (fragmented experience).

## References
- YARP reverse proxy docs
- .NET Aspire AppHost integration examples
