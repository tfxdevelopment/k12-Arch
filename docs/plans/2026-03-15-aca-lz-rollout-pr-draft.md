# Draft PR Description — ACA landing-zone rollout + post-merge Terraform fixes

> This is a local draft document only (no PR operation).

## Proposed Title
Draft: ACA landing-zone rollout + post-merge Terraform fixes

## Proposed Target
- Source branch: `features/aca-lz-rollout-pr`
- Target branch: `main`

## Summary
- Replays the previously conflict-resolved ACA landing-zone integration onto a clean branch from `main`.
- Includes Terraform reconciliation fixes to keep module source paths and variable contracts consistent.
- Keeps source-hygiene guardrails and production environment scaffolding included in the resolved merge.

## Validation Notes
- Terraform `init` + `validate` completed for:
  - `terraform/environments/development`
  - `terraform/environments/staging` (deprecation warning only)
  - `terraform/environments/testing` (deprecation warning only)
  - `terraform/environments/production`
- Source-path hygiene check passed:
  - no forbidden `scenarios/shared/terraform/modules` references in active roots/modules.

## Reviewer Focus Areas
- Landing-zone/shared module structure and pathing consistency.
- Environment parity across `development`, `staging`, `testing`, and `production`.
- API enrollment module changes (`app.tf`, variables, architecture artifact).

## Rollback / Safety
- Branch is isolated and can be dropped if review requests a narrower split.
- Suggested fallback: split docs-heavy content and Terraform execution changes into separate PRs if needed.

## Optional Follow-up
- If desired, create a reduced-scope follow-up draft limited to Terraform runtime-impacting files only.
