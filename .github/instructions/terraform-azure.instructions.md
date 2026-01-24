---
applyTo: '**/*.tf'
---
# Terraform for Azure

When generating Terraform code for Azure, follow these guidelines:

## Provider Configuration

Always configure the AzureRM provider with required features:

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
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}
```

## Resource Naming

Follow Azure naming conventions and use consistent patterns:

- Use lowercase with hyphens for Azure resource names
- Include environment, region, and workload identifiers
- Use locals for generating consistent names

```hcl
locals {
  name_prefix = "${var.workload}-${var.environment}-${var.location}"
}

resource "azurerm_resource_group" "main" {
  name     = "rg-${local.name_prefix}"
  location = var.location
  tags     = var.tags
}
```

## Tagging Strategy

Apply consistent tags to all resources:

```hcl
variable "tags" {
  type = map(string)
  default = {
    Environment = "dev"
    ManagedBy   = "Terraform"
    Owner       = "Platform Team"
  }
}
```

## Security Best Practices

1. **Use Managed Identities** instead of service principals
2. **Store secrets in Key Vault** and reference via data sources
3. **Enable Private Endpoints** for PaaS services
4. **Configure Network Security Groups** with explicit rules
5. **Enable diagnostic settings** for all resources

## State Management

Use Azure Storage for remote state:

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "stterraformstate"
    container_name       = "tfstate"
    key                  = "workload.tfstate"
  }
}
```

## Module Usage

Prefer Azure Verified Modules when available:

```hcl
module "storage" {
  source  = "Azure/avm-res-storage-storageaccount/azurerm"
  version = "~> 0.1"

  name                = "st${local.name_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  tags                = var.tags
}
```

## Common Patterns

### Conditional Resources

```hcl
resource "azurerm_private_endpoint" "example" {
  count = var.enable_private_endpoint ? 1 : 0
  # ...
}
```

### Multiple Instances

```hcl
resource "azurerm_subnet" "subnets" {
  for_each = var.subnet_config
  
  name                 = each.key
  address_prefixes     = [each.value.address_prefix]
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
}
```

## Validation

Always run these commands before committing:

```bash
terraform fmt -recursive
terraform validate
terraform plan
```
