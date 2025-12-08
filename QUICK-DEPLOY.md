# Quick Deploy Guide - K12 Aspire to Azure Container Apps

Fast-track deployment guide for development and operations teams.

## Prerequisites Checklist

- [ ] .NET 9.0+ installed
- [ ] Azure CLI installed and authenticated
- [ ] azd CLI installed (`curl -fsSL https://aka.ms/install-azd.sh | bash`)
- [ ] Python 3.8+ installed
- [ ] Terraform 1.9+ installed
- [ ] Resource groups created (k12-dev-rg, k12-prod-rg, k12-terraform-state-rg)
- [ ] Service connection created (K12-Azure-Gov)
- [ ] Container Registry accessible

## 5-Minute Setup

### 1. Install Dependencies

```bash
# .NET Aspire
dotnet workload install aspire

# Python packages
pip install pyyaml jinja2

# Bicep CLI
az bicep install
```

### 2. Generate Manifest

```bash
cd k12-Arch
azd infra synth --output ./infra/manifest
```

### 3. Translate to IaC

```bash
# Generate Terraform
python scripts/manifest-to-terraform.py \
  --manifest ./infra/manifest/manifest.json \
  --output ./infra/terraform

# Generate Bicep
python scripts/manifest-to-bicep.py \
  --manifest ./infra/manifest/manifest.json \
  --output ./infra/bicep
```

### 4. Deploy Development (Bicep)

```bash
# Validate template
az bicep build-params --file infra/bicep/main.dev.bicepparam

# Deploy
az deployment group create \
  --resource-group k12-dev-rg \
  --template-file infra/bicep/main.bicep \
  --parameters @infra/bicep/main.dev.bicepparam
```

### 5. Deploy Production (Terraform)

```bash
cd infra/terraform

# Initialize
terraform init \
  -backend-config="resource_group_name=k12-terraform-state-rg" \
  -backend-config="storage_account_name=k12tfstate" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=k12.terraform.tfstate"

# Plan
terraform plan -var-file=terraform.tfvars.prod

# Apply
terraform apply -var-file=terraform.tfvars.prod
```

## Verify Deployment

```bash
# Get Container App URLs
az containerapp show --resource-group k12-dev-rg \
  --name k12-docs-api-dev \
  --query properties.configuration.ingress.fqdn

# Test API
curl https://<docs-api-fqdn>/health

# View logs
az containerapp logs show --resource-group k12-dev-rg \
  --name k12-docs-api-dev --follow
```

## Common Commands

### View Current Deployments

```bash
# Bicep deployments
az deployment group list --resource-group k12-dev-rg

# Terraform state
terraform state list
terraform state show azurerm_container_app.docs_api
```

### Scale Replicas

```bash
# Update minimum replicas in Bicep
az deployment group create \
  --resource-group k12-dev-rg \
  --template-file infra/bicep/main.bicep \
  --parameters docsApiMinReplicas=2

# Or via Terraform
terraform apply -var="docs_api_min_replicas=2" -auto-approve
```

### Check Logs

```bash
# Real-time logs
az containerapp logs show --resource-group k12-dev-rg \
  --name k12-docs-api-dev --follow

# Log Analytics query
az monitor log-analytics query \
  --workspace k12-docs-logs-dev \
  --analytics-query 'ContainerAppConsoleLogs_CL | tail 50'
```

### Rollback Deployment

```bash
# Bicep - redeploy previous version
az deployment group create \
  --resource-group k12-dev-rg \
  --template-file infra/bicep/main.bicep \
  --parameters imageTag="v1.0.0"

# Terraform - revert and apply
git checkout HEAD~1 infra/terraform/
terraform apply -auto-approve
```

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
dotnet clean
dotnet build K12.sln --configuration Release -v diagnostic

# Install missing workload
dotnet workload install aspire
```

### Manifest Generation Fails

```bash
# Verify Aspire project
ls src/K12.AppHost

# Run with verbose output
azd infra synth --output ./infra/manifest --debug

# Check manifest output
cat infra/manifest/manifest.json | jq .
```

### Deployment Fails

```bash
# Validate template
az bicep build-params --file infra/bicep/main.bicep

# Check resource group
az group show --resource-group k12-dev-rg

# Verify service connection
az account show
```

### Container App Won't Start

```bash
# Check deployment logs
az deployment operation list --resource-group k12-dev-rg \
  --name <deployment-name> --query "[].properties.statusMessage"

# View container logs
az containerapp logs show --resource-group k12-dev-rg \
  --name k12-docs-api-dev --follow --tail 100

# Check ingress
az containerapp ingress show --resource-group k12-dev-rg \
  --name k12-docs-api-dev
```

## Pipeline Deployment

### Push to Repository

```bash
git add azure-pipelines.yml scripts/ infra/
git commit -m "Add Azure Pipelines CI/CD for Aspire deployment"
git push origin develop  # Deploy to dev
git push origin main     # Deploy to prod
```

### Monitor Pipeline

1. Go to Azure DevOps project
2. Select **Pipelines**
3. Find **K12-Aspire-Deploy** pipeline
4. Click running build to view stages

### Manual Trigger

```bash
# Via Azure CLI
az pipelines run \
  --project k12 \
  --branch develop
```

## Environment Variables

### Development

```bash
ASPNETCORE_ENVIRONMENT=Development
LOG_LEVEL=Information
ENABLE_SWAGGER=true
```

### Production

```bash
ASPNETCORE_ENVIRONMENT=Production
LOG_LEVEL=Warning
ENABLE_SWAGGER=false
```

## Cost Estimation

### Monthly Costs (Estimate)

**Development**:
- Container App Environment: $30
- Log Analytics (1GB/day): $50
- Application Insights: $10
- **Total: ~$90/month**

**Production**:
- Container App Environment: $30
- Container App instances (3 x docs-api, 3 x docs-site): $200
- Log Analytics (10GB/day): $500
- Application Insights: $50
- Terraform state storage: $10
- **Total: ~$790/month**

## Getting Help

| Topic | Resource |
|-------|----------|
| Aspire | https://learn.microsoft.com/dotnet/aspire/ |
| Container Apps | https://learn.microsoft.com/azure/container-apps/ |
| Terraform | https://registry.terraform.io/providers/hashicorp/azurerm/ |
| Bicep | https://learn.microsoft.com/azure/azure-resource-manager/bicep/ |
| Azure CLI | https://learn.microsoft.com/cli/azure/ |

## Rollout Checklist

- [ ] Code committed and tested locally
- [ ] Pipeline created and verified
- [ ] Service connection configured
- [ ] Environments created (K12-Dev, K12-Production)
- [ ] Resource groups created
- [ ] Storage account for Terraform state
- [ ] Container Registry accessible
- [ ] Branch policies configured
- [ ] Dev deployment successful
- [ ] Prod deployment approved and successful
- [ ] Monitoring and alerts configured
- [ ] Documentation updated
