---
description: Instructions for generating modern Terraform code for Azure deployments
applyTo: '**/*.tf'
---
# Terraform Azure Code Generation Instructions

Follow these guidelines when generating or modifying Terraform code for Azure resources.

## Code Structure

- Use consistent file organization: `main.tf`, `variables.tf`, `outputs.tf`, `providers.tf`, `locals.tf`
- Group related resources in logically named files (e.g., `networking.tf`, `storage.tf`)
- Use `terraform.tfvars` for environment-specific values
- Create modules for reusable components

## Naming Conventions

- Use snake_case for resource names and variables
- Prefix resource names with the Azure resource type abbreviation
- Include environment and region identifiers in names
- Follow Azure naming conventions for the actual resource names

## Variable Definitions

```hcl
variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region for resource deployment"
  type        = string
  default     = "eastus2"
}
```

## Provider Configuration

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

## Resource Patterns

### Use locals for computed values

```hcl
locals {
  resource_prefix = "${var.project}-${var.environment}"
  common_tags = {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "Terraform"
  }
}
```

### Apply consistent tagging

```hcl
resource "azurerm_resource_group" "main" {
  name     = "${local.resource_prefix}-rg"
  location = var.location
  tags     = local.common_tags
}
```

## Best Practices

- Use `count` or `for_each` for conditional or multiple resource creation
- Leverage data sources for existing resources
- Implement proper dependency management with `depends_on` when implicit dependencies aren't sufficient
- Use `lifecycle` blocks for special resource handling
- Enable soft delete and purge protection for Key Vault resources
- Use managed identities instead of service principals where possible

## Outputs

```hcl
output "resource_group_id" {
  description = "The ID of the resource group"
  value       = azurerm_resource_group.main.id
}
```

## Security

- Never hardcode secrets or connection strings
- Use Azure Key Vault for secret management
- Reference secrets using data sources
- Configure private endpoints for PaaS services
- Enable diagnostic settings for auditing

## Formatting

- Run `terraform fmt` before committing
- Run `terraform validate` to check configuration
- Use `terraform plan` to preview changes
