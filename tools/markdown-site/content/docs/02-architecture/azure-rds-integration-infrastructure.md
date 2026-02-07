# K12 MyPortal Azure Infrastructure - RDS Integration

> Integration architecture for Residency Determination Service (RDS) via Azure Service Bus

## Overview

This document details the Azure infrastructure components supporting the RDS (Residency Determination Service) integration for NC residency verification. The integration uses **Azure Service Bus** for reliable asynchronous messaging between K12 and the CFI-managed MuleSoft ESB.

**Related Documentation:**
- [INT-07: RDS Integration Specification](integrations/INT-07-rds-residency-determination-service.md)
- [ADR-013: RDS Async Integration Pattern](./../adr/ADR-013-rds-async-integration-pattern.md)
- [C4-05: RDS Integration Diagrams](c4-diagrams/05-rds-integration-context.md)

---

## High-Level Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        K12 AZURE ENVIRONMENT                                                     │
│                                          (Azure Government Cloud)                                                │
│                                                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                      PRESENTATION LAYER                                                   │   │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                             │   │
│  │   │    Admin     │   │  Enrollment  │   │   Providers  │   │   Schools    │                             │   │
│  │   │   Portal     │   │    Portal    │   │    Portal    │   │    Portal    │                             │   │
│  │   │ (Angular 19) │   │ (Angular 19) │   │ (Angular 19) │   │ (Angular 19) │                             │   │
│  │   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘                             │   │
│  │          │                  │                  │                  │                                       │   │
│  │          └──────────────────┴────────┬─────────┴──────────────────┘                                       │   │
│  │                                      │                                                                     │   │
│  │                           ┌──────────▼──────────┐                                                         │   │
│  │                           │   Azure Front Door   │                                                         │   │
│  │                           │   (WAF + CDN)        │                                                         │   │
│  │                           └──────────┬──────────┘                                                         │   │
│  └──────────────────────────────────────┼────────────────────────────────────────────────────────────────────┘   │
│                                         │                                                                        │
│  ┌──────────────────────────────────────┼────────────────────────────────────────────────────────────────────┐   │
│  │                                API GATEWAY LAYER                                                           │   │
│  │                           ┌──────────▼──────────┐                                                         │   │
│  │                           │   API Management     │                                                         │   │
│  │                           │   (APIM)             │                                                         │   │
│  │                           │   • JWT Validation   │                                                         │   │
│  │                           │   • Rate Limiting    │                                                         │   │
│  │                           │   • Routing          │                                                         │   │
│  │                           └──────────┬──────────┘                                                         │   │
│  └──────────────────────────────────────┼────────────────────────────────────────────────────────────────────┘   │
│                                         │                                                                        │
│  ┌──────────────────────────────────────┼────────────────────────────────────────────────────────────────────┐   │
│  │                              APPLICATION LAYER                                                             │   │
│  │       ┌──────────────────────────────▼──────────────────────────────┐                                     │   │
│  │       │                    K12 API (Azure Functions)                 │                                     │   │
│  │       │                       (.NET 8 Backend)                       │                                     │   │
│  │       │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │                                     │   │
│  │       │  │  Enrollment API │  │   Programs API  │  │  Admin API   │ │                                     │   │
│  │       │  └─────────────────┘  └─────────────────┘  └──────────────┘ │                                     │   │
│  │       └────────────────────────────────┬────────────────────────────┘                                     │   │
│  │                                        │                                                                   │   │
│  │       ┌────────────────────────────────▼────────────────────────────┐                                     │   │
│  │       │              RESIDENCY SERVICE COMPONENT                     │                                     │   │
│  │       │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │                                     │   │
│  │       │  │ Request Handler │  │Response Processor│  │ K12 Rules    │ │                                     │   │
│  │       │  │ (Create Requests)│  │(Process Raw Data)│  │ Engine       │ │                                     │   │
│  │       │  └────────┬────────┘  └────────▲────────┘  │ (SOURCE OF   │ │                                     │   │
│  │       │           │                    │           │  TRUTH)      │ │                                     │   │
│  │       │           │                    │           └──────────────┘ │                                     │   │
│  │       └───────────┼────────────────────┼────────────────────────────┘                                     │   │
│  └───────────────────┼────────────────────┼──────────────────────────────────────────────────────────────────┘   │
│                      │                    │                                                                      │
│  ┌───────────────────┼────────────────────┼──────────────────────────────────────────────────────────────────┐   │
│  │               MESSAGING LAYER (Azure Service Bus)                                                          │   │
│  │                      │                    │                                                                 │   │
│  │   ┌──────────────────▼──────────────────┐ │ ┌──────────────────────────────┐                              │   │
│  │   │      NEW RESIDENCY QUEUE            │ │ │    RESIDENCY RESPONSE QUEUE  │                              │   │
│  │   │      (new-residency-queue)          │ │ │    (residency-response-queue)│                              │   │
│  │   │                                     │ │ │                              │                              │   │
│  │   │  • Outbound validation requests     │ │ │  • Inbound raw agency data   │                              │   │
│  │   │  • TTL: 7 days                      │ │ │  • TTL: 14 days              │                              │   │
│  │   │  • Max Delivery: 5                  │ │ │  • Max Delivery: 3           │                              │   │
│  │   │  • Dead Letter Queue enabled        │ │ │  • Dead Letter Queue enabled │                              │   │
│  │   └──────────────────┬──────────────────┘ │ └──────────────────▲───────────┘                              │   │
│  │                      │                    │                    │                                           │   │
│  │   ┌──────────────────────────────────────────────────────────────────────────┐                            │   │
│  │   │                    RESIDENCY STATUS QUEUE                                 │                            │   │
│  │   │                    (residency-status-queue)                               │                            │   │
│  │   │                    • Status polling requests                              │                            │   │
│  │   └──────────────────────────────────────────────────────────────────────────┘                            │   │
│  └───────────────────┬────────────────────────────────────────────▲───────────────────────────────────────────┘   │
│                      │                                            │                                              │
│  ┌───────────────────┼────────────────────────────────────────────┼───────────────────────────────────────────┐   │
│  │               DATA LAYER                                       │                                            │   │
│  │   ┌───────────────▼──────────────┐  ┌──────────────────────────┼───────────┐  ┌──────────────────────────┐│   │
│  │   │        Azure SQL              │  │       Key Vault           │           │  │     Storage Account     ││   │
│  │   │   ┌─────────────────────┐    │  │  ┌────────────────────────▼─────────┐ │  │  ┌────────────────────┐ ││   │
│  │   │   │ ResidencyValidation │    │  │  │ Service Bus Connection String   │ │  │  │  Audit Logs        │ ││   │
│  │   │   │ AgencyTracking      │    │  │  │ RDS Credentials (per env)       │ │  │  │  PII Storage       │ ││   │
│  │   │   │ ManualReviewTask    │    │  │  │ API Keys                        │ │  │  │  (Encrypted)       │ ││   │
│  │   │   └─────────────────────┘    │  │  └──────────────────────────────────┘ │  │  └────────────────────┘ ││   │
│  │   └──────────────────────────────┘  └───────────────────────────────────────┘  └──────────────────────────┘│   │
│  └────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                      │                                            │                                              │
└──────────────────────┼────────────────────────────────────────────┼──────────────────────────────────────────────┘
                       │                                            │
                       │         AZURE FIREWALL / NSG               │
                       │         (Allow RDS IP Ranges)              │
                       │                                            │
                       ▼                                            │
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   EXTERNAL: CFI MULESOFT ENVIRONMENT                                              │
│                                                                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              MULESOFT ESB (Anypoint Platform)                                              │   │
│  │                                                                                                            │   │
│  │   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐                   │   │
│  │   │  Queue Listener │──▶│ Payload Validator│──▶│  Error Handler  │──▶│  Agency Router  │                   │   │
│  │   │ (Pulls from K12 │   │ (Format Check)   │   │ (Apply Defaults)│   │ (SFTP Dispatch) │                   │   │
│  │   │  Service Bus)   │   │                  │   │                  │   │                 │                   │   │
│  │   └─────────────────┘   └─────────────────┘   └─────────────────┘   └────────┬────────┘                   │   │
│  │                                                                               │                            │   │
│  │   ┌─────────────────┐   ┌─────────────────┐          ┌────────────────────────┴────────────────────────┐   │   │
│  │   │Response Publisher│◀──│ Response        │◀─────────│                                                │   │   │
│  │   │(Pushes to K12   │   │ Aggregator      │          │                                                │   │   │
│  │   │ Service Bus)    │   │ (Raw Data Only) │          │                                                │   │   │
│  │   └─────────────────┘   └─────────────────┘          │                                                │   │   │
│  │                                                       │                                                │   │   │
│  │   MuleSoft Azure Connectors:                         │                                                │   │   │
│  │   • Azure Service Bus Connector v3.4.3               │                                                │   │   │
│  │   • Azure Key Vault Connector v1.2.0                 │                                                │   │   │
│  │   • Azure Data Lake Storage Connector v1.0.7         ▼                                                │   │   │
│  └───────────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                          │                                                        │
└──────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┘
                                                           │
                           ┌───────────────────────────────┴───────────────────────────────┐
                           │                                                               │
                           ▼                                                               ▼
┌───────────────────────────────────────────────────┐   ┌───────────────────────────────────────────────────┐
│              NC DMV DATACENTER                     │   │              NC DOR DATACENTER                     │
│                                                    │   │                                                    │
│   ┌────────────────────────────────────────────┐  │   │   ┌────────────────────────────────────────────┐  │
│   │            DMV SFTP SERVER                  │  │   │   │            DOR SFTP SERVER                  │  │
│   │                                             │  │   │   │                                             │  │
│   │  • Driver License Verification              │  │   │   │  • Tax Filing Verification                  │  │
│   │  • Vehicle Registration Data                │  │   │   │  • Residency Status (Y/N/X)                 │  │
│   │  • Processing: Daily @ 7:00 AM EST          │  │   │   │  • Filing Status Codes                      │  │
│   │                                             │  │   │   │  • Processing: Daily @ 7:30 PM EST          │  │
│   │  Response Data:                             │  │   │   │                                             │  │
│   │  ┌─────────────────────────────────────┐   │  │   │   │  Response Data:                             │  │
│   │  │ driverLicence: Y/N                  │   │  │   │   │  ┌─────────────────────────────────────┐   │  │
│   │  │ vehicleRegistered: Y/N              │   │  │   │   │  │ ncResident: Y/N/X                   │   │  │
│   │  │ deceasedDate: YYYY-MM-DD            │   │  │   │   │  │ filingStatus: 1-5/X                 │   │  │
│   │  │ errorCode: DOT01-DOT99              │   │  │   │   │  │ residencyIndicator: Y/N/X           │   │  │
│   │  └─────────────────────────────────────┘   │  │   │   │  └─────────────────────────────────────┘   │  │
│   └────────────────────────────────────────────┘  │   │   └────────────────────────────────────────────┘  │
│                                                    │   │                                                    │
└────────────────────────────────────────────────────┘   └────────────────────────────────────────────────────┘
```

---

## Azure Service Bus Configuration

### Service Bus Namespace (Per Environment)

| Environment | Namespace | SKU | Region |
|-------------|-----------|-----|--------|
| Development | `k12-sb-dev` | Standard | East US 2 |
| Testing | `k12-sb-testing` | Standard | East US 2 |
| Staging | `k12-sb-staging` | Standard | East US 2 |
| Production | `k12-sb-prod` | Premium | East US 2 |

### Queue Configuration

```yaml
# new-residency-queue
new-residency-queue:
  maxSizeInMegabytes: 5120
  defaultMessageTimeToLive: P7D      # 7 days
  lockDuration: PT1M                  # 1 minute
  maxDeliveryCount: 5
  deadLetteringOnMessageExpiration: true
  enablePartitioning: false
  requiresSession: false

# residency-response-queue
residency-response-queue:
  maxSizeInMegabytes: 5120
  defaultMessageTimeToLive: P14D     # 14 days
  lockDuration: PT30S                 # 30 seconds
  maxDeliveryCount: 3
  deadLetteringOnMessageExpiration: true
  enablePartitioning: false
  requiresSession: false

# residency-status-queue
residency-status-queue:
  maxSizeInMegabytes: 1024
  defaultMessageTimeToLive: P1D      # 1 day
  lockDuration: PT30S                 # 30 seconds
  maxDeliveryCount: 3
  deadLetteringOnMessageExpiration: true
  enablePartitioning: false
  requiresSession: false
```

### Dead Letter Queue Handling

```
┌────────────────────────────────────────────────────────────────────┐
│                    DEAD LETTER QUEUE FLOW                           │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐│
│   │  Message    │───▶│   Retry     │───▶│ Max Delivery Count      ││
│   │  Published  │    │   (1-5x)    │    │ Exceeded? → DLQ         ││
│   └─────────────┘    └─────────────┘    └───────────┬─────────────┘│
│                                                      │              │
│                                          ┌───────────▼─────────────┐│
│                                          │  Dead Letter Queue      ││
│                                          │  • Manual investigation ││
│                                          │  • Alert to Ops team    ││
│                                          │  • Replay after fix     ││
│                                          └─────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

---

## Network Security Configuration

### Firewall Rules for RDS Access

RDS (MuleSoft) connects to K12 Azure Service Bus as an **external client**. The following network configuration is required:

```
┌─────────────────────────────────────────────────────────────────┐
│                    NETWORK SECURITY                              │
│                                                                  │
│   K12 Azure Environment                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Network Security Group (NSG)                            │   │
│   │  ┌─────────────────────────────────────────────────────┐ │   │
│   │  │ INBOUND RULES:                                       │ │   │
│   │  │ • Allow: CFI MuleSoft IP Range → Port 443 (AMQP/TLS)│ │   │
│   │  │ • Allow: K12 Azure Functions → Port 443             │ │   │
│   │  │ • Deny: All other                                   │ │   │
│   │  └─────────────────────────────────────────────────────┘ │   │
│   │                                                          │   │
│   │  Service Bus Firewall                                    │   │
│   │  ┌─────────────────────────────────────────────────────┐ │   │
│   │  │ • Trusted Microsoft Services: Enabled               │ │   │
│   │  │ • IP Rules: CFI MuleSoft Public IPs                 │ │   │
│   │  │ • Virtual Network Rules: K12 VNet Subnet            │ │   │
│   │  └─────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Access Control

| Principal | Access Level | Authentication |
|-----------|-------------|----------------|
| K12 Azure Functions | Send + Listen | Managed Identity |
| RDS (MuleSoft) | Send + Listen | SAS Token / Connection String |
| DevOps Pipelines | Manage | Service Principal |

---

## Azure Resource Inventory (RDS Integration)

### Service Bus Resources

| Environment | Resource Name | Resource Group | Type |
|-------------|--------------|----------------|------|
| Development | k12-sb-dev | development | Microsoft.ServiceBus/namespaces |
| Development | new-residency-queue | development | Queue |
| Development | residency-response-queue | development | Queue |
| Development | residency-status-queue | development | Queue |
| Testing | k12-sb-testing | testing | Microsoft.ServiceBus/namespaces |
| Staging | k12-sb-staging | staging | Microsoft.ServiceBus/namespaces |
| Production | k12-sb-prod | k12-cms | Microsoft.ServiceBus/namespaces |

### Key Vault Secrets (RDS Integration)

| Secret Name | Purpose | Rotation |
|-------------|---------|----------|
| `ServiceBus--ConnectionString` | K12 internal connection | Azure managed |
| `RDS--ServiceBus--ConnectionString` | Shared with CFI/RDS | Quarterly |
| `RDS--EncryptionKey` | PII encryption key | Annual |

### Monitoring Resources

| Resource | Type | Purpose |
|----------|------|---------|
| `rds-integration-insights` | Application Insights | RDS message flow monitoring |
| `rds-dlq-alert` | Alert Rule | Dead letter queue threshold |
| `rds-latency-alert` | Alert Rule | Response time SLA monitoring |

---

## Data Flow Architecture

### Request Flow (K12 → RDS → Agencies)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Parent Submits Enrollment                                                        │
│                                                                                          │
│   Parent Portal ──▶ K12 API ──▶ Residency Service ──▶ Create Request                    │
│                                                         │                                │
│                                                         ▼                                │
│                                                  ┌──────────────┐                        │
│                                                  │ Azure SQL    │                        │
│                                                  │ (PENDING)    │                        │
│                                                  └──────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Publish to Service Bus                                                           │
│                                                                                          │
│   Residency Service ──▶ new-residency-queue                                              │
│                         │                                                                │
│                         │  Message: { k12Id, ssn, dob, lastName, dmvState, ... }        │
│                         │  CorrelationId: k12Id                                         │
│                         │  MessageId: GUID                                              │
│                         ▼                                                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: MuleSoft Processes Request                                                       │
│                                                                                          │
│   Mule RDS ◀── new-residency-queue                                                       │
│      │                                                                                   │
│      ├──▶ Validate Payload                                                              │
│      │       └── If invalid: Add error codes, apply defaults                            │
│      │                                                                                   │
│      ├──▶ Create DMV Request File ──▶ SFTP to NC DMV                                    │
│      │                                                                                   │
│      └──▶ Create DOR Request File ──▶ SFTP to NC DOR                                    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Response Flow (Agencies → RDS → K12)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Agency Response Processing (24-36 hours later)                                   │
│                                                                                          │
│   NC DMV ──SFTP──▶ Mule RDS ◀──SFTP── NC DOR                                            │
│                       │                                                                  │
│                       ├──▶ Parse DMV Raw Data (driverLicence, vehicleRegistered)        │
│                       │                                                                  │
│                       ├──▶ Parse DOR Raw Data (ncResident, filingStatus)                │
│                       │                                                                  │
│                       └──▶ Aggregate into Response JSON                                 │
│                            (NO BUSINESS RULES APPLIED - RAW DATA ONLY)                  │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Publish Response to K12                                                          │
│                                                                                          │
│   Mule RDS ──▶ residency-response-queue                                                  │
│                │                                                                         │
│                │  Message: { k12Id, completionStatus, tracking: [DMV, DOR], ... }       │
│                │  EventType: COMPLETE                                                   │
│                ▼                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 6: K12 Applies Business Rules (SOURCE OF TRUTH)                                     │
│                                                                                          │
│   Residency Service ◀── residency-response-queue                                         │
│          │                                                                               │
│          ├──▶ Parse Raw Agency Data                                                     │
│          │                                                                               │
│          ├──▶ Apply SEAA Business Rules                                                 │
│          │       ├── DMV: NC License in any year? → DMV_CONFIRMED                       │
│          │       ├── DOR: NC Resident on tax return? → DOR_CONFIRMED                    │
│          │       └── Both confirmed? → RESIDENCY = Y                                    │
│          │                                                                               │
│          ├──▶ Determine Final Result                                                    │
│          │       ├── Both Confirmed → Residency = Y (Auto-Approve)                      │
│          │       ├── Both Not Confirmed → Residency = N (Auto-Reject)                   │
│          │       └── Conflict/Errors → Manual Review Required                           │
│          │                                                                               │
│          └──▶ Update Azure SQL                                                          │
│                  └── ResidencyValidation.Status = VERIFIED / MANUAL_REVIEW              │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

### Application Insights Queries

```kusto
// RDS Request Volume (Last 24 Hours)
customEvents
| where name == "RdsRequestSubmitted"
| where timestamp > ago(24h)
| summarize count() by bin(timestamp, 1h)
| render timechart

// RDS Response Latency (Request to Complete)
customMetrics
| where name == "RdsResponseLatencyMs"
| where timestamp > ago(7d)
| summarize avg(value), percentile(value, 95) by bin(timestamp, 1d)

// Dead Letter Queue Count
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.SERVICEBUS"
| where Category == "OperationalLogs"
| where OperationName == "DeadLetter"
| summarize count() by bin(TimeGenerated, 1h)
```

### Alert Rules

| Alert | Condition | Action |
|-------|-----------|--------|
| DLQ Threshold | Dead letter count > 10 in 1 hour | Email Ops Team |
| Response SLA | Response time > 72 hours | Page On-Call |
| Error Rate | Error codes in > 20% of responses | Email Dev Team |
| Queue Depth | new-residency-queue > 1000 messages | Scale Function App |

---

## Disaster Recovery

### Service Bus Geo-Recovery (Production)

```
┌─────────────────────────────────────────────────────────────────┐
│                 PRODUCTION GEO-RECOVERY                          │
│                                                                  │
│   PRIMARY (East US 2)              SECONDARY (Central US)        │
│   ┌─────────────────┐              ┌─────────────────┐          │
│   │ k12-sb-prod     │◀────────────▶│ k12-sb-prod-dr  │          │
│   │ (Premium Tier)  │  Geo-Pairing │ (Premium Tier)  │          │
│   │                 │              │                 │          │
│   │ • Active        │              │ • Passive       │          │
│   │ • Read/Write    │              │ • Read-Only     │          │
│   └─────────────────┘              └─────────────────┘          │
│                                                                  │
│   Failover: Automatic (managed by Azure)                        │
│   RTO: < 2 minutes                                              │
│   RPO: 0 (synchronous replication)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [Azure Infrastructure Overview](azure-infrastructure.md)
- [INT-07: RDS Integration Specification](integrations/INT-07-rds-residency-determination-service.md)
- [ADR-013: RDS Async Integration Pattern](./../adr/ADR-013-rds-async-integration-pattern.md)
- [C4-05: RDS Integration Diagrams](c4-diagrams/05-rds-integration-context.md)
- [ADR-PROP: Azure Service Bus Standard](./../09-proposed-architecture/07-adr-proposed/ADR-PROP-azure-service-bus-standard.md)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-12
**Owner:** CFI Architecture Team
