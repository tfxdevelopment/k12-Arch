---
applyTo: '**/*.bicep'
---
# Creating Azure resources using Azure Verified Modules (AVM) for Bicep

When creating Azure resources for Bicep, always use [Azure Verified Modules for Bicep](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/bicep-resource-modules/).

## Discovering AVM Modules

- Browse the [AVM Bicep Module Index](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/bicep-resource-modules/) to find available modules.
- Each module has a dedicated page with usage examples and parameter documentation.
- The source code is available on GitHub at `https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/{service}/{resource}`.

## Using AVM Modules

To reference an AVM module from the Bicep public module registry:

```bicep
module example 'br/public:avm/res/{service}/{resource}:{version}' = {
  name: 'exampleDeployment'
  params: {
    // Required and optional parameters
  }
}
```

## Finding the Latest Version

To find the available versions for a module, query the Microsoft Container Registry (MCR):

```
https://mcr.microsoft.com/v2/bicep/avm/res/{service}/{resource}/tags/list
```

Replace `{service}` and `{resource}` with the appropriate values (e.g., `compute`, `virtual-machine`).

## Module Naming Conventions

AVM modules follow consistent naming conventions:

- **Resource modules**: `avm/res/{service}/{resource}` - Individual Azure resource types
- **Pattern modules**: `avm/ptn/{pattern}` - Architectural patterns combining multiple resources
- **Utility modules**: `avm/utl/{utility}` - Helper modules for common operations

## Best Practices

- Always pin to a specific version to ensure reproducible deployments.
- Review the module's README for required and optional parameters.
- Start with the official examples provided in the module documentation.
- Review the module's outputs to understand what values are available for dependent resources.

## Running Locally

After making changes, always run `bicep lint` to validate your Bicep code and ensure it follows best practices.
