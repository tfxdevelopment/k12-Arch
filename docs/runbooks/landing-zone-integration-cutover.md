# Landing-Zone Integration Cutover Runbook

## Purpose

Operational runbook for promoting the landing-zone integration from toggle-gated wiring to active platform usage, while keeping APIM strangler rollback-safe.

## Scope

- Terraform roots: `terraform/environments/{development,staging,testing,production}`
- Platform wrappers: `terraform/modules/landing-zone/{hub,spoke}`
- Workload modules consuming platform contracts: `api-enrollment`, `web-enrollment`
- APIM strangler policy path for Function fallback and ACA canary

## Current readiness snapshot (2026-03-15)

| Environment | Root landing-zone wiring | Toggle default posture | Verification status |
|---|---|---|---|
| development | Present | Disabled by default | `init` + `validate` + `plan -refresh=false` passed |
| staging | Present | Disabled by default | `init` + `validate` + `plan -refresh=false` passed |
| testing | Present | Disabled by default | `init` + `validate` + `plan -refresh=false` passed |
| production | Present | Disabled by default (safety-first) | `init` + `validate` + `plan -refresh=false` passed |

## Preconditions

1. Approved change window and rollback owner assigned.
2. Required `TF_VAR_*` secrets are injected by pipeline/variable group.
3. APIM strangler policy remains default-safe (Function backend fallback intact).
4. Source-hygiene pipeline check passes (no active references to scenario-relative module paths).

## Cutover procedure

### 1) Validate baseline in target environment

- Run Terraform dry-run sequence in target env folder:
  - `terraform init -backend=false`
  - `terraform validate`
  - `terraform plan -refresh=false`
- Confirm expected diff only for intended toggle activation.

### 2) Enable platform toggles incrementally

Set and promote in order:

1. `enable_landing_zone_platform = true`
2. `enable_private_networking = true`
3. `enable_internal_ingress = true` (when ingress hardening checkpoint is approved)

Promote sequence: `development -> staging -> testing -> production`.

### 3) APIM strangler migration checkpoints

1. Keep default backend on Function App.
2. Enable header-based canary routing to ACA for controlled traffic.
3. Observe health/SLO signals during burn-in window.
4. If healthy and approved, switch default backend to ACA.
5. Keep rollback route defined until Function deprecation exit criteria are met.

### 4) Smoke checks after each promotion step

- API health endpoints: `/health/live`, `/health/ready`, `/health/startup`
- APIM request success rate and latency
- ACA revision health and Dapr component readiness
- Dependency checks: SQL, Storage, Service Bus, Key Vault

## Rollback procedure

If regression exceeds threshold:

1. Restore APIM default backend to Function App.
2. Disable canary header routing to ACA.
3. Revert toggle changes in the current environment branch.
4. Re-run Terraform validate/plan and deploy rollback.
5. Capture incident notes and block further promotion until RCA is complete.

## Evidence checklist

- [ ] Terraform dry-run output saved for target environment
- [ ] APIM policy state captured before/after change
- [ ] Health endpoint and telemetry screenshots/log links captured
- [ ] Rollback command path validated and owner confirmed
