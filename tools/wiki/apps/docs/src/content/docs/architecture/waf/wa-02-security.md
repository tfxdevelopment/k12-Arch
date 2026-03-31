---
title: WA-02 Security
description: Security guidance for the proposed cloud-native architecture.
---

> Generated from canonical source: `../../09-proposed-architecture/05-well-architected/WA-02-security.md`.

Status: Draft
Owner: CFI Architecture Team
Last Updated: 2026-02-18

## Purpose

Define the security baseline for the proposed architecture while preserving existing K12 identity and authorization controls.

## Security goals

1. Protect student and household data with defense in depth.
2. Keep platform posture aligned with state and federal compliance expectations.
3. Reduce blast radius from compromised credentials, workloads, or pipelines.

## Principles

1. Identity-first access controls.
2. Least privilege everywhere.
3. Secure defaults in code, infrastructure, and pipelines.
4. Continuous detection and response.

## Control model

### Identity and access

- Continue Entra-based identity model and role mapping.
- Use managed identity for service-to-service access.
- Require scoped tokens and explicit audience checks.

### Workload and container security

- Harden base images and use non-root execution.
- Gate deployments on image vulnerability policies.
- Segment workloads by trust zone and data sensitivity.

### Data protection

- Encrypt data in transit and at rest by default.
- Keep secrets in Key Vault with rotation policy.
- Enforce data access auditing on sensitive operations.

### API and integration boundary

- Standardize auth, throttling, and request validation at API edge.
- Enforce schema validation and payload limits for inbound integrations.
- Add signed event validation for critical async flows.

### Detection and operations

- Centralize security telemetry in SIEM workflow.
- Define P0 and P1 response runbooks with response-time targets.
- Track recurring findings and close by severity SLA.

## Implementation backlog

### Now (0-30 days)

1. Define baseline security checklist for every service onboarding.
2. Add image scan gate to CI pipeline for critical severity failures.
3. Validate secret inventory and remove app-setting secrets.

### Next (30-90 days)

1. Add workload identity and privilege reviews by domain.
2. Implement security alert triage dashboard and ownership rotation.
3. Run tabletop incident exercise with API and data teams.

### Later (90+ days)

1. Continuous policy enforcement for network and data controls.
2. Drift detection for runtime security posture.

## KPIs

- Mean time to remediate critical findings.
- Percent of services with managed identity only.
- Secret rotation compliance rate.
- Security incident closure time by severity.

## Dependencies

- `../../02-architecture/security/SEC-01-entra-id-configuration.md`
- `../../02-architecture/security/SEC-02-authorization-model.md`
- `../../02-architecture/security/SEC-04-audit-logging.md`

## Legacy reference

Detailed prior security analysis is retained in `../04-well-architected/WA-02-security.md`.
