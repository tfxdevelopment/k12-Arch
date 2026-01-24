# C4 Diagrams: RDS Integration Architecture

**Document ID:** C4-05
**Subject:** Residency Determination Service (RDS) Integration
**Last Updated:** 2025-12-12

## Table of Contents

- [Level 1: System Context](#level-1-system-context)
- [Level 2: Container Diagram](#level-2-container-diagram)
- [Level 3: Component Diagram](#level-3-component-diagram)
- [Sequence Diagrams](#sequence-diagrams)
- [Data Flow Diagrams](#data-flow-diagrams)

---

## Source of Truth Architecture

> **Critical Design Decision:** K12 MyPortal is the **authoritative source of truth** for final residency determination. RDS aggregates raw agency data (DMV, DOR) but does NOT make the final Y/N decision. K12 applies SEAA business rules to the raw data.

```mermaid
flowchart LR
    subgraph RDS["RDS (MuleSoft)"]
        A[Receive Request] --> B[Route to Agencies]
        B --> C[Aggregate Raw Data]
        C --> D[Return Raw Data to K12]
    end

    subgraph K12["K12 MyPortal (Source of Truth)"]
        E[Receive Raw Data] --> F[Apply SEAA Business Rules]
        F --> G{Both Sources Agree?}
        G -->|Yes: Confirmed| H[Residency = Y]
        G -->|Yes: Not Confirmed| I[Residency = N]
        G -->|No: Conflict| J[Manual Review]
    end

    D --> E
```

See [ADR-013: RDS Asynchronous Integration Pattern](../../adr/ADR-013-rds-async-integration-pattern.md) for the full architectural decision.

---

## Level 1: System Context

### RDS Integration Context Diagram

```mermaid
C4Context
    title System Context Diagram - RDS Residency Determination

    Person(parent, "Parent/Guardian", "Scholarship applicant providing residency information")
    Person(admin, "SEAA Admin", "Reviews manual cases and overrides")

    System(k12, "K12 MyPortal", "Scholarship management system")

    System_Ext(rds, "RDS Service", "MuleSoft ESB residency determination")
    System_Ext(dmv, "NC DMV", "Driver license verification")
    System_Ext(dor, "NC DOR", "Tax filing verification")
    System_Ext(dpi, "NC DPI", "Student enrollment data (future)")

    Rel(parent, k12, "Submits application with residency data")
    Rel(admin, k12, "Reviews flagged cases")
    Rel(k12, rds, "Submits residency validation requests", "Azure Service Bus")
    Rel(rds, dmv, "Validates driver license", "SFTP")
    Rel(rds, dor, "Validates tax residency", "SFTP")
    Rel(rds, dpi, "Validates student enrollment", "API (future)")
    Rel(rds, k12, "Returns validation results", "Azure Service Bus")
```

### Context Description

| Actor/System | Description | Interaction |
|--------------|-------------|-------------|
| **Parent/Guardian** | Scholarship applicant | Provides SSN, DOB, license info during enrollment |
| **SEAA Admin** | State agency administrator | Reviews cases with validation errors |
| **K12 MyPortal** | Primary scholarship platform | Orchestrates validation requests/responses |
| **RDS Service** | MuleSoft integration layer | Routes requests to state agencies |
| **NC DMV** | Dept of Motor Vehicles | Provides driver license/vehicle registration data |
| **NC DOR** | Dept of Revenue | Provides tax filing/residency status |
| **NC DPI** | Dept of Public Instruction | Student enrollment verification (future) |

---

## Level 2: Container Diagram

### RDS Integration Containers

```mermaid
C4Container
    title Container Diagram - RDS Integration Architecture

    Person(parent, "Parent", "Scholarship applicant")

    System_Boundary(k12_boundary, "K12 MyPortal") {
        Container(web_app, "Household Portal", "Angular 19", "Parent enrollment interface")
        Container(admin_app, "Admin Portal", "Angular 19", "Administrative review interface")
        Container(api, "K12 API", "Azure Functions .NET 8", "Business logic and orchestration")
        ContainerDb(sql_db, "Azure SQL", "SQL Server", "Application data including residency records")
        Container(residency_svc, "Residency Service", ".NET 8", "RDS request/response handling")
    }

    System_Boundary(azure_bus, "Azure Service Bus") {
        ContainerQueue(req_queue, "New Residency Queue", "Service Bus Queue", "Outbound validation requests")
        ContainerQueue(resp_queue, "Response Queue", "Service Bus Queue", "Inbound validation results")
        ContainerQueue(status_queue, "Status Queue", "Service Bus Queue", "Status polling requests")
    }

    System_Boundary(mule_boundary, "MuleSoft ESB") {
        Container(mule_rds, "Mule RDS", "MuleSoft", "Integration orchestration")
        Container(validator, "Payload Validator", "MuleSoft", "Input validation and defaults")
        Container(router, "Agency Router", "MuleSoft", "Routes to DMV/DOR")
    }

    System_Ext(dmv, "NC DMV", "SFTP Server")
    System_Ext(dor, "NC DOR", "SFTP Server")

    Rel(parent, web_app, "Submits residency info")
    Rel(web_app, api, "POST /api/residency/validate", "HTTPS")
    Rel(api, residency_svc, "Initiates validation")
    Rel(residency_svc, req_queue, "Publishes request")
    Rel(req_queue, mule_rds, "Pulls messages")
    Rel(mule_rds, validator, "Validates payload")
    Rel(validator, router, "Routes valid requests")
    Rel(router, dmv, "SFTP file transfer")
    Rel(router, dor, "SFTP file transfer")
    Rel(dmv, router, "SFTP response")
    Rel(dor, router, "SFTP response")
    Rel(mule_rds, resp_queue, "Publishes results")
    Rel(resp_queue, residency_svc, "Subscribes to results")
    Rel(residency_svc, sql_db, "Updates validation records")
    Rel(admin_app, api, "Reviews flagged cases")
```

### Container Responsibilities

| Container | Technology | Responsibility |
|-----------|-----------|---------------|
| **Household Portal** | Angular 19 | Collect residency data from parents |
| **Admin Portal** | Angular 19 | Manual review interface for flagged cases |
| **K12 API** | Azure Functions | HTTP endpoints, business logic |
| **Azure SQL** | SQL Server | Persist validation requests/results |
| **Residency Service** | .NET 8 | Queue message handling |
| **New Residency Queue** | Service Bus | Buffer outbound requests |
| **Response Queue** | Service Bus | Receive validation results |
| **Mule RDS** | MuleSoft | ESB orchestration |
| **Payload Validator** | MuleSoft | Input validation, default handling |
| **Agency Router** | MuleSoft | Route to DMV/DOR via SFTP |

---

## Level 3: Component Diagram

### K12 Residency Service Components

```mermaid
C4Component
    title Component Diagram - K12 Residency Service

    Container_Boundary(residency_boundary, "Residency Service") {
        Component(request_handler, "Request Handler", ".NET", "Creates and publishes validation requests")
        Component(response_processor, "Response Processor", ".NET", "Processes agency responses")
        Component(status_checker, "Status Checker", ".NET", "Polls for pending validations")
        Component(rule_engine, "Residency Rules", ".NET", "Applies determination logic")
        Component(review_creator, "Review Task Creator", ".NET", "Creates manual review tasks")
    }

    Container_Boundary(data_boundary, "Data Layer") {
        Component(repo, "Residency Repository", "Dapper", "Data access")
        ComponentDb(db, "Residency Tables", "SQL Server", "ResidencyValidation, AgencyTracking")
    }

    Container_Boundary(queue_boundary, "Message Queue") {
        Component(publisher, "Queue Publisher", "Azure SDK", "Publishes to Service Bus")
        Component(subscriber, "Queue Subscriber", "Azure SDK", "Subscribes to Response Queue")
    }

    Rel(request_handler, publisher, "Sends request message")
    Rel(subscriber, response_processor, "Receives response")
    Rel(response_processor, rule_engine, "Applies rules")
    Rel(rule_engine, repo, "Updates validation")
    Rel(rule_engine, review_creator, "Creates review if needed")
    Rel(review_creator, repo, "Creates review task")
    Rel(status_checker, publisher, "Publishes status request")
    Rel(repo, db, "SQL queries")
```

### MuleSoft RDS Components

> **Note:** RDS does NOT determine residency. It aggregates raw agency data and returns it to K12. The "Response Aggregator" combines data but does NOT apply business rules - that happens in K12.

```mermaid
C4Component
    title Component Diagram - MuleSoft RDS Service (Data Aggregation Only)

    Container_Boundary(mule_boundary, "Mule RDS") {
        Component(queue_listener, "Queue Listener", "Mule Flow", "Subscribes to New Residency Queue")
        Component(validator, "Payload Validator", "DataWeave", "Validates format, applies defaults for invalid fields")
        Component(error_handler, "Error Handler", "Mule Flow", "Records error codes, continues processing")
        Component(dmv_connector, "DMV Connector", "SFTP Connector", "Files to/from DMV")
        Component(dor_connector, "DOR Connector", "SFTP Connector", "Files to/from DOR")
        Component(aggregator, "Response Aggregator", "Mule Flow", "Combines raw agency responses")
        Component(response_publisher, "Response Publisher", "Mule Flow", "Publishes raw data to K12")
    }

    ContainerQueue(req_q, "New Residency Queue", "Input")
    ContainerQueue(resp_q, "Response Queue", "Output (Raw Data)")
    System_Ext(dmv, "NC DMV SFTP")
    System_Ext(dor, "NC DOR SFTP")

    Rel(req_q, queue_listener, "Pulls message")
    Rel(queue_listener, validator, "Validates format")
    Rel(validator, error_handler, "On validation error")
    Rel(error_handler, dmv_connector, "With defaults")
    Rel(validator, dmv_connector, "Valid payload")
    Rel(validator, dor_connector, "Valid payload")
    Rel(dmv_connector, dmv, "SFTP upload/download")
    Rel(dor_connector, dor, "SFTP upload/download")
    Rel(dmv_connector, aggregator, "DMV raw response")
    Rel(dor_connector, aggregator, "DOR raw response")
    Rel(aggregator, response_publisher, "Combined raw data")
    Rel(response_publisher, resp_q, "Publishes to K12")
```

---

## Sequence Diagrams

### Successful Residency Validation Flow

```mermaid
sequenceDiagram
    autonumber
    participant Parent as Parent Portal
    participant API as K12 API
    participant ResSvc as Residency Service
    participant ReqQ as New Residency Queue
    participant Mule as Mule RDS
    participant DMV as NC DMV
    participant DOR as NC DOR
    participant RespQ as Response Queue
    participant DB as Azure SQL

    Parent->>API: Submit Application
    API->>ResSvc: InitiateResidencyCheck(parentId)
    ResSvc->>DB: Create ResidencyValidation (status=PENDING)
    ResSvc->>ReqQ: Publish Request Message

    Note over Mule: Async Processing Begins

    Mule->>ReqQ: Pull Message
    Mule->>Mule: Validate Payload
    Mule->>DMV: SFTP Request File
    Mule->>DOR: SFTP Request File

    Note over DMV,DOR: Agency Processing (hours/days)

    DMV-->>Mule: SFTP Response File
    Mule->>Mule: Process DMV Response (raw data)
    Mule->>RespQ: Publish UPDATE (DMV raw data)

    RespQ-->>ResSvc: Receive UPDATE
    ResSvc->>DB: Update AgencyTracking (DMV)

    DOR-->>Mule: SFTP Response File
    Mule->>Mule: Process DOR Response (raw data)
    Mule->>Mule: All Agencies Complete
    Mule->>RespQ: Publish COMPLETE (raw data only)

    Note over ResSvc: K12 is Source of Truth

    RespQ-->>ResSvc: Receive COMPLETE (raw data)
    ResSvc->>ResSvc: Apply SEAA Business Rules
    ResSvc->>ResSvc: Determine Residency (Y/N)
    ResSvc->>DB: Update ResidencyValidation (status=VERIFIED)
    ResSvc->>API: Residency Confirmed
    API->>Parent: Application Status Updated
```

### Validation with Errors (Manual Review)

```mermaid
sequenceDiagram
    autonumber
    participant ResSvc as Residency Service
    participant ReqQ as New Residency Queue
    participant Mule as Mule RDS
    participant Val as Validator
    participant RespQ as Response Queue
    participant DB as Azure SQL
    participant Admin as Admin Portal

    ResSvc->>ReqQ: Publish Request (invalid SSN)
    Mule->>ReqQ: Pull Message
    Mule->>Val: Validate Payload

    Val->>Val: SSN Invalid
    Val->>Val: Add Error Code: SSNERR
    Val->>Val: Set SSN Default: 000000000

    Mule->>Mule: Continue with Defaults
    Mule->>RespQ: Publish UPDATE (errors recorded)

    Note over Mule: Continue agency validation...

    Mule->>RespQ: Publish COMPLETE (with errorCodes)

    RespQ-->>ResSvc: Receive COMPLETE
    ResSvc->>ResSvc: Detect Error Codes
    ResSvc->>DB: Update ResidencyValidation (status=MANUAL_REVIEW)
    ResSvc->>DB: Create ManualReviewTask

    Admin->>DB: Query Manual Review Tasks
    Admin->>Admin: Review Application
    Admin->>DB: Approve/Override
    DB->>ResSvc: Validation Complete
```

---

## Data Flow Diagrams

### Request Data Flow

```mermaid
flowchart LR
    subgraph Input["Parent Input"]
        A[First Name]
        B[Last Name]
        C[SSN]
        D[DOB]
        E[License #]
        F[State]
    end

    subgraph Transform["K12 Transform"]
        G[Build RDS Request JSON]
    end

    subgraph Queue["Service Bus"]
        H[New Residency Queue]
    end

    subgraph Mule["MuleSoft"]
        I[Validate Fields]
        J[Apply Defaults if Invalid]
        K[Build Agency Files]
    end

    subgraph Agencies["State Agencies"]
        L[DMV SFTP File]
        M[DOR SFTP File]
    end

    A --> G
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    K --> M
```

### Response Data Flow

> **Note:** The diagram below shows that K12 (not MuleSoft) applies the residency business rules. MuleSoft only aggregates raw data.

```mermaid
flowchart LR
    subgraph Agencies["Agency Responses"]
        A[DMV Response]
        B[DOR Response]
    end

    subgraph Mule["MuleSoft (Aggregation Only)"]
        C[Parse DMV Data]
        D[Parse DOR Data]
        E[Aggregate Raw Tracking]
        G[Build Response JSON<br/>with Raw Data]
    end

    subgraph Queue["Service Bus"]
        H[Response Queue]
    end

    subgraph K12["K12 Processing (Source of Truth)"]
        I[Process Response]
        R[Apply SEAA<br/>Business Rules]
        J{Determine<br/>Residency}
        K[Residency = Y]
        L[Residency = N]
        N[Create Review Task]
        M[Update Database]
    end

    A --> C
    B --> D
    C --> E
    D --> E
    E --> G
    G --> H
    H --> I
    I --> R
    R --> J
    J -->|Both Confirmed| K
    J -->|Both Not Confirmed| L
    J -->|Conflict/Errors| N
    K --> M
    L --> M
    N --> M
```

### Database Entity Relationships

```mermaid
erDiagram
    HOUSEHOLD ||--o{ RESIDENCY_VALIDATION : "has"
    RESIDENCY_VALIDATION ||--o{ AGENCY_TRACKING : "contains"
    RESIDENCY_VALIDATION ||--o| MANUAL_REVIEW_TASK : "may require"
    AGENCY_TRACKING ||--o{ AGENCY_DETAIL : "contains"

    HOUSEHOLD {
        int HouseholdId PK
        string PrimaryContactSSN
        string PrimaryContactFirstName
        string PrimaryContactLastName
        date PrimaryContactDOB
    }

    RESIDENCY_VALIDATION {
        int ValidationId PK
        int HouseholdId FK
        string K12Id
        string AcademicYear
        string BatchId
        datetime RequestedAt
        datetime CompletedAt
        string CompletionStatus
        string ErrorCodes
        string ResidencyResult
        string Status
    }

    AGENCY_TRACKING {
        int TrackingId PK
        int ValidationId FK
        string Source
        bool Complete
        string ErrorCodes
        datetime RequestedDate
        datetime ResponseDate
    }

    AGENCY_DETAIL {
        int DetailId PK
        int TrackingId FK
        string Year
        string Value1
        string Value2
        string Indicator
    }

    MANUAL_REVIEW_TASK {
        int TaskId PK
        int ValidationId FK
        string Reason
        string Status
        int AssignedTo
        datetime CreatedAt
        datetime CompletedAt
    }
```

---

## Deployment View

```mermaid
C4Deployment
    title Deployment Diagram - RDS Integration

    Deployment_Node(azure, "Azure Government Cloud", "FedRAMP High") {
        Deployment_Node(rg, "K12 Resource Group") {
            Deployment_Node(func, "Azure Functions") {
                Container(api, "K12 API", "Function App")
                Container(res_svc, "Residency Service", "Function App")
            }
            Deployment_Node(sql, "Azure SQL") {
                ContainerDb(db, "K12 Database", "SQL Server")
            }
            Deployment_Node(bus, "Service Bus Namespace") {
                ContainerQueue(req_q, "new-residency-queue")
                ContainerQueue(resp_q, "residency-response-queue")
                ContainerQueue(status_q, "residency-status-queue")
            }
        }
    }

    Deployment_Node(mulesoft, "MuleSoft CloudHub", "Anypoint Platform") {
        Container(mule, "RDS Integration App", "Mule Runtime")
    }

    Deployment_Node(nc_agencies, "NC State Agency Network") {
        Deployment_Node(dmv_dc, "DMV Datacenter") {
            System_Ext(dmv_sftp, "DMV SFTP Server")
        }
        Deployment_Node(dor_dc, "DOR Datacenter") {
            System_Ext(dor_sftp, "DOR SFTP Server")
        }
    }

    Rel(res_svc, req_q, "Publish")
    Rel(req_q, mule, "Subscribe")
    Rel(mule, resp_q, "Publish")
    Rel(resp_q, res_svc, "Subscribe")
    Rel(mule, dmv_sftp, "SFTP")
    Rel(mule, dor_sftp, "SFTP")
```

---

## Related Documentation

- [INT-07: RDS Integration](../integrations/INT-07-rds-residency-determination-service.md)
- [INT-05: NC DMV/DOR Integration](../integrations/INT-05-nc-dmv-dor-integration.md) (Legacy)
- [02-Container Diagram](02-container-diagram.md)
- [ADR-013: RDS Integration Pattern](../../adr/ADR-013-rds-async-integration-pattern.md)

---

**Document Version:** 1.0
**Last Reviewed:** 2025-12-12
**Owner:** CFI Architecture Team
