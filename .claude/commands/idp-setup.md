---
agent: k12-docs-orchestrator
---

# /idp-setup - Configure Internal Developer Portal

Configure Backstage IDP components including app settings, TechDocs, and software catalog.

## Usage

```
/idp-setup [component]
```

## Components

### Full Setup
```
/idp-setup all              # Configure everything
```

### Individual Components
```
/idp-setup config           # app-config.yaml settings
/idp-setup auth             # Entra ID authentication
/idp-setup azure-devops     # Azure DevOps integration
/idp-setup techdocs         # TechDocs/MkDocs configuration
/idp-setup catalog          # Software catalog entities
/idp-setup search           # Search configuration
/idp-setup branding         # Custom branding
```

## Examples

### Set up TechDocs with full wiki integration
```
/idp-setup techdocs
```

### Configure software catalog
```
/idp-setup catalog
```

### Full IDP setup
```
/idp-setup all
```

## Process

### /idp-setup all
1. Configure organization settings
2. Set up Azure DevOps integration
3. Configure Entra ID authentication
4. Create full mkdocs.yml navigation
5. Create catalog entities (system, components, teams)
6. Configure search
7. Provide deployment instructions

### /idp-setup techdocs
1. Generate comprehensive mkdocs.yml
2. Create wiki/catalog-info.yaml
3. Validate navigation covers all files
4. Provide local testing commands

### /idp-setup catalog
1. Create system entity
2. Create component entities for all repos
3. Create team/group entities
4. Define API entities
5. Update app-config.yaml locations

## Output

- Updated configuration files
- New catalog-info.yaml files
- Environment variable requirements
- Testing/validation commands
- Deployment instructions

## Prerequisites

- Backstage scaffolded at `src/cfi-k12/k12-idp/`
- Wiki documentation at `wiki/`
- Azure DevOps PAT (for integration)
- Entra ID app registration (for auth)
