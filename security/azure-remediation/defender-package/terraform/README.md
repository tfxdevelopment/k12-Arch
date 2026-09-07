# Terraform — Defender for Cloud remediation baseline

Three root modules, split by **scope and owner** so they slot into the existing pipeline structure:

| Module | Scope | Owner | Runs |
|---|---|---|---|
| `platform-guardrails/policy` | Management groups | DevOps | Once (`-var-file=environments/cfi.tfvars`) |
| `platform-guardrails/defender` | Subscription | DevOps | Once per subscription (`-var-file=environments/<env>.tfvars`) |
| `workload-baseline` | Resource group | Architects | Once per environment (`-var-file=environments/<env>.tfvars`) |

Every file is annotated with the plan section and the Defender recommendation it closes.

## What this is (and is not)

- It is a **reference implementation of the target state** in `Defender-Remediation-Plan.md`, written so each resource block can be lifted into the existing K12 modules. Names, CIDRs, SKUs and IDs are placeholders.
- It is **not** a drop-in replacement for the current Terraform, and `apply` has not been run anywhere. `terraform validate` passes against azurerm `~> 4.60` (v4.81 at time of writing; 5.0 requires the upgrade guide).
- Container Apps environments, Service Bus SKU changes and Redis migration are **replace** operations — sequence them per the roadmap (identity before network, dev → test → stage → prod).

## Order of operations

1. `workload-baseline` (dev) → outputs the Log Analytics workspace ID.
2. `platform-guardrails/defender` (each subscription).
3. `platform-guardrails/policy` with `prod_effect = "Audit"`; review compliance in Defender → Regulatory compliance.
4. Repeat 1 for test/stage/prod.
5. Flip `prod_effect = "Deny"`.

## Pipeline identity requirements

| Module | Role needed |
|---|---|
| policy | Resource Policy Contributor on the definition MG; User Access Administrator on NonProd/Prod MGs (for the DINE remediation role assignments) |
| defender | Security Admin on the subscription |
| workload-baseline | Contributor on the RG + User Access Administrator (role assignments) + Key Vault Secrets Officer (example secret); agent must have network line-of-sight to the private endpoints for data-plane calls |

Use **workload identity federation** for all three service connections — no client secrets.
