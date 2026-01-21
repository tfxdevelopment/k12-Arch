# Project Overview

## Project Charter

### Background

The North Carolina State Education Assistance Authority (SEAA) currently uses commercially developed software called Envision/MyPortal to administer two critical scholarship programs:

1. **ESA+ Program** (Personal Education Student Accounts for Children with Disabilities)
   - Established by G.S. § 115C-590 et. seq.
   - Provides scholarships for educational expenses for children with disabilities
   - Supports nonpublic school settings

2. **Opportunity Scholarship Program**
   - Established by G.S. § 115C-562.1 et seq.
   - Provides tuition scholarships for eligible students
   - Significantly expanded for 2024/2025 school year

### The Problem

- **Manual Processes**: SEAA relies heavily on manual workarounds due to vendor limitations
- **Vendor Dependency**: Changes require vendor availability, causing delays
- **Scalability Issues**: System struggles with increased application volume (95,000+ applications)
- **Pain Points**: Numerous functionality and efficiency gaps identified by SEAA staff

### The Solution

State of NC has appropriated funding for SEAA to develop an in-house system with CFI as the development partner. The new system will:
- Eliminate manual processes through automation
- Provide SEAA with direct control over features and changes
- Scale to handle growing demand
- Integrate modern cloud technologies and best practices

## Project Scope

### In Scope

1. **Application & Renewal System**
   - Apply, renew, disburse, and track funds for both programs
   - Validation and eligibility determination
   - Lottery process for award allocation
   - Income verification workflows

2. **School Management**
   - New school registration process
   - Payment processing support
   - Compliance tracking (background checks, financial reviews, tuition schedules)
   - Document management and e-signatures

3. **Provider Management**
   - Service provider enrollment
   - Vendor validation and credentials verification
   - Product and service approval workflows

4. **SEAA Administration**
   - Robust query builder for ad-hoc reporting
   - Funds tracking and reconciliation
   - Batch operations on records
   - Audit history and transaction tracking
   - Self-service banner messages and custom fields

5. **Customer Relationship Management (CRM)**
   - Interaction tracking with schools and parents
   - Issue documentation and resolution
   - Communication history

6. **Technical Deliverables**
   - Modern cloud architecture (Azure Government)
   - Data migration from Envision
   - ClassWallet integration
   - Security and compliance (FedRAMP, NIST 800-53)
   - Production support and disaster recovery plans

### Out of Scope

- Sunsetting Envision/MyPortal software
- Integration with non-specified systems
- Change management for SEAA staff (separate initiative)
- Paper application processing (digital only)
- K12 public website (separate project)

### Scope Change Process

Any additions to scope after charter sign-off require:
1. Change Request (CR) submission
2. Impact assessment (schedule, budget, resources)
3. Approval by SEAA and CFI Project Sponsors

## Project Objectives

**Primary Objective**: Unify ESA+ and Opportunity Scholarship management for schools, service providers, and families across North Carolina in a single, modern platform.

**Success Criteria**:
1. System fully operational by February 1, 2026
2. Automation of current manual processes
3. All charter deliverables met
4. SEAA well-informed throughout project
5. Clear production issue reporting and enhancement request process

## Timeline & Milestones

| # | Milestone | Lead | Target Date | Status |
|---|-----------|------|-------------|--------|
| 1 | Create Confluence Space | Phil von Gretener | 2/15/2024 | ✅ Complete |
| 2 | CFI/SEAA Kick-off Meeting | Phil von Gretener | 2/15/2024 | ✅ Complete |
| 3 | Project Charter Sign-off | Phil von Gretener | 2/29/2024 | ✅ Complete |
| 4 | Technical Team Staffing | Pete Rau | 3/1/2024 | ✅ Complete |
| 5 | Discovery Phase Complete | Rob Hines | 4/30/2024 | ✅ Complete |
| 6 | Development Phase Begins | Pete Rau | 5/1/2024 | ✅ Complete |
| 7 | **Project Completion** | Phil von Gretener | **6/1/2026** | 🚧 In Progress |

### Current Program Increment

**PI3: October 1 - December 2, 2025**

Focus Areas:
- Enrollment Builder
- Communication Center
- Query Builder
- Dashboards (schools and household)

## Stakeholders & Governance

### Project Roles

| Role | Name | Responsibility |
|------|------|---------------|
| **SEAA Project Sponsor** | Kathryn Marker | Project champion, policy decisions, budget approval |
| **CFI Project Sponsor & Product Manager** | Rob Hines | Ensure CFI meets SEAA expectations, product vision |
| **CFI Project Manager** | Phil von Gretener | Schedule, risk management, change control |
| **SEAA Project Manager** | Katie Gerhardt | SEAA resource coordination, decision facilitation |
| **SEAA Product Lead** | Lauren Bader | Business requirements, user story prioritization |
| **CFI Executive Technology Lead** | Pete Rau | Architecture decisions, technical resource management |
| **CFI Architects** | Marty Flournory, Sumith Mathur | Technical guidance, standards compliance |
| **Scrum Masters** | Bill Ewald, Jeff Ellsworth, Bryan Winston | Agile ceremonies, team facilitation |

### Executive Stakeholders
- Mary Shuping (CFI)
- Shannon Byers (CFI)
- Betsy Rozakis (SEAA)

## Governance Model

The project follows an Agile/SAFe framework with:
- **Program Increments (PI)**: 8-10 week planning cycles
- **Sprints**: 2-week development iterations
- **Daily Standups**: Team synchronization
- **Sprint Planning**: Bi-weekly commitment to work
- **Sprint Reviews**: Demo completed work to stakeholders
- **Retrospectives**: Continuous improvement

## Key Assumptions

1. CFI will determine, retain, and oversee technical resources (funded by SEAA)
2. SEAA staff participation throughout the effort
3. CFI provides ongoing maintenance and support post-launch
4. SEAA coordinates User Acceptance Testing
5. Envision software continues for 2024/2025 and 2025/2026 school years
6. SEAA handles budget tracking and state reporting independently

## Key Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Key resource turnover | High | Cross-training, documentation |
| Greenfield development complexity | High | Iterative delivery, frequent validation |
| Competing priorities | Medium | Clear prioritization, resource planning |
| Scope creep | High | Rigorous change control process |
| Late integration requirements | Medium | Comprehensive discovery phase |
| Legislative changes mid-project | Medium | Flexible architecture, configurable rules |
| Third-party provider changes | Medium | Abstraction layers, change request process |

## Application Volume Statistics

As of February 28, 2024:
- **28,000** renewal applications
- **67,000** new participant applications
- **95,000** total applications processed

## Related Documentation

- [Revised K12 Project Charter (Confluence)](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4213407777)
- [K12 Roadmap (Confluence)](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4086530071)
- [System Architecture](../02-architecture/README.md)
- [External Repositories](./external-repositories.md)

---

*For questions about project governance, contact the CFI or SEAA Project Managers.*
