# STD-01: Frontend Coding Standards

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
- **Checklist ID**: STD-01
- **Why incomplete**: Standards exist across architecture/CI docs but need a single canonical reference (especially for formatting and E2E strategy).

## Standards
### Language and Framework
- Angular version: 19.2.6 (documented)
- Nx version: 21.4.1 monorepo (documented)
- TypeScript version target: 5.7.3 (documented)
- UI libraries: Angular Material + PrimeNG (documented)

### Code Style
- Linting: ESLint (validated in CI pipelines)
- Formatting: TBD (confirm if Prettier is enforced and where)
- Naming conventions:
	- Prefer Angular conventions (kebab-case filenames, PascalCase classes/types, camelCase variables/functions)
	- Keep public component selectors/patterns consistent within each app

### Accessibility
- Minimum requirements: WCAG 2.1 AA (system requirement); target WCAG 2.2 AA where feasible
- Testing approach/tools:
	- Use accessible-by-default UI components (Angular Material)
	- Include keyboard navigation and screen reader checks for UI changes
	- Recommended tooling: Accessibility Insights (manual) and automated checks where available

### Testing
- Unit tests: Jest (documented)
	- Run all tests: `npm test`
	- Run a single app: `nx test admin` (or `providers`, etc.)
	- Tests live alongside code: `*.spec.ts`
- E2E test expectations: TBD (not documented in this repo)

## Open Questions / TODO
- Identify existing formatting config (Prettier or equivalent) and document agreed conventions.
