# K12 MyPortal Architecture Overview

## Executive Summary Diagram

```mermaid
flowchart TB
    subgraph Users["👥 Users"]
        families["🏠 Families<br/>95,000+ annually"]
        schools["🏫 Schools<br/>Administrators"]
        providers["🎓 Providers<br/>Service Vendors"]
        admins["👔 SEAA Staff<br/>State Agency"]
    end

    subgraph K12System["K12 MyPortal System"]
        subgraph Frontend["🌐 Web Applications"]
            admin_app["Admin Portal"]
            enrollment_app["Enrollment"]
            providers_app["Providers"]
            schools_app["Schools"]
        end

        subgraph Backend["⚙️ Backend Services"]
            api["API Gateway<br/>+ Functions"]
            realtime["Real-time<br/>Notifications"]
        end

        subgraph Data["💾 Data Layer"]
            database["SQL Database"]
            documents["Document Storage"]
        end
    end

    subgraph External["🔌 External Systems"]
        identity["🔐 Microsoft Entra ID<br/>Identity & Access"]
        payments["💳 ClassWallet<br/>Payment Processing"]
        email["📧 SendGrid<br/>Email Service"]
        docs["📄 PandaDoc<br/>Document Generation"]
        state["🏛️ NC State Agencies<br/>DMV, DOR, DPI"]
    end

    families --> enrollment_app
    schools --> schools_app
    providers --> providers_app
    admins --> admin_app

    Frontend --> api
    api --> realtime
    api --> database
    api --> documents

    api <--> identity
    api <--> payments
    api <--> email
    api <--> docs
    api <--> state

    style Users fill:#e3f2fd
    style K12System fill:#e8f5e9
    style External fill:#fff3e0
```

## Technology Stack

```mermaid
flowchart LR
    subgraph FE["Frontend"]
        angular["Angular 19"]
        nx["Nx Monorepo"]
        material["Angular Material"]
        primeng["PrimeNG"]
    end

    subgraph BE["Backend"]
        dotnet[".NET 8"]
        functions["Azure Functions v4"]
        dapper["Dapper ORM"]
    end

    subgraph Infra["Infrastructure"]
        azure["Azure Cloud"]
        sql["Azure SQL"]
        storage["ADLS Gen2"]
        apim["API Management"]
    end

    subgraph Security["Security"]
        entra["Entra ID B2C"]
        keyvault["Key Vault"]
        rls["Row-Level Security"]
    end

    FE --> BE --> Infra
    Security --> BE

    style FE fill:#1976d2,color:white
    style BE fill:#388e3c,color:white
    style Infra fill:#7b1fa2,color:white
    style Security fill:#d32f2f,color:white
```

## Environment Pipeline

```mermaid
flowchart LR
    dev["🔧 Development<br/>Integration & Testing"]
    test["🧪 Testing<br/>QA Validation"]
    staging["🎭 Staging<br/>Pre-Production"]
    prod["🚀 Production<br/>Live System"]
    dr["🔄 DR<br/>Disaster Recovery"]

    dev -->|"PR Merge"| test
    test -->|"PR Merge"| staging
    staging -->|"Manual"| prod
    prod -.->|"Geo-Replication"| dr

    style dev fill:#bbdefb
    style test fill:#c8e6c9
    style staging fill:#fff9c4
    style prod fill:#ffcdd2
    style dr fill:#f5f5f5
```

## Four-App Architecture

```mermaid
flowchart TB
    subgraph AdminApp["👔 Admin Portal (4200)"]
        admin_features["• Program Management<br/>• Application Review<br/>• User Administration<br/>• Reporting & Analytics"]
    end

    subgraph EnrollmentApp["🏠 Enrollment Portal (4300)"]
        enrollment_features["• Scholarship Application<br/>• Document Upload<br/>• Status Tracking<br/>• Award Management"]
    end

    subgraph ProvidersApp["🎓 Providers Portal (4500)"]
        providers_features["• Service Registration<br/>• Invoice Submission<br/>• Payment Tracking<br/>• Provider Profile"]
    end

    subgraph SchoolsApp["🏫 Schools Portal (4600)"]
        schools_features["• Student Enrollment<br/>• Attendance Tracking<br/>• Funding Allocation<br/>• School Profile"]
    end

    api["Shared API Backend"]

    AdminApp --> api
    EnrollmentApp --> api
    ProvidersApp --> api
    SchoolsApp --> api

    style AdminApp fill:#f3e5f5
    style EnrollmentApp fill:#e3f2fd
    style ProvidersApp fill:#e8f5e9
    style SchoolsApp fill:#fff3e0
```

## Security Architecture (Hub & Spoke)

```mermaid
flowchart TB
    subgraph Hub["🔐 Identity Hub (Entra ID)"]
        sso["Single Sign-On"]
        mfa["Multi-Factor Auth"]
        attributes["Custom Security<br/>Attributes"]
        groups["Security Groups"]
    end

    subgraph Spokes["Application Spokes"]
        spoke1["Admin App"]
        spoke2["Enrollment App"]
        spoke3["Providers App"]
        spoke4["Schools App"]
    end

    subgraph DataSecurity["Data Security"]
        jwt["JWT Validation"]
        rls["Row-Level Security"]
        encryption["Encryption at Rest"]
    end

    Hub --> Spokes
    Spokes --> jwt
    jwt --> rls
    rls --> encryption

    style Hub fill:#d32f2f,color:white
    style Spokes fill:#1976d2,color:white
    style DataSecurity fill:#388e3c,color:white
```

## Data Flow Overview

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Angular SPA
    participant FrontDoor as Azure Front Door
    participant APIM as API Gateway
    participant Functions as Azure Functions
    participant SQL as Azure SQL
    participant Storage as ADLS Gen2

    User->>Frontend: Access Application
    Frontend->>FrontDoor: HTTPS Request
    FrontDoor->>Frontend: Deliver SPA
    Frontend->>APIM: API Request + JWT
    APIM->>APIM: Validate JWT
    APIM->>Functions: Route Request
    Functions->>SQL: Query Data (RLS)
    SQL-->>Functions: Filtered Results
    Functions->>Storage: Get/Store Documents
    Storage-->>Functions: Document URL
    Functions-->>APIM: Response
    APIM-->>Frontend: JSON Response
    Frontend-->>User: Render UI
```

## Key Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| **Annual Applications** | 95,000+ | Scholarship applications processed |
| **Concurrent Users** | 10,000+ | Peak during application periods |
| **Availability** | 99.9% | Uptime SLA target |
| **Response Time** | < 2s | API response time |
| **Environments** | 4 | Dev → Test → Staging → Prod |
| **Azure Regions** | 2 | Primary (East US 2) + DR (Central US) |

## Quick Links

- [Detailed System Context (C4 Level 1)](01-system-context.md)
- [Container Diagram (C4 Level 2)](02-container-diagram.md)
- [Deployment Diagram](03-deployment-diagram.md)
- [Azure Infrastructure Details](./../azure-infrastructure.md)
- [Security Architecture](./../security/README.md)
