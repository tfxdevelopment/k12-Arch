# ACA Delivery Talking Points

Use this for stakeholder reviews/check-ins.

## Headlines
- Lower envs stay Basic/Consumption with public ingress; prod is the only place we flip on ILB, zone redundancy, and ACR geo-rep.
- All toggles live in `terraform/environments/<env>/locals.tf` (see table in `terraform/docs/CONTAINER_APPS_SETUP.md`).
- GitOps workflow uses Azure Pipelines + Speckit (`specworkflows/gitops-multi-env.yaml`) and promotes a single immutable image tag across envs.

## Flow (Mermaid)
```mermaid
graph LR
  D(Develop branch) --> P1[CI: terraform plan (dev)]
  P1 --> B[Build & push image tag]
  B --> D1[Deploy dev]
  D1 -->|gated| S[Deploy staging]
  S -->|gated| T[Deploy testing]
  T -->|gated| PR[Deploy prod]
  subgraph Toggles in locals.tf
    ZR[zone_redundancy]
    GR[acr_geo_replication]
    ILB[internal_load_balancer]
    MIN[min_replicas]
    MAX[max_replicas]
  end
```

## What to cover live
- Current posture: dev/staging/testing keep ILB/zone/geo **off**, 1–5 replicas, 0.5 vCPU/1Gi.
- Production posture: ILB + zone redundancy + ACR geo-rep; raise min replicas to 2+.
- Health contract: `/health/live`, `/health/ready`, `/health/startup` must stay green post-deploy.
- Security: Managed Identity for ACR pull and Key Vault secrets (`{env}apikv`), ACR admin disabled.
- Runbooks: Terraform executed only from env folders; publish plan artifacts before apply; reuse image tags for promotions.

## Decisions to ratify
- Approve production toggle set (ILB, zone redundancy, ACR geo-rep, min replicas ≥2).
- Confirm branch→environment mapping and promotion gates.
- Confirm cost acceptance for prod premium SKUs.

## Links
- GitOps guide: `docs/gitops.md`
- ACA setup: `terraform/docs/CONTAINER_APPS_SETUP.md`
- Prod readiness: `terraform/docs/ACA_PRODUCTION_READINESS.md`
