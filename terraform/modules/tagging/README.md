# Tagging Module

This Terraform module provides a standardized way to generate and manage tags for Azure resources in the K12 infrastructure.

## Features

- Generates consistent base tags (Environment, Project, Owner, CostCenter, ManagedBy, CreatedOn)
- Allows merging additional custom tags
- Ensures tagging compliance across all resources

## Usage

```hcl
module "tagging" {
  source = "../tagging"

  environment     = "development"
  project         = "k12"
  owner           = "CFI-AzureDevOps"
  cost_center     = "IT"
  additional_tags = {
    Module = "api-enrollment"
  }
}

# Use the tags in resources
resource "azurerm_resource_group" "example" {
  name     = "example-rg"
  location = "East US"
  tags     = module.tagging.tags
}
```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|----------|
| environment | Environment name | string | n/a | yes |
| project | Project name | string | "k12" | no |
| owner | Owner or team | string | "CFI-AzureDevOps" | no |
| cost_center | Cost center | string | "IT" | no |
| additional_tags | Custom tags to merge | map(string) | {} | no |

## Outputs

| Name | Description |
|------|-------------|
| tags | Merged tags map |