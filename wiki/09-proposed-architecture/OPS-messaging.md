# Operations: Messaging (Azure Service Bus)

This runbook standardizes operations for the event-driven messaging layer based on Azure Service Bus. It covers monitoring, alerts, DLQ handling, replay/quarantine procedures, and troubleshooting. Use this as your day-to-day guide and as an onboarding reference.

## Scope

- Azure Service Bus (queues, topics/subscriptions)
- Consumers: Azure Functions, Dapr pub/sub, Aspire services
- Observability: Azure Monitor, Application Insights, Logs/KQL

## Naming and topology standards

- Namespace per environment: `sb-<env>-k12` (e.g., `sb-dev-k12`, `sb-prod-k12`).
- Queues/topics naming: `k12.<domain>.<event>` (e.g., `k12.roster.application-submitted`).
- Topic subscription naming: `sub.<consumer>` (e.g., `sub.docs-api`).
- Use topics for fan-out; queues for point-to-point and command processing.
- Prefer sessions when strict ordering is needed per aggregate (e.g., per `applicationId`).
- Enforce max delivery count = 5–10 with DLQ enabled on all entities.

## Message envelope and schema

- Envelope fields (required): `eventId`, `eventType`, `version`, `occurredAt`, `correlationId`, `causationId`, `tenantId`, `environment`.
- Payload: JSON object; keep under 256 KB; include only necessary fields.
- Versioning: semantic versions (e.g., `1.2`); producers must not break existing consumers; introduce new versions for breaking changes.

## Observability and alerts

### Metrics to monitor

- Queue depth and active message count (per entity).
- Dead-letter queue (DLQ) length.
- Delivery failures and exception rates on consumers.
- Function/Dapr consumer scale-out and latency.

### Sample alerts

- DLQ length > 10 for > 5 minutes.
- Active messages > 1,000 for > 10 minutes on critical entities.
- Consumer failure rate > 2% for 10 minutes.

### KQL queries (Application Insights)

```kql
traces
| where message has "ServiceBus" and severityLevel >= 2
| summarize count() by bin(timestamp, 5m), operation_Name

exceptions
| where type has "ServiceBusException" or type has "MessagingException"
| summarize failures=count() by bin(timestamp, 5m), operation_Name

customMetrics
| where name in ("sb.dlq.length", "sb.active.length")
| summarize avg(value) by bin(timestamp, 5m), name, cloud_RoleName
```

## DLQ handling runbook

1. Identify DLQ spikes via alerts.
2. Inspect sample messages:
   - Use Service Bus Explorer (Portal) or CLI to peek DLQ.
   - Check `correlationId`, `eventType`, last exception.
3. Classify cause:
   - Transient (e.g., downstream outage)
   - Permanent (e.g., schema mismatch)
4. Actions:
   - Transient: fix downstream, then replay (move messages back to main queue or re-submit).
   - Permanent: quarantine (move to `queue.quarantine`), create incident, open a work item, and notify owners.
5. Record resolution notes in incident and link to message sample (redact PII).

### Replay procedures

- Use Azure Functions admin endpoint or a replay utility to reprocess.
- For large batches, throttle replays to avoid producer/consumer overload.
- Maintain idempotency: consumers must safely handle duplicate deliveries.

## KEDA autoscaling

- Use `azure-servicebus` scaler for queues or topic subscriptions.
- Recommended metadata:
  - `queueName` or `topicName` + `subscriptionName`
  - `messageCount` (e.g., `5`) and `activationMessageCount` (e.g., `0`)
  - `connectionFromEnv` pointing to managed identity or connection string
- Scale to zero permitted for background consumers; ensure warm-up tests for latency-sensitive flows.

### Example: KEDA ScaledObject for a queue

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
   name: k12-email-processor
spec:
   scaleTargetRef:
      name: email-consumer-deployment
   minReplicaCount: 0
   maxReplicaCount: 10
   triggers:
   - type: azure-servicebus
      metadata:
         queueName: k12.notifications.email-queued
         messageCount: "5"
         activationMessageCount: "0"
         connectionFromEnv: SERVICEBUS_CONNECTION
```

### Example: KEDA ScaledObject for a topic subscription

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
   name: k12-docs-subscription
spec:
   scaleTargetRef:
      name: docs-consumer-deployment
   minReplicaCount: 0
   maxReplicaCount: 10
   triggers:
   - type: azure-servicebus
      metadata:
         topicName: k12.docs.document-uploaded
         subscriptionName: sub.docs-api
         messageCount: "5"
         activationMessageCount: "0"
         connectionFromEnv: SERVICEBUS_CONNECTION
```

## Dapr pub/sub consumers

- Component: `pubsub.azure.servicebus`.
- Key settings:
  - `namespace`, `entityName`, `disableEntityManagement=true` (infra-managed), `maxConcurrentHandlers`, dead-letter forwarding policy.
- Subscriptions: define topic filters and route handlers; propagate `correlationId` across HTTP boundaries.

### Example: Dapr component (Azure Service Bus)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
   name: messagebus
spec:
   type: pubsub.azure.servicebus
   version: v1
   metadata:
   - name: connectionString
      secretRef: servicebus-connection
   - name: namespace
      value: sb-dev-k12
   - name: entityName
      value: k12.docs.document-uploaded
   - name: disableEntityManagement
      value: "true"
   - name: maxConcurrentHandlers
      value: "16"
scopes:
- docs-api
```

### Example: Dapr subscription

```yaml
apiVersion: dapr.io/v1alpha1
kind: Subscription
metadata:
   name: docs-uploaded-sub
spec:
   topic: k12.docs.document-uploaded
   route: /events/docs-uploaded
   pubsubname: messagebus
   scopes:
   - docs-api
```

## Troubleshooting checklist

- Check consumer logs for `ServiceBusException` (link dead-letter reason codes where available).
- Validate connection/auth (Managed Identity vs connection string).
- Confirm entity existence and permissions; verify `disableEntityManagement` if infra manages entities.
- Review message size and schema; reject oversize payloads early.
- Verify session locks if using sessions; monitor lock lost events.

## SRE playbook integrations

- Create Azure Monitor alert rules per entity; route to incident management.
- Maintain owners per queue/topic in a registry; include on-call rotations.
- Quarterly DLQ drills: simulate failures and test replay/quarantine.

## Producers/Consumers registry

Maintain a simple registry of messaging entities with owners and SLAs.

| Entity | Type | Owner Team | On-call | SLA |
|---|---|---|---|---|
| k12.notifications.email-queued | Queue | Messaging | @oncall-messaging | Process within 5m |
| k12.docs.document-uploaded / sub.docs-api | Topic/Subscription | Docs API | @oncall-docs | Process within 2m |


## References

- Azure Service Bus operational excellence (Well-Architected)
- KEDA scalers for Service Bus
- Dapr Azure Service Bus pub/sub component
