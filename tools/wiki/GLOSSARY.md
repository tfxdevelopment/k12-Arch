# K12 MyPortal Glossary

## Business Terms

| Term | Definition |
|------|------------|
| **ESA+** | Education Savings Account Plus program - NC scholarship program allowing families to use state funds for approved educational expenses |
| **Opportunity Scholarship** | NC scholarship program providing tuition assistance for students from low-income families to attend private schools |
| **SEAA** | State Education Assistance Authority - NC state agency administering scholarship programs |
| **CFI** | College Foundation, Inc - Development partner for K12 MyPortal |
| **Household** | A family unit applying for scholarships, consisting of parents and students |
| **Primary Parent** | The main parent/guardian on a household account with full access |
| **Proxy Parent** | Additional parent/guardian with read-only access to student information |
| **Provider** | Educational service provider (tutors, therapists) approved for ESA+ payments |
| **Award** | Financial allocation granted to a student through scholarship programs |
| **Disbursement** | Payment of awarded funds to schools, providers, or family accounts |
| **ClassWallet** | External payment platform managing ESA+ fund distribution |
| **Enrollment Period** | Time window when families can apply for scholarships (typically Feb-June) |
| **Roster** | List of students enrolled at a school for scholarship verification |
| **Certification** | School confirmation of student enrollment status |

## Technical Terms

### Architecture

| Term | Definition |
|------|------------|
| **C4 Model** | Architecture visualization framework with 4 levels: Context, Container, Component, Code |
| **ADR** | Architecture Decision Record - document capturing significant technical decisions |
| **Hub and Spoke** | Identity architecture pattern with central Entra ID hub and application spokes |
| **N-Tier** | Layered architecture separating presentation, business logic, and data access |
| **RLS** | Row-Level Security - database feature filtering data based on user context |
| **OBO Flow** | On-Behalf-Of - OAuth flow allowing APIs to call services with user identity |
| **CIAM** | Customer Identity and Access Management - B2C identity solution |

### Azure Services

| Term | Definition |
|------|------------|
| **Azure Functions** | Serverless compute service hosting the API backend |
| **Azure SQL** | Managed SQL Server database (primary data store) |
| **ADLS Gen2** | Azure Data Lake Storage Gen2 - hierarchical document storage |
| **Azure APIM** | API Management - gateway for routing, security, and throttling |
| **Entra ID** | Microsoft's identity platform (formerly Azure AD) |
| **Entra ID B2C** | Business-to-Consumer identity service for external users |
| **Azure SignalR** | Managed real-time communication service |
| **Azure Container Apps** | Managed container orchestration platform (proposed) |
| **Key Vault** | Secure storage for secrets, keys, and certificates |
| **App Insights** | Application performance monitoring and diagnostics |

### Frontend

| Term | Definition |
|------|------------|
| **Angular** | TypeScript-based web application framework (v19) |
| **Nx** | Build system and monorepo management tool |
| **MSAL** | Microsoft Authentication Library for Entra ID integration |
| **RxJS** | Reactive Extensions library for asynchronous programming |
| **Angular Material** | UI component library following Material Design |
| **PrimeNG** | Additional Angular UI component library |

### Backend

| Term | Definition |
|------|------------|
| **.NET 8** | Microsoft's cross-platform framework (current runtime) |
| **Dapper** | Micro-ORM for performant SQL queries |
| **AutoMapper** | Object-to-object mapping library |
| **FluentValidation** | Input validation library |
| **NRules** | Business rules engine for eligibility determination |
| **Polly** | Resilience and transient-fault-handling library |

### Analytics

| Term | Definition |
|------|------------|
| **Cube.js** | Semantic layer and analytics framework |
| **Trino** | Distributed SQL query engine for data federation |
| **Pre-aggregation** | Pre-computed aggregations for faster queries |
| **Metabase** | Open-source business intelligence tool |
| **PostgreSQL** | Open-source relational database (analytics only) |
| **TimescaleDB** | PostgreSQL extension for time-series data |

### DevOps

| Term | Definition |
|------|------------|
| **Terraform** | Infrastructure as Code tool for Azure resource provisioning |
| **CI/CD** | Continuous Integration/Continuous Deployment |
| **Azure DevOps** | Microsoft's DevOps platform (pipelines, repos, boards) |
| **Newman** | Command-line runner for Postman collections |
| **Blue-Green** | Deployment strategy with two production environments |
| **.NET Aspire** | Cloud-native orchestration framework (proposed) |
| **DAB** | Data API Builder - zero-code REST/GraphQL generator |

### Security

| Term | Definition |
|------|------------|
| **JWT** | JSON Web Token - authentication token format |
| **OAuth 2.0** | Authorization framework for delegated access |
| **OIDC** | OpenID Connect - authentication layer on OAuth 2.0 |
| **SAS Token** | Shared Access Signature - short-lived access token for storage |
| **MFA** | Multi-Factor Authentication |
| **RBAC** | Role-Based Access Control |
| **FedRAMP** | Federal Risk and Authorization Management Program |
| **FERPA** | Family Educational Rights and Privacy Act |
| **WCAG** | Web Content Accessibility Guidelines |

### Integration

| Term | Definition |
|------|------------|
| **SendGrid** | Email delivery service for transactional emails |
| **PandaDoc** | Document generation and e-signature platform |
| **Melissa Data** | Address validation and standardization API |
| **RDS** | Residency Determination Service (NC state integration) |
| **DMV** | Division of Motor Vehicles (residency verification) |
| **DOR** | Department of Revenue (income verification) |
| **DPI** | Department of Public Instruction (student data) |
| **MuleSoft** | Enterprise integration platform (RDS middleware) |

## Acronyms

| Acronym | Full Form |
|---------|-----------|
| **API** | Application Programming Interface |
| **APIM** | API Management |
| **B2C** | Business-to-Consumer |
| **CDN** | Content Delivery Network |
| **CORS** | Cross-Origin Resource Sharing |
| **DTO** | Data Transfer Object |
| **EF** | Entity Framework |
| **HTTP** | Hypertext Transfer Protocol |
| **IaC** | Infrastructure as Code |
| **JSON** | JavaScript Object Notation |
| **LTS** | Long-Term Support |
| **NFR** | Non-Functional Requirement |
| **ORM** | Object-Relational Mapping |
| **PII** | Personally Identifiable Information |
| **REST** | Representational State Transfer |
| **RPO** | Recovery Point Objective |
| **RTO** | Recovery Time Objective |
| **SDK** | Software Development Kit |
| **SLA** | Service Level Agreement |
| **SPA** | Single Page Application |
| **SQL** | Structured Query Language |
| **SSO** | Single Sign-On |
| **TDE** | Transparent Data Encryption |
| **TLS** | Transport Layer Security |
| **UI** | User Interface |
| **URL** | Uniform Resource Locator |
| **UX** | User Experience |
| **VNet** | Virtual Network |
| **WAF** | Web Application Firewall |

## User Roles

| Role | Description | Portal Access |
|------|-------------|---------------|
| **K12.Admin** | SEAA administrators with full system access | Admin (4200) |
| **School.Admin** | School staff managing enrollment and students | Schools (4600) |
| **Vendor.Admin** | Service provider staff managing services | Providers (4500) |
| **PrimaryParent.User** | Primary parent with full household access | Enrollment (4300) |
| **ProxyParent.User** | Secondary parent with read-only access | Enrollment (4300) |

## Application Statuses

| Status | Description |
|--------|-------------|
| **Draft** | Application started but not submitted |
| **Submitted** | Application submitted and pending review |
| **Under Review** | Application being evaluated by SEAA staff |
| **Pending Documentation** | Additional documents required |
| **Approved** | Application approved for funding |
| **Denied** | Application denied (with reason) |
| **Waitlisted** | Application on waiting list for funding |
| **Withdrawn** | Application withdrawn by applicant |

## Related Documentation

- [Architecture Overview](02-architecture/README.md)
- [ADR Index](adr/README.md)
- [Development Guide](05-development/README.md)

---

*Last Updated: December 2025*
