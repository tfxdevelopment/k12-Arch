# C4 Diagrams: Roster - To Be Certified Workflow

This document provides C4 model diagrams for the Roster - To Be Certified workflow, showing the system context, container interactions, and deployment view.

---

## Table of Contents

1. [System Context (C4 Level 1)](#system-context-c4-level-1)
2. [Container Diagram (C4 Level 2)](#container-diagram-c4-level-2)
3. [Workflow State Diagram](#workflow-state-diagram)
4. [Deployment View](#deployment-view)
5. [Data Flow Diagram](#data-flow-diagram)

---

## System Context (C4 Level 1)

The Roster - To Be Certified workflow operates within the K12 MyPortal ecosystem, interacting with users and external systems.

```mermaid
C4Context
    title System Context: Roster - To Be Certified Workflow

    Person(household, "Household/Parent", "Completes enrollment application, receives notifications")
    Person(schoolAdmin, "School Administrator", "Reviews and certifies students on roster")
    Person(seaaAdmin, "SEAA Administrator", "Monitors workflows, handles exceptions")

    System(k12Portal, "K12 MyPortal", "Manages scholarship enrollment, roster certification, and payments")

    System_Ext(entra, "Microsoft Entra ID", "Identity and access management")
    System_Ext(sendgrid, "SendGrid", "Email notification delivery")
    System_Ext(classwallet, "ClassWallet", "Payment processing")

    Rel(household, k12Portal, "Completes application, views status", "HTTPS")
    Rel(schoolAdmin, k12Portal, "Certifies students", "HTTPS")
    Rel(seaaAdmin, k12Portal, "Manages workflows", "HTTPS")

    Rel(k12Portal, entra, "Authenticates users", "OAuth 2.0")
    Rel(k12Portal, sendgrid, "Sends notifications", "HTTPS/API")
    Rel(k12Portal, classwallet, "Triggers payments", "HTTPS/API")

    UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
```

### Context Description

| Element | Description |
|---------|-------------|
| **Household/Parent** | End users who complete enrollment applications and receive certification status notifications |
| **School Administrator** | School staff who review student information and certify enrollment on the roster |
| **SEAA Administrator** | State administrators who monitor workflow progress and handle exceptions |
| **K12 MyPortal** | The main system orchestrating enrollment, certification, and payment workflows |
| **Microsoft Entra ID** | External identity provider for authentication and authorization |
| **SendGrid** | External email service for notification delivery |
| **ClassWallet** | External payment processor triggered after successful certification |

---

## Container Diagram (C4 Level 2)

The workflow involves multiple containers within the K12 MyPortal system.

```mermaid
C4Container
    title Container Diagram: Roster - To Be Certified Workflow

    Person(schoolAdmin, "School Admin", "Certifies students")
    Person(household, "Household", "Views status")

    Container_Boundary(k12, "K12 MyPortal") {
        Container(adminApp, "Admin Portal", "Angular 19", "Administrative interface for SEAA staff")
        Container(schoolApp, "Schools Portal", "Angular 19", "School management and certification interface")
        Container(householdApp, "Household Portal", "Angular 19", "Parent/household interface")

        Container(apim, "API Gateway", "Azure APIM", "API routing, auth, rate limiting")

        Container(rosterApi, "Roster API", "Azure Functions .NET 8", "Roster management endpoints")
        Container(taskApi, "Task API", "Azure Functions .NET 8", "Task management endpoints")
        Container(commsApi, "Comms API", "Azure Functions .NET 8", "Communication endpoints")

        Container(orchestrator, "Workflow Orchestrator", "Azure Durable Functions", "Orchestrates roster certification workflow")

        Container(serviceBus, "Service Bus", "Azure Service Bus", "Event messaging and routing")

        ContainerDb(sqlDb, "K12 Database", "Azure SQL", "Roster, enrollment, workflow state data")
        ContainerDb(storage, "Blob Storage", "Azure Blob", "Documents, orchestrator state")
    }

    System_Ext(sendgrid, "SendGrid", "Email delivery")
    System_Ext(classwallet, "ClassWallet", "Payments")

    Rel(schoolAdmin, schoolApp, "Certifies students", "HTTPS")
    Rel(household, householdApp, "Views status", "HTTPS")

    Rel(schoolApp, apim, "API calls", "HTTPS")
    Rel(householdApp, apim, "API calls", "HTTPS")
    Rel(adminApp, apim, "API calls", "HTTPS")

    Rel(apim, rosterApi, "Routes requests", "HTTPS")
    Rel(apim, taskApi, "Routes requests", "HTTPS")
    Rel(apim, commsApi, "Routes requests", "HTTPS")

    Rel(rosterApi, serviceBus, "Publishes events", "AMQP")
    Rel(serviceBus, orchestrator, "Triggers workflow", "AMQP")

    Rel(orchestrator, sqlDb, "Reads/writes state", "TDS")
    Rel(orchestrator, storage, "Stores execution history", "HTTPS")
    Rel(orchestrator, commsApi, "Triggers notifications", "HTTPS")

    Rel(rosterApi, sqlDb, "CRUD operations", "TDS")
    Rel(commsApi, sendgrid, "Sends emails", "HTTPS")
    Rel(orchestrator, classwallet, "Triggers payment", "HTTPS")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### Container Responsibilities

| Container | Technology | Responsibility |
|-----------|------------|----------------|
| **Admin Portal** | Angular 19 | SEAA staff interface for workflow monitoring |
| **Schools Portal** | Angular 19 | School admin interface for certification |
| **Household Portal** | Angular 19 | Parent interface for status viewing |
| **API Gateway** | Azure APIM | Request routing, authentication, rate limiting |
| **Roster API** | Azure Functions | Roster CRUD operations, event publishing |
| **Task API** | Azure Functions | Task management for certification process |
| **Comms API** | Azure Functions | Notification management |
| **Workflow Orchestrator** | Durable Functions | Long-running workflow orchestration |
| **Service Bus** | Azure Service Bus | Async event messaging |
| **K12 Database** | Azure SQL | Persistent data storage |
| **Blob Storage** | Azure Blob | Document and state storage |

---

## Workflow State Diagram

Visual representation of the workflow states and transitions.

```mermaid
stateDiagram-v2
    direction LR

    [*] --> Pending: Prerequisites Complete

    state Pending {
        [*] --> WaitingForWindow
        WaitingForWindow --> WindowReady: Timer expires
    }

    Pending --> Certifying: Window Opens

    state Certifying {
        [*] --> ReviewingStudents
        ReviewingStudents --> StudentCertified: Certify
        ReviewingStudents --> StudentRejected: Reject
        StudentCertified --> CheckRemaining
        StudentRejected --> CheckRemaining
        CheckRemaining --> ReviewingStudents: More students
        CheckRemaining --> AllDetermined: No more
    }

    Certifying --> Certified: All students certified
    Certifying --> Incomplete: Window closes

    state Certified {
        [*] --> TriggerPayment
        TriggerPayment --> PaymentQueued
    }

    state Incomplete {
        [*] --> NotifyHousehold
        NotifyHousehold --> AwaitReview
        AwaitReview --> ManualReview: Admin action
    }

    Incomplete --> Certifying: Manual Review
    Certified --> [*]: Complete
    Incomplete --> [*]: Restart Selection
```

### State Descriptions

| State | Duration | Actions |
|-------|----------|---------|
| **Pending** | Days to weeks | Students added to roster, waiting for certification window |
| **Certifying** | 1-4 weeks | Active certification period, school admins review students |
| **Certified** | Minutes | All certified, trigger payment workflow |
| **Incomplete** | Variable | Some not certified, await manual review or restart |

---

## Deployment View

Azure resources supporting the workflow.

```mermaid
flowchart TB
    subgraph Azure["Azure Government Cloud (East US 2)"]
        subgraph Frontend["Frontend Tier"]
            swa1["Static Web App\n(Admin)"]
            swa2["Static Web App\n(Schools)"]
            swa3["Static Web App\n(Household)"]
        end

        subgraph Gateway["API Gateway Tier"]
            apim["Azure API Management\n(APIM)"]
        end

        subgraph Compute["Compute Tier"]
            subgraph FuncApp["Function App"]
                rosterFunc["Roster Functions"]
                taskFunc["Task Functions"]
                commsFunc["Comms Functions"]
                durableFunc["Durable Orchestrator"]
            end
        end

        subgraph Messaging["Messaging Tier"]
            sb["Azure Service Bus\n(Topics & Subscriptions)"]
        end

        subgraph Data["Data Tier"]
            sql["Azure SQL Server\n+ K12 Database"]
            blob["Azure Blob Storage\n(Documents + Durable State)"]
        end

        subgraph Monitoring["Observability"]
            ai["Application Insights"]
            la["Log Analytics"]
        end
    end

    subgraph External["External Services"]
        sg["SendGrid"]
        cw["ClassWallet"]
    end

    swa1 --> apim
    swa2 --> apim
    swa3 --> apim

    apim --> FuncApp

    rosterFunc --> sb
    sb --> durableFunc

    durableFunc --> sql
    durableFunc --> blob
    durableFunc --> commsFunc

    commsFunc --> sg
    durableFunc --> cw

    FuncApp --> ai
    ai --> la

    style Azure fill:#e6f3ff
    style External fill:#fff3e6
```

### Resource Mapping

| Resource | Azure Service | SKU/Tier |
|----------|--------------|----------|
| Function App | Azure Functions | Consumption/Premium |
| Durable Functions | Azure Durable Functions | Uses Function App |
| Service Bus | Azure Service Bus | Standard |
| SQL Database | Azure SQL | S2/S3 |
| Blob Storage | Azure Blob | Standard LRS |
| API Management | Azure APIM | Developer/Standard |
| Application Insights | Azure Monitor | Per-GB |

---

## Data Flow Diagram

Complete data flow through the workflow.

```mermaid
flowchart TB
    subgraph Trigger["1. Trigger Phase"]
        app["Application Complete"]
        award["Award Accepted"]
        school["School Selected"]
    end

    subgraph Validation["2. Validation Phase"]
        check{"All Prerequisites\nComplete?"}
    end

    subgraph RosterCreation["3. Roster Creation"]
        addRoster["Add to Roster\n(SQL Insert)"]
        createTasks["Create Tasks\n(SQL Insert)"]
        notify1["Send Notifications\n(Service Bus → SendGrid)"]
    end

    subgraph Certification["4. Certification Phase"]
        window["Wait for Window\n(Durable Timer)"]
        certLoop["Certification Loop\n(External Events)"]
        updateStatus["Update Status\n(SQL Update)"]
    end

    subgraph Completion["5. Completion Phase"]
        certified{"All\nCertified?"}
        payment["Trigger Payment\n(ClassWallet API)"]
        incomplete["Handle Incomplete\n(Restart Selection)"]
    end

    subgraph Storage["Data Stores"]
        sqlRoster[("Roster.ToBeCertified")]
        sqlState[("Roster.WorkflowState")]
        sqlHistory[("Roster.CertificationHistory")]
        blobState[("Durable Function State")]
    end

    app --> check
    award --> check
    school --> check

    check -->|Yes| addRoster
    check -->|No| wait["Wait/Retry"]

    addRoster --> sqlRoster
    addRoster --> createTasks
    createTasks --> notify1

    notify1 --> window
    window --> certLoop

    certLoop --> updateStatus
    updateStatus --> sqlRoster
    updateStatus --> sqlHistory
    updateStatus --> sqlState

    certLoop --> certified

    certified -->|Yes| payment
    certified -->|No, Window Closed| incomplete

    payment --> sqlState
    incomplete --> sqlState

    style Trigger fill:#d4edda
    style Certification fill:#cce5ff
    style Completion fill:#f8d7da
```

### Data Flow Summary

| Phase | Source | Destination | Data |
|-------|--------|-------------|------|
| Trigger | API | Service Bus | ApplicationComplete event |
| Roster Creation | Orchestrator | Azure SQL | Roster entry, tasks |
| Notifications | Orchestrator | SendGrid | Email templates |
| Certification | School Portal | Azure SQL | Certification status |
| Payment | Orchestrator | ClassWallet | Payment request |

---

## Related Documentation

- [WF-01: Roster - To Be Certified Workflow](../workflows/WF-01-roster-to-be-certified.md)
- [ADR-012: Durable Functions for Orchestration](../../adr/ADR-012-roster-workflow-orchestration.md)
- [System Architecture Overview](../README.md)
- [Azure Infrastructure](../azure-infrastructure.md)
- [C4 Level 1: System Context](01-system-context.md)
- [C4 Level 2: Container Diagram](02-container-diagram.md)

---

*Generated: 2025-12-11 | Author: CFI Architecture Team*
