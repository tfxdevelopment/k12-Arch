# K12 MyPortal Architecture - Table of Contents

## Main Wiki
- [Home](README.md)

## Section 1: Project Overview
- [Project Overview](01-project-overview/README.md)
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

### Architecture Deep-Dives
- Identity & Access Management
  - [Microsoft Entra ID Hub and Spoke Model](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4053696597)
  - [Identity Provider (CIAM) Options Analysis](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4032725075)
  - Custom Security Attributes
  - Administrative Units (Delegated Administration)

## Section 3: Technical Documentation

### Backend (k12-api-enrollment)
- [Backend README](../../k12-api-enrollment/README.md)
- [API Setup Guide](../../k12-api-enrollment/README.md#setup)
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
- [Frontend README](../../k12-web-enrollment/README.md)
- [Setup Guide](../../k12-web-enrollment/README.md#development-server)
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

### Infrastructure (k12-infra)
- [Terraform README](../../k12-infra/terraform/README.md)
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

### API Testing (k12-test-api-postman)
- [Testing README](../../k12-test-api-postman/README.md)
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
- [Full Confluence Export](../MyPortal%20K12.md)

---

*Last Updated: November 15, 2025*
*Maintained by: K12 Technical Team*
