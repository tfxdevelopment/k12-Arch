# Development Guide

## Prerequisites

### Backend Development (.NET 8 Azure Functions)

**Required Software**:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Azure Functions Core Tools v4](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- SQL Server (local SQLExpress or Docker container)
- Azurite (optional, for Azure Storage emulation)

**Setup Steps**:
1. Clone repository: `git clone https://CFI-AzureDevOps@dev.azure.com/CFI-AzureDevOps/K12/_git/k12-api-enrollment`
2. Obtain `local.settings.json` from team (contains connection strings, secrets)
3. Configure SQL connection string
4. Request IP whitelisting for Azure SQL database access
5. Run `az login` for Azure AD authentication

**Mac M1/M2/M3 Users**:
If encountering ARM64 compatibility issues:
```bash
# Remove existing dotnet installations
sudo rm -rf /usr/local/share/dotnet
sudo rm -rf /etc/dotnet
sudo rm -rf ~/.dotnet

# Reinstall .NET SDK for ARM64, then:
npm uninstall -g azure-functions-core-tools@3
brew tap azure/functions
brew install azure-functions-core-tools@4
```

**Run Locally**:
```bash
cd k12-api-enrollment/Enrollment
func start
```

See: [k12-api-enrollment/README.md](../../../k12-api-enrollment/README.md)

### Frontend Development (Angular 19 + Nx)

**Required Software**:
- Node.js: `^18.19.1 || ^20.11.1 || ^22.0.0`
- nvm (recommended for version management)
- Angular CLI: `npm install -g @angular/cli@18.2.1`

**Mac Users**:
```bash
# Install Xcode tools
xcode-select --install

# Install and configure nvm
brew install nvm
nvm install v20.17.0
nvm alias default node

# Global Angular CLI
npm install -g @angular/cli@18.2.1
```

**Windows Users**:
- Install Node.js from [nodejs.org](https://nodejs.org/en/download/package-manager)
- Global Angular CLI: `npm install -g @angular/cli@18.2.1`

**Setup Steps**:
```bash
cd k12-web-enrollment
npm install

# CRITICAL: Build shared library first
npm run build:shared
# OR: ng build shared

# Start specific application
npm run start:admin      # https://localhost:4200
npm run start:enrollment # http://localhost:4300
npm run start:providers  # http://localhost:4500
npm run start:schools    # http://localhost:4600
```

**Important**: Any change to the `shared` library requires:
1. Stop dev server
2. Rebuild shared: `npm run build:shared`
3. Restart dev server

See: [k12-web-enrollment/README.md](../../../k12-web-enrollment/README.md)

### Infrastructure Development (Terraform)

**Required Software**:
- [Terraform](https://developer.hashicorp.com/terraform/install)
- Azure CLI (authenticated)

**Windows Installation**:
1. Download Terraform from official site
2. Extract `terraform.exe`
3. Place in directory on your `$PATH`
4. Restart terminals/editors

See: [k12-infra/terraform/README.md](../../../k12-infra/terraform/README.md)

### API Testing (Postman/Newman)

**Required Software**:
- Node.js (for Newman CLI)

**Setup**:
```bash
cd k12-test-api-postman
npm install

# Run tests
newman run <collection.json> -e <environment.json>

# Examples:
newman run development/development_admin.collection.json \
  -e development/development.environment.json
```

See: [k12-test-api-postman/README.md](../../../k12-test-api-postman/README.md)

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/K12-123-description

# Make changes, commit frequently
git add .
git commit -m "K12-123: Description of change"

# Push to remote
git push origin feature/K12-123-description

# Create Pull Request to development
```

### 2. Code Review Process

**PR Requirements**:
- [ ] Linked to Jira ticket (K12-XXX)
- [ ] All tests passing
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Reviewed by at least 1 team member

**PR Checklist**:
- [ ] No secrets in code
- [ ] No large files committed
- [ ] Migration scripts reviewed (if applicable)
- [ ] Breaking changes documented

### 3. Testing Strategy

#### Backend Tests (MSTest)
```bash
cd k12-api-enrollment
dotnet test
```

**Test Projects**:
- `EnrollmentTests/`
- `CFIK12.ApplicationTests/`
- `SchoolTests/`
- `PartnerTests/`

**Important**: Large test files like `AdminAppTests.cs` (82KB) contain complex workflow tests.

#### Frontend Tests (Jest)
```bash
cd k12-web-enrollment
npm test                    # All tests
nx test admin               # Specific project
nx test providers
```

**Test Location**: `*.spec.ts` files alongside components

#### API Integration Tests (Newman)
```bash
cd k12-test-api-postman

# Development environment
newman run development/development_admin.collection.json \
  -e development/development.environment.json

# Testing environment
newman run testing/testing_provider.collection.json \
  -e testing/testing.environment.json
```

**Complex Test Folders** (`testing-admin/`):
- `ReviewComponentValidation` - Program component rules
- `PublishEnrollment` - Enrollment publishing API
- `ReviewEnrollmentComponent` - GetFinalPrompt API
- `GetEnrollmentSessionPrompt` - Session prompt validation
- `SubmitCompletedEnrollment` - Enrollment submission flows

### 4. Database Development

#### Running Local SQL Server (Docker)
```bash
cd k12-api-enrollment/CFIK12.Database
./build-docker.sh

# Connection info:
# Server: localhost
# User: sa
# Password: YourStrong!Passw0rd
```

#### Updating Entity Framework Models

**CAUTION**: Database at connection string may be behind other developers' work

```bash
cd k12-api-enrollment

# Install tool (if not already)
dotnet tool install --global EntityFrameworkCore.Generator

# Generate models
efg generate -c <ConnectionString>
```

**Important**:
- EF is used ONLY for model generation
- Data access uses Dapper
- Review changes carefully before committing

## CI/CD Pipelines

### Backend Pipelines

| Pipeline | Trigger | Environment | YAML File |
|----------|---------|-------------|-----------|
| **Manual Deploy** | Manual | Any | `api-enrollment-manual-pipeline.yaml` |
| **Development** | PR merge to `development` | Development | `api-enrollment-development-pipeline.yaml` |
| **Testing** | PR merge to `testing` | Testing | `api-enrollment-testing-pipeline.yaml` |
| **Staging** | Manual | Staging | `api-enrollment-staging-pipeline.yaml` |

**Rules**:
- Feature branches → `development` (auto-deploy to dev)
- `development` → `testing` (auto-deploy to testing)
- Feature branches **CANNOT** merge directly to `testing`

### Frontend Pipelines

Separate pipelines for each app:
- `admin-pipeline.yaml`
- `providers-pipeline.yaml`
- `schools-pipeline.yaml`
- `household-pipeline.yaml`

**Pipeline Steps**:
1. `npm install`
2. `nx build <app>`
3. `npm test` (Jest)
4. ESLint validation
5. Deploy to Azure Static Web Apps

### Other Pipelines

- `swagger-to-apim-pipeline.yml` - OpenAPI to Azure API Management
- `apim-policy-pipeline.yml` - API Management policy updates

### QueryBuilder Analytics Pipelines (Aspire + Azure Container Apps)

The QueryBuilder analytics platform uses **.NET Aspire** for orchestration and deploys to **Azure Container Apps** via Azure Pipelines.

#### Aspire Manifest Generation

Aspire generates a deployment manifest that describes all services, containers, and their relationships:

```bash
# Navigate to AppHost project
cd k12-querybuilder/K12.QueryBuilder.AppHost

# Generate manifest (saves as artifact in CI/CD)
dotnet run --publisher manifest --output-path ./aspire-manifest.json

# OR use the new aspire CLI (Aspire 9.2+)
aspire publish --publisher manifest -o ./output
```

**Manifest contains:**
- Container definitions (Cube.js, Trino, Metabase, Redis)
- Service bindings and ports
- Environment variables with placeholder references
- Connection strings for inter-service communication

#### Azure Pipelines Deployment Workflow

```yaml
# azure-pipelines-querybuilder.yml
trigger:
  branches:
    include:
      - development
      - main
  paths:
    include:
      - 'k12-querybuilder/**'

pool:
  vmImage: 'ubuntu-latest'

variables:
  azureSubscription: 'K12-Azure-Service-Connection'
  containerRegistry: 'k12acr.azurecr.io'
  resourceGroup: 'rg-k12-querybuilder-$(environment)'

stages:
  - stage: Build
    displayName: 'Build & Generate Manifest'
    jobs:
      - job: BuildAndPublish
        steps:
          # Install .NET 10 SDK
          - task: UseDotNet@2
            inputs:
              version: '10.x'
              includePreviewVersions: true

          # Install Aspire workload
          - script: dotnet workload install aspire
            displayName: 'Install Aspire Workload'

          # Restore dependencies
          - script: dotnet restore
            workingDirectory: 'k12-querybuilder'
            displayName: 'Restore Dependencies'

          # Build solution
          - script: dotnet build --configuration Release --no-restore
            workingDirectory: 'k12-querybuilder'
            displayName: 'Build Solution'

          # Generate Aspire manifest
          - script: |
              dotnet run --project K12.QueryBuilder.AppHost \
                --publisher manifest \
                --output-path $(Build.ArtifactStagingDirectory)/aspire-manifest.json
            workingDirectory: 'k12-querybuilder'
            displayName: 'Generate Aspire Manifest'

          # Build container images
          - script: |
              dotnet publish K12.QueryBuilder.API \
                --os linux --arch x64 \
                -p:ContainerRegistry=$(containerRegistry) \
                -p:ContainerImageTag=$(Build.BuildId)
            workingDirectory: 'k12-querybuilder'
            displayName: 'Build Container Images'

          # Login to Azure Container Registry
          - task: Docker@2
            inputs:
              containerRegistry: $(containerRegistry)
              command: 'login'
            displayName: 'Login to ACR'

          # Push container images
          - script: |
              docker push $(containerRegistry)/k12-query-api:$(Build.BuildId)
              docker push $(containerRegistry)/k12-query-api:latest
            displayName: 'Push Images to ACR'

          # Publish manifest as artifact
          - publish: $(Build.ArtifactStagingDirectory)/aspire-manifest.json
            artifact: 'aspire-manifest'
            displayName: 'Publish Manifest Artifact'

  - stage: DeployDev
    displayName: 'Deploy to Development'
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/development'))
    jobs:
      - deployment: DeployToContainerApps
        environment: 'k12-querybuilder-dev'
        strategy:
          runOnce:
            deploy:
              steps:
                # Download manifest artifact
                - download: current
                  artifact: 'aspire-manifest'

                # Deploy using Azure CLI
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: $(azureSubscription)
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      # Deploy Container Apps using manifest
                      az containerapp update \
                        --name k12-query-api \
                        --resource-group $(resourceGroup) \
                        --image $(containerRegistry)/k12-query-api:$(Build.BuildId)
                  displayName: 'Deploy to Container Apps'
```

#### Azure Developer CLI (azd) Integration

For simplified deployment, configure Azure Pipelines with `azd`:

```bash
# One-time setup: Configure Azure Pipeline
cd k12-querybuilder/K12.QueryBuilder.AppHost
azd pipeline config --provider azdo

# This creates:
# - Service connection to Azure
# - Pipeline YAML file
# - Environment variables/secrets
```

**Pipeline generated by azd:**
```yaml
# .azdo/pipelines/azure-dev.yml (auto-generated)
stages:
  - stage: Provision
    jobs:
      - job: provision
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: $(AZURE_SERVICE_CONNECTION)
              scriptType: bash
              scriptLocation: inlineScript
              inlineScript: |
                azd provision --no-prompt

  - stage: Deploy
    jobs:
      - job: deploy
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: $(AZURE_SERVICE_CONNECTION)
              scriptType: bash
              scriptLocation: inlineScript
              inlineScript: |
                azd deploy --no-prompt
```

#### Container Registry Configuration

Images are pushed to **Azure Container Registry (ACR)**:

| Image | Description | Registry Path |
|-------|-------------|---------------|
| `k12-query-api` | Query API (.NET 10) | `k12acr.azurecr.io/k12-query-api` |
| `k12-cubejs` | Cube.js semantic layer | `k12acr.azurecr.io/k12-cubejs` |
| `k12-trino` | Trino query federation | `k12acr.azurecr.io/k12-trino` |
| `k12-metabase` | Metabase BI (optional) | `k12acr.azurecr.io/k12-metabase` |

**ACR Authentication:**
```bash
# CI/CD uses managed identity or service principal
az acr login --name k12acr

# Local development uses Docker credential helper
docker login k12acr.azurecr.io
```

See: [ASPIRE-01: AppHost Setup](../09-proposed-architecture/02-aspire/ASPIRE-01-apphost-setup.md) for detailed Aspire configuration.

## Code Standards

### Backend (.NET)

**Naming Conventions**:
- Classes: PascalCase
- Methods: PascalCase
- Private fields: `_camelCase`
- Constants: UPPER_SNAKE_CASE

**Project Structure**:
```
API/                    # HTTP triggers (Admin.cs, Programs.cs)
Application/            # Business logic (*App.cs)
Infrastructure/         # External services
Domain/                 # Models, validators, enums
```

**Important Files** (large/complex):
- `API/Programs.cs` (41KB)
- `API/Tasks.cs` (33KB)
- `API/Communications.cs` (26KB)
- `Application/AdminApp.cs` (57KB)

### Frontend (Angular/TypeScript)

**Naming Conventions**:
- Components: `kebab-case.component.ts`
- Services: `kebab-case.service.ts`
- Interfaces: PascalCase (prefix with `I` optional)
- Constants: UPPER_SNAKE_CASE

**Shared Library**:
- Located in `projects/shared/`
- Must be built before running any app
- Changes require rebuild + dev server restart

**Component Structure**:
```typescript
// Good
@Component({
  selector: 'app-feature-name',
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.scss']
})

// Services use RxJS for reactive state
private dataSubject = new BehaviorSubject<Data>(initialData);
public data$ = this.dataSubject.asObservable();
```

### SQL

**Naming Conventions**:
- Tables: PascalCase
- Columns: PascalCase
- Stored Procedures: `usp_PascalCase`
- Functions: `fn_PascalCase`

**Schema Organization**:
- `dbo` - Core tables
- `Enrollment` - Enrollment management
- `Households` - Household data
- `Awards` - Awards system
- `Comms` - Communications

## Security Best Practices

### Never Commit Secrets
- Use `local.settings.json` (backend) - **gitignored**
- Use environment files (frontend) - **gitignored**
- Use Azure Key Vault for production secrets

### Authentication
- **Backend**: EntraAuthenticationMiddleware validates JWT tokens
- **Frontend**: MSAL Angular for Azure AD authentication
- **API**: All endpoints require authentication (except health checks)

### Authorization
- Use custom security attributes for fine-grained access
- Implement defense-in-depth (APIM → API → RLS)
- Log all authorization decisions

### OWASP Top 10
- ✅ Injection: Use parameterized queries (Dapper)
- ✅ XSS: Angular sanitizes templates by default
- ✅ CSRF: MSAL handles CSRF tokens
- ✅ Sensitive Data: Encrypt at rest and in transit
- ✅ Broken Access Control: Hub & Spoke model

## Common Development Tasks

### Add a New Azure Function Endpoint

1. Create HTTP trigger in `API/` folder
2. Implement business logic in `Application/` layer
3. Use Dapper for data access
4. Add AutoMapper profile if needed
5. Add FluentValidation validators
6. Write unit tests
7. Update Swagger annotations

### Add a New Angular Component (Shared Library)

```bash
cd k12-web-enrollment

# Generate component in shared library
ng generate component projects/shared/src/lib/shared_components/my-component

# Build shared library
npm run build:shared

# Import in app
import { MyComponent } from 'shared';
```

### Add a New Database Migration

**Important**: Coordinate with team to avoid conflicts

1. Create SQL migration script
2. Test on local database
3. Submit for review
4. Apply to dev environment
5. Re-run `efg generate` to update models
6. Commit updated models

### Grant Azure Function Access to SQL Database

```sql
-- Run in target SQL database
CREATE USER [<function-app-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<function-app-name>];
ALTER ROLE db_datawriter ADD MEMBER [<function-app-name>];
GRANT EXECUTE TO [<function-app-name>];

-- Example:
CREATE USER [dev-api-enrollment] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [dev-api-enrollment];
ALTER ROLE db_datawriter ADD MEMBER [dev-api-enrollment];
GRANT EXECUTE TO [dev-api-enrollment];
```

## Troubleshooting

### Backend Issues

**Issue**: `func start` fails with "Can't determine Project to build"
```bash
# Uninstall npm version
npm uninstall -g azure-functions-core-tools@3

# Reinstall via brew (Mac)
brew tap azure/functions
brew install azure-functions-core-tools@4
```

**Issue**: SQL connection timeout
- Verify IP is whitelisted in Azure SQL firewall
- Check connection string in `local.settings.json`
- Ensure `az login` is current

### Frontend Issues

**Issue**: Module not found from `shared` library
```bash
# Rebuild shared library
npm run build:shared

# Restart dev server
npm run start:admin
```

**Issue**: Port already in use
```bash
# Kill process on port 4200 (example)
# Windows:
netstat -ano | findstr :4200
taskkill /PID <pid> /F

# Mac/Linux:
lsof -ti:4200 | xargs kill -9
```

## Additional Resources

### Documentation
- [CLAUDE.md](../../../CLAUDE.md) - Project instructions for AI assistance
- [API README](../../../k12-api-enrollment/README.md)
- [Web README](../../../k12-web-enrollment/README.md)
- [Infra README](../../../k12-infra/terraform/README.md)
- [Testing README](../../../k12-test-api-postman/README.md)

### External Links
- [Azure DevOps Project](https://dev.azure.com/CFI-AzureDevOps/K12)
- [Confluence Space](https://cfi-nc.atlassian.net/wiki/spaces/KR)
- [Jira Board](https://cfi-nc.atlassian.net/jira/software/c/projects/K12)

### Team Contacts
- **Architecture**: Marty Flournory, Sumith Mathur
- **Backend**: Pete Rau (Technical Lead)
- **Frontend**: Kwame Amponsah (UX Design Lead)
- **DevOps**: CFI DevOps Team
- **QA**: Jennifer Sills (SEAA QA Lead)

---

*For development questions, reach out in the team Slack channel or create a Jira ticket.*
