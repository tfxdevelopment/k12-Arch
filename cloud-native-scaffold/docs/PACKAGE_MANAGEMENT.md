# Central Package Management Guide

## Overview

This project uses **Central Package Management (CPM)** introduced in NuGet 6.2+. This approach provides several benefits:

- **Centralized version management**: All package versions defined in one place
- **Consistent versions**: Ensures all projects use the same package versions
- **Easier updates**: Update versions in one location
- **Reduced merge conflicts**: Fewer version conflicts across projects
- **Transitive dependency pinning**: Lock transitive dependency versions

## File Structure

### Directory.Packages.props

This is the central file that defines all package versions:

```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
    <CentralPackageVersionOverrideEnabled>false</CentralPackageVersionOverrideEnabled>
  </PropertyGroup>

  <ItemGroup Label="Aspire - .NET 10 Preview">
    <PackageVersion Include="Aspire.Hosting.AppHost" Version="10.0.0-preview.1.25118.6" />
    <!-- More packages -->
  </ItemGroup>
</Project>
```

**Key Properties:**

- `ManagePackageVersionsCentrally`: Enables CPM
- `CentralPackageTransitivePinningEnabled`: Locks transitive dependencies
- `CentralPackageVersionOverrideEnabled`: Prevents projects from overriding versions

### Directory.Build.props

Defines shared properties for all projects:

```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <LangVersion>preview</LangVersion>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

### Individual .csproj Files

Project files reference packages **without version attributes**:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="Aspire.Hosting.AppHost" />
    <PackageReference Include="Dapr.AspNetCore" />
    <!-- NO Version attribute needed -->
  </ItemGroup>
</Project>
```

## .NET 10 Preview

This project uses **.NET 10 Preview** for cutting-edge features.

### Installation

```bash
# Download .NET 10 SDK Preview
# Visit: https://dotnet.microsoft.com/download/dotnet/10.0

# Verify installation
dotnet --list-sdks
# Should show: 10.0.xxx-preview
```

### Global.json (Optional)

To lock the SDK version, create `global.json`:

```json
{
  "sdk": {
    "version": "10.0.100-preview.1.25118.6",
    "rollForward": "latestPatch"
  }
}
```

## Aspire 10 Preview

### Key Changes from Aspire 9

1. **Improved Service Discovery**: Enhanced service-to-service communication
2. **Better Azure Integration**: Deeper Azure resource provisioning
3. **Enhanced Dashboard**: More detailed observability
4. **Performance Improvements**: Faster startup and lower overhead

### Package Versions

All Aspire packages are aligned to `10.0.0-preview.1.25118.6`:

```xml
<PackageVersion Include="Aspire.Hosting.AppHost" Version="10.0.0-preview.1.25118.6" />
<PackageVersion Include="Aspire.Hosting.Azure.*" Version="10.0.0-preview.1.25118.6" />
<PackageVersion Include="Aspire.Hosting.Dapr" Version="10.0.0-preview.1.25118.6" />
```

## Managing Package Versions

### Adding a New Package

1. **Add version to Directory.Packages.props**:

```xml
<ItemGroup Label="New Package">
  <PackageVersion Include="Newtonsoft.Json" Version="13.0.3" />
</ItemGroup>
```

2. **Reference in project** (no version):

```xml
<PackageReference Include="Newtonsoft.Json" />
```

### Updating Package Versions

Update versions in `Directory.Packages.props`:

```bash
# Manual update
# Edit Directory.Packages.props and change version

# Or use dotnet CLI (if supported)
dotnet list package --outdated
dotnet outdated  # Requires dotnet-outdated-tool
```

### Overriding a Version (Not Recommended)

If absolutely necessary, enable overrides:

```xml
<!-- In Directory.Packages.props -->
<CentralPackageVersionOverrideEnabled>true</CentralPackageVersionOverrideEnabled>

<!-- In project file -->
<PackageReference Include="SpecialPackage" Version="2.0.0" VersionOverride="2.1.0" />
```

**Warning**: This defeats the purpose of CPM. Use sparingly.

## Package Organization

Packages are organized by category for maintainability:

```xml
<ItemGroup Label="Aspire - .NET 10 Preview">
  <!-- Aspire packages -->
</ItemGroup>

<ItemGroup Label="Dapr">
  <!-- Dapr packages -->
</ItemGroup>

<ItemGroup Label="Microsoft - .NET 10 Preview">
  <!-- Microsoft packages -->
</ItemGroup>

<ItemGroup Label="Azure SDK - Latest">
  <!-- Azure SDK packages -->
</ItemGroup>
```

## Troubleshooting

### Package Restore Issues

```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore

# Build solution
dotnet build
```

### Version Conflicts

If you see version conflicts:

1. Check `Directory.Packages.props` for duplicate entries
2. Ensure all projects use the same `TargetFramework`
3. Run `dotnet list package --vulnerable` to check for vulnerabilities
4. Use `dotnet list package --outdated` to see outdated packages

### Preview Package Feed

.NET 10 preview packages may require the preview feed:

**NuGet.config**:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="dotnet-preview" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet10/nuget/v3/index.json" />
  </packageSources>
</configuration>
```

## Best Practices

### 1. Keep Versions Aligned

For related packages (like Aspire), keep versions aligned:

```xml
<!-- GOOD: All Aspire packages same version -->
<PackageVersion Include="Aspire.Hosting.AppHost" Version="10.0.0-preview.1.25118.6" />
<PackageVersion Include="Aspire.Hosting.Redis" Version="10.0.0-preview.1.25118.6" />

<!-- BAD: Mismatched versions -->
<PackageVersion Include="Aspire.Hosting.AppHost" Version="10.0.0-preview.1.25118.6" />
<PackageVersion Include="Aspire.Hosting.Redis" Version="9.1.0" />
```

### 2. Use Labels for Organization

Organize packages by category:

```xml
<ItemGroup Label="Aspire - .NET 10 Preview">
<ItemGroup Label="Azure SDK - Latest">
<ItemGroup Label="Testing">
```

### 3. Pin Transitive Dependencies

Enable transitive pinning to avoid unexpected updates:

```xml
<CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
```

### 4. Regular Updates

Schedule regular package updates:

```bash
# Check for outdated packages
dotnet list package --outdated

# Update to latest versions
# Manually update Directory.Packages.props
```

### 5. Security Scanning

Check for vulnerable packages:

```bash
dotnet list package --vulnerable
dotnet list package --deprecated
```

## Migration from Individual Package Management

If migrating from traditional package management:

1. **Create Directory.Packages.props**:

```bash
# Extract all package versions
dotnet list package --format json > packages.json
```

2. **Enable CPM**:

```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
</Project>
```

3. **Remove versions from .csproj files**:

```bash
# Manually remove Version attributes from PackageReference elements
```

4. **Test build**:

```bash
dotnet restore
dotnet build
dotnet test
```

## Preview vs. Stable

### When to Use Previews

✅ **Use .NET 10 Preview for:**
- Exploring cutting-edge features
- Providing feedback to Microsoft
- Preparing for future LTS release
- Internal projects with controlled deployments

❌ **Don't Use .NET 10 Preview for:**
- Production workloads
- Critical business applications
- Long-term support requirements

### Stable Alternative

To use stable versions (.NET 9):

**Directory.Build.props**:
```xml
<TargetFramework>net9.0</TargetFramework>
<LangVersion>latest</LangVersion>
```

**Directory.Packages.props**:
```xml
<PackageVersion Include="Aspire.Hosting.AppHost" Version="9.1.0" />
<PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="9.0.1" />
```

## Resources

- [Central Package Management (NuGet Docs)](https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management)
- [.NET 10 Preview Downloads](https://dotnet.microsoft.com/download/dotnet/10.0)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [NuGet Package Versioning](https://learn.microsoft.com/en-us/nuget/concepts/package-versioning)

## Summary

Central Package Management provides:

✅ **Single source of truth** for package versions
✅ **Consistency** across all projects
✅ **Easier maintenance** and updates
✅ **Reduced conflicts** in version control
✅ **Better dependency management**

Combined with .NET 10 and Aspire 10 previews, this architecture is ready for the future of cloud-native development.
