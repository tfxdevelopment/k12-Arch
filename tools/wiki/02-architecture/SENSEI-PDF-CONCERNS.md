# Sensei Architecture Document Concerns (Checklist)

This is a working checklist distilled from the legacy Sensei architecture document.

> Note: The PDF is stored at `sources/Sensei-Solution Architecture Document-1.0.pdf`. Some extraction is incomplete in this repo; this checklist is intended to be updated as more text is extracted.

## Checklist

| Concern / Recommendation | Addressed By | Status | Notes |
|---|---|---|---|
| Async integrations must be resilient (retries, backoff, DLQ/poison handling) | `wiki/09-proposed-architecture/OPS-messaging.md`, proposed ADRs for Service Bus | Partial | Ensure standard DLQ playbook exists and is linked from ops section. |
| Event/message schema governance (versioning, compatibility) | Proposed ADRs under `wiki/09-proposed-architecture/07-adr-proposed/` | Partial | Add concrete schema/versioning guidelines to `wiki/02-architecture/CONTRACTS.md`. |
| Idempotency for message handlers and workflow steps | `wiki/02-architecture/workflows/*` | Partial | Add explicit idempotency guidance for BFF + services. |
| Operational readiness (monitoring, alerts, runbooks) | `wiki/06-operations/*` and pipeline docs | Partial | Confirm alerts/metrics for queues and workflow failures. |
| CI/CD gates (tests, security scanning, deployment controls) | `PIPELINE-*.md`, `azure-pipelines.yml` | Partial | Document minimum quality gates for service onboarding. |

## Gaps to Close Next

- A single “messaging runbook” that includes DLQ triage and replay.
- A single “contract versioning” policy that covers both REST and events.
- A service onboarding checklist (what every new BFF/service must implement).
