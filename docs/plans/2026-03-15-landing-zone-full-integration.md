# Landing Zone Full Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate landing-zone platform modules into active environment stacks so hub/spoke networking and shared platform primitives are first-class, reusable, and promotion-safe across dev/stage/test/prod.

**Architecture:** Split orchestration into platform and workload concerns. Promote `terraform/modules/shared/*` as the single module source, expose platform outputs through a stable contract, then wire workload modules (`api-enrollment`, `web-enrollment`, `messaging`, `core`) progressively behind environment toggles and APIM strangler safeguards.

**Tech Stack:** Terraform (azurerm/azuread), Azure Container Apps, APIM, Front Door, Key Vault, Service Bus, Azure SQL, Azure Pipelines.

---

### Task 1: Baseline and guardrails

**Files:**
- Modify: `terraform/.gitignore`
- Create: `terraform/ARCHITECTURE.md`
- Test: N/A

**Step 1: Add Terraform artifact ignore rules**

Update `terraform/.gitignore` with:
- `*.log`
- `*.dryrun`
- `tfplan*`
- `.terraform.tfstate.lock.info`

**Step 2: Document architecture boundary**

Create `terraform/ARCHITECTURE.md` with sections:
- Platform vs workload ownership
- Module source-of-truth policy (`terraform/modules/shared/*`)
- Environment promotion model

**Step 3: Verify no accidental log/plan tracking remains**

Run: `git status --short`
Expected: transient Terraform artifacts no longer appear after dry-runs.

**Step 4: Commit**

Commit message: `chore(terraform): add artifact guardrails and architecture boundary doc`

---

### Task 2: Normalize landing-zone module roots

**Files:**
- Create: `terraform/modules/landing-zone/hub/main.tf`
- Create: `terraform/modules/landing-zone/hub/variables.tf`
- Create: `terraform/modules/landing-zone/hub/outputs.tf`
- Create: `terraform/modules/landing-zone/spoke/main.tf`
- Create: `terraform/modules/landing-zone/spoke/variables.tf`
- Create: `terraform/modules/landing-zone/spoke/outputs.tf`
- Modify: `terraform/environments/development/modules/landing-zone/01-hub/*.tf`
- Modify: `terraform/environments/development/modules/landing-zone/02-spoke/*.tf`

**Step 1: Create hub/spoke wrapper modules under `terraform/modules/landing-zone/`**

Port current development landing-zone logic into new canonical wrappers.

**Step 2: Replace deep scenario-relative module source paths**

In wrappers, use local module paths under `terraform/modules/shared/*`.

**Step 3: Keep old development landing-zone files as compatibility shim (temporary)**

Optionally point old modules to new wrapper modules for minimal disruption.

**Step 4: Validate wrappers**

Run: `terraform -chdir=terraform/environments/development init -backend=false`
Expected: init success with no module source resolution errors.

**Step 5: Commit**

Commit message: `refactor(terraform): normalize landing-zone module roots`

---

### Task 3: Define stable platform-to-workload contracts

**Files:**
- Modify: `terraform/modules/landing-zone/hub/outputs.tf`
- Modify: `terraform/modules/landing-zone/spoke/outputs.tf`
- Modify: `terraform/modules/api-enrollment/variables.tf`
- Modify: `terraform/modules/web-enrollment/variables.tf`
- Modify: `terraform/environments/*/variables.tf`

**Step 1: Expose platform outputs**

Add explicit outputs for:
- Spoke VNet/subnet IDs
- Private endpoint subnet ID
- Route table ID / firewall private IP
- Optional ingress/public edge IDs (AGW/Front Door)

**Step 2: Add optional workload input variables for platform wiring**

In workload modules, add nullable variables for network contracts (default null).

**Step 3: Add environment variable definitions**

Add toggle and contract variables in each env folder.

**Step 4: Validate syntax only**

Run: `terraform -chdir=terraform/environments/development validate`
Expected: valid configuration.

**Step 5: Commit**

Commit message: `feat(terraform): add landing-zone contract outputs and workload inputs`

---

### Task 4: Wire development environment with feature toggles

**Files:**
- Modify: `terraform/environments/development/main.tf`
- Modify: `terraform/environments/development/locals.tf`
- Modify: `terraform/environments/development/variables.tf`

**Step 1: Add landing-zone module call to development root**

Add module blocks for hub/spoke (or a composite `module "landing-zone"`) guarded by booleans.

**Step 2: Add development toggles**

- `enable_landing_zone_platform`
- `enable_private_networking`
- `enable_internal_ingress`

**Step 3: Wire outputs into workload modules when toggle enabled**

Use conditional expressions to pass network contracts into API/web modules.

**Step 4: Run validation and dry-run plan**

Run:
- `terraform -chdir=terraform/environments/development validate`
- `terraform -chdir=terraform/environments/development plan`

Expected: validate success; plan exits with changes but without plan-time errors.

**Step 5: Commit**

Commit message: `feat(terraform): wire development landing-zone orchestration`

---

### Task 5: Promote wiring to staging and testing

**Files:**
- Modify: `terraform/environments/staging/main.tf`
- Modify: `terraform/environments/staging/locals.tf`
- Modify: `terraform/environments/staging/variables.tf`
- Modify: `terraform/environments/testing/main.tf`
- Modify: `terraform/environments/testing/locals.tf`
- Modify: `terraform/environments/testing/variables.tf`

**Step 1: Mirror development toggle pattern**

Add landing-zone orchestration and contract wiring to staging/testing.

**Step 2: Preserve environment posture differences**

Keep non-prod cost and resiliency settings aligned to current policy.

**Step 3: Validate and dry-run**

Run for each env:
- `terraform init -backend=false`
- `terraform validate`
- `terraform plan`

Expected: no module/source/provider errors.

**Step 4: Commit**

Commit message: `feat(terraform): promote landing-zone wiring to staging/testing`

---

### Task 6: Production integration with safety gates

**Files:**
- Modify: `terraform/environments/production/main.tf`
- Modify: `terraform/environments/production/locals.tf`
- Modify: `terraform/environments/production/variables.tf`

**Step 1: Add production landing-zone orchestration disabled by default**

Use toggles defaulting to conservative rollout values.

**Step 2: Keep APIM strangler fallback**

Ensure APIM defaults remain rollback-safe until ACA burn-in is complete.

**Step 3: Validate + speculative production plan**

Run:
- `terraform -chdir=terraform/environments/production validate`
- `terraform -chdir=terraform/environments/production plan`

Expected: successful plan with expected infra additions.

**Step 4: Commit**

Commit message: `feat(terraform): add production landing-zone wiring with safety toggles`

---

### Task 7: CI guardrails for source-path hygiene

**Files:**
- Modify: `azure-pipelines.yml`
- Create: `specs/validate-terraform-sources.yaml` (or equivalent script step)

**Step 1: Add policy check to prevent old scenario-relative sources in active execution paths**

Fail build if active env/module files include:
- `docs/aca-landing-zone-accelerator/scenarios/shared/terraform/modules`

**Step 2: Add pipeline stage/step before plan/apply jobs**

Ensure hygiene checks run on PR and mainline.

**Step 3: Verify pipeline lint/static checks**

Expected: pipeline config parses and check is enforceable.

**Step 4: Commit**

Commit message: `ci(terraform): enforce module source hygiene for landing-zone integration`

---

### Task 8: Cutover readiness and documentation finalization

**Files:**
- Modify: `docs/aca-diagrams-and-structure-review-2026-03-15.md`
- Create: `docs/runbooks/landing-zone-integration-cutover.md`

**Step 1: Add final “current vs target vs complete” status table**

Include each environment and readiness state.

**Step 2: Document APIM migration checkpoints**

- Header-based canary
- Default backend switch criteria
- Rollback trigger and command path

**Step 3: Final verification runbook commands**

Include exact `terraform validate/plan` and smoke-check sequence.

**Step 4: Commit**

Commit message: `docs(terraform): add landing-zone integration cutover runbook`

---

## Verification matrix (must pass before apply)

1. `terraform validate` succeeds in development/staging/testing/production.
2. `terraform plan` succeeds in development/staging/testing/production.
3. No active Terraform source paths reference `docs/aca-landing-zone-accelerator/scenarios/shared/terraform/modules`.
4. APIM strangler remains rollback-safe until explicit default backend switch approval.

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-03-15-landing-zone-full-integration.md`. Two execution options:

1. **Subagent-Driven (this session)** — Dispatch fresh subagent per task, review between tasks.
2. **Parallel Session (separate)** — Open new session with executing-plans for batched execution.
