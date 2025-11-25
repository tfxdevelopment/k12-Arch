# .NET 10.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that an .NET 10.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 10.0 upgrade.
3. Upgrade src/K12.ServiceDefaults/K12.ServiceDefaults.csproj
4. Upgrade src/K12.Docs.Api/K12.Docs.Api.csproj
5. Upgrade src/K12.AppHost/K12.AppHost.csproj

## Settings

This section contains settings and data used by execution steps.

### Excluded projects

| Project name                                   | Description                 |
|:-----------------------------------------------|:---------------------------:|

### Aggregate NuGet packages modifications across all projects

NuGet packages used across all selected projects or their dependencies that need version update in projects that reference them.

| Package Name                        | Current Version | New Version | Description                                   |
|:------------------------------------|:---------------:|:-----------:|:----------------------------------------------|
| Aspire.Azure.AI.OpenAI              |   9.0.0         | 13.0.0-preview.1.25560.3 | Recommended for .NET 10.0                     |
| Aspire.Hosting.AppHost              |   9.0.0         | 13.0.0      | Deprecated, recommended for .NET 10.0         |
| Aspire.Hosting.Dapr                 |   9.0.0         | 9.1.0       | Deprecated, recommended for .NET 10.0         |
| Aspire.Hosting.NodeJs               |   9.0.0         | 9.5.2       | Deprecated, recommended for .NET 10.0         |
| Microsoft.Extensions.Http.Resilience|   9.0.0         | 10.0.0      | Recommended for .NET 10.0                     |
| Microsoft.Extensions.ServiceDiscovery|  9.0.0         | 10.0.0      | Deprecated, recommended for .NET 10.0         |
| OpenTelemetry.Instrumentation.AspNetCore| 1.9.0        | 1.14.0      | Recommended for .NET 10.0                     |
| OpenTelemetry.Instrumentation.Http  |   1.9.0         | 1.14.0      | Recommended for .NET 10.0                     |

### Project upgrade details

#### src/K12.ServiceDefaults/K12.ServiceDefaults.csproj modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.Extensions.Http.Resilience should be updated from `9.0.0` to `10.0.0`
  - Microsoft.Extensions.ServiceDiscovery should be updated from `9.0.0` to `10.0.0` (*deprecated*)
  - OpenTelemetry.Instrumentation.AspNetCore should be updated from `1.9.0` to `1.14.0`
  - OpenTelemetry.Instrumentation.Http should be updated from `1.9.0` to `1.14.0`

#### src/K12.Docs.Api/K12.Docs.Api.csproj modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Aspire.Azure.AI.OpenAI should be updated from `9.0.0` to `13.0.0-preview.1.25560.3`

#### src/K12.AppHost/K12.AppHost.csproj modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Aspire.Hosting.AppHost should be updated from `9.0.0` to `13.0.0` (*deprecated*)
  - Aspire.Hosting.Dapr should be updated from `9.0.0` to `9.1.0` (*deprecated*)
  - Aspire.Hosting.NodeJs should be updated from `9.0.0` to `9.5.2` (*deprecated*)
