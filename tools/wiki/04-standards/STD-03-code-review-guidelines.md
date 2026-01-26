# STD-03: Code Review Guidelines

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
- **Checklist ID**: STD-03
- **Why incomplete**: Base PR requirements exist in developer docs, but enforcement (branch policies/required checks) must be confirmed and documented.

## Goals
- Consistent quality gates
- Security-first review
- Accessibility and performance considerations included where relevant

## Review Checklist
- PR Requirements (documented):
	- [ ] Linked to Jira ticket (K12-XXX)
	- [ ] All tests passing
	- [ ] Code follows project standards
	- [ ] Documentation updated
	- [ ] Reviewed by at least 1 team member

- PR Checklist (documented):
	- [ ] No secrets in code
	- [ ] No large files committed
	- [ ] Migration scripts reviewed (if applicable)
	- [ ] Breaking changes documented

- Review focus areas (apply as relevant):
	- Correctness and edge cases
	- Security (OWASP Top 10 considerations)
	- Accessibility (where UI changes exist)
	- Tests added/updated (unit/integration)
	- Observability/logging (logs are actionable and don’t expose sensitive data)

## Approval Rules
- Required reviewers: at least 1 team member (documented)
- Branch protections: TBD (confirm required checks + merge strategy)

## Open Questions / TODO
- Confirm branch policies and required checks.
