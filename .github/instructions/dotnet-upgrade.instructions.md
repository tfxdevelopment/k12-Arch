---
description: Instructions for analyzing and upgrading .NET framework versions in a solution
applyTo: "**/*.cs,**/*.csproj,**/*.sln"
---

# .NET Framework Upgrade Instructions

Use these instructions when analyzing and upgrading .NET framework versions in a solution.

## Discovery & Analysis

### Project Classification

1. Identify all projects in the solution using `dotnet sln list`
2. Classify each project by type:
   - `TargetFramework` starts with `netcoreapp`, `net5.0+` → **Modern .NET**
   - `netstandard*` → **.NET Standard** (migrate to current LTS)
   - `net4*` → **.NET Framework** (requires intermediate steps)
3. Analyze each `.csproj` for current `TargetFramework` and SDK usage

### Dependency Analysis

1. Check outdated packages: `dotnet list <project>.csproj package --outdated`
2. Review external and internal dependencies for framework compatibility
3. Identify legacy `packages.config` projects needing migration to `PackageReference`
4. Generate dependency graph: `dotnet msbuild <project>.csproj /t:GenerateRestoreGraphFile /p:RestoreGraphOutputPath=graph.json`

## Upgrade Sequence

### Recommended Order

1. **Independent Libraries**: Start with class libraries having no internal dependencies
2. **Shared Components**: Common utilities and shared projects
3. **API/Web Projects**: APIs, Azure Functions, and web applications
4. **Tests**: Test projects should be upgraded last
5. **CI/CD Pipelines**: Update after all projects compile successfully

### Per-Project Flow

1. Create branch: `upgrade/<project>-to-<targetVersion>`
2. Update `TargetFramework` in `.csproj` to target version
3. Restore and update packages:
   ```bash
   dotnet restore
   dotnet list package --outdated
   dotnet add package <PackageName> --version <LatestVersion>
   ```
4. Build and test:
   ```bash
   dotnet build <Project>.csproj
   dotnet test <Project>.Tests.csproj
   ```
5. Fix issues: deprecated APIs, configuration changes, package incompatibilities
6. Commit and create PR with test evidence

## Breaking Changes & Modernization

### Code Patterns to Update

- `WebHostBuilder` → `HostBuilder`
- `Startup.cs` configuration → `Program.cs` top-level statements
- Synchronous calls → async where appropriate
- Legacy `Microsoft.Azure.*` packages → `Azure.*` packages

### Configuration Updates

- Replace `IWebHostBuilder` with `IHostBuilder` patterns
- Update middleware registration for new APIs
- Migrate from `Configure<T>` to options pattern where needed

## CI/CD Updates

### Azure DevOps

```yaml
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '8.x'  # Update to target version
```

### GitHub Actions

```yaml
- uses: actions/setup-dotnet@v4
  with:
    dotnet-version: '8.x'  # Update to target version
```

## Validation Checklist

- [ ] All `TargetFramework` values updated
- [ ] All NuGet packages compatible and updated
- [ ] Solution builds successfully locally
- [ ] All unit tests pass
- [ ] CI/CD pipeline succeeds
- [ ] Integration tests pass in lower environment
- [ ] No deprecated API warnings in build output
