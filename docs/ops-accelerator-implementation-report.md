# K12 Accelerator OPS Implementation Report (Terraform-First)

## Purpose

This report provides an implementation walkthrough to deploy the accelerator stack into a **new initial OPS resource group** (recommended: `development-infra`) and establish a secure baseline before broader environment rollout.

It is aligned to current Azure + Terraform guidance:
- Managed identity first (no hardcoded credentials)
- Least privilege RBAC
- Private networking as the target posture
- Terraform validate/plan/apply discipline

---

## Current Terraform Baseline (as implemented)

Environment entrypoint:
- `terraform/environments/development/main.tf`

Providers/state:
- `terraform/environments/development/provider.tf`

Environment configuration:
- `terraform/environments/development/locals.tf`

### Module topology

The development stack currently composes:
- `module.core` (foundational RG/shared resources)
- `module.enrollment-web`
- `module.enrollment-api`
- `module.admin-web`
- `module.providers-web`
- `module.schools-web`
- `module.messaging`

### OPS-relevant observations

1. Terraform backend is fixed to:
   - `resource_group_name = "k12-infra"`
   - `storage_account_name = "k12infra"`
   - `container_name = "tfstate"`
   - key `development.tfstate`
2. Provider pins:
   - `azurerm ~> 4.11.0`
   - `azuread ~> 2.0`
3. Non-prod toggles in development are cost-optimized:
   - zone redundancy disabled
   - ACR geo-replication disabled
   - internal load balancer disabled
   - ACA min/max replicas `1/5`

---

## Proposed Initial OPS Landing Deployment (new RG)

## Target

Deploy first-pass platform resources to a dedicated OPS RG:
- **Resource Group**: `development-infra`
- **Purpose**: platform controls and baseline services for dev environment

## Recommended deployment strategy

Use one of the following patterns:

1. **Preferred (low drift)**: Add a dedicated Terraform environment folder:
   - `terraform/environments/development-infra/`
   - separate backend state key, e.g. `development-infra.tfstate`

2. **Alternative (faster but riskier)**: Parameterize existing development environment and re-point with tfvars/workspace.

Recommendation: use option 1 for clean state boundaries and lower blast radius.

---

## Implementation Phases

### Phase 0 — Prereqs and guardrails

- Confirm Terraform installed and version-compatible.
- Confirm Azure subscription/tenant context.
- Confirm naming/tagging standards.
- Confirm policy assignments for subscription and RG scope.

### Phase 1 — Create OPS environment skeleton

- Create `terraform/environments/development-infra/` with:
  - `provider.tf` (separate backend key)
  - `locals.tf` (OPS-safe defaults)
  - `main.tf` (start with `module.core`, then layer in required modules)
- Keep resource names deterministic and tag with:
  - `environment = development`
  - `workload = infra`
  - `owner = platform`

### Phase 2 — Secure baseline before workload rollout

- Replace plaintext secrets/connection strings with Key Vault references and managed identity.
- Disable permissive public access where feasible in dev (or enforce temporary exception model).
- Ensure diagnostics and Defender plans are enabled.

### Phase 3 — Validate and deploy

Required command sequence for Terraform workflow:
1. `terraform validate`
2. `terraform plan`
3. `terraform apply -auto-approve`

### Phase 4 — Operational acceptance

- Confirm post-deploy controls:
  - RBAC assignments (least privilege)
  - diagnostics + alerting
  - network boundary controls
  - backup/purge protection controls

---

## Security-Critical Gaps to Address During OPS Setup

From current IaC and Advisor evidence, prioritize:

1. **Secrets hygiene**
   - Remove inline secrets/keys from `locals.tf`.
   - Use Key Vault + managed identity access.

2. **Private connectivity**
   - Private Link for storage and Key Vault resources.
   - Restrict storage account network access (VNet/PE + firewall).

3. **Subscription hardening**
   - Enable Defender plans for containers/APIs/SQL/KV/Resource Manager.
   - Reduce/clean up excessive owners and guest write privileges.

4. **APIM posture**
   - Remove unused endpoints.
   - Enforce backend auth and encrypted protocols.
   - Remove all-APIs subscription scope.

---

## Suggested Terraform Deliverables for `development-infra`

- `terraform/environments/development-infra/provider.tf`
  - dedicated state key
  - provider pinning aligned with current lockfile

- `terraform/environments/development-infra/locals.tf`
  - no inline secrets
  - explicit security toggles

- `terraform/environments/development-infra/main.tf`
  - staged module enablement (core first)
  - feature flags for optional services

- `terraform/environments/development-infra/README.md`
  - prerequisites
  - rollout sequence
  - rollback notes

---

## Rollout Walkthrough (presentation script)

1. **Why new RG?**
   - isolate initial OPS controls from app churn
2. **What gets deployed first?**
   - core platform controls, identity, diagnostics, baseline networking
3. **How do we prevent drift?**
   - environment-specific state key and immutable plan/apply process
4. **How do we reduce security risk immediately?**
   - address High/Medium Advisor items in descending impact order
5. **How do we scale to prod?**
   - carry hardened module patterns forward; increase HA/private defaults in prod

---

## Exit Criteria for Initial OPS Setup

- New `development-infra` environment deploys successfully from Terraform.
- No plaintext credentials remain in environment locals.
- Defender + diagnostics enabled for critical services.
- Key Vault + Storage network controls enforced (or documented approved exception).
- ADR set approved for top security decisions (see companion ADR roadmap).
