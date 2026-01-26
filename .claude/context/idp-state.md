# Internal Developer Portal (Backstage) State

## Current State

| Aspect | Status |
|--------|--------|
| Backstage Version | Latest (scaffolded) |
| Location | `src/cfi-k12/k12-idp/` |
| Status | Scaffolded, unconfigured |

## Configuration Status

### app-config.yaml
| Setting | Current | Target |
|---------|---------|--------|
| Organization Name | "My Company" | "CFI - K12 MyPortal" |
| App Title | "Scaffolded Backstage App" | "K12 MyPortal Developer Portal" |
| Authentication | Guest only | Microsoft Entra ID |
| Azure DevOps | Not configured | Full integration |
| TechDocs | Local builder | Azure Blob Storage |

### TechDocs
| Aspect | Status |
|--------|--------|
| mkdocs.yml | Basic stub exists |
| Location | `k12-tech-docs/mkdocs.yml` |
| Navigation | Single "Getting Started" entry |
| Wiki Integration | Not configured |

### Software Catalog
| Aspect | Status |
|--------|--------|
| catalog-info.yaml | Placeholder only |
| Components | 1 (k12-idp itself) |
| Systems | 0 |
| APIs | 0 |
| Teams | 0 |

## Target Architecture

```
Backstage IDP
├── Software Catalog
│   ├── System: k12-myportal
│   ├── Components
│   │   ├── k12-api-enrollment (service)
│   │   ├── k12-web-admin (website)
│   │   ├── k12-web-enrollment (website)
│   │   ├── k12-web-providers (website)
│   │   ├── k12-web-schools (website)
│   │   ├── k12-infra (resource)
│   │   └── k12-architecture-docs (documentation)
│   ├── APIs
│   │   ├── enrollment-api
│   │   ├── admin-api
│   │   └── communications-api
│   └── Resources
│       ├── k12-database
│       ├── k12-storage
│       └── k12-keyvault
├── TechDocs
│   └── 184 wiki pages integrated
├── Search
│   ├── Catalog search
│   └── TechDocs search
└── Authentication
    └── Microsoft Entra ID
```

## Required Plugins

### Essential
- @backstage/plugin-techdocs
- @backstage/plugin-catalog
- @backstage/plugin-search
- @backstage/plugin-azure-devops

### Recommended
- @backstage/plugin-api-docs
- @backstage/plugin-tech-radar
- @backstage/plugin-adr
- @backstage/plugin-todo

## Environment Variables Needed

```bash
# Azure DevOps
AZURE_DEVOPS_TOKEN=<PAT>

# Microsoft Entra ID
AZURE_CLIENT_ID=<app-client-id>
AZURE_CLIENT_SECRET=<app-client-secret>
AZURE_TENANT_ID=<tenant-id>

# Azure Storage (for TechDocs)
AZURE_STORAGE_ACCOUNT=<storage-account>
AZURE_STORAGE_KEY=<storage-key>
```

## Setup Tasks

1. [ ] Configure organization settings
2. [ ] Set up Azure DevOps integration
3. [ ] Configure Entra ID authentication
4. [ ] Create full mkdocs.yml navigation
5. [ ] Create catalog-info.yaml for wiki
6. [ ] Create system/component catalog entries
7. [ ] Create team/group entries
8. [ ] Configure search
9. [ ] Add custom branding
10. [ ] Deploy to Azure Static Web Apps
