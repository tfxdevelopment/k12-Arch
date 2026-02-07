---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

# K12 Infrastructure Copilot Instructions

## Project Context
This repository manages Azure infrastructure for the K12 Enrollment project using Terraform. It follows a modular architecture separating reusable components from environment-specific configurations.

## Architecture & Structure
- **Monorepo Structure**:
  - `terraform/environments/`: Root configuration for each stage (development, staging, testing). **Run terraform commands here.**
  - `terraform/modules/`: Reusable distinct subsystems (api-enrollment, web-enrollment, messaging).
  - `terraform/modules/core`: Base infrastructure (Resource Group, Networking) shared by other modules.
- **Service Boundaries**:
  - **Core**: Provides the Resource Group and base networking to all other modules.
  - **Web Enrollment**: Azure Static Web Apps (`web-enrollment` module).
  - **API Enrollment**: Azure SQL, APIM, Data Factory, **Azure Container Apps with Dapr** (`api-enrollment` module).
  - **Messaging**: Event/Message bus infrastructure.

## Critical Workflows

### Terraform Execution
- **NEVER** run `terraform apply` from the root or `modules/` directories.
- **ALWAYS** navigate to `terraform/environments/<env>` (e.g., `development`) to run commands.
- State is stored remotely in Azure Storage (`k12-infra` RG).

### Database Hydration
- Located in: `terraform/modules/api-enrollment/CFIK12.Database/DB_Hydration/`
- **Tooling**: Node.js script (`generate.mjs`) using `mssql` and `@faker-js/faker`.
- **Authentication**: Uses Azure CLI (`az account get-access-token`) to authenticate. Ensure you are logged in via `az login` before running locally.
- **Command**: `npm install && node generate.mjs` (Requires `DB_SERVER` and `DB_NAME` env vars).

### Container Apps Deployment
- **Infrastructure**: VNet, Redis, Container App Environment, ACR, and Container App defined in `api-enrollment/app.tf`.
- **VNet**: `10.0.0.0/16` with subnets for Container Apps (`10.0.0.0/23`), APIM (`10.0.2.0/24`), and Redis (`10.0.3.0/24`).
- **Image Build**: `az acr build --registry <acr-name> --image k12-api:latest --file Dockerfile .`
- **Health Checks Required**: Application **must** implement `/health/live`, `/health/ready`, and `/health/startup` endpoints.
- **Dapr**: Enabled with Redis state store and pub/sub components. See `terraform/docs/DAPR_INTEGRATION.md`.
- **Setup Guide**: See `terraform/docs/CONTAINER_APPS_SETUP.md` for complete deployment walkthrough.

### Key Vault Integration
- **Existing Vault**: `developmentapikv` (or `{environment}apikv`)
- **RBAC**: Container Apps use Managed Identity with "Key Vault Secrets User" role.
- **Secret References**: SQL and Blob Storage connection strings stored in Key Vault and referenced in Container App config.
- **CLI Access**: `az keyvault secret set --vault-name developmentapikv --name "secret-name" --value "secret-value"`

## Conventions & Patterns
- **Module Dependencies**: The `core` module outputs (like `rg_name`) are explicitly passed to sibling modules.
- **Security**: 
  - All web/api modules require `zscaler_ip_list` and `dev_ip_list` for firewall/access restrictions.
  - Container Apps: Use Managed Identity for ACR and Key Vault access.
  - VNet Integration: Container Apps deployed in dedicated subnet with delegation.
  - Secrets: Never hardcode - **always** use Key Vault with RBAC authorization.
- **Tagging**: 
  - Use `local.tags` in environment files for common tags.
  - Merge with module-specific tags: `tags = merge(local.tags, {module = "module-name"})`.
- **Infrastructure as Code**:
  - Provider versions are pinned in `provider.tf` (AzureRM ~> 4.11.0).
  - Use `locals` for environment-specific logic (IPs, principal IDs) to keep `main.tf` clean.
  - SKU Selection: Development uses Basic/Consumption SKUs; Production upgrades to Premium/Standard.
- **Development vs Production**:
  - **Development**: Basic ACR, Redis Basic C0, min 1 replica, public ingress (~$80/month).
  - **Staging/Testing**: Same as development (separate environments).
  - **Production**: Premium ACR with geo-replication, Redis Standard/Premium, min 2 replicas, internal load balancer, zone redundancy.

## Dapr Architecture
- **Components**:
  - State Store: `statestore` (Redis backend)
  - Pub/Sub: `pubsub` (Redis backend)
- **App ID**: `k12-api`
- **App Port**: 8080
- **Telemetry**: Integrated with Application Insights for distributed tracing.
- **Usage**: See `terraform/docs/DAPR_INTEGRATION.md` for .NET SDK examples.

## Networking
- **VNet**: `{environment}-k12-vnet` (10.0.0.0/16)
  - Container Apps subnet: `10.0.0.0/23` (delegated to Microsoft.App/environments)
  - APIM subnet: `10.0.2.0/24` (reserved for future APIM VNet integration)
  - Redis subnet: `10.0.3.0/24`
- **Internal Load Balancer**: Disabled for dev (public access), enabled for prod (private).
- **IP Restrictions**: Optional - can restrict ingress using `dev_ip_list` or `zscaler_ip_list`.

## Key Files
- `terraform/environments/development/main.tf`: Example of how modules are composed and configured.
- `terraform/modules/web-enrollment/app.tf`: Defines the Azure Static Web App resources.
- `terraform/modules/api-enrollment/app.tf`: Container Apps, ACR, Redis, Dapr, VNet, and API infrastructure.
- `terraform/modules/api-enrollment/CFIK12.Database/DB_Hydration/generate.mjs`: Data seeding logic.
- `terraform/docs/CONTAINER_APPS_SETUP.md`: Complete setup guide with deployment steps, costs, and troubleshooting.
- `terraform/docs/DAPR_INTEGRATION.md`: Dapr SDK examples, state management, pub/sub patterns, and best practices.
- `terraform/docs/ACA_PRODUCTION_READINESS.md`: Production upgrade checklist (zone redundancy, Premium SKUs, multi-region).

## Common Commands
```bash
# Deploy infrastructure
cd terraform/environments/development
terraform init
terraform plan
terraform apply

# Build and push container image
az acr login --name developmentk12acr
az acr build --registry developmentk12acr --image k12-api:latest --file Dockerfile .

# View container logs
az containerapp logs show --name development-app --resource-group development --follow

# Store secret in Key Vault
az keyvault secret set --vault-name developmentapikv --name "my-secret" --value "secret-value"

# Test health checks
curl https://development-app.<hash>.eastus2.azurecontainerapps.io/health/live
```

## Troubleshooting
- **Container won't start**: Check logs with `az containerapp logs show`, verify health check endpoints return HTTP 200.
- **Key Vault access denied**: Verify Managed Identity has "Key Vault Secrets User" role.
- **Image pull fails**: Ensure Container App identity has "AcrPull" role on ACR.
- **Dapr state/pubsub issues**: Check Redis connectivity, verify component configuration in environment.

## PROJECT DOCUMENTATION & CONTEXT SYSTEM
- `terraform/docs/ACA_PRODUCTION_READINESS.md`: Container Apps security and production checklist.
- `terraform/docs/CONTAINER_APPS_SETUP.md`: Complete setup guide with deployment steps, costs, and troubleshooting.
- `terraform/docs/DAPR_INTEGRATION.md`: Dapr SDK examples, state management, pub/sub patterns, and best practices.

## DEBUGGING
- Use the `terraform/validate-deployment.sh` script to check the deployment.
- **Container won't start**: Check logs with `az containerapp logs show`, verify health check endpoints return HTTP 200.
- **Key Vault access denied**: Verify Managed Identity has "Key Vault Secrets User" role.
- **Image pull fails**: Ensure Container App identity has "AcrPull" role on ACR.
- **Dapr state/pubsub issues**: Check Redis connectivity, verify component configuration in environment.

## FINAL DOs AND DON'Ts
- **NEVER** run `terraform apply` from the root or `modules/` directories.
- **ALWAYS** navigate to `terraform/environments/<env>` (e.g., `development`) to run commands.