# STD-02: Backend Coding Standards

## Confluence Source
| Field | Value |
|---|---|
| Confluence Space | TBD |
| Confluence Page | TBD |
| Confluence URL | TBD |
| Last Reviewed | TBD |
| Owner | TBD |

## Status and Coverage
- **Status**: Draft (Partially Complete)
- **Checklist ID**: STD-02
- **Why incomplete**: Core technology choices are documented (Functions/.NET + Dapper), but API conventions, telemetry specifics, and auth patterns need a single, explicit reference.

## Standards
### .NET
- Runtime (documented): Azure Functions on .NET 8
- Logging/telemetry conventions:
	- Prefer structured logging and avoid logging secrets or sensitive personal data
	- Ensure logs/telemetry are usable in Azure monitoring (App Insights / Log Analytics are part of the platform)
	- Correlate logs across APIM → Functions where possible

### API Design
- API gateway: Azure API Management fronts backend APIs (documented)
- OpenAPI/Swagger publishing: CI includes pipelines to push OpenAPI into APIM (documented)
- Endpoint conventions: TBD (needs canonical guidance per API/service)
- Versioning strategy: TBD (typically enforced at APIM)

### Data Access
- Primary data access approach: Dapper (ADR-002)
- EF usage: model generation only (documented)
- Dapper usage conventions:
	- Use parameterized queries to prevent SQL injection
	- Keep SQL readable and reviewable (prefer multi-line SQL strings for complex queries)
	- Optimize for Azure Functions cold start and memory constraints (ADR-002 decision drivers)
- Transaction boundaries: TBD (codify per-domain rules and when to use explicit transactions)

### Security
- AuthN/AuthZ patterns: TBD (platform uses Microsoft Entra ID; APIM performs JWT validation)
- Secret management:
	- Do not commit secrets (PR checklist)
	- Prefer platform-managed secret storage (Key Vault exists in the platform)
	- Use environment configuration and managed identity where available (confirm per service)

## Open Questions / TODO
- Identify existing conventions from current APIs and codify them (routing, versioning, error shape, correlation IDs).
