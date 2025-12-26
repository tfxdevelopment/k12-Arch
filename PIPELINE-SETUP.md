# Azure Pipelines CI/CD Setup for K12 Aspire Deployment

This document provides comprehensive setup instructions for the K12 Aspire deployment pipeline to Azure Container Apps.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Pipeline Configuration](#pipeline-configuration)
5. [Deployment Flow](#deployment-flow)
6. [Scripts Reference](#scripts-reference)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

---

## Overview

The Azure Pipelines YAML (`azure-pipelines.yml`) automates the complete deployment workflow for K12 Aspire applications:

- **Build Stage**: Compiles .NET Aspire projects and Angular documentation site
- **Manifest Stage**: Generates Aspire deployment manifest using `azd infra synth`
- **IaC Translation**: Converts manifest to both Terraform and Bicep formats
- **Deployment Stages**: Deploys to Dev (develop branch) or Production (main branch)

### Key Features

- **Multi-stage pipeline** with conditional deployments
- **Aspire manifest generation** via `azd infra synth`
- **Infrastructure as Code** in both Terraform and Bicep
- **Environment-specific** deployments (Dev/Staging/Prod)
- **Artifact management** for manifest and IaC files
- **Automated testing** of build artifacts

---

## Architecture

```
GitHub/ADO Repository
    ↓
Build Stage
├── .NET Aspire Build
│   ├── Install Aspire Workload
│   ├── Restore & Build
│   └── Run Unit Tests
└── Angular Docs Build
    ├── Install Dependencies
    ├── Build Nuxt App
    └── Publish Artifacts
    ↓
Generate Manifest Stage
├── azd infra synth
└── Publish manifest.json
    ↓
Translate IaC Stage
├── Manifest → Terraform (Python script)
│   └── Publish terraform/
└── Manifest → Bicep (Python script)
    └── Publish bicep/
    ↓
Deploy Dev (develop branch)
├── Download Bicep artifacts
└── az deployment group create
    ↓
Deploy Prod (main branch)
├── Download Terraform artifacts
├── terraform init
└── terraform apply
```

---

## Prerequisites

### Azure DevOps / GitHub Requirements

1. **Service Connection**: Create Azure service connection named `K12-Azure-Gov`
   - Subscription: Your Azure subscription
   - Service Principal with appropriate permissions

2. **Environments**: Create two approval environments
   ```
   - K12-Dev (auto-deploy on develop branch)
   - K12-Production (manual approval on main branch)
   ```

3. **Azure Resources**: Pre-create resource groups
   ```
   - k12-dev-rg (Dev environment)
   - k12-prod-rg (Production environment)
   - k12-terraform-state-rg (Terraform state storage)
   ```

### Local Development

1. **.NET 9.0+** with Aspire workload
   ```bash
   dotnet workload install aspire
   ```

2. **Azure Developer CLI (azd)**
   ```bash
   curl -fsSL https://aka.ms/install-azd.sh | bash
   ```

3. **Python 3.8+**
   ```bash
   pip install pyyaml jinja2
   ```

4. **Terraform 1.9+** (for local testing)
   ```bash
   terraform version
   ```

5. **Bicep CLI** (part of Azure CLI)
   ```bash
   az bicep install
   ```

---

## Pipeline Configuration

### Required Service Connection

Create a service connection in Azure DevOps:

```
Project Settings → Service Connections → New Service Connection
├── Authentication method: Service principal (automatic)
├── Scope level: Subscription
├── Subscription: K12-Azure-Gov
├── Resource group: (leave blank for all)
└── Service connection name: K12-Azure-Gov
```

### Assign Service Principal Roles

The service connection requires these Azure RBAC roles:

```
- Contributor (Container Apps, Container Registry, Log Analytics)
- Storage Blob Data Contributor (Terraform state backend)
```

### Create Approval Environments

In Azure DevOps:

```
Pipelines → Environments

K12-Dev:
├── Approval: None (auto-deploy)
└── Deployment record retention: 30 days

K12-Production:
├── Approval: Manual approval required
├── Approvers: Architecture team
└── Deployment record retention: 90 days
```

### Repository Setup

1. Clone the pipeline file to repository root:
   ```
   c:\Projects\CFI\K12\k12-Arch\
   └── azure-pipelines.yml
   ```

2. Create scripts directory:
   ```
   c:\Projects\CFI\K12\k12-Arch\scripts\
   ├── manifest-to-terraform.py
   └── manifest-to-bicep.py
   ```

3. Update repository settings:
   - Branch policies on `main`: Require build to pass
   - Pull request triggers for feature branches

---

## Deployment Flow

### Trigger Conditions

| Branch | Stage | Deployment |
|--------|-------|-----------|
| develop | Build, Manifest, IaC | Deploy to Dev (Bicep) |
| main | Build, Manifest, IaC | Deploy to Prod (Terraform) |
| feature/* | Build only | No deployment |
| release/* | All stages | Manual trigger |

### Build Stage

**Inputs**: Repository code
**Outputs**: Compiled artifacts, test results

```yaml
Jobs:
  - BuildDotnet
    - Install .NET 9.0
    - Install Aspire Workload
    - Restore NuGet packages
    - Build K12.sln
    - Run unit tests

  - BuildAngular
    - Install Node.js 22.x
    - npm ci (clean install)
    - npm run build (Nuxt build)
    - Publish build artifacts
```

### Generate Manifest Stage

**Inputs**: Built .NET Aspire app
**Outputs**: `manifest.json` artifact

```yaml
Job: AspireManifest
  - Install azd CLI
  - Run: azd infra synth --output ./manifest
  - Publish manifest artifact
```

The `azd infra synth` command generates a JSON manifest describing:
- Container images to deploy
- Environment variables and secrets
- Network configuration
- Scaling policies

### Translate IaC Stage

**Inputs**: `manifest.json`
**Outputs**: Terraform and Bicep files

```yaml
Jobs:
  - TranslateToTerraform
    - Download manifest artifact
    - Run: python manifest-to-terraform.py
    - Outputs: main.tf, variables.tf, outputs.tf

  - TranslateToBicep
    - Download manifest artifact
    - Run: python manifest-to-bicep.py
    - Outputs: main.bicep, parameters.bicep, *.bicepparam files
```

### Deploy Dev Stage

**Conditions**: Develop branch + all previous stages passed
**Deployment Type**: Bicep via Azure CLI

```yaml
Steps:
  1. Download bicep artifacts
  2. az deployment group create
     --resource-group k12-dev-rg
     --template-file main.bicep
     --parameters environment=dev
```

**Resources Created**:
- Container App Environment
- Log Analytics Workspace
- Application Insights
- Container App: docs-api
- Container App: docs-site

### Deploy Prod Stage

**Conditions**: Main branch + approval required
**Deployment Type**: Terraform

```yaml
Steps:
  1. Download terraform artifacts
  2. terraform init
     --backend-config="resource_group_name=k12-terraform-state-rg"
     --backend-config="storage_account_name=k12tfstate"
     --backend-config="container_name=tfstate"
     --backend-config="key=k12.terraform.tfstate"
  3. terraform apply (with approval)
```

---

## Scripts Reference

### manifest-to-terraform.py

Converts Aspire manifest JSON to Terraform configuration.

**Usage**:
```bash
python scripts/manifest-to-terraform.py \
  --manifest ./manifest/manifest.json \
  --output ./terraform
```

**Generated Files**:
- `main.tf` - Resource definitions
- `variables.tf` - Input variables with validation
- `outputs.tf` - Output values
- `terraform.tfvars.example` - Example values file

**Features**:
- Automatic variable validation
- Common tags support
- Min/max replica scaling
- Health checks configuration
- Dapr service-to-service communication
- Log Analytics integration

**Example terraform.tfvars**:
```hcl
environment              = "prod"
resource_group_name     = "k12-prod-rg"
location                = "eastus"
container_registry_url  = "k12acr.azurecr.io"
image_tag               = "v1.0.0"
docs_api_min_replicas   = 3
docs_api_max_replicas   = 20
docs_site_min_replicas  = 3
docs_site_max_replicas  = 10

common_tags = {
  Environment = "prod"
  Project     = "K12-Docs"
  CostCenter  = "Operations"
}
```

### manifest-to-bicep.py

Converts Aspire manifest JSON to Bicep templates.

**Usage**:
```bash
python scripts/manifest-to-bicep.py \
  --manifest ./manifest/manifest.json \
  --output ./bicep
```

**Generated Files**:
- `main.bicep` - Main template with all resources
- `parameters.bicep` - Default parameters
- `main.dev.bicepparam` - Development parameters
- `main.staging.bicepparam` - Staging parameters
- `main.prod.bicepparam` - Production parameters

**Features**:
- Managed identity (system-assigned)
- Liveness and readiness probes
- Environment-specific configuration
- Dapr integration
- Multiple scaling rules
- Security best practices

**Deployment Command**:
```bash
az deployment group create \
  --resource-group k12-dev-rg \
  --template-file bicep/main.bicep \
  --parameters @bicep/main.dev.bicepparam
```

---

## Troubleshooting

### Issue: Pipeline Fails at Build Stage

**Problem**: .NET build fails
**Solution**:
```bash
# Verify .NET installation
dotnet --version

# Install Aspire workload
dotnet workload install aspire

# Try building locally
dotnet build K12.sln --configuration Release
```

### Issue: Manifest Generation Fails

**Problem**: `azd infra synth` returns error
**Solution**:
```bash
# Check azd installation
azd version

# Verify Aspire workload
dotnet workload list | grep aspire

# Run azd in verbose mode
azd infra synth --output ./manifest --debug
```

### Issue: Manifest Conversion Fails

**Problem**: Python script fails on manifest.json
**Solution**:
```bash
# Validate manifest JSON
python -m json.tool manifest/manifest.json

# Check Python dependencies
pip install pyyaml jinja2

# Run script with verbose output
python scripts/manifest-to-terraform.py \
  --manifest manifest/manifest.json \
  --output terraform -v
```

### Issue: Terraform Apply Fails

**Problem**: State backend not found
**Solution**:
1. Verify Azure Storage Account:
   ```bash
   az storage account show --resource-group k12-terraform-state-rg \
     --name k12tfstate
   ```

2. Create container if missing:
   ```bash
   az storage container create --account-name k12tfstate \
     --name tfstate
   ```

3. Verify service connection permissions:
   ```bash
   az role assignment list --assignee <service-principal-id>
   ```

### Issue: Bicep Deployment Fails

**Problem**: Resource group or template errors
**Solution**:
```bash
# Validate Bicep template
az bicep build-params --file bicep/main.bicep

# Test deployment with --what-if
az deployment group what-if \
  --resource-group k12-dev-rg \
  --template-file bicep/main.bicep \
  --parameters environment=dev

# Review error details
az deployment group show --resource-group k12-dev-rg \
  --name <deployment-name> --query properties.error
```

### Issue: Container App Not Accessible

**Problem**: 403 Forbidden or timeout
**Solution**:
```bash
# Check Container App status
az containerapp show --resource-group k12-dev-rg \
  --name k12-docs-api-dev

# View logs
az containerapp logs show --resource-group k12-dev-rg \
  --name k12-docs-api-dev --follow

# Verify ingress configuration
az containerapp ingress show --resource-group k12-dev-rg \
  --name k12-docs-api-dev
```

---

## Security Considerations

### Service Principal Permissions

Restrict service connection to minimum required roles:

```bash
# Option 1: Use custom role
az role definition create --role-definition '
{
  "Name": "K12-Aspire-Deployer",
  "IsCustom": true,
  "Description": "Deploy K12 Aspire applications",
  "AssignableScopes": ["/subscriptions/{subscriptionId}"],
  "Permissions": [
    {
      "Actions": [
        "Microsoft.App/containerApps/write",
        "Microsoft.App/managedEnvironments/write",
        "Microsoft.Insights/components/write",
        "Microsoft.OperationalInsights/workspaces/write",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read"
      ]
    }
  ]
}
'

# Option 2: Use built-in roles scoped to resource group
az role assignment create \
  --assignee <service-principal-id> \
  --role "Contributor" \
  --scope "/subscriptions/{sub}/resourceGroups/k12-dev-rg"
```

### Secret Management

1. **Pipeline Variables**:
   - Mark sensitive variables as "secret"
   - Don't hardcode credentials
   - Use Azure Key Vault integration

2. **Container Registry**:
   - Use managed identity for ACR pull
   - Implement ACR Tasks for image building
   - Enable content trust/image signing

3. **Terraform State**:
   - Enable storage account encryption
   - Use SAS token with expiry
   - Implement access controls

### Branch Protection

Configure branch policies:

```
main branch:
├── Require pull request review (2 reviewers)
├── Dismiss stale PR approvals
├── Require status checks to pass
│   └── Build (azure-pipelines)
├── Require up-to-date branches
└── Require deployment to K12-Production

develop branch:
├── Require pull request review (1 reviewer)
└── Require status checks to pass
    └── Build (azure-pipelines)
```

### Logging and Monitoring

Enable audit logging:

```bash
# Enable pipeline audit logs
az devops security group membership add \
  --group-id <project-administrators>

# Monitor deployments
az monitor log-analytics query \
  --workspace k12-docs-logs-prod \
  --analytics-query 'AzureDiagnostics | where ResourceType == "CONTAINERAPP"'
```

---

## Maintenance and Operations

### Regular Tasks

1. **Weekly**: Review pipeline execution logs
2. **Monthly**: Update dependencies (SDKs, packages)
3. **Quarterly**: Review security policies and access
4. **Annually**: Audit Terraform state and costs

### Scaling Configuration

Adjust replica counts in bicepparam files:

```bicep
// Development
param docsApiMinReplicas = 1
param docsApiMaxReplicas = 5

// Production
param docsApiMinReplicas = 3
param docsApiMaxReplicas = 20
```

### Monitoring Endpoints

- **App Insights**: `https://portal.azure.com → Application Insights → k12-docs-insights-{env}`
- **Logs**: `https://portal.azure.com → Log Analytics → k12-docs-logs-{env}`
- **Container Apps**: `https://portal.azure.com → Container Apps → k12-docs-{app}-{env}`

---

## Related Documentation

- **Aspire Documentation**: https://learn.microsoft.com/en-us/dotnet/aspire/
- **Container Apps**: https://learn.microsoft.com/en-us/azure/container-apps/
- **Terraform AzureRM**: https://registry.terraform.io/providers/hashicorp/azurerm/latest
- **Bicep Reference**: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/

---

## Contact and Support

For pipeline issues or questions:
- **DevOps Team**: devops@cfi-nc.com
- **Architecture Team**: Marty Flournory, Sumith Mathur
- **Azure Support**: Azure DevOps admin console
