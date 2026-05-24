# ADR-006: Pipelines for ACA Deployment and Matrix Builds

Status: Proposed
Date: 2025-12-24

## Context
We require CI/CD pipelines that build/push images for four Nx apps and the API, then deploy to ACA. Local dev uses Aspire; prod uses Front Door → APIM → ACA.

## Decision
Implement Azure Pipelines matrix builds for Nx apps (single Dockerfile template with per-app args) and separate job for API. Push images to ACR. Deploy to ACA with per-app/container revisions. Keep APIM policies in prod; bypass locally.

## Rationale
- Efficiency: Matrix builds reduce duplication.
- Control: Separate API job and deployment gates.
- Clarity: Environment-specific configs via variables.

## Consequences
- Requires pipeline updates and ACR/ACA service connections.
- Track revisions and rollbacks.

## Alternatives
- GitHub Actions (similar approach).
- Single monolithic deployment (less flexible).

## References
- Azure Pipelines multi-job/matrix docs
- ACA deployment tasks and CLI examples
