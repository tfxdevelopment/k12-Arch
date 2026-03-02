# K12 MyPortal Architecture - Table of Contents

## Main Wiki
- [Home](README.md)

## Content Sections
- [Plans & Tasks](../../memory-bank/tasks/_index.md)
- [Diagrams](diagrams/README.md)
- [Docs & Guides](guides/README.md)
- [Notes & Principles](notes/README.md)
- [To-Dos & Backlog](../../memory-bank/tasks/_index.md)
- [Lessons Learned](lessons/README.md)
- [Knowledge Base](knowledge/README.md)

## Documentation Health
- [Documentation Health Report](DOCUMENTATION-HEALTH-REPORT.md)
- [Incompleteness Scan](DOCUMENTATION-INCOMPLETENESS-SCAN.md)

## Section 1: Project Overview
- [Project Overview](01-project-overview/README.md)
  - [Roadmap](01-project-overview/roadmap/README.md)
  - Project Charter
  - Timeline & Milestones
  - Stakeholders & Governance
  - Key Risks & Assumptions
  - Application Volume Statistics

## Section 2: System Architecture
- [System Architecture](02-architecture/README.md)
  - High-Level Architecture Diagram
  - Layered N-Tier Architecture (Backend)
  - Frontend Monorepo Architecture (Nx)
  - Hub and Spoke Security Model
  - Data Architecture
  - Integration Architecture
  - Infrastructure as Code
  - Non-Functional Requirements
  - Technology Stack Summary

### Target .NET Structure (In Progress)
- [Project Structure (Target .NET Monorepo)](02-architecture/PROJECT-STRUCTURE.md)
- [BFF / Orchestrators](02-architecture/BFF-ORCHESTRATORS.md)
- [Shared Contracts](02-architecture/CONTRACTS.md)
- [Repository Organization Issues](02-architecture/REPO-ORGANIZATION-ISSUES.md)
- [Sensei PDF Concerns Checklist](02-architecture/SENSEI-PDF-CONCERNS.md)

### Standalone Architecture Docs (Checklist)
- [Backend Architecture](02-architecture/backend/README.md)
- [Data Architecture](02-architecture/data/README.md)

### Azure Infrastructure
- [Azure Infrastructure Documentation](02-architecture/azure-infrastructure.md)
  - Environment Summary (Dev/Test/Staging/Prod)
  - Resource Inventory (185 resources)
  - Frontend Applications (Static Web Apps)
  - API Layer (APIM, App Services)
  - Database Layer (SQL Servers, Databases)
  - Storage Layer (Blob, ADLS Gen2)
  - Security Layer (Key Vault, Managed Identities)
  - Real-Time & Messaging (SignalR, Service Bus)
  - Monitoring & Observability
  - Production DR Architecture
- [Azure RDS Integration Infrastructure](02-architecture/azure-rds-integration-infrastructure.md)
  - K12-RDS Communication Flow
  - Azure Service Bus Configuration
  - MuleSoft ESB Integration
  - NC Agency Connections (DMV, DOR, DPI)

### C4 Architecture Diagrams
- [Architecture Overview (Executive Summary)](02-architecture/c4-diagrams/00-architecture-overview.md)
  - Executive Summary Diagram
  - Technology Stack
  - Environment Pipeline
  - Four-App Architecture
  - Security Hub & Spoke Model
- [C4 Level 1: System Context](02-architecture/c4-diagrams/01-system-context.md)
  - User Interactions
  - External System Integrations
  - System Boundaries
- [C4 Level 2: Container Diagram](02-architecture/c4-diagrams/02-container-diagram.md)
  - Web Application (Angular SPA)
  - API Gateway (APIM)
  - API Functions (.NET 8)
  - Database (Azure SQL)
  - Storage (Blob, ADLS Gen2)
  - Real-time Service (SignalR)
  - Data Flow Diagrams
- [C4 Deployment Diagram](02-architecture/c4-diagrams/03-deployment-diagram.md)
  - Per-Environment Resource Map
  - Production Architecture (with DR)
  - Network Topology
  - Security Infrastructure
- [C4 Roster Workflow Context](02-architecture/c4-diagrams/04-roster-workflow-context.md)
  - System Context for Workflow
  - Container Interactions
  - Workflow State Diagram
  - Deployment View
- [C4 RDS Integration Context](02-architecture/c4-diagrams/05-rds-integration-context.md)
  - System Context for RDS
  - Container Interactions
  - K12 Rule Engine Architecture
  - Data Flow Diagrams

### Architecture Deep-Dives
- Identity & Access Management
  - [Microsoft Entra ID Hub and Spoke Model](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4053696597)
  - [Identity Provider (CIAM) Options Analysis](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4032725075)
  - Custom Security Attributes
  - Administrative Units (Delegated Administration)

### Proposed Architecture (Event-Driven)
- [Operations: Messaging (Azure Service Bus)](09-proposed-architecture/OPS-messaging.md)
- ADRs (Proposed)
  - [Standardize on Azure Service Bus](09-proposed-architecture/07-adr-proposed/ADR-PROP-azure-service-bus-standard.md)
  - [Event Schema & Versioning](09-proposed-architecture/07-adr-proposed/ADR-PROP-event-schema-versioning.md)

### Business Workflows
- [Workflows Overview](02-architecture/workflows/README.md)
  - [WF-01: Roster - To Be Certified](02-architecture/workflows/WF-01-roster-to-be-certified.md)
    - Workflow States & Transitions
    - Event-Driven Architecture
    - Azure Durable Functions Design
    - Proposed Database Schema
    - Related Workflows

### Analytics Platform (k12-querybuilder)
- [QueryBuilder Analytics Platform](02-architecture/integrations/QueryBuilder/Data-Platform.md)
  - .NET Aspire Orchestration
  - Cube.js Semantic Layer
  - Trino Query Federation
  - Metabase Business Intelligence
  - Query API (.NET 10 Minimal API)
  - Service Layer Pattern
  - Rate Limiting & Caching
  - Security & Validation
- [QueryBuilder SDK Design](02-architecture/integrations/QueryBuilder/SDK-Design.md)
  - Pluggable Query Engine Architecture
  - Integration with DataMapper SemanticLayer
  - Query Definition Storage (Analytics Schema)
  - Snapshot & Caching System
  - Query Sharing & Permissions
  - API Endpoints & SDK Interfaces
  - Cube.js & Trino Adapters
  - Future DBT Integration

## Section 3: Technical Documentation

### Standards
- [Standards](04-standards/README.md)

### Backend (k12-api-enrollment)
- [Backend Repo (k12-api-enrollment)](01-project-overview/external-repositories.md#k12-api-enrollment-primary-backend-api)
- [API Setup Guide (k12-api-enrollment)](01-project-overview/external-repositories.md#k12-api-enrollment-primary-backend-api)
- Layered Architecture
  - API Layer (Azure Functions HTTP Triggers)
  - Middleware Layer (Error Handling, Authentication)
  - Application Layer (Business Logic)
  - Infrastructure Layer (External Services)
  - Domain Layer (Models, Validators)
  - Data Layer (Dapper Repository Pattern)
- Key Files
  - `API/Programs.cs` (41KB - Program management)
  - `API/Tasks.cs` (33KB - Task workflows)
  - `API/Communications.cs` (26KB - Communication center)
  - `Application/AdminApp.cs` (57KB - Complex admin workflows)
- Testing
  - Unit Tests (MSTest)
  - Integration Tests (Newman/Postman)

### Frontend (k12-web-enrollment)
- [Frontend Repo (k12-web-enrollment)](01-project-overview/external-repositories.md#k12-web-enrollment-angular--nx)
- [Setup Guide (k12-web-enrollment)](01-project-overview/external-repositories.md#k12-web-enrollment-angular--nx)
- Application Structure
  - Admin Portal (port 4200)
  - Household Enrollment (port 4300)
  - Providers Portal (port 4500)
  - Schools Portal (port 4600)
- Shared Library
  - Components (Reusable UI)
  - Services (HTTP, State Management)
  - Guards (Route Protection)
  - Interceptors (HTTP Middleware)
  - Models (TypeScript Types/Enums)
- [UI Component Strategy](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4461035529)
- Testing (Jest)

### Frontend (Standalone Docs)
- [Frontend Architecture Docs](05-development/frontend/README.md)

### Infrastructure
> Infrastructure documentation (see Azure DevOps k12-infra repository)
- Environment Management
  - Development
  - Testing
  - Staging
  - Production
- Modules
  - Core (Shared Resources)
  - API (Azure Functions)
  - Web (Static Web Apps)
  - Data (SQL, Storage)
  - Networking (VNet, APIM)

### API Testing
> API testing documentation (see Azure DevOps k12-test-api-postman repository)
- Newman CLI Setup
- Collection Structure
  - Development Collections
  - Testing Collections
  - Complex Test Scenarios

### Database
- Schema Design
  - `dbo` - Core tables
  - `Enrollment` - Enrollment management
  - `Households` - Household data
  - `Awards` - Awards system
  - `Comms` - Communications
- Entity Framework Model Generation
- Dapper Data Access

## Section 4: Business Requirements

### Functional Requirements
- [Functional Requirements](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/2973040656)
- Application Process
  - New Student Applications
  - Renewal Process
  - Validation/Evaluation
  - Lottery Process
- School Management
  - New School Registration
  - Payment Processing
  - Compliance Requirements
- Provider Management
  - Provider Enrollment
  - Credential Verification
  - Product/Service Approval
- SEAA Administration
  - Query Builder
  - Funds Tracking
  - Batch Operations
  - Audit History

### Process Flows

#### ESA+ Process Flows
- ESA Application Process
- Co-Enrollment Process
- Flow of Funds Process
- Marketplace Process
- Provider Registration Process
- Renewal Process
- School Choice Process
- Withdrawal Process
- ClassWallet Expenses

#### Opportunity Scholarship Process Flows
- 4-Year-Old Process
- Award Process
- Certification Process
- Disbursement Process
- Endorsement Process
- Income Verification Process
- Lottery Process
- New Student Application Process
- Parent Change Process
- Refunds Process
- Residency Process

#### School Process Flows
- Compliance Background Process
- Compliance Financial Review Process
- Compliance Graduate Data Process
- Compliance Tuition & Fees Process
- New School Registration Process
- Payments and Refunds Process

### Standard Operating Procedures (SOPs)
- ESA+ Qualifying Education Expenses Policy
- ESA+ Providers SOP
- Opportunity Scholarship Criminal History SOP
- Opportunity Scholarship Financial Review SOP
- Opportunity Scholarship Tuition and Fee Schedule SOPs
- Awarding SOP
- OS Income Verification SOP

### Pain Points & Solutions
- ESA+ Pain Points
- Opportunity Scholarship Pain Points
- Manual Process Automation

## Section 5: Development Guide
- [Development Guide](05-development/README.md)
  - Prerequisites
    - Backend (.NET 8 Azure Functions)
    - Frontend (Angular 19 + Nx)
    - Infrastructure (Terraform)
    - API Testing (Postman/Newman)
  - Development Workflow
    - Feature Development
    - Code Review Process
    - Testing Strategy
    - Database Development
  - CI/CD Pipelines
    - Backend Pipelines
    - Frontend Pipelines
    - Pipeline Rules
  - Code Standards
    - Backend (.NET)
    - Frontend (Angular/TypeScript)
    - SQL
  - Security Best Practices
  - Common Development Tasks
  - Troubleshooting

## Section 6.5: Deployment (Standalone Docs)
- [Deployment](07-deployment/README.md)

## Section 6.6: Operations (Standalone Docs)
- [Operations](06-operations/README.md)

## Section 6: Operations & Support

### Production Support
- Production Support Plan
- Disaster Recovery Plan
- Monitoring & Alerting
- Incident Response

### Security & Compliance
- FedRAMP High Compliance
- NIST 800-53 Controls
- WCAG 2.1 Level AA Accessibility
- [ADA Requirements](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4296704036)
- Data Protection
- Audit Logging

### Performance
- Availability: 99.9% uptime
- Scalability: 100,000+ concurrent users
- Response Time: <2 seconds for API calls
- Throughput: 95,000+ applications in 30-day period

## Section 7: Program Management

### RAID Logs
- [Risk RAID Log](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3436806145)
- [Assumption RAID Log](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3436871681)
- [Issue RAID Log](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3436806158)
- [Decision RAID Log](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3435462687)

### Planning & Roadmap
- [K12 Roadmap](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4086530071)
- Program Increment Planning (PI3: Oct 1 - Dec 2)
- Sprint Planning
- Release Planning

### Team & Communication
- [Event & Leave Calendar](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3338600450)
- [2025 CFI/RD Holiday Schedule](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4001988649)
- Team Structure
- Communication Plan

### UX/BA Team Resources
- [UX/BA Team](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3236986902)
- User Research
  - Provider Research
  - School Research
  - Family Research
  - Admin Research
- Personas
- UX Guides
- Prototypes
- Usability Testing

## Appendices

### External Integrations
- ClassWallet (Payment Services)
- SendGrid (Email Notifications)
- PandaDoc (Document Generation)
- Microsoft Graph (Azure AD)
- Melissa Data (Address Validation)
- NC DMV (Residency Validation)
- NC Department of Revenue (Income Validation)
- NC DPI (Student Data - Planned)
- NC RDS (Residency Determination Service via MuleSoft) - [INT-07](02-architecture/integrations/INT-07-rds-residency-determination-service.md)

### Technology Versions
| Component | Version |
|-----------|---------|
| .NET | 8.0 |
| Azure Functions | v4 |
| Angular | 19.2.6 |
| Nx | 21.4.1 |
| TypeScript | 5.7.3 |
| Angular Material | 19.2.9 |
| PrimeNG | 17.18.9 |
| MSAL Angular | 4.0.12 |
| Dapper | Latest |
| FluentValidation | Latest |
| MSTest | 3.6.4 |
| Moq | 4.20.72 |
| Jest | 29.7.0 |

### Glossary
- **ESA+**: Personal Education Student Accounts for Children with Disabilities Program
- **OS**: Opportunity Scholarship Program
- **SEAA**: North Carolina State Education Assistance Authority
- **CFI**: College Foundation, Inc
- **APIM**: Azure API Management
- **ADLS**: Azure Data Lake Storage
- **RLS**: Row-Level Security
- **OBO**: On-Behalf-Of (authentication flow)
- **SAS**: Shared Access Signature
- **MAU**: Monthly Active Users
- **CIAM**: Customer Identity and Access Management
- **RAID**: Risks, Assumptions, Issues, Decisions
- **PI**: Program Increment
- **UAT**: User Acceptance Testing

### Quick Reference Links
- [Azure DevOps](https://dev.azure.com/CFI-AzureDevOps/K12)
- [Confluence](https://cfi-nc.atlassian.net/wiki/spaces/KR)
- [Jira](https://cfi-nc.atlassian.net/jira/software/c/projects/K12)
- [Full Confluence Export](../../MyPortal K12.md)

---

*Last Updated: December 11, 2025*
*Maintained by: K12 Technical Team*
