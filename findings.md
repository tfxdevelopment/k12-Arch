# Findings & Decisions

## Requirements
- Finish ACA implementation in `k12-infra`.
- Include CI/CD wiring for image build and ACA deploy/update.
- Complete Terraform toggle usage and production hardening.
- Complete Dapr components.
- Target environments: development, staging, testing, production.
- Include secret hardening (remove plaintext secrets from repo locals).
- Use strangler-fig deprecation path for Function App, likely via APIM control.

## Research Findings
- `terraform/modules/api-enrollment/app.tf` has ACA resources present but key hardening/toggle-driven settings are partially hardcoded or commented.
- Environment locals (`development/staging/testing`) define ACA toggles and currently include plaintext connection strings.
- `specs/image-build.yaml` and `specs/deploy-container-app.yaml` exist but are not integrated into `azure-pipelines.yml`.
- `docs/gitops.md` defines desired branch→environment mapping and immutable image promotion intent.
- Production environment Terraform folder is not present yet.
- `terraform/modules/messaging` provisions Service Bus (not Redis), so Dapr pub/sub should align to Service Bus unless Redis infrastructure is introduced.
- Environment folder conventions include `provider.tf`, `main.tf`, `locals.tf`, `data.tf` (empty), and `stack.tm.hcl`; production should follow this pattern.
- `azure-pipelines.yml` currently uses a dockerized KBST Terraform workflow and does not invoke `specs/*.yaml` deployment specs.
- Implemented: ACA module now consumes env toggles for replicas/CPU/memory and ILB/zone/geo posture.
- Implemented: production Terraform environment scaffolded under `terraform/environments/production`.
- Implemented: plaintext connection strings removed from env locals; now sourced from secure Terraform variables.
- Implemented: Dapr state store and Service Bus pub/sub component wiring added in Terraform.
- Implemented: branch-mapped Azure Pipeline now plans/applies per environment and runs ACA health checks including `/health/startup`.
- Dry-run: `development` Terraform plan runs successfully with changes detected after fixing ACA environment argument coupling and Dapr pub/sub `count` determinism.
- Dry-run: `staging` and `testing` plans fail due state/provider mismatch: `module.core.azuread_service_principal.devops_sp` is managed by newer AzureAD provider than currently selected.
- Dry-run: `production` plan fails due missing baseline resources expected by data sources (`production` resource group, APIM service, Linux Function App, Key Vault).
- Dry-run pipeline audit: branch triggers, stage mapping, health endpoint checks, required service connection reference, secret TF_VAR usage, and env folder presence all pass static readiness checks.
- APIM strangler dry-run assessment: there are no APIM backend or policy resources (`set-backend-service`, API policy resources) in Terraform to perform weighted/conditional routing yet.
- Implemented APIM strangler rollout scaffolding in `api-enrollment` module:
  - Added toggle-gated backend resources for Function App and ACA.
  - Added API policy XML with header-based conditional routing to ACA backend while defaulting to Function backend.
  - Added module variables for rollout toggle, backend names/urls, API identifier, and routing header/value.
- Follow-up dry-run pass resolved prior blockers:
	- `staging/testing` provider mismatch resolved by selecting AzureAD `~> 3.0` in those envs.
	- `production` bootstrap blockers resolved by (a) optional Key Vault secret sync toggle in `core`, (b) replacing APIM data lookup with module resource reference, and (c) removing legacy Linux Function App data lookup in `storage.tf`.
- Landing-zone execution batch (Tasks 1-3) completed:
	- Added canonical wrapper modules at `terraform/modules/landing-zone/hub` and `terraform/modules/landing-zone/spoke` using local `terraform/modules/shared/*` sources.
	- Converted `terraform/environments/development/modules/landing-zone/{01-hub,02-spoke}` into compatibility shims to the canonical wrappers.
	- Added platform contract outputs (`routeTableId`, `routeTableName`, `firewallPrivateIp`) and baseline landing-zone toggle/contract variables to all environment `variables.tf` files.
	- Completed Task 4 development wiring: environment now has toggle-gated landing-zone module orchestration and passes optional platform contracts into `api-enrollment` and `web-enrollment` modules.
- Landing-zone execution Tasks 5-6 completed:
	- Promoted the same toggle-gated landing-zone hub/spoke orchestration and platform contract pass-through into `staging`, `testing`, and `production` root `main.tf` wiring.
	- Added landing-zone defaults/effective contract locals to `production/locals.tf` to align with development/staging/testing structure.
	- Verified all three environments with `init`, `validate`, and lightweight `plan -refresh=false` dry-runs using placeholder `TF_VAR_*` secrets.
- Landing-zone execution Tasks 7-8 completed:
	- Added CI guardrail template `specs/validate-terraform-sources.yaml` and wired it into all stages in `azure-pipelines.yml` before Terraform actions.
	- Added documentation finalization artifacts: integration status/checkpoints in `docs/aca-diagrams-and-structure-review-2026-03-15.md` and operational runbook `docs/runbooks/landing-zone-integration-cutover.md`.
	- Verified forbidden source path scan returns zero matches in active execution paths (`terraform/environments/**`, `terraform/modules/**`).
- Added Terraform guardrails:
	- `terraform/.gitignore` now ignores transient `*.log`, `*.dryrun`, and `tfplan*` artifacts.
	- `terraform/ARCHITECTURE.md` now documents platform/workload ownership and source-of-truth policy.
- Latest dry-run status:
	- `development` plan: success with diff (exit 2)
	- `staging` plan: success with diff (exit 2)
	- `testing` plan: success with diff (exit 2)
	- `production` plan: success with diff (exit 2)
	- Post-strangler-scaffold dry-runs: `staging/testing/production` all success with diff (exit 2), no new plan-time errors.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Apply infra changes before pipeline cutover | Prevent pipeline deploying incomplete infrastructure posture |
| Keep non-prod defaults and enforce prod posture via env locals | Aligns with approved cost/security model |
| Introduce production env as a first-class Terraform environment | Required for full promotion chain |
| Move secret values out of locals into secure injection path | Prevent plaintext secret exposure in source control |
| Use Service Bus for Dapr pub/sub | Existing messaging module already provisions Service Bus namespace/queues |
| Keep this pass as dry-run only | User requested next steps with no apply/deploy actions |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Existing repo has extensive unrelated unstaged changes | Limit edits to targeted ACA files; avoid touching unrelated paths |
| Session catch-up helper path mismatch for current profile | Continued with explicit baseline checks (`git diff --stat`) |
| Broad terraform formatting created out-of-scope changes | Restored unintended files and constrained change scope |
| ACA environment argument coupling (`infrastructure_subnet_id` + ILB/zone) failed non-prod plans | Set ILB/zone attributes to `null` unless ILB is enabled |
| Dapr pub/sub count depended on unknown module output at plan time | Made `count` depend only on static boolean toggle |
| Staging/testing provider state mismatch on AzureAD | Logged blocker for provider alignment before non-error plan exit |
| Terraform exit handling in PowerShell obscured plan outcomes | Evaluated explicit exit codes and tailed logs per environment |

## Resources
- `g:\Projects\CFI\K12\devops\k12-infra\docs\gitops.md`
- `g:\Projects\CFI\K12\devops\k12-infra\terraform\docs\CONTAINER_APPS_SETUP.md`
- `g:\Projects\CFI\K12\devops\k12-infra\terraform\docs\ACA_PRODUCTION_READINESS.md`
- `g:\Projects\CFI\K12\devops\k12-infra\terraform\modules\api-enrollment\app.tf`
- `g:\Projects\CFI\K12\devops\k12-infra\azure-pipelines.yml`
- `g:\Projects\CFI\K12\devops\k12-infra\specs\image-build.yaml`
- `g:\Projects\CFI\K12\devops\k12-infra\specs\deploy-container-app.yaml`

## Visual/Browser Findings
- N/A (no browser/image sources used in this task).

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
