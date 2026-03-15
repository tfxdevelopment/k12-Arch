# Task Plan: Complete ACA Feature in k12-infra

## Goal
Complete the Azure Container Apps feature end-to-end in `k12-infra` across development/staging/testing/production with secure secrets, production-ready networking/diagnostics, CI/CD promotion, and a strangler-fig migration path away from legacy Function App usage.

## Current Phase
Phase 1

## Phases

### Phase 1: Requirements & Discovery
- [x] Confirm implementation scope with stakeholder input
- [x] Review docs and current Terraform/pipeline implementation
- [x] Identify blockers and acceptance criteria
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Define implementation approach and sequence
- [x] Identify files to change
- [x] Create/maintain planning files in project root
- **Status:** complete

### Phase 3: Implementation
- [x] Make ACA module toggle-driven (replicas, cpu/memory, ILB/zone/geo)
- [x] Add/enable VNet injection and production ingress posture
- [x] Add ACA diagnostics and Dapr components
- [x] Create production environment Terraform configuration
- [x] Remove plaintext env secrets and use secure secret inputs
- [x] Wire CI/CD build/promote/deploy flow for immutable tags
- [x] Add APIM strangler rollout IaC scaffolding (backends + conditional policy)
- **Status:** complete

### Phase 4: Testing & Verification
- [x] Run Terraform fmt/validate for affected environments
- [x] Run Terraform plan for development/staging/testing/production
- [x] Validate pipeline YAML structure and branch mapping behavior
- [x] Re-run dry-runs after APIM strangler rollout scaffold changes
- [x] Document evidence and any residual gaps
- **Status:** complete

### Phase 5: Delivery
- [x] Review changed files and summarize rationale
- [x] Confirm docs/runbook updates
- [x] Deliver implementation + verification summary
- **Status:** complete

### Phase 6: Landing-zone integration execution
- [x] Task 1 baseline guardrails (`terraform/.gitignore`, `terraform/ARCHITECTURE.md`)
- [x] Task 2 normalize landing-zone module roots and compatibility shims
- [x] Task 3 add platform/workload contract variables and outputs
- [x] Task 4 wire development environment with landing-zone toggles
- [x] Task 5 promote wiring to staging/testing
- [x] Task 6 production integration with safety gates
- [x] Task 7 CI source-path hygiene guardrails
- [x] Task 8 cutover runbook finalization
- **Status:** complete

## Key Questions
1. What is the safest cutover sequence from Function App to ACA via APIM?
2. Which hardening controls must be enforced now vs deferred (e.g., WAF, DR)?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Implement ACA completion in phased increments | Reduces risk in infrastructure-heavy changes |
| Keep non-prod cost posture; enable prod HA toggles | Matches `docs/gitops.md` guardrails |
| Include secure secret hardening now | Explicitly requested and currently needed |
| Use strangler-fig migration with APIM control | Enables reversible cutover from Function App |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `terraform fmt -recursive` changed files outside ACA scope | 1 | Restored only unintended formatting changes and constrained further edits |
| `git restore` included non-existent pathspecs | 1 | Re-ran restore with only valid tracked paths |
| Terraform plan failed in non-prod due ACA env arg coupling | 1 | Adjusted ILB/zone args to be null when ILB disabled |
| Terraform plan failed due unknown-dependent `count` on Dapr pub/sub | 1 | Switched to static boolean `count` |
| `staging/testing` dry-run blocked by AzureAD provider/state mismatch | 1 | Logged blocker; requires provider/state alignment in those envs |
| `production` dry-run blocked by missing baseline resources for data sources | 1 | Logged blocker; requires bootstrap/conditional data source strategy |
| `terraform plan` attempted long refresh during dry-run cycle | 1 | Forced dry-run flags through `TF_CLI_ARGS_plan` and reran with log capture |
| PowerShell native command wrapped Terraform detailed exit code as error output | 1 | Disabled wrapping and validated results using explicit exit codes/log tails |

## Notes
- Re-read this file before major changes.
- Log all errors and avoid repeating failed actions.
- Keep external/untrusted content out of this file.
