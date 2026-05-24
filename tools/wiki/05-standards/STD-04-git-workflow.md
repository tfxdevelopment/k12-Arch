# STD-04: Git Workflow

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
- **Checklist ID**: STD-04
- **Why incomplete**: Core branch flow is documented (feature → development → testing), but repo-specific defaults and release/versioning conventions must be confirmed.

## Branching Model
- Default branch: TBD (confirm for this repo)
- Feature branches (documented pattern):
	- Branch from `development`
	- Naming: `feature/K12-123-description`
	- Commit message: `K12-123: Description of change`
- Environment flow / CI rules (documented):
	- Feature branches → `development` (auto-deploy to dev)
	- `development` → `testing` (auto-deploy to testing)
	- Feature branches cannot merge directly to `testing`
- Release branches/tags: TBD

## Pull Requests
- PR title conventions:
	- Include Jira ticket (K12-XXX)
	- Use a clear, user-impacting summary
- Minimum PR requirements (documented):
	- Linked to Jira ticket (K12-XXX)
	- All tests passing
	- Documentation updated
	- Reviewed by at least 1 team member
- PR hygiene (documented):
	- No secrets in code
	- No large files committed
	- Migration scripts reviewed (if applicable)
	- Breaking changes documented

## Versioning
- Semantic versioning rules (if used): TBD

## Open Questions / TODO
- Confirm current practices and align with CI/CD pipeline requirements.
