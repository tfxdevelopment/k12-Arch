# GitOps for K12 Azure Container Apps

This doc describes how we ship the K12 API to Azure Container Apps using Terraform, Azure Pipelines, and Terramate stack orchestration. The Speckit workflow in `specworkflows/` is currently staged/secondary guidance only.

## Branch → environment mapping
- `develop`: CI-only (plan + image build); no apply
- `env/development`: optional dev CD
- `env/staging`: staging CD
- `env/testing`: testing CD
- `main`: production CD

## Golden rules
- Run Terraform **only** from `terraform/environments/<env>`; remote state lives in the storage account configured for k12-infra.
- Keep ACR admin disabled; use managed identity for pulls and Key Vault reads.
- Health endpoints must stay green: `/health/live`, `/health/ready`, `/health/startup`.
- Lower envs stay inexpensive (Basic/Consumption, public ingress). Prod upgrades to HA/ILB/geo-rep.

## Terraform toggles (per environment)
Set these in `terraform/environments/<env>/locals.tf`.

| Toggle | Purpose | Non-prod default | Prod target |
| --- | --- | --- | --- |
| `enable_zone_redundancy` | Zone-redundant ACA env & ACR | `false` | `true` |
| `enable_acr_geo_replication` | ACR geo-replication | `false` | `true` |
| `enable_internal_load_balancer` | Private ingress (ILB) for ACA env | `false` | `true` |
| `aca_min_replicas` | HA floor | `1` | `2+` |
| `aca_max_replicas` | Burst limit | `5` | per capacity plan |
| `aca_cpu` | vCPU per replica | `0.5` | workload-driven |
| `aca_memory` | Memory per replica | `1Gi` | workload-driven |

Keep dev/staging/testing at the non-prod defaults unless explicitly approved to change cost posture.

## Pipeline layout (Azure Pipelines + Terramate)
Separate CI and CD stages. `azure-pipelines.yml` is the primary execution path.

**CI (develop):**
1) `terramate run --tags env:development -- terraform plan` from `terraform/`
2) Build & push `k12-api:${image_tag}` to `${acr_name}.azurecr.io`

**CD (per env branch):**
1) Optional gated `terramate run --tags env:<env> -- terraform plan` (publish plan artifact)
2) `terramate run --tags env:<env> -- terraform apply`
3) Roll out image `${acr_name}.azurecr.io/k12-api:${image_tag}` to the ACA app
4) Health check `/health/live`, `/health/ready`, `/health/startup`

**Promotion controls:**
- Inputs: `acr_name`, `image_tag`, `deploy_staging/testing/prod`
- Promote by reusing the same pushed image tag; do not rebuild during promotion.

## Security & access
- Managed Identity pulls from ACR (role: `AcrPull`); Managed Identity reads Key Vault secrets (`Key Vault Secrets User`).
- Secrets live in `{env}apikv`; do **not** embed secrets in Terraform variables or app settings.
- Keep public ingress only for lower envs. Prod should be ILB-only behind App Gateway/Front Door when approved.

## Runbook
- Validate plan artifacts before apply.
- Never run `terraform apply` from module roots.
- Execute from `terraform/` when using Terramate orchestration.
- Use stack tags for targeted runs:
	- `env:development` + `tier:ops`
	- `env:staging` + `tier:apps`
	- `env:testing` + `tier:apps`
- If toggles change (e.g., enabling ILB/zone redundancy), communicate cost and downtime expectations in the PR and meeting notes.

## References
- Primary pipeline: `azure-pipelines.yml`
- Terramate project config: `terraform/terramate.tm.hcl`
- Staged workflow reference: `specworkflows/gitops-multi-env.yaml`
- ACA prod readiness: `terraform/docs/ACA_PRODUCTION_READINESS.md`
- ACA setup: `terraform/docs/CONTAINER_APPS_SETUP.md`
