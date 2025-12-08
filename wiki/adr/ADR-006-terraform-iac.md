# ADR-006: Terraform for Infrastructure as Code

**Status:** Accepted
**Date:** 2024-08-20
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur), DevOps Team
**Technical Story:** Infrastructure provisioning for Azure Government Cloud resources

## Context and Problem Statement

The K12 MyPortal system requires infrastructure across multiple Azure Government Cloud environments:
- Development (dev)
- Testing (test)
- Staging (staging)
- Production (prod)

Resources include:
- Azure Functions (API layer)
- Azure SQL Database
- Azure Storage (ADLS Gen2)
- Azure API Management
- Azure Static Web Apps (4 frontends)
- Azure Key Vault
- Azure Application Insights
- Azure SignalR Service
- Networking (VNets, subnets, NSGs)

Requirements:
- Consistent provisioning across all environments
- Version-controlled infrastructure definitions
- Audit trail for all infrastructure changes
- Support for Azure Government Cloud endpoints
- Ability to preview changes before applying (plan/apply workflow)
- State management for infrastructure drift detection
- Modular, reusable infrastructure components

The question is: which Infrastructure as Code (IaC) tool should we use?

## Decision Drivers

* **Azure Government Support**: Must work with Azure Government Cloud endpoints
* **State Management**: Track infrastructure state and detect drift
* **Plan/Apply Workflow**: Preview changes before applying
* **Modularity**: Reusable modules across environments
* **Community Support**: Large ecosystem and community
* **Team Expertise**: CFI team familiarity
* **Version Control**: Infrastructure definitions as code in Git
* **Multi-Environment**: Manage dev, test, staging, prod consistently
* **Documentation**: Clear, well-documented tool

## Considered Options

1. **Terraform** - HashiCorp's multi-cloud IaC tool
2. **ARM Templates** - Azure Resource Manager JSON templates
3. **Bicep** - Azure's domain-specific language for ARM
4. **Pulumi** - Multi-cloud IaC with general-purpose languages
5. **Azure Portal (Manual)** - Manual resource creation

## Decision Outcome

**Chosen option:** "Terraform", because it provides:
1. Excellent Azure Government Cloud support via AzureRM provider
2. Mature state management with remote backends (Azure Storage)
3. Clear plan/apply workflow for safe infrastructure changes
4. Modular design with reusable modules
5. Large community and ecosystem (Terraform Registry)
6. CFI team already experienced with Terraform
7. Multi-cloud support (future-proofing for potential hybrid scenarios)
8. HCL (HashiCorp Configuration Language) is readable and maintainable

### Consequences

#### Good
- Infrastructure changes are versioned and reviewable in Git
- Plan/apply workflow prevents surprises in production
- State management detects infrastructure drift
- Modules enable consistent patterns across environments
- Azure Government Cloud support is first-class
- Large community for troubleshooting and examples
- Can manage non-Azure resources (SendGrid, PandaDoc integrations)
- Clear dependency graph and resource relationships
- Easy to replicate entire environments

#### Bad
- State management adds complexity (remote state, locking)
- Azure-native features may lag ARM/Bicep by weeks or months
- Terraform state contains sensitive information (requires encryption)
- State file can become corrupted (need backups)
- Learning curve for team members new to Terraform
- Potential for state drift if manual changes made in portal

#### Neutral
- Need to establish state management strategy (Azure Storage)
- Requires discipline to avoid manual portal changes
- Module design requires upfront planning

## Pros and Cons of the Options

### Terraform (Chosen)

* **Pro:** Mature, production-ready IaC tool
* **Pro:** Excellent Azure Government Cloud support
* **Pro:** Plan/apply workflow for safe changes
* **Pro:** State management with drift detection
* **Pro:** Modular design with Terraform Registry
* **Pro:** Multi-cloud support (Azure + others)
* **Pro:** Large community and ecosystem
* **Pro:** HCL is readable and maintainable
* **Pro:** CFI team already experienced
* **Pro:** Works with any CI/CD pipeline
* **Con:** State management complexity
* **Con:** Azure features may lag ARM/Bicep
* **Con:** State file security considerations
* **Con:** Not Azure-native (third-party tool)

### ARM Templates

* **Pro:** Native Azure solution
* **Pro:** Latest Azure features immediately available
* **Pro:** No third-party dependencies
* **Pro:** Integrated with Azure Portal
* **Con:** JSON syntax verbose and hard to read
* **Con:** No state management (harder to detect drift)
* **Con:** Limited modularity (linked templates are clunky)
* **Con:** Azure-only (vendor lock-in)
* **Con:** No plan/preview workflow
* **Con:** Difficult to debug and troubleshoot

### Bicep

* **Pro:** Native Azure solution
* **Pro:** Much better syntax than ARM (cleaner, more readable)
* **Pro:** Latest Azure features immediately available
* **Pro:** Compiles to ARM templates
* **Pro:** Improving rapidly
* **Con:** Newer tool (less mature than Terraform)
* **Con:** Smaller community than Terraform
* **Con:** No state management
* **Con:** Azure-only (vendor lock-in)
* **Con:** Limited modularity compared to Terraform
* **Con:** No plan/preview workflow like Terraform

### Pulumi

* **Pro:** Multi-cloud support
* **Pro:** Use general-purpose languages (TypeScript, Python, Go, C#)
* **Pro:** State management included
* **Pro:** Good Azure support
* **Con:** CFI team not experienced with Pulumi
* **Con:** Smaller community than Terraform
* **Con:** Requires learning Pulumi SDK
* **Con:** More complex than Terraform for simple use cases
* **Con:** State management requires Pulumi Cloud or self-hosted backend

### Azure Portal (Manual)

* **Pro:** No code required
* **Pro:** Immediate visual feedback
* **Pro:** No learning curve
* **Con:** Not version-controlled
* **Con:** No audit trail
* **Con:** Impossible to replicate consistently
* **Con:** Error-prone (manual mistakes)
* **Con:** No infrastructure drift detection
* **Con:** Difficult to manage multiple environments
* **Con:** Not scalable

## Technical Details

### Repository Structure

```
k12-infra/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── test/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   └── ...
│   └── prod/
│       └── ...
├── modules/
│   ├── function-app/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── sql-database/
│   │   └── ...
│   ├── storage-account/
│   │   └── ...
│   ├── static-web-app/
│   │   └── ...
│   └── api-management/
│       └── ...
├── scripts/
│   ├── init.sh
│   ├── plan.sh
│   └── apply.sh
└── README.md
```

### Azure Government Provider Configuration

**environments/prod/backend.tf:**
```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
  }

  # Remote state in Azure Storage (Government Cloud)
  backend "azurerm" {
    resource_group_name  = "k12-terraform-state-rg"
    storage_account_name = "k12tfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
    environment          = "usgovernment"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }

  # Azure Government Cloud
  environment = "usgovernment"
}
```

### Environment Configuration

**environments/prod/main.tf:**
```hcl
locals {
  environment = "prod"
  location    = "usgovvirginia"

  tags = {
    Environment = "Production"
    Project     = "K12 MyPortal"
    ManagedBy   = "Terraform"
    CostCenter  = "SEAA"
  }
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "k12-${local.environment}-rg"
  location = local.location
  tags     = local.tags
}

# Azure SQL Database
module "sql_database" {
  source = "../../modules/sql-database"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  admin_group_object_id = var.sql_admin_group_object_id

  sku_name = "S3"  # Standard tier
  max_size_gb = 250

  tags = local.tags
}

# Storage Account for ADLS Gen2
module "storage_account" {
  source = "../../modules/storage-account"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  account_tier             = "Standard"
  account_replication_type = "GRS"
  enable_hierarchical_namespace = true  # ADLS Gen2

  tags = local.tags
}

# Function App (API)
module "function_app" {
  source = "../../modules/function-app"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  app_name = "k12-api"

  # Connect to SQL Database
  sql_connection_string = module.sql_database.connection_string

  # Connect to Storage Account
  storage_account_name = module.storage_account.name
  storage_account_key  = module.storage_account.primary_access_key

  tags = local.tags
}

# Static Web Apps (all 4 frontends)
module "admin_portal" {
  source = "../../modules/static-web-app"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  app_name = "k12-admin-portal"

  tags = local.tags
}

module "enrollment_portal" {
  source = "../../modules/static-web-app"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  app_name = "k12-enrollment-portal"

  tags = local.tags
}

# Key Vault
module "key_vault" {
  source = "../../modules/key-vault"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  tenant_id = var.tenant_id

  tags = local.tags
}

# Application Insights
module "app_insights" {
  source = "../../modules/app-insights"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  tags = local.tags
}
```

**environments/prod/variables.tf:**
```hcl
variable "sql_admin_group_object_id" {
  description = "Object ID of Azure AD group for SQL admin access"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "Azure AD tenant ID"
  type        = string
}
```

**environments/prod/terraform.tfvars:**
```hcl
# Production variables
sql_admin_group_object_id = "12345678-1234-1234-1234-123456789abc"
tenant_id                 = "87654321-4321-4321-4321-cba987654321"
```

### Reusable Module Example

**modules/function-app/main.tf:**
```hcl
resource "azurerm_service_plan" "this" {
  name                = "k12-${var.app_name}-${var.environment}-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Windows"
  sku_name            = var.sku_name

  tags = var.tags
}

resource "azurerm_windows_function_app" "this" {
  name                = "k12-${var.app_name}-${var.environment}-func"
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.this.id

  storage_account_name       = var.storage_account_name
  storage_account_access_key = var.storage_account_key

  site_config {
    application_stack {
      dotnet_version              = "8.0"
      use_dotnet_isolated_runtime = true
    }

    cors {
      allowed_origins = var.allowed_origins
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"     = "dotnet-isolated"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = var.app_insights_key
    "SqlConnectionString"          = var.sql_connection_string
    "WEBSITE_RUN_FROM_PACKAGE"     = "1"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

# Grant Function App access to SQL Database
resource "azurerm_role_assignment" "sql_contributor" {
  scope                = var.sql_database_id
  role_definition_name = "SQL DB Contributor"
  principal_id         = azurerm_windows_function_app.this.identity[0].principal_id
}
```

**modules/function-app/variables.tf:**
```hcl
variable "environment" {
  description = "Environment name (dev, test, staging, prod)"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "sku_name" {
  description = "SKU name for App Service Plan"
  type        = string
  default     = "EP1"  # Elastic Premium
}

variable "storage_account_name" {
  description = "Storage account name for Function App"
  type        = string
}

variable "storage_account_key" {
  description = "Storage account access key"
  type        = string
  sensitive   = true
}

variable "sql_connection_string" {
  description = "SQL Database connection string"
  type        = string
  sensitive   = true
}

variable "sql_database_id" {
  description = "SQL Database resource ID"
  type        = string
}

variable "app_insights_key" {
  description = "Application Insights instrumentation key"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
```

**modules/function-app/outputs.tf:**
```hcl
output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_windows_function_app.this.name
}

output "function_app_id" {
  description = "Resource ID of the Function App"
  value       = azurerm_windows_function_app.this.id
}

output "function_app_url" {
  description = "URL of the Function App"
  value       = "https://${azurerm_windows_function_app.this.default_hostname}"
}

output "function_app_identity_principal_id" {
  description = "Principal ID of Function App managed identity"
  value       = azurerm_windows_function_app.this.identity[0].principal_id
}
```

### State Management

**State Storage Account (created manually first):**
```bash
# Create resource group for Terraform state
az group create \
  --name k12-terraform-state-rg \
  --location usgovvirginia \
  --cloud AzureUSGovernment

# Create storage account for state
az storage account create \
  --name k12tfstate \
  --resource-group k12-terraform-state-rg \
  --location usgovvirginia \
  --sku Standard_GRS \
  --encryption-services blob \
  --cloud AzureUSGovernment

# Create container for state files
az storage container create \
  --name tfstate \
  --account-name k12tfstate \
  --cloud AzureUSGovernment

# Enable versioning for state file backups
az storage account blob-service-properties update \
  --account-name k12tfstate \
  --enable-versioning true \
  --cloud AzureUSGovernment
```

### Terraform Workflow

**scripts/init.sh:**
```bash
#!/bin/bash
set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./init.sh <environment>"
  exit 1
fi

cd "environments/$ENVIRONMENT"

echo "Initializing Terraform for $ENVIRONMENT..."
terraform init

echo "Validating configuration..."
terraform validate

echo "Formatting code..."
terraform fmt -recursive
```

**scripts/plan.sh:**
```bash
#!/bin/bash
set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./plan.sh <environment>"
  exit 1
fi

cd "environments/$ENVIRONMENT"

echo "Planning changes for $ENVIRONMENT..."
terraform plan -out=tfplan

echo ""
echo "Review the plan above. To apply: ./apply.sh $ENVIRONMENT"
```

**scripts/apply.sh:**
```bash
#!/bin/bash
set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./apply.sh <environment>"
  exit 1
fi

cd "environments/$ENVIRONMENT"

if [ ! -f "tfplan" ]; then
  echo "No plan file found. Run ./plan.sh first."
  exit 1
fi

echo "Applying changes for $ENVIRONMENT..."
terraform apply tfplan

rm tfplan
echo "Changes applied successfully!"
```

### CI/CD Pipeline Integration

**Azure DevOps Pipeline (azure-pipelines.yml):**
```yaml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - environments/prod/**
      - modules/**

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: terraform-prod-vars  # Variable group in Azure DevOps

stages:
  - stage: Plan
    displayName: 'Terraform Plan'
    jobs:
      - job: TerraformPlan
        steps:
          - task: TerraformInstaller@0
            inputs:
              terraformVersion: '1.5.0'

          - task: TerraformTaskV4@4
            displayName: 'Terraform Init'
            inputs:
              provider: 'azurerm'
              command: 'init'
              workingDirectory: '$(System.DefaultWorkingDirectory)/environments/prod'
              backendServiceArm: 'Azure Gov Subscription'
              backendAzureRmResourceGroupName: 'k12-terraform-state-rg'
              backendAzureRmStorageAccountName: 'k12tfstate'
              backendAzureRmContainerName: 'tfstate'
              backendAzureRmKey: 'prod.terraform.tfstate'

          - task: TerraformTaskV4@4
            displayName: 'Terraform Plan'
            inputs:
              provider: 'azurerm'
              command: 'plan'
              workingDirectory: '$(System.DefaultWorkingDirectory)/environments/prod'
              environmentServiceNameAzureRM: 'Azure Gov Subscription'
              commandOptions: '-out=tfplan'

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: '$(System.DefaultWorkingDirectory)/environments/prod/tfplan'
              artifactName: 'tfplan'

  - stage: Apply
    displayName: 'Terraform Apply'
    dependsOn: Plan
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: TerraformApply
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: DownloadPipelineArtifact@2
                  inputs:
                    artifactName: 'tfplan'
                    targetPath: '$(System.DefaultWorkingDirectory)/environments/prod'

                - task: TerraformInstaller@0
                  inputs:
                    terraformVersion: '1.5.0'

                - task: TerraformTaskV4@4
                  displayName: 'Terraform Apply'
                  inputs:
                    provider: 'azurerm'
                    command: 'apply'
                    workingDirectory: '$(System.DefaultWorkingDirectory)/environments/prod'
                    environmentServiceNameAzureRM: 'Azure Gov Subscription'
                    commandOptions: 'tfplan'
```

### Drift Detection

**Scheduled drift detection (runs daily):**
```yaml
# drift-detection-pipeline.yml
schedules:
  - cron: "0 0 * * *"  # Daily at midnight
    displayName: Daily drift detection
    branches:
      include:
        - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: TerraformInstaller@0
    inputs:
      terraformVersion: '1.5.0'

  - task: TerraformTaskV4@4
    displayName: 'Terraform Init'
    inputs:
      provider: 'azurerm'
      command: 'init'
      workingDirectory: '$(System.DefaultWorkingDirectory)/environments/prod'
      backendServiceArm: 'Azure Gov Subscription'

  - task: TerraformTaskV4@4
    displayName: 'Terraform Plan (Detect Drift)'
    inputs:
      provider: 'azurerm'
      command: 'plan'
      workingDirectory: '$(System.DefaultWorkingDirectory)/environments/prod'
      environmentServiceNameAzureRM: 'Azure Gov Subscription'
      commandOptions: '-detailed-exitcode'
    continueOnError: true
    name: drift_check

  - script: |
      if [ $DRIFT_EXITCODE -eq 2 ]; then
        echo "##vso[task.logissue type=warning]Infrastructure drift detected!"
        # Send notification to team
      fi
    displayName: 'Check for Drift'
    env:
      DRIFT_EXITCODE: $(drift_check.exitCode)
```

## Validation

Success will be measured by:
- All Azure resources provisioned consistently across 4 environments
- Infrastructure changes tracked in Git with full audit trail
- No manual resource creation in Azure Portal (100% Terraform-managed)
- State drift detected and corrected within 24 hours
- Plan/apply workflow prevents production surprises
- All infrastructure changes reviewed via PR before merge
- Infrastructure can be replicated to new environment in <1 hour

## Related Decisions

* [ADR-001: Azure Government Cloud](ADR-001-azure-government-cloud.md) - Impacts provider configuration
* [ADR-008: Multi-Schema Database Design](ADR-008-multi-schema-database.md) - Database resources provisioned by Terraform

## References

* [Terraform Documentation](https://www.terraform.io/docs)
* [Terraform Azure Government Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_government)
* [Terraform Best Practices](https://www.terraform-best-practices.com/)
* [Azure DevOps Terraform Tasks](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks)
* [Terraform State Management](https://www.terraform.io/docs/language/state/index.html)

---

**Decision Made:** August 20, 2024
**Implemented:** August 2024
**Repository:** https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-infra
