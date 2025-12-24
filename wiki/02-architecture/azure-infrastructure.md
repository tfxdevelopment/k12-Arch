# K12 MyPortal Azure Infrastructure

> Auto-generated from Azure Resource Graph export on 2025-12-11

## Overview

The K12 MyPortal system is deployed across **4 environments** in Azure, primarily in **East US 2** region with disaster recovery capabilities in **Central US**. The architecture follows a consistent pattern across all environments with environment-specific naming conventions.

## Environment Summary

| Environment | Resource Group | Primary Region | Purpose |
|-------------|---------------|----------------|---------|
| Development | `development` | East US 2 | Active development and integration |
| Testing | `testing` | East US 2 | QA and automated testing |
| Staging | `staging` | East US 2 | Pre-production validation |
| Production | `k12-cms` | East US 2 + Central US (DR) | Live system |

## Architecture Pattern (Per Environment)

Each environment follows an identical architecture pattern:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EDGE LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Admin Portal │  │  Enrollment  │  │  Providers   │  │   Schools    │    │
│  │  Front Door  │  │  Front Door  │  │  Front Door  │  │  Front Door  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐    │
│  │ Static Web   │  │ Static Web   │  │ Static Web   │  │ Static Web   │    │
│  │     App      │  │     App      │  │     App      │  │     App      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY LAYER                                 │
│                    ┌────────────────────────────┐                           │
│                    │   API Management Service   │                           │
│                    │   (APIM - Rate Limiting,   │                           │
│                    │    Auth, Routing)          │                           │
│                    └─────────────┬──────────────┘                           │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                  │
│     ┌─────────────────────────┐        ┌─────────────────────────┐         │
│     │    App Service (API)    │        │  App Service (Logic)    │         │
│     │   Azure Functions v4    │        │  Background Processing  │         │
│     │   .NET 8 Backend        │        │                         │         │
│     └───────────┬─────────────┘        └───────────┬─────────────┘         │
│                 │                                   │                       │
│     ┌───────────▼─────────────┐        ┌───────────▼─────────────┐         │
│     │   App Service Plan      │        │   App Service Plan      │         │
│     │   (Shared Compute)      │        │   (Logic App Plan)      │         │
│     └─────────────────────────┘        └─────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  SQL Server  │  │   Storage    │  │   Storage    │  │  Key Vault   │    │
│  │  + K12 DB    │  │  (General)   │  │  (HNS/ADLS)  │  │  (Secrets)   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATION LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │   SignalR    │  │  Service Bus │  │  Event Grid  │                      │
│  │  (Real-time) │  │  (Messaging) │  │   (Events)   │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OBSERVABILITY LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Application  │  │Log Analytics │  │ Availability │  │    Smart     │    │
│  │  Insights    │  │  Workspace   │  │    Tests     │  │  Detection   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Resource Inventory

### Frontend Applications (Static Web Apps)

Each environment hosts **4 Angular applications** served via Azure Static Web Apps with Azure Front Door CDN:

| Application | Purpose | Port (Local) |
|-------------|---------|--------------|
| **Admin** | Administrative portal for SEAA staff | 4200 |
| **Enrollment** | Household enrollment application | 4300 |
| **Providers** | Education provider management | 4500 |
| **Schools** | School management portal | 4600 |

#### Resource Naming Convention
```
{app}-{environment}-web-app          # Static Web App
{app}-{environment}-afd-profile      # Front Door Profile
{app}-{environment}-frontend         # Front Door Endpoint
```

#### Inventory by Environment

| Environment | Admin | Enrollment | Providers | Schools |
|-------------|-------|------------|-----------|---------|
| Development | admin-development-web-app | enrollment-development-web-app | providers-development-web-app | schools-development-web-app |
| Testing | admin-testing-web-app | enrollment-testing-web-app | providers-testing-web-app | schools-testing-web-app |
| Staging | admin-staging-web-app | enrollment-staging-web-app | providers-staging-web-app | schools-staging-web-app |
| Production | (via k12-cms Front Door) | (via k12-cms Front Door) | (via k12-cms Front Door) | (via k12-cms Front Door) |

---

### API Layer

#### API Management Service (APIM)
Central API gateway providing:
- Rate limiting and throttling
- JWT token validation
- Request/response transformation
- API versioning
- Developer portal

| Environment | Resource Name | Region |
|-------------|--------------|--------|
| Development | development-api-enrollment | East US 2 |
| Testing | testing-api-enrollment | East US 2 |
| Staging | staging-api-enrollment | East US 2 |

#### App Services (Backend APIs)

Each environment has **two App Services**:

1. **Primary API** (`{env}-api-enrollment`) - Main Azure Functions API
2. **Logic App** (`{env}-api-enrollment-la`) - Background processing and workflows

| Environment | Primary API | Logic App | Plan |
|-------------|------------|-----------|------|
| Development | development-api-enrollment | development-api-enrollment-la | development-api-enrollment / development-api-enrollment-sp |
| Testing | testing-api-enrollment | testing-api-enrollment-la | testing-api-enrollment / testing-api-enrollment-sp |
| Staging | staging-api-enrollment | staging-api-enrollment-la | staging-api-enrollment / staging-api-enrollment-sp |
| Production | app-k12-site-prd | app-k12-site-prd-dr (DR) | plan-k12-site-shared / plan-k12-site-prd-dr |

---

### Database Layer

#### SQL Servers

| Environment | Server Name | Region | Databases |
|-------------|------------|--------|-----------|
| Development | development-api-enrollment | East US 2 | K12, K12_backup, hydration-test, master |
| Testing | testing-api-enrollment | East US 2 | K12, K12_Development, K12_backup, master |
| Staging | staging-api-enrollment | East US 2 | K12, master |
| Production | sql-k12-site-shared | East US 2 | sqldb-k12-site-prd, sqldb-k12-site-stg, master |
| Production DR | sql-k12-site-shared-dr | Central US | sqldb-k12-site-prd, master |

#### Database Schema
The K12 database uses multi-schema design:
- `dbo` - Core tables
- `Enrollment` - Enrollment management
- `Households` - Household data
- `Awards` - Awards system
- `Comms` - Communications

#### SQL Elastic Pool (Production Only)
- **Name**: sqlep-k12-site-shared
- **Region**: East US 2
- **Purpose**: Cost optimization for multiple databases

---

### Storage Layer

#### Storage Accounts

| Environment | General Storage | HNS (ADLS Gen2) | Logic App Storage |
|-------------|-----------------|-----------------|-------------------|
| Development | developmentapienrollment | developmentenrollmenthns | stapilogicappdevelopment |
| Testing | testingapienrollment | testingenrollmenthns | stapilogicapptesting |
| Staging | stagingapienrollment | stagingenrollmenthns | stapilogicappstaging |
| Production | stk12data | - | - |

#### Storage Purpose
- **General Storage**: Blob storage for documents, temporary files
- **HNS (Hierarchical Namespace)**: ADLS Gen2 for document management with folder structure
- **Logic App Storage**: State persistence for Logic Apps/Durable Functions

---

### Security Layer

#### Key Vaults

| Environment | Key Vault | Purpose |
|-------------|-----------|---------|
| Development | developmentapikv | Environment secrets, connection strings |
| Testing | testingapikv | Environment secrets, connection strings |
| Staging | stagingapikv | Environment secrets, connection strings |
| Shared | k12-shared-accounts | Cross-environment shared secrets |

#### Managed Identities

| Identity | Resource Group | Purpose |
|----------|---------------|---------|
| k12-azure-func-dev-user | development | Azure Functions managed identity |
| K12dev-adf-sp | development | Data Factory service principal |
| K12development-adf-sp | development | Data Factory service principal |
| K12testing-adf-sp | testing | Data Factory service principal |
| K12staging-adf-sp | staging | Data Factory service principal |
| DevOpsServiceConnection | k12-cms | Azure DevOps deployment identity |

---

### Real-Time & Messaging

#### SignalR Service
Provides real-time communication for:
- Live enrollment status updates
- Dashboard notifications
- Task completion alerts

| Environment | Resource Name |
|-------------|--------------|
| Development | development-api-enrollment-signalr, development-signalr |
| Testing | testing-api-enrollment-signalr |
| Staging | staging-api-enrollment-signalr |

#### Service Bus & Event Grid (Development Only)
- **Service Bus**: k12eventhub (East US) - Message queue for async processing
- **Event Grid**: k12DevEventGrid (East US) - Event-driven architecture

#### Web PubSub (Development Only)
- **Name**: k12devwebpubsub (East US)
- **Purpose**: Alternative real-time messaging (evaluation)

---

### Monitoring & Observability

#### Application Insights

| Environment | Primary | Secondary |
|-------------|---------|-----------|
| Development | development-api-enrollment-insights | - |
| Testing | testing-api-enrollment, testing-api-enrollment-insights, testing-api-enrollment-la | - |
| Staging | staging-api-enrollment-insights | - |
| Production | app-k12-site-prd | app-k12-site-prd-dr (DR) |
| Frontend | k12-fe-insights-dev | - |

#### Log Analytics Workspaces

| Workspace | Resource Group | Purpose |
|-----------|---------------|---------|
| managed-development-api-enrollment-insights-ws | ai_development-* | Dev App Insights backend |
| managed-testing-api-enrollment-insights-ws | ai_testing-* | Test App Insights backend |
| managed-staging-api-enrollment-insights-ws | ai_staging-* | Staging App Insights backend |
| la-k12-site-shared | k12-cms | Production centralized logs |
| LA-cf6841bb-b70c-K12-CMS-EastUS2 | k12-cms | Production App Insights |
| cf6841bb-b70c-4d55-a489-2d53855e78b5-K12-CMS-CUS | k12-cms | DR region logs |
| DefaultWorkspace-*-EUS2 | defaultresourcegroup-eus2 | Default workspace |
| DefaultWorkspace-*-EUS | defaultresourcegroup-eus | Default workspace |

#### Availability Tests

| Environment | Test Name |
|-------------|-----------|
| Development | development-api-availability-test, development-api-enrollment-development-api-enrollment-insights |
| Testing | testing-api-availability-test, testing-api-enrollment-testing-api-enrollment |
| Staging | staging-api-availability-test |

#### Smart Detection & Alerts

**Failure Anomalies** (Auto-configured by Application Insights):
- Failure Anomalies - development-api-enrollment-insights
- Failure Anomalies - testing-api-enrollment
- Failure Anomalies - testing-api-enrollment-la
- Failure Anomalies - staging-api-enrollment-insights
- Failure Anomalies - app-k12-site-prd
- Failure Anomalies - app-k12-site-prd-dr

**Custom Alerts** (Production):
- K12 Admin Actions - Activity log monitoring
- K12 Prod Down - Service availability
- K12-CMS Production Resource Health Alert - Resource health

**Action Groups**:
- Application Insights Smart Detection (per environment)
- Eagle Fang (development) - Custom notification group
- Notify_Netsupport (production) - Operations team notification

---

### Data Integration

#### Data Factory

| Resource | Resource Group | Purpose |
|----------|---------------|---------|
| K12datafactorydev | development | ETL pipelines, data movement |
| datafactorygzfuagkwud4to | rab-data-factory-test1 | Test data factory |

#### Communication Services (Production)

| Resource | Type | Purpose |
|----------|------|---------|
| K12-CMS-Communication | Communication Service | Azure Communication Services hub |
| K12-Email | Email Communication Service | Transactional email sending |
| ncseaa.edu | Email Domain | Verified sender domain |

---

### Networking

#### Virtual Network (Development)
- **Name**: sample-vnet (East US)
- **NSG**: sample-nsg

#### Network Watcher
- **Name**: NetworkWatcher_eastus (East US)
- **Purpose**: Network diagnostics and monitoring

---

### Container Services

#### Container Registry (Development)
- **Name**: k12devcontainerreg (East US)
- **Purpose**: Docker image storage for containerized deployments

---

### AI & Cognitive Services

#### Azure AI Foundry (Development)
- **Name**: cog-k12-transloator-dev (East US)
- **Purpose**: Translation and content processing

---

### Security Connectors

| Resource | Type | Purpose |
|----------|------|---------|
| K12DefenderDevOps | Security Connector | Defender for DevOps integration |
| defenderfordevops | Security Connector | DevOps security scanning |

---

## Production Architecture (k12-cms)

Production has enhanced architecture with disaster recovery:

```
                    ┌─────────────────────────────────────┐
                    │        Azure Front Door              │
                    │     fd-k12-site-shared               │
                    │  (Global Load Balancing + WAF)       │
                    └───────────────┬─────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │     PRIMARY (East US 2)   │   │      DR (Central US)      │
    │                           │   │                           │
    │  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
    │  │  app-k12-site-prd   │  │   │  │ app-k12-site-prd-dr │  │
    │  │   + warmup slot     │  │   │  │                     │  │
    │  └──────────┬──────────┘  │   │  └──────────┬──────────┘  │
    │             │             │   │             │             │
    │  ┌──────────▼──────────┐  │   │  ┌──────────▼──────────┐  │
    │  │ sql-k12-site-shared │  │   │  │sql-k12-site-shared-dr│ │
    │  │  sqldb-k12-site-prd │  │   │  │  sqldb-k12-site-prd │  │
    │  │  (Elastic Pool)     │◄─┼───┼──│  (Geo-Replica)      │  │
    │  └─────────────────────┘  │   │  └─────────────────────┘  │
    │                           │   │                           │
    └───────────────────────────┘   └───────────────────────────┘
```

### Production-Specific Features

1. **Deployment Slots**: `app-k12-site-prd/warmup` for zero-downtime deployments
2. **Geo-Replication**: SQL database replicated to Central US
3. **Elastic Pool**: Cost-optimized database hosting
4. **Staging Environment**: `app-k12-site-stg` for production validation
5. **Communication Services**: Azure Communication Services for email

---

## Resource Naming Conventions

### Pattern
```
{environment}-{service}-{component}
{component}-{environment}-{type}
```

### Examples
| Pattern | Example | Description |
|---------|---------|-------------|
| `{env}-api-enrollment` | development-api-enrollment | API-related resources |
| `{app}-{env}-web-app` | admin-development-web-app | Frontend applications |
| `{env}apienrollment` | developmentapienrollment | Storage accounts (no hyphens) |
| `{env}apikv` | developmentapikv | Key Vaults |

---

## Cost Optimization Strategies

1. **Shared App Service Plans**: Multiple apps share compute resources per environment
2. **Elastic Pools**: Production databases share DTU/vCore allocation
3. **Static Web Apps**: Free tier for frontend hosting with built-in CDN
4. **Managed Identities**: Eliminate credential management overhead
5. **Auto-scaling**: Configured on production App Service Plans

---

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Edge Security                                      │
│   - Azure Front Door WAF                                    │
│   - DDoS Protection                                         │
│   - SSL/TLS Termination                                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: API Gateway Security                               │
│   - API Management policies                                 │
│   - Rate limiting                                           │
│   - JWT validation                                          │
│   - IP filtering                                            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Application Security                               │
│   - Entra ID authentication                                 │
│   - Role-based access control                               │
│   - Custom security attributes                              │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Data Security                                      │
│   - Key Vault for secrets                                   │
│   - Managed Identity authentication                         │
│   - SQL Row-Level Security                                  │
│   - Encryption at rest                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [System Architecture Overview](README.md)
- [Security Architecture](security/README.md)
- [Database Schema](../Database-Schema-Documentation.md)
- [CI/CD Pipelines](../05-development/README.md)
- [RDS Integration Infrastructure](azure-rds-integration-infrastructure.md) - Azure Service Bus integration with MuleSoft ESB
