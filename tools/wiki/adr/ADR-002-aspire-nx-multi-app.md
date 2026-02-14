# ADR-002: Aspire Registration of Nx Multi-App (Node)

Status: Proposed
Date: 2025-12-24

## Context
We need to run four Angular/Nx apps from a single repo/workspace. Each app should be its own container with Node runtime. We want to orchestrate them with .NET Aspire and provide single-origin routing via AppHost.

## Decision
Register the same Nx project in Aspire as four container resources using a single Dockerfile template and distinct build arguments (e.g., `APP_NAME`, `PORT`). Use Node runtime for both dev and prod.

## Rationale
- Reuse: One Dockerfile template avoids duplication and simplifies maintenance.
- Configuration: Per-app args/ports allow clean separation while preserving shared build logic.
- Orchestration: Aspire makes references, health, and observability consistent.

## Consequences
- Introduces shared Dockerfile and per-app config convention.
- Requires explicit route mapping to each app.

## Alternatives
- Separate Dockerfiles per app (higher maintenance).
- Static assets via NGINX (not aligned with Node runtime requirement).

## References
- .NET Aspire container orchestration docs
- Nx build/serve targets
