---
applyTo: '**/*.yml,**/*.yaml'
---
# Azure DevOps YAML Pipeline Best Practices

## YAML Pipeline Configuration Principles

### Architecture

- Decompose large monolithic pipelines into modular stage templates
- Use templates for shared logic and task patterns
- Define separate template files for jobs that appear across multiple pipelines
- Implement consistent stage gates for deployments

### Templates and Reuse

- Store templates in dedicated repository or designated folder structure
- Use `extends` for pipeline templates to enforce organizational standards
- Use `template` references for reusable job and step definitions
- Define parameters with defaults and types for template inputs
- Avoid duplicating code across stage/job definitions

## Variable Management

### Variable Best Practices

- Use variable groups for shared secrets and environment configuration
- Reference Azure Key Vault for secrets using Key Vault variable groups
- Define pipeline-level variables in the `variables:` block
- Avoid hardcoding environment-specific values; parameterize instead
- Use variable templates to centralize variable definitions

### Runtime Variables

- Use `$(variableName)` for compile-time and `$[variables.variableName]` for runtime expansion
- Parameterize environment names and conditions
- Use `parameters` instead of `variables` for template inputs

## Stage and Job Design

### Stage Structure

- Organize stages by environment: Build → Dev → Test → Staging → Production
- Use `dependsOn` to control stage sequencing
- Implement approval gates for higher environments
- Group related jobs within each stage

### Job Patterns

- Use `strategy.matrix` to parallelize test execution across configurations
- Use containers for consistent build environments
- Limit job-level dependencies to avoid unnecessary serialization
- Use agent pools efficiently with appropriate demands

## Task Usage

### Best Practices for Tasks

- Prefer built-in Azure DevOps tasks over custom scripts for common operations
- Pin task versions to major versions (e.g., `task@2`) for stability
- Use inline scripts only for simple logic; extract complex logic to scripts
- Pass secrets as task inputs or environment variables, not as script arguments

### Common Tasks

- Use `UseDotNet@2` to set up .NET SDK version
- Use `DotNetCoreCLI@2` for restore, build, test, and publish steps
- Use `AzureCLI@2` for Azure resource management
- Use `PublishPipelineArtifact@1` for publishing artifacts

## Conditional Execution

- Use `condition: succeeded()` as baseline; override when needed
- Implement environment-specific logic using runtime expressions
- Use `eq(variables['Build.SourceBranch'], 'refs/heads/main')` patterns
- Avoid nested `if/else`; prefer flat condition checks

## Security and Compliance

- Limit pipeline access using pipeline authorization settings
- Store secrets in Azure Key Vault or secure variable groups
- Use service connections with least-privilege roles
- Avoid storing tokens, credentials, or keys in YAML files
- Enable logging and auditing for approval gates

## Artifact and Deployment Patterns

### Artifact Handling

- Use `PublishPipelineArtifact` to persist build outputs
- Use `DownloadPipelineArtifact` in deployment jobs to retrieve artifacts
- Separate build artifacts from deployment configuration
- Name artifacts meaningfully for traceability

### Deployment Jobs

- Use `deployment` job type for deployments to environments
- Define `environment` resources with approval policies
- Use `strategy.runOnce`, `rolling`, or `canary` as appropriate
- Implement health checks as post-deployment gates

## Naming Conventions

- Use PascalCase for stages and jobs
- Use camelCase for variables and parameters
- Prefix template files with their purpose (e.g., `build-template.yml`)
- Use clear environment names in stage identifiers
