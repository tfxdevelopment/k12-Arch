# ASPIRE-02: Local Development Workflow

**Status:** Draft
**Last updated:** 2026-01-20

## Purpose
Document the day-to-day local development workflow for the proposed .NET Aspire-based setup in this repository.

## Scope
- Running the AppHost and dependent services locally
- Common developer tasks (start/stop, logs, debugging)
- Local configuration and secrets handling

## Local run workflow
### Start
- Use the AppHost as the primary entry point when working on orchestrated services.
- Prefer repository scripts and documented tasks over ad-hoc commands.

### Debugging
- Use the IDE debugger for service processes.
- Use logs/telemetry to validate cross-service calls.

## Configuration
### Secrets
- Do not commit secrets.
- Use environment variables or approved secret stores for local developer environments.

### Ports and endpoints
- Document any stable local ports/endpoints that are relied on by other docs or scripts.

## References
- AppHost project: src/K12.AppHost (external to this repo)
- Related Aspire docs: [ASPIRE-01: AppHost Setup](ASPIRE-01-apphost-setup.md)
