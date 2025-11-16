# K12 Architecture Documentation Guide

## Overview

This folder contains comprehensive enterprise architecture documentation for the K12 MyPortal system. The documentation has been organized from the exported Confluence content and existing README files into two formats:

1. **Static Wiki** ([wiki/](wiki/)) - Markdown files for offline reading or direct GitHub viewing
2. **Interactive Documentation Site** ([k12-docs/](k12-docs/)) - Nuxt Content-powered searchable website

## What Was Created

### 1. Static Wiki Documentation

Located in [wiki/](wiki/), this is a curated set of markdown files organized specifically for enterprise architects:

**Main Sections**:
- **[Project Overview](wiki/01-project-overview/README.md)** - Charter, timeline, stakeholders, governance
- **[System Architecture](wiki/02-architecture/README.md)** - High-level design, security model, integrations
- **[Development Guide](wiki/05-development/README.md)** - Setup, workflows, CI/CD, standards
- **[Table of Contents](wiki/TABLE_OF_CONTENTS.md)** - Complete navigation guide

**Content Sources**:
- ✅ Confluence export ([MyPortal K12.md](MyPortal%20K12.md)) - 12,063 lines extracted
- ✅ Existing README files from all repositories
- ✅ Links to Confluence pages for detailed content
- ✅ Cross-references between documentation

**Key Features**:
- Architecture diagrams (text-based and Mermaid)
- Technology stack summaries
- Security model (Hub & Spoke with Entra ID)
- Integration patterns
- Code structure explanations
- File path references with line numbers

### 2. Interactive Documentation Site

Located in [k12-docs/](k12-docs/), this is a Nuxt 3 + Nuxt Content powered documentation website:

**Features**:
- ✅ **Full-text search** across all documentation
- ✅ **Dark mode** toggle
- ✅ **Table of contents** auto-generated from headings
- ✅ **Syntax highlighting** for code blocks (C#, TypeScript, SQL, Bash, etc.)
- ✅ **Responsive design** for mobile/tablet/desktop
- ✅ **Vue components in markdown** (MDC)
- ✅ **Fast static site generation** for deployment

**Technology**:
- Nuxt 3 (Vue-based framework)
- Nuxt Content (markdown processing)
- Tailwind CSS (styling)
- TypeScript (type safety)

## How to Use

### Viewing Static Wiki (Easiest)

**Option 1: GitHub**
- Navigate to [wiki/README.md](wiki/README.md) on GitHub
- GitHub will render the markdown with full formatting
- Click links to navigate between pages

**Option 2: Local Markdown Viewer**
- Open files in VS Code, Typora, or any markdown editor
- Follow links between documents

**Option 3: Clone and Browse**
```bash
cd K12-Arch/wiki
# Open README.md in your preferred markdown viewer
```

### Running the Documentation Site

**Prerequisites**:
- Node.js 18.19.1+ or 20.11.1+ or 22.0.0+
- npm or yarn

**Setup**:
```bash
cd K12-Arch/k12-docs

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

**Building for Production**:
```bash
# Generate static site
npm run generate

# Preview production build
npm run preview
```

The static files will be in `.output/public/` ready for deployment.

### Deployment Options

**Azure Static Web Apps** (Recommended):
1. Build: `npm run generate`
2. Deploy `.output/public/` to Azure Static Web Apps
3. Configured CI/CD will auto-deploy on git push

**Netlify/Vercel**:
- Connect GitHub repository
- Framework: Nuxt 3
- Build command: `npm run generate`
- Publish directory: `.output/public`

**GitHub Pages**:
```bash
npm run generate
# Deploy .output/public to gh-pages branch
```

## Documentation Structure

```
K12-Arch/
├── DOCUMENTATION_GUIDE.md         # This file
├── MyPortal K12.md                # Full Confluence export (714KB)
│
├── wiki/                          # Static markdown wiki
│   ├── README.md                  # Wiki home
│   ├── TABLE_OF_CONTENTS.md       # Complete navigation
│   ├── 01-project-overview/       # Charter, timeline, governance
│   ├── 02-architecture/           # System design, security
│   ├── 03-technical/              # Backend, frontend, infra
│   ├── 04-requirements/           # Business requirements, flows
│   ├── 05-development/            # Setup, workflows, standards
│   ├── 06-operations/             # Support, monitoring
│   └── 07-program-management/     # RAID, roadmap, team
│
└── k12-docs/                      # Nuxt Content documentation site
    ├── package.json               # Dependencies
    ├── nuxt.config.ts             # Nuxt configuration
    ├── README.md                  # Site setup guide
    ├── app.vue                    # App entry point
    ├── components/                # Vue components
    │   ├── ColorModeButton.vue
    │   ├── SidebarNav.vue
    │   └── TableOfContents.vue
    ├── layouts/
    │   └── default.vue
    ├── content/                   # Markdown content
    │   └── index.md               # Home page
    └── public/                    # Static assets
```

## Content Organization

### For Enterprise Architects

The documentation has been specifically curated with enterprise architect needs in mind:

**Architecture Focus**:
- ✅ High-level system design
- ✅ Security architecture (Hub & Spoke model)
- ✅ Data architecture (multi-schema SQL, ADLS Gen2)
- ✅ Integration patterns (ClassWallet, SendGrid, PandaDoc)
- ✅ Technology stack decisions and rationale
- ✅ Non-functional requirements (performance, compliance)

**Strategic Content**:
- ✅ Project charter and governance model
- ✅ Risk analysis (RAID logs)
- ✅ Compliance (FedRAMP, NIST, WCAG)
- ✅ Infrastructure as Code (Terraform)
- ✅ CI/CD pipeline architecture

**Developer Guidance**:
- ✅ Setup instructions (linked to existing READMEs)
- ✅ Code standards and patterns
- ✅ Testing strategy
- ✅ Common development tasks

### Cross-References

The documentation extensively links to:
- **Source Code**: File paths with line numbers (e.g., `API/Programs.cs:41`)
- **Confluence Pages**: Direct links to detailed process flows and SOPs
- **Existing READMEs**: Backend, Frontend, Infrastructure, Testing
- **Jira**: Project tracking and issues
- **Azure DevOps**: CI/CD pipelines and repositories

## Key Documentation Highlights

### 1. System Architecture

**Hub and Spoke Security Model**:
- Central identity management with Entra ID
- Custom security attributes for fine-grained access
- Defense-in-depth (APIM → API Gateway → Row-Level Security)
- Delegated administration via Administrative Units

**Layered N-Tier Backend**:
- API Layer (Azure Functions HTTP Triggers)
- Middleware (Error Handling, Authentication)
- Application Layer (Business Logic)
- Infrastructure Layer (External Services)
- Domain Layer (Models, Validators)
- Data Layer (Dapper Repository)

**Monorepo Frontend**:
- 4 Angular applications (admin, enrollment, providers, schools)
- Shared library (components, services, guards)
- Independent routing per app
- Material Design + PrimeNG hybrid

### 2. Technology Decisions

**Key Choices**:
- ✅ Azure Government Cloud → FedRAMP compliance
- ✅ Entra ID B2C → Cost-effective CIAM ($162.5/month vs $7,000)
- ✅ Dapper over EF → Performance for queries
- ✅ Nx Monorepo → Code sharing, build optimization
- ✅ Terraform → Multi-cloud IaC capability

### 3. Integration Architecture

**External Systems**:
- **ClassWallet**: Payment services and fund repository
- **SendGrid**: Transactional email
- **PandaDoc**: Document generation and e-signature
- **Melissa Data**: Address validation (API)
- **NC DMV**: Residency validation
- **NC DOR**: Income validation
- **NC DPI**: Student data (planned)

### 4. Compliance & Security

**Certifications**:
- FedRAMP High (Azure Government)
- NIST 800-53 controls
- WCAG 2.1 Level AA
- SOC 2

**Security Features**:
- Multi-factor authentication (MFA)
- Encryption at rest and in transit (TLS 1.2+)
- Row-Level Security (RLS) in SQL
- Audit logging (complete transaction history)
- SAS tokens for document access (5-minute expiry)

## Maintenance

### Updating Documentation

**Static Wiki**:
1. Edit markdown files in `wiki/` folder
2. Follow existing structure and formatting
3. Update `TABLE_OF_CONTENTS.md` if adding new sections
4. Commit and push to repository

**Documentation Site**:
1. Edit markdown files in `k12-docs/content/`
2. Add new pages as needed
3. Update `components/SidebarNav.vue` for navigation changes
4. Test locally with `npm run dev`
5. Commit and deploy

### Syncing with Confluence

The Confluence export is a point-in-time snapshot. To refresh:
1. Export updated Confluence space
2. Replace `MyPortal K12.md`
3. Review changes and update wiki pages accordingly
4. Preserve any custom organization and cross-references

### Keeping README Links Current

The wiki links to existing README files:
- [k12-api-enrollment/README.md](../k12-api-enrollment/README.md)
- [k12-web-enrollment/README.md](../k12-web-enrollment/README.md)
- [k12-infra/terraform/README.md](../k12-infra/terraform/README.md)
- [k12-test-api-postman/README.md](../k12-test-api-postman/README.md)

Ensure these paths remain valid if repository structure changes.

## Search Functionality

The Nuxt Content site provides full-text search:
- Indexes all markdown content automatically
- Searches titles, headings, and body text
- Results ranked by relevance
- No external dependencies required

## Next Steps

### Recommended Actions

1. **Review the Wiki**:
   - Start with [wiki/README.md](wiki/README.md)
   - Navigate to [System Architecture](wiki/02-architecture/README.md) for technical overview
   - Check [Development Guide](wiki/05-development/README.md) for setup instructions

2. **Try the Documentation Site**:
   ```bash
   cd K12-Arch/k12-docs
   npm install
   npm run dev
   ```
   - Open http://localhost:3000
   - Test search functionality
   - Toggle dark mode
   - Navigate between sections

3. **Deploy Documentation Site** (Optional):
   - Choose deployment platform (Azure Static Web Apps recommended)
   - Configure CI/CD for automatic updates
   - Share URL with team

4. **Customize as Needed**:
   - Add company branding
   - Include additional diagrams
   - Expand sections based on team feedback
   - Integrate with other documentation sources

## Additional Resources

**Documentation Tools**:
- [Nuxt Content Docs](https://content.nuxt.com/)
- [Mermaid Diagrams](https://mermaid.js.org/)
- [Markdown Guide](https://www.markdownguide.org/)

**Project Resources**:
- [Confluence Space](https://cfi-nc.atlassian.net/wiki/spaces/KR)
- [Azure DevOps](https://dev.azure.com/CFI-AzureDevOps/K12)
- [Jira Board](https://cfi-nc.atlassian.net/jira/software/c/projects/K12)

## Support

For questions about this documentation:
- **Content Questions**: Contact SEAA Product Lead or CFI Product Owner
- **Technical Questions**: Contact CFI Architecture Team
- **Site Issues**: Create Jira ticket or contact DevOps team

---

**Created**: November 15, 2025
**Maintained By**: K12 Technical Team
**Last Updated**: November 15, 2025
