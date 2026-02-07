<!-- BEGIN ContextStream -->
# Workspace: K12 Azure
# Project: k12-Arch
# Workspace ID: 88a586eb-0e78-4841-b4fd-32f080419e2a

# Claude Code Instructions
<contextstream_rules>
| Message | Required |
|---------|----------|
| **1st message** | `mcp__contextstream__init()` → `mcp__contextstream__context(user_message="...")` |
| **Every message** | `mcp__contextstream__context(user_message="...")` FIRST |
| **Before file search** | `mcp__contextstream__search(mode="auto")` BEFORE Glob/Grep/Read |
</contextstream_rules>

**Why?** `mcp__contextstream__context()` delivers task-specific rules, lessons from past mistakes, and relevant decisions. Skip it = fly blind.

**Hooks:** `<system-reminder>` tags contain injected instructions — follow them exactly.

**Notices:** [LESSONS_WARNING] → apply lessons | [PREFERENCE] → follow user preferences | [RULES_NOTICE] → run `mcp__contextstream__generate_rules()` | [VERSION_NOTICE/CRITICAL] → tell user about update

v0.4.60
<!-- END ContextStream -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **K12 MyPortal Architecture Documentation Repository** for the NC SEAA K-12 Scholarship Management System. It contains comprehensive enterprise architecture documentation in two formats:

1. **Static Wiki** (`wiki/`) - Markdown files for offline reading or GitHub viewing
2. **Interactive Documentation Site** (`k12-docs/`) - Nuxt Content-powered searchable website

**Important**: This repository contains documentation only, not application code. The actual application code resides in separate repositories:
- `k12-api-enrollment` - Backend API (.NET 8 Azure Functions)
- `k12-web-enrollment` - Frontend applications (Angular 19 + Nx monorepo)
- `k12-infra` - Infrastructure as Code (Terraform)
- `k12-test-api-postman` - API testing (Postman/Newman)

## Documentation Site Commands

### Development
```bash
cd k12-docs
npm install           # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run generate     # Generate static site (.output/public/)
npm run preview      # Preview production build
```

### Deployment
The generated static files in `.output/public/` can be deployed to:
- Azure Static Web Apps (recommended)
- Netlify/Vercel
- GitHub Pages

## Documentation Structure

### Static Wiki (`wiki/`)
The wiki is organized for enterprise architects and technical staff:

- `01-project-overview/` - Project charter, governance, stakeholders, timeline
- `02-architecture/` - System architecture, security model (Hub & Spoke with Entra ID), integrations
- `05-development/` - Development setup, workflows, CI/CD pipelines, code standards

Key files:
- `wiki/README.md` - Main wiki entry point
- `wiki/TABLE_OF_CONTENTS.md` - Complete navigation guide
- `wiki/Database-Schema-Documentation.md` - Database schema details

### Documentation Site (`k12-docs/`)
Nuxt 3 + Nuxt Content application with features:
- Full-text search
- Dark mode
- Auto-generated table of contents
- Syntax highlighting
- Responsive design

Key files:
- `k12-docs/nuxt.config.ts` - Nuxt configuration
- `k12-docs/package.json` - Dependencies (Nuxt 3, Nuxt Content, Tailwind CSS, TypeScript)
- `k12-docs/content/` - Markdown content files
- `k12-docs/components/` - Vue components (ColorModeButton, SidebarNav, TableOfContents)

## System Architecture Context

When discussing architecture or technical details, reference these key patterns:

### Backend Architecture
- **N-Tier Layered**: API → Middleware → Application → Infrastructure → Domain → Data
- **Technology**: .NET 8 Azure Functions (v4), Dapper for data access (NOT Entity Framework)
- **Security**: EntraAuthenticationMiddleware validates JWT tokens
- **Key Files**: `API/Programs.cs` (41KB), `API/Tasks.cs` (33KB), `Application/AdminApp.cs` (57KB)

### Frontend Architecture
- **Monorepo**: Nx workspace with 4 Angular applications (admin, enrollment, providers, schools)
- **Shared Library**: `projects/shared/` must be built first before running any app
- **Critical Workflow**: Changes to shared library require rebuild + dev server restart
- **Ports**: admin (4200), enrollment (4300), providers (4500), schools (4600)

### Security Model (Hub & Spoke)
- **Hub**: Azure Entra ID as central identity authority
- **Custom Security Attributes**: `studentAccessControl` attribute set with fine-grained access
- **Defense-in-Depth**: APIM → API Gateway Middleware → Row-Level Security (SQL)
- **Authorization Flow**: JWT validation → Role check → Custom attributes → OBO flow for SQL

### Data Architecture
- **Database**: Azure SQL with multi-schema design (dbo, Enrollment, Households, Awards, Comms)
- **Document Storage**: ADLS Gen2 with hierarchical structure `/{application}/{legal-entity}/{userid}/{documentType}`
- **Access Control**: SAS tokens (5-minute expiry) for secure document downloads

### Integration Points
- **ClassWallet** - Payment services and fund repository
- **SendGrid** - Transactional email
- **PandaDoc** - Document generation and e-signature
- **Microsoft Graph** - Azure AD integration
- **NC DMV, DOR, DPI** - State agency integrations

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Documentation Site | Nuxt | 3.15.0 |
| | Nuxt Content | 2.13.4 |
| | Vue | 3.5.13 |
| | Tailwind CSS | 6.12.2 |
| | TypeScript | 5.7.3 |
| Backend (other repos) | .NET | 8.0 |
| | Azure Functions | v4 |
| Frontend (other repos) | Angular | 19.2.6 |
| | Nx | 21.4.1 |
| Database (other repos) | Azure SQL | Latest |
| Identity (other repos) | Entra ID B2C | Latest |

## Working with Documentation

### Updating Wiki Content
1. Edit markdown files in `wiki/` directory
2. Follow existing structure and formatting conventions
3. Update `wiki/TABLE_OF_CONTENTS.md` if adding new sections
4. Include cross-references to source code with file paths and line numbers (e.g., `Programs.cs:41`)

### Updating Documentation Site
1. Edit markdown files in `k12-docs/content/`
2. Test locally: `cd k12-docs && npm run dev`
3. Update `k12-docs/components/SidebarNav.vue` for navigation changes
4. Build and preview: `npm run generate && npm run preview`

### Documentation Standards
- Use Mermaid for diagrams where applicable
- Include code examples with syntax highlighting
- Link to Confluence pages for detailed process flows: `https://cfi-nc.atlassian.net/wiki/spaces/KR`
- Link to Azure DevOps: `https://dev.azure.com/CFI-AzureDevOps/K12`
- Reference external repository README files for setup instructions

## Source Files Reference

### Large Documentation Files
- `MyPortal K12.md` (744KB) - Full Confluence export (12,063 lines)
- `DOCUMENTATION_GUIDE.md` (11KB) - Complete documentation guide
- `wiki/02-architecture/README.md` - System architecture overview
- `wiki/05-development/README.md` - Development guide and workflows

### Key Documentation Topics
- **Project Overview**: Charter, timeline, stakeholders, governance
- **System Architecture**: High-level design, technology stack, security model
- **Security**: Hub & Spoke model with Entra ID, custom security attributes, defense-in-depth
- **Development**: Setup instructions, workflows, testing, CI/CD pipelines
- **Infrastructure**: Terraform IaC, Azure resources, deployment patterns
- **Compliance**: FedRAMP, NIST 800-53, WCAG 2.1 Level AA, FERPA

## External Resources

- **Confluence Space**: https://cfi-nc.atlassian.net/wiki/spaces/KR/overview
- **Azure DevOps**: https://dev.azure.com/CFI-AzureDevOps/K12
- **Jira Board**: https://cfi-nc.atlassian.net/jira/software/c/projects/K12

## Important Notes

1. **This is a documentation repository only** - Do not expect to find application code, API endpoints, or database schemas here. Reference the appropriate repositories for implementation details.

2. **Cross-repository references** - The wiki extensively links to README files in other repositories (k12-api-enrollment, k12-web-enrollment, k12-infra, k12-test-api-postman). These links assume a sibling directory structure.

3. **Confluence synchronization** - The `MyPortal K12.md` file is a point-in-time export. Updates to Confluence are not automatically reflected here.

4. **Documentation site is optional** - The static wiki in `wiki/` is self-contained and can be viewed directly on GitHub or any markdown viewer. The Nuxt site provides enhanced search and navigation features.

5. **Architecture focus** - This documentation is specifically curated for enterprise architects and technical staff, focusing on high-level design, security architecture, integration patterns, and technology decisions rather than implementation details.

## Contact

- **Technical Questions**: CFI Architecture Team (Marty Flournory, Sumith Mathur)
- **Content Questions**: SEAA Product Lead or CFI Product Owner
- **Site Issues**: Create Jira ticket or contact DevOps team


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
