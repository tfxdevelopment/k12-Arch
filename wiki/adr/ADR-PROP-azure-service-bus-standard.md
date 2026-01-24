# ADR: Standardize on Azure Service Bus for Messaging

Date: 2025-12-11
Status: Proposed
Decision Type: Architecture

## Context

The platform requires an event-driven architecture to decouple services, support fan-out, and ensure reliable processing with observability. Documentation currently references both Azure Storage Queues and Azure Service Bus.

## Decision

Standardize on Azure Service Bus as the primary messaging broker for all event-driven workflows.

## Rationale

- Enterprise features: topics/subscriptions, dead-letter queues, sessions for ordered processing.
- Rich diagnostics and monitoring integrations with Azure Monitor and App Insights.
- Fine-grained control over delivery count, TTL, filters, and routing.
- KEDA scaler support for queues and topic subscriptions; alignment with Dapr `pubsub.azure.servicebus`.

## Scope

- Applies to all asynchronous events, commands, and integration messaging in production and pre-production.
- Producers: APIs, Functions, background services.
- Consumers: Azure Functions, Dapr subscribers, Aspire services.

### Primary Use Cases

| Use Case | Queues/Topics | Justification |
|----------|---------------|---------------|
| **RDS Integration** | `new-residency-queue`, `residency-response-queue`, `residency-status-queue` | External integration with MuleSoft ESB for NC residency verification. Requires reliable delivery, DLQ for failed messages, and audit trail. See [INT-07](../02-architecture/integrations/INT-07-rds-residency-determination-service.md), [ADR-013](ADR-013-rds-async-integration-pattern.md) |
| **Roster Workflow** | Topic: `k12.roster.events` | Long-running workflow state changes. See [ADR-012](ADR-012-roster-workflow-orchestration.md) |
| **Email Notifications** | Queue: `k12.notifications.email` | SendGrid integration with retry and DLQ |
| **Document Processing** | Queue: `k12.documents.process` | PandaDoc generation requests |

## Carve-out policy

Storage Queues may be used only for low-risk, non-critical, cost-sensitive workloads with simple retry needs (no ordering, no fan-out). Each usage must be explicitly documented with owners and SLAs.

## Operational policies

- DLQ enabled on all entities; max delivery count = 5–10.
- Idempotent consumers; duplicate-safe processing.
- Use sessions for strict per-aggregate ordering (e.g., per `applicationId`).
- Enforce naming: `k12.<domain>.<event>`; subscriptions `sub.<consumer>`.

## Alternatives considered

- Azure Storage Queues: lower cost but lacks topics, sessions, rich DLQ semantics.
- Event Grid/EH: excellent for reactive/eventing/telemetry, but Service Bus better fits command/event processing with guarantees.

## Consequences

- Unified broker simplifies topology, standards, and ops runbooks.
- Migration of examples and diagrams from Storage Queues to Service Bus.

## References

- OPS-messaging runbook: `wiki/09-proposed-architecture/OPS-messaging.md`
- KEDA scaler docs (Service Bus)
- Dapr Azure Service Bus pub/sub component
