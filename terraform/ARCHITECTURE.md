# Terraform Architecture Boundary

## Platform vs workload ownership

### Platform layer

The platform layer owns shared network, security, and observability primitives used by workloads:

- Hub/spoke virtual networking
- Firewall, Bastion, route tables, NSGs
- Private endpoint and private DNS integration
- Shared diagnostics and platform log analytics

Canonical modules are under `terraform/modules/landing-zone/*` and `terraform/modules/shared/*`.

### Workload layer

The workload layer owns application-delivery infrastructure and runtime resources:

- `core` baseline resources and identity bootstrap
- `api-enrollment` API resources (APIM, ACA, legacy Function, data dependencies)
- `web-enrollment` web front-end resources
- `messaging` service bus resources

Workload module orchestration is environment-scoped via `terraform/environments/<env>/main.tf`.

## Module source-of-truth policy

- **Authoritative shared modules:** `terraform/modules/shared/*`
- **Authoritative landing-zone wrappers:** `terraform/modules/landing-zone/*`
- `docs/aca-landing-zone-accelerator/scenarios/*` is treated as reference content, not the active execution source for environment applies.
- **DEPRECATED:** `terraform/environments/development/modules/landing-zone/{01-hub,02-spoke}` are compatibility wrappers. They are not referenced by any environment root and are scheduled for removal. Do not create new references to these paths.

## Environment promotion model

Promotion order:

1. development
2. staging
3. testing
4. production

Execution posture:

- Validate and dry-run plan at each stage before promotion.
- Keep rollout controls toggle-based.
- Preserve APIM rollback path during migration windows.

## Integration contract principle

Platform modules must expose stable outputs for workload modules to consume (subnet IDs, private endpoint contracts, route/firewall details, ingress network contracts). Workload modules should accept these inputs as optional contracts to enable staged adoption.
