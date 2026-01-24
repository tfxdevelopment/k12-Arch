# Architecture Decision Records (ADRs)

This directory contains records of architectural decisions made in the K12 MyPortal project.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences.

## When to Write an ADR

Write an ADR when you make a significant decision about:
- Technology choices (frameworks, libraries, platforms)
- Architectural patterns (layering, data access, state management)
- Security approaches
- Integration strategies
- Development practices

## ADR Lifecycle

- **Proposed**: Under discussion
- **Accepted**: Decision made and implemented
- **Deprecated**: No longer followed
- **Superseded**: Replaced by another ADR

## Current ADRs

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](ADR-001-azure-government-cloud.md) | Azure Government Cloud Selection | Accepted | 2024-07-XX |
| [ADR-002](ADR-002-dapper-over-entity-framework.md) | Dapper for Data Access | Accepted | 2024-08-XX |
| [ADR-003](ADR-003-entra-id-b2c-ciam.md) | Entra ID B2C for CIAM | Accepted | 2024-07-XX |
| [ADR-004](ADR-004-nx-monorepo-frontend.md) | Nx Monorepo for Frontend | Accepted | 2024-08-XX |
| [ADR-005](ADR-005-nrules-business-rules.md) | NRules for Business Rules Engine | Accepted | 2024-11-XX |
| [ADR-006](ADR-006-terraform-iac.md) | Terraform for IaC | Accepted | 2024-07-XX |
| [ADR-007](ADR-007-angular-19-framework.md) | Angular 19 Framework | Accepted | 2024-08-XX |
| [ADR-008](ADR-008-multi-schema-database.md) | Multi-Schema Database Design | Accepted | 2024-07-XX |

## Template

See [ADR-template.md](ADR-template.md) for the standard format.

## Writing Guidelines

1. **Be Concise**: Focus on the decision, not implementation details
2. **Include Context**: Explain why the decision was necessary
3. **List Alternatives**: Show what options were considered
4. **Document Consequences**: Both positive and negative outcomes
5. **Add References**: Link to research, documentation, or Confluence pages

## Related Documentation

- [System Architecture](../02-architecture/README.md)
- [Development Guide](../05-development/README.md)
- [Confluence: System Architecture Space](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/3338731526)
