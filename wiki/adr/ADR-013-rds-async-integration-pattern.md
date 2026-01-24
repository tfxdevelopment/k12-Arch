# ADR-013: RDS Asynchronous Integration Pattern for Residency Validation

**Status:** Accepted
**Date:** 2025-12-12
**Deciders:** CFI Architecture Team, SEAA Product Owner
**Technical Story:** [K12-2964](https://cfi-nc.atlassian.net/browse/K12-2964) Enabler and RDS Integration

## Context and Problem Statement

The K12 MyPortal system requires automated residency verification to determine scholarship eligibility. NC state law mandates electronic verification of residency through state agency data (G.S. 115C-562.3). The system must validate parent/guardian residency against:

1. **NC DMV** - Driver license and vehicle registration data
2. **NC DOR** - Tax filing and residency status
3. **NC DPI** - Student enrollment data (future phase)

The existing INT-05 integration uses direct SOAP/SFTP connections to agencies, but CFI has developed a centralized **Residency Determination Service (RDS)** via MuleSoft ESB that aggregates agency access. The question is how K12 should integrate with RDS for reliable, auditable residency verification.

**Critical Architectural Decision:** RDS returns **raw agency data** to K12. The K12 system is the **authoritative source of truth** for the final residency determination, applying SEAA-specific business rules to the raw data.

## Decision Drivers

* **Compliance**: Complete audit trail required for state audits and appeals
* **Reliability**: 95,000+ annual validations must complete without data loss
* **Processing Time**: Agency file processing is batch-based (daily), requiring async handling
* **Separation of Concerns**: K12 owns business rules; RDS handles agency connectivity
* **Security**: PII (SSN, DOB, tax data) requires secure transmission and storage
* **Operational Timeline**: Agency processing schedules (DMV: 7:00 AM EST, DOR: 7:30 PM EST)

## Considered Options

1. **Azure Service Bus + MuleSoft ESB** (Asynchronous Message Queues)
2. **Direct SFTP Integration** (Current INT-05 approach, expanded)
3. **Synchronous REST API** (Real-time request/response)
4. **Azure Logic Apps** (Low-code integration workflow)

## Decision Outcome

**Chosen option:** "Azure Service Bus + MuleSoft ESB", because it provides:
- Reliable message delivery with guaranteed processing
- Decoupling of K12 and RDS for independent scaling/deployment
- Built-in retry, dead-letter, and audit capabilities
- Support for async 24-72 hour processing windows
- Compatibility with existing CFI MuleSoft infrastructure

### Consequences

#### Good
- **Reliable Delivery**: Service Bus guarantees message processing with dead-letter queues
- **Audit Trail**: All messages are logged with timestamps for compliance
- **Decoupled Systems**: K12 and RDS can be updated independently
- **Error Recovery**: Failed messages automatically retry with exponential backoff
- **Scalability**: Queue-based processing handles peak volumes (Feb-April application period)
- **K12 Rule Ownership**: Business rules remain in K12 for SEAA customization

#### Bad
- **Latency**: 24-72 hours for complete validation (inherent to agency batch processing)
- **Complexity**: Requires queue monitoring, dead-letter handling, status polling
- **State Management**: K12 must track pending validations and correlate responses

#### Neutral
- MuleSoft connector versions must be maintained by CFI integration team
- Queue connection credentials must be securely managed per environment

## Pros and Cons of the Options

### Option 1: Azure Service Bus + MuleSoft ESB

* **Pro:** Guaranteed message delivery with at-least-once semantics
* **Pro:** Native Azure integration with Key Vault for secrets
* **Pro:** Supports async patterns matching agency processing schedules
* **Pro:** MuleSoft provides existing connectors for DMV/DOR SFTP
* **Pro:** Dead-letter queues capture failed messages for investigation
* **Con:** Requires managing queue connections per environment
* **Con:** Additional infrastructure (Service Bus namespace, queues)

### Option 2: Direct SFTP Integration

* **Pro:** Simpler architecture - direct K12 to agency communication
* **Pro:** No MuleSoft dependency
* **Con:** K12 must manage SFTP connections to each agency
* **Con:** No centralized error handling or retry logic
* **Con:** File format changes require K12 code updates
* **Con:** Limited audit capabilities compared to message queues

### Option 3: Synchronous REST API

* **Pro:** Simple request/response model
* **Pro:** Immediate feedback for validation requests
* **Con:** Incompatible with agency batch processing (daily file schedules)
* **Con:** Requires blocking calls or complex polling logic
* **Con:** No natural retry mechanism for failed requests

### Option 4: Azure Logic Apps

* **Pro:** Low-code, visual workflow design
* **Pro:** Built-in connectors for Service Bus, SFTP
* **Con:** Limited control over error handling and retries
* **Con:** Per-execution pricing may be expensive at scale
* **Con:** Team lacks Logic Apps expertise

## Technical Details

### Integration Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   K12 MyPortal  │     │  Azure Service  │     │   MuleSoft RDS  │
│                 │     │      Bus        │     │                 │
│ ┌─────────────┐ │     │ ┌─────────────┐ │     │ ┌─────────────┐ │
│ │  Residency  │─┼────▶│ │ new-residency│─┼────▶│ │ Queue       │ │
│ │  Service    │ │     │ │   -queue    │ │     │ │ Listener    │ │
│ └─────────────┘ │     │ └─────────────┘ │     │ └──────┬──────┘ │
│       ▲         │     │                 │     │        │        │
│       │         │     │ ┌─────────────┐ │     │        ▼        │
│ ┌─────┴───────┐ │     │ │  response   │ │     │ ┌─────────────┐ │
│ │ Response    │◀┼─────│ │   -queue    │◀┼─────│ │ Validator   │ │
│ │ Processor   │ │     │ └─────────────┘ │     │ └──────┬──────┘ │
│ └─────────────┘ │     │                 │     │        │        │
│       │         │     └─────────────────┘     │        ▼        │
│       ▼         │                             │ ┌─────────────┐ │
│ ┌─────────────┐ │                             │ │ DMV/DOR     │ │
│ │  K12 Rules  │ │                             │ │ Connectors  │ │
│ │  Engine     │ │                             │ └─────────────┘ │
│ └─────────────┘ │                             └─────────────────┘
│       │         │                                     │
│       ▼         │                                     ▼
│ ┌─────────────┐ │                             ┌─────────────────┐
│ │ Residency   │ │                             │  NC DMV / DOR   │
│ │ Result: Y/N │ │                             │   (SFTP)        │
│ └─────────────┘ │                             └─────────────────┘
└─────────────────┘
```

### Key Design Principles

1. **K12 as Source of Truth**: RDS returns raw agency data; K12 applies SEAA business rules
2. **Asynchronous Processing**: Expect 24-72 hour turnaround
3. **Correlation**: `k12Id` and `batchId` correlate requests to responses
4. **Error Recording**: Validation errors (SSNERR, LNERR, etc.) recorded but processing continues
5. **Status Updates**: UPDATE events for partial completion, COMPLETE when all agencies respond

### Queue Configuration

```yaml
# Azure Service Bus Configuration
queues:
  new-residency-queue:
    maxDeliveryCount: 5
    lockDuration: PT1M
    defaultMessageTimeToLive: P7D
    deadLetteringOnMessageExpiration: true

  residency-response-queue:
    maxDeliveryCount: 3
    lockDuration: PT30S
    defaultMessageTimeToLive: P14D

  residency-status-queue:
    maxDeliveryCount: 3
    lockDuration: PT30S
```

### Request/Response Flow

**Request (K12 → RDS):**
```json
{
  "k12Id": "10000001982",
  "academicYear": "2025-2026",
  "batchId": "20251201",
  "firstName": "John",
  "lastName": "Smith",
  "ssn": "123456789",
  "dmvCustomerId": "0000100000",
  "dmvState": "NC",
  "dob": "1981-08-11",
  "validationDate": "2025-07-01",
  "timestamp": 1754933504000
}
```

**Response (RDS → K12):**
```json
{
  "rds_id": 252,
  "k12Id": "10000001982",
  "completionStatus": "COMPLETE",
  "errorCodes": "",
  "tracking": [
    {
      "source": "DMV",
      "complete": true,
      "sources": [{ "details": [{ "driverLicence": "Y" }] }]
    },
    {
      "source": "DOR",
      "complete": true,
      "sources": [{ "ncResident": "Y" }]
    }
  ]
}
```

**K12 Rule Application:**
```csharp
// K12 is source of truth - applies SEAA business rules
public ResidencyResult DetermineResidency(RdsResponse response)
{
    var dmvConfirmed = HasNcDriverLicense(response);
    var dorConfirmed = HasNcTaxResidency(response);

    if (dmvConfirmed && dorConfirmed) return ResidencyResult.Confirmed;
    if (!dmvConfirmed && !dorConfirmed) return ResidencyResult.NotConfirmed;
    return ResidencyResult.RequiresReview;
}
```

## Validation

This decision will be validated by:

1. **Successful PoC**: End-to-end message flow in sandbox environment
2. **Response Time**: 85%+ validations complete within 48 hours
3. **Error Rate**: <1% message failures (dead-letter rate)
4. **Audit Compliance**: Complete request/response trail passes state audit
5. **Volume Handling**: System processes peak load (95,000 requests in 30 days)

## Related Decisions

* [INT-05: NC DMV/DOR Integration](../02-architecture/integrations/INT-05-nc-dmv-dor-integration.md) - Legacy approach being replaced
* [INT-07: RDS Integration](../02-architecture/integrations/INT-07-rds-residency-determination-service.md) - Detailed integration specification
* [C4-05: RDS Context Diagrams](../02-architecture/c4-diagrams/05-rds-integration-context.md) - Visual architecture

## References

* [K12-2964: Enabler and RDS Integration](https://cfi-nc.atlassian.net/browse/K12-2964) - Jira Epic
* [K12-3844: RDS Integration Implementation](https://cfi-nc.atlassian.net/browse/K12-3844) - Implementation Epic
* [Azure Service Bus Documentation](https://docs.microsoft.com/azure/service-bus-messaging/)
* [MuleSoft Azure Connectors](https://docs.mulesoft.com/connectors/)
* [G.S. 115C-562.3](https://www.ncleg.gov/Laws/GeneralStatuteLookup/115C-562.3) - NC Residency Verification Statute
