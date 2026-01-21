---
applyTo: '**/*.tf'
---
# Creating Azure resources using Azure Verified Modules (AVM) for Terraform

When creating Azure resources for Terraform, always use [Azure Verified Modules for Terraform](https://azure.github.io/Azure-Verified-Modules/indexes/terraform/tf-resource-modules/).

## Discovering AVM Modules

- Browse the [Terraform Registry](https://registry.terraform.io/) and search for modules prefixed with `avm` or filter by Azure partner modules.
- Check the [AVM Terraform Module Index](https://azure.github.io/Azure-Verified-Modules/indexes/terraform/tf-resource-modules/) for the complete list.
- The source code is available on GitHub at `https://github.com/Azure/terraform-azurerm-avm-res-{service}-{resource}`.

## Using AVM Modules

To reference an AVM module from the Terraform Registry:

```hcl
module "example" {
  source  = "Azure/avm-res-{service}-{resource}/azurerm"
  version = "{version}"

  # Required and optional parameters
  enable_telemetry = false
}
```

## Finding the Latest Version

Query the Terraform Registry API for available versions:

```
https://registry.terraform.io/v1/modules/Azure/{module}/azurerm/versions
```

Replace `{module}` with the module name (e.g., `avm-res-compute-virtualmachine`).

## Module Naming Conventions

AVM modules follow consistent naming conventions:

- **Resource modules**: `Azure/avm-res-{service}-{resource}/azurerm` - Individual Azure resource types
- **Pattern modules**: `Azure/avm-ptn-{pattern}/azurerm` - Architectural patterns combining multiple resources
- **Utility modules**: `Azure/avm-utl-{utility}/azurerm` - Helper modules for common operations

## Best Practices

- Always pin to a specific version for reproducible deployments.
- Review the module's inputs and outputs in the Terraform Registry documentation.
- Start with the official examples provided in the module's `examples/` directory.
- Set `enable_telemetry = false` if you don't want to send anonymous usage data.
- Consider using AVM utility modules for common patterns like naming conventions or tagging.
- Follow the requirements for the AzureRM provider version specified by the module.

## Running Locally

After making changes, always run `terraform fmt` and `terraform validate` to format and validate your Terraform code.
