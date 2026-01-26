---
agent: k12-docs-orchestrator
---

# /catalog-add - Add Component to Software Catalog

Add a new component, API, or resource to the Backstage software catalog.

## Usage

```
/catalog-add [name] [type] [options]
```

## Types

| Type | Description |
|------|-------------|
| service | Backend service/API |
| website | Frontend application |
| library | Shared library |
| documentation | Documentation site |
| resource | Infrastructure resource |
| api | API definition |

## Examples

### Add a backend service
```
/catalog-add k12-api-enrollment service --owner cfi-backend-team
```

### Add a frontend application
```
/catalog-add k12-web-admin website --owner cfi-frontend-team --consumes enrollment-api
```

### Add an API definition
```
/catalog-add enrollment-api api --spec ./api-specs/enrollment.yaml
```

### Add infrastructure resource
```
/catalog-add k12-database resource --type database --owner cfi-backend-team
```

## Options

| Option | Description |
|--------|-------------|
| --owner | Team that owns the component |
| --system | Parent system (default: k12-myportal) |
| --lifecycle | production, experimental, deprecated |
| --provides | APIs this component provides |
| --consumes | APIs this component consumes |
| --depends-on | Components this depends on |
| --spec | Path to API specification |
| --techdocs | Enable TechDocs for this component |

## Output

- Generated catalog-info.yaml content
- Instructions for adding to repository
- Updated app-config.yaml locations (if needed)
- Validation commands

## Process

1. Generate catalog-info.yaml with provided metadata
2. Add appropriate annotations (TechDocs, links)
3. Define relationships (provides, consumes, depends-on)
4. Provide file placement instructions
5. Update catalog locations if needed
