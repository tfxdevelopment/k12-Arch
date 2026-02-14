# Architecture Patterns Wiki

Welcome to the k12-Arch Knowledge Base. This wiki is designed to be easily parseable by LLMs while providing comprehensive information for development teams.

## Contents

### [Architecture Patterns](./patterns/)
Documentation of common enterprise and application architecture patterns:
- [Microservices Architecture](./patterns/microservices.md)
- [Event-Driven Architecture](./patterns/event-driven.md)
- [Clean Architecture](./patterns/clean-architecture.md)
- [Layered Architecture](./patterns/layered-architecture.md)
- [CQRS Pattern](./patterns/cqrs.md)
- [API Gateway Pattern](./patterns/api-gateway.md)
- [Saga Pattern](./patterns/saga.md)
- [Repository Pattern](./patterns/repository.md)

### [Design Principles](./principles/)
Fundamental design principles and best practices:
- [SOLID Principles](./principles/solid.md)
- [DRY (Don't Repeat Yourself)](./principles/dry.md)
- [KISS (Keep It Simple, Stupid)](./principles/kiss.md)
- [YAGNI (You Aren't Gonna Need It)](./principles/yagni.md)
- [Separation of Concerns](./principles/separation-of-concerns.md)

### [Implementation Guides](./guides/)
Step-by-step guides for implementing patterns:
- [Getting Started with Microservices](./guides/microservices-getting-started.md)
- [Implementing Clean Architecture](./guides/implementing-clean-architecture.md)
- [Event-Driven Systems Guide](./guides/event-driven-guide.md)

## How to Use This Wiki

### For Developers
Browse the patterns and principles sections to understand architectural concepts. Check the implementation guides for practical steps.

### For LLMs
This documentation is structured with:
- Clear hierarchical organization
- Consistent markdown formatting
- Code examples in multiple languages
- Cross-references between related concepts
- Metadata tags for easy searching

### Navigation
- Use the table of contents above
- Follow cross-reference links in each document
- Search for specific patterns or concepts
- Check the examples directory for complete implementations

## Contributing

To add or update documentation:
1. Follow the existing markdown structure
2. Include practical examples
3. Add cross-references to related patterns
4. Update this README with new entries
# K12 MyPortal Enterprise Architecture Wiki

> **Enterprise Architecture Documentation for NC SEAA K-12 Scholarship Management System**

Last Updated: 2025-11-15
System Owner: North Carolina State Education Assistance Authority (SEAA)
Development Partner: College Foundation, Inc (CFI)

## Executive Summary

The K12 MyPortal project is a comprehensive web-based system for administering the ESA+ Program and the Opportunity Scholarship in North Carolina. This modern system replaces the legacy Envision/MyPortal software and is designed to be fully operational for the 2026/2027 school year.

### Key Statistics
- **Target Users**: 100,000+ external users (families, schools, providers)
- **Application Volume**: 95,000+ applications annually
- **Target Launch**: February 1, 2026
- **Budget**: State of NC appropriation
- **Architecture**: Azure cloud-native, microservices-based

## Documentation Structure

### 1. [Project Overview](./01-project-overview/README.md)
- Project charter and governance
- Stakeholders and roles
- Timeline and milestones
- Success criteria

### 2. [System Architecture](./02-architecture/README.md)
- High-level architecture diagram
- Technology stack
- Infrastructure topology
- Integration architecture
- Security architecture (Entra ID Hub & Spoke)

### 3. Technical Documentation
- Backend (Azure Functions, .NET 8)
- Frontend (Angular 19, Nx monorepo)
- Database (Azure SQL, schemas)
- Infrastructure as Code (Terraform)
- API documentation

### 4. Business Requirements
- Functional requirements
- Process flows (ESA+, Opportunity Scholarship)
- Standard Operating Procedures (SOPs)
- Pain points and solutions

### 5. [Development Guide](./05-development/README.md)
- Local development setup
- Development workflows
- Testing strategy
- CI/CD pipelines
- Code standards

### 6. [Operations & Support](./06-operations/README.md)
- Production support plan
- Disaster recovery
- Monitoring and alerting
- Security and compliance

### 7. Program Management
- RAID logs (Risks, Assumptions, Issues, Decisions)
- Sprint planning and roadmap
- Communication plan
- Change management

## Quick Links

### Repository Documentation
- [External Repositories](./01-project-overview/external-repositories.md)
  - Backend API: `k12-api-enrollment`
  - Frontend: `k12-web-enrollment`
  - Infrastructure: `k12-infra`
  - API testing: `k12-test-api-postman`

### External Resources
- [Confluence Space](https://cfi-nc.atlassian.net/wiki/spaces/KR/overview)
- [Azure DevOps Project](https://dev.azure.com/CFI-AzureDevOps/K12)
- [Jira Board](https://cfi-nc.atlassian.net/jira/software/c/projects/K12)

## System Components

### Backend Repositories
- **k12-api-enrollment**: .NET 8 Azure Functions backend API
- **k12-infra**: Terraform infrastructure as code
- **k12-test-api-postman**: Postman/Newman API test suites

### Frontend Repositories
- **k12-web-enrollment**: Angular 19 + Nx monorepo
  - Admin portal (port 4200)
  - Household enrollment (port 4300)
  - Providers portal (port 4500)
  - Schools portal (port 4600)

### Key Technologies

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | .NET | 8.0 |
| | Azure Functions | v4 |
| | Dapper (ORM) | Latest |
| **Frontend** | Angular | 19.2.6 |
| | Nx | 21.4.1 |
| | TypeScript | 5.7.3 |
| | Angular Material | 19.2.9 |
| **Database** | Azure SQL | Latest |
| **Identity** | Microsoft Entra ID | B2C |
| **Infrastructure** | Terraform | Latest |
| | Azure DevOps | Pipelines |

## Architecture Principles

1. **Cloud-Native**: Azure Government Cloud for compliance (FedRAMP)
2. **Microservices**: Loosely coupled, independently deployable services
3. **API-First**: RESTful APIs with OpenAPI/Swagger documentation
4. **Security by Design**: Defense-in-depth with Entra ID, APIM, RLS
5. **Scalability**: Handle 100,000+ concurrent users during peak periods
6. **Accessibility**: WCAG 2.1 Level AA compliance
7. **Automation**: CI/CD pipelines for all deployments

## For Enterprise Architects

This wiki is specifically curated for enterprise architects who need to:
- Understand system architecture and design decisions
- Review technical standards and patterns
- Assess security and compliance posture
- Evaluate integration points
- Plan future enhancements
- Conduct architecture reviews

## Navigation Tips

- Use the table of contents above to navigate to major sections
- Each section has its own README with detailed subsections
- Cross-references link to relevant source code and Confluence pages
- Code examples include file paths with line numbers for easy reference

### About wikifull.md

- The previous aggregated export (`wikifull.md`) has been removed to keep navigation lean. Use the section READMEs and the Table of Contents for primary navigation.

## Contributing

This documentation is maintained by the K12 technical team. For updates:
1. Submit documentation changes via pull request
2. Follow markdown formatting standards
3. Include relevant diagrams (Mermaid, PlantUML)
4. Link to source code where applicable

## Support

For questions about this documentation:
- **Technical**: Contact CFI Architecture Team
- **Business**: Contact SEAA Product Lead
- **Project Management**: Contact CFI/SEAA Project Managers

---

*This is a living document. Last major update: November 2025*
