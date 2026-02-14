# K12 MyPortal Domain Context

## System Overview

K12 MyPortal is a comprehensive web-based system for administering the ESA+ Program (Personal Education Student Accounts for Children with Disabilities) and the Opportunity Scholarship in North Carolina.

## Key Statistics

| Metric | Value |
|--------|-------|
| Target Users | 100,000+ external users |
| Application Volume | 95,000+ applications annually |
| Target Launch | February 1, 2026 |
| Architecture | Azure cloud-native, microservices-based |

## Stakeholders

- **SEAA** (NC State Education Assistance Authority) - System owner
- **CFI** (College Foundation, Inc) - Development partner
- **Families** - Primary users for enrollment
- **Schools** - Participating private schools
- **Providers** - ESA+ service providers

## Programs

### ESA+ (Personal Education Student Accounts)
- For children with disabilities
- Flexible spending on approved educational services
- ClassWallet integration for fund management

### Opportunity Scholarship
- Income-based scholarship program
- Lottery-based selection process
- School tuition assistance

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | .NET 8, Azure Functions v4 |
| Frontend | Angular 19, Nx 21.4.1 |
| Database | Azure SQL (multi-schema) |
| Identity | Microsoft Entra ID B2C |
| Storage | ADLS Gen2 |
| Infrastructure | Terraform, Azure DevOps |

## Repository Structure

| Repository | Purpose |
|------------|---------|
| k12-Arch | Architecture documentation (this repo) |
| k12-api-enrollment | Backend API |
| k12-web-enrollment | Frontend applications |
| k12-infra | Infrastructure as Code |
| k12-test-api-postman | API testing |

## Security Model

- **Hub & Spoke** with Entra ID as central authority
- **Custom Security Attributes** for fine-grained access
- **Row-Level Security** in Azure SQL
- **Defense-in-Depth**: APIM → Middleware → RLS

## Compliance Requirements

- FedRAMP High
- NIST 800-53
- WCAG 2.1 Level AA
- FERPA
