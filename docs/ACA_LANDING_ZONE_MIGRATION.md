# ACA Landing Zone Migration (First-Party Modules)

## Status

- Date: 2026-02-27
- Phase: Batch 1 scaffold
- Deployment pipeline posture: `azure-pipelines.yml` remains primary
- Spec workflow posture: `specworkflows/gitops-multi-env.yaml` is staged/secondary

## Source-of-truth decision

Active Terraform composition must come from first-party modules under:

- `terraform/modules/shared/landing-zone/*`

Vendored accelerator content under:

- `docs/aca-landing-zone-accelerator/*`

is retained as a reference source for migration only.

## What was implemented in this batch

1. Added first-party landing-zone scaffolds:
   - `terraform/modules/shared/landing-zone/hub`
   - `terraform/modules/shared/landing-zone/spoke`
   - `terraform/modules/shared/landing-zone/policy`
   - `terraform/modules/shared/landing-zone/observability`
2. Added disabled-by-default landing-zone composition to:
   - `terraform/environments/development/main.tf`
   - `terraform/environments/staging/main.tf`
   - `terraform/environments/testing/main.tf`
3. Added environment feature flags in `locals.tf` files:
   - `enable_landing_zone = false`

## Guardrails

- Keep `enable_landing_zone = false` until network and policy modules are populated.
- No production cutover while modules are scaffold-only.
- Every migrated resource from accelerator references should be copied into first-party shared modules before use in active environment entrypoints.

## Next migration sequence

1. Populate `hub` module with vnet/firewall/bastion/diagnostics resources.
2. Populate `spoke` module with vnet/subnets/nsg/peering/route-table resources.
3. Add baseline policy assignments in `policy` module (advisory-first).
4. Add DCR, alerting, and workbook baselines in `observability` module.
5. Enable `enable_landing_zone` in development only after successful `terraform plan` and smoke checks.
