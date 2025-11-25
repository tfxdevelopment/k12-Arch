# K12 Aspire Deployment Pipeline - Complete Architecture

This document provides technical architecture details for the Azure Pipelines CI/CD solution.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Pipeline Workflow](#pipeline-workflow)
3. [IaC Translation Strategy](#iac-translation-strategy)
4. [Deployment Patterns](#deployment-patterns)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Security Architecture](#security-architecture)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Git Repository                            │
│  (main / develop / feature branches)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Azure Pipelines                                  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Build      │→ │  Manifest    │→ │  Translate   │           │
│  │   Stage      │  │  Generation  │  │   IaC        │           │
│  └──────────────┘  └──────────────┘  └──────┬───────┘           │
│                                              │                  │
│                              ┌───────────────┼───────────────┐   │
│                              ▼               ▼               ▼   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Deploy Stage (Conditional)                               │   │
│  │                                                          │   │
│  │ ┌────────────────┐           ┌────────────────┐        │   │
│  │ │  Dev (Bicep)   │           │ Prod (Terraform)         │   │
│  │ └────────┬────────┘           └────────┬────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                                      │
         │ (develop)                            │ (main)
         ▼                                      ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│   Azure (Dev Environment)    │    │ Azure (Prod Environment)     │
│                              │    │                              │
│ k12-dev-rg                   │    │ k12-prod-rg                  │
│ ┌────────────────────────┐   │    │ ┌────────────────────────┐   │
│ │ Container Apps Env     │   │    │ │ Container Apps Env     │   │
│ │ - Docs API             │   │    │ │ - Docs API             │   │
│ │ - Docs Site            │   │    │ │ - Docs Site            │   │
│ │ - Log Analytics        │   │    │ │ - Log Analytics        │   │
│ │ - App Insights         │   │    │ │ - App Insights         │   │
│ └────────────────────────┘   │    │ └────────────────────────┘   │
└──────────────────────────────┘    └──────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Source Control** | Git (GitHub/Azure DevOps) | Latest | Code versioning |
| **CI/CD** | Azure Pipelines | Latest | Orchestration |
| **Build** | .NET SDK | 9.0 | Aspire project compilation |
| **Manifest Generation** | Azure Developer CLI (azd) | Latest | Infrastructure manifest |
| **IaC Translation** | Python 3.8+ | - | Manifest to Terraform/Bicep |
| **Infrastructure (Dev)** | Azure Bicep | Latest | Infrastructure as Code |
| **Infrastructure (Prod)** | Terraform | 1.9+ | State-managed infrastructure |
| **Compute** | Azure Container Apps | Latest | Containerized applications |
| **Observability** | Log Analytics + App Insights | Latest | Monitoring and logging |

---

## Pipeline Workflow

### Stage 1: Build

**Objectives**:
- Compile .NET Aspire applications
- Build Angular documentation site
- Validate builds with unit tests

**Build Stage Flow**:

```
BuildDotnet Job:
  ├── UseDotNet@2 (Install .NET 9.0)
  ├── dotnet workload install aspire
  ├── dotnet restore K12.sln
  ├── dotnet build K12.sln --configuration Release
  └── dotnet test K12.sln

BuildAngular Job (Parallel):
  ├── NodeTool@0 (Install Node.js 22.x)
  ├── npm ci (clean install)
  ├── npm run build (Nuxt build)
  └── PublishPipelineArtifact (docs-site-build)
```

**Artifacts Generated**:
- Compiled binaries
- Build logs
- Test results
- Angular site build (`docs-site-build`)

**Success Criteria**:
- All .NET builds complete without errors
- Unit tests pass (>90% pass rate)
- Angular build completes with no critical warnings
- All artifacts published

### Stage 2: Generate Manifest

**Objectives**:
- Generate Aspire deployment manifest
- Capture containerization requirements
- Define environment-specific settings

**Manifest Generation Flow**:

```
AspireManifest Job:
  ├── UseDotNet@2 (Install .NET 9.0)
  ├── Install Tools
  │   ├── dotnet workload install aspire
  │   └── dotnet tool install -g azd
  ├── azd infra synth --output ./manifest
  │   └── Outputs: manifest.json
  └── PublishPipelineArtifact (aspire-manifest)
```

**Manifest Contents**:
```json
{
  "containers": {
    "docs-api": {
      "image": "k12acr.azurecr.io/docs-api:latest",
      "env": {
        "ASPNETCORE_ENVIRONMENT": "dev"
      }
    },
    "docs-site": {
      "image": "k12acr.azurecr.io/docs-site:latest",
      "env": {
        "NODE_ENV": "dev"
      }
    }
  },
  "resources": {
    "logAnalytics": {},
    "appInsights": {},
    "containerAppEnv": {}
  }
}
```

**Artifacts Generated**:
- `manifest.json` (Aspire deployment manifest)

**Success Criteria**:
- manifest.json validates against Aspire schema
- All required containers defined
- Environment variables properly configured

### Stage 3: Translate IaC

**Objectives**:
- Convert manifest to Terraform
- Convert manifest to Bicep
- Generate parameter files for each environment

**TranslateToTerraform Job**:

```
TranslateToTerraform Job:
  ├── DownloadPipelineArtifact (aspire-manifest)
  ├── UsePythonVersion@0 (Install Python 3.x)
  ├── python manifest-to-terraform.py
  │   ├── Generates: main.tf
  │   ├── Generates: variables.tf
  │   ├── Generates: outputs.tf
  │   └── Generates: terraform.tfvars.example
  └── PublishPipelineArtifact (terraform-iac)
```

**TranslateToBicep Job**:

```
TranslateToBicep Job:
  ├── DownloadPipelineArtifact (aspire-manifest)
  ├── UsePythonVersion@0 (Install Python 3.x)
  ├── python manifest-to-bicep.py
  │   ├── Generates: main.bicep
  │   ├── Generates: parameters.bicep
  │   ├── Generates: main.dev.bicepparam
  │   ├── Generates: main.staging.bicepparam
  │   └── Generates: main.prod.bicepparam
  └── PublishPipelineArtifact (bicep-iac)
```

**Artifacts Generated**:
- Terraform files (main.tf, variables.tf, outputs.tf)
- Bicep template (main.bicep)
- Parameter files (.bicepparam for each environment)

**Success Criteria**:
- Terraform files validate with `terraform validate`
- Bicep templates validate with `az bicep validate`
- All parameters properly templated

### Stage 4: Deploy (Conditional)

#### Dev Deployment (Develop Branch)

**Conditions**:
- Build successful
- Manifest generated
- IaC translated
- Source branch is `develop`

**DeployACA_Dev Job**:

```
DeployACA_Dev Job:
  ├── DownloadPipelineArtifact (bicep-iac)
  ├── AzureCLI@2
  │   └── az deployment group create
  │       ├── --resource-group k12-dev-rg
  │       ├── --template-file main.bicep
  │       ├── --parameters environment=dev
  │       └── Deploys Container Apps, Log Analytics, App Insights
  └── Approval (automatic)
```

**Resources Deployed**:
1. **Log Analytics Workspace**
   - Name: k12-docs-logs-dev
   - SKU: PerGB2018
   - Retention: 30 days

2. **Application Insights**
   - Name: k12-docs-insights-dev
   - Type: web
   - Linked to Log Analytics

3. **Container Apps Environment**
   - Name: k12-docs-env-dev
   - Dapr enabled
   - Monitoring configured

4. **Docs API Container App**
   - Name: k12-docs-api-dev
   - Image: k12acr.azurecr.io/docs-api:latest
   - CPU: 0.25
   - Memory: 0.5Gi
   - Min replicas: 1
   - Max replicas: 5

5. **Docs Site Container App**
   - Name: k12-docs-site-dev
   - Image: k12acr.azurecr.io/docs-site:latest
   - CPU: 0.5
   - Memory: 1.0Gi
   - Min replicas: 1
   - Max replicas: 3

#### Production Deployment (Main Branch)

**Conditions**:
- Build successful
- Manifest generated
- IaC translated
- Source branch is `main`
- Approval from K12-Production environment

**DeployACA_Prod Job**:

```
DeployACA_Prod Job:
  ├── DownloadPipelineArtifact (terraform-iac)
  ├── TerraformInstaller@0 (Install Terraform 1.9.0)
  ├── TerraformTaskV4@4 (init)
  │   ├── -backend-config="resource_group_name=k12-terraform-state-rg"
  │   ├── -backend-config="storage_account_name=k12tfstate"
  │   ├── -backend-config="container_name=tfstate"
  │   └── -backend-config="key=k12.terraform.tfstate"
  ├── TerraformTaskV4@4 (plan)
  │   └── Generates execution plan
  ├── Approval (manual)
  └── TerraformTaskV4@4 (apply)
      └── Deploys resources
```

**Resources Deployed**:
- Same as Dev, but with production scaling:
  - Docs API: 3-20 replicas
  - Docs Site: 3-10 replicas
- Terraform state stored in Azure Storage

---

## IaC Translation Strategy

### Manifest Analysis

The Python translation scripts analyze the Aspire manifest and extract:

```json
{
  "services": {
    "docs-api": {
      "type": "container",
      "image": "k12acr.azurecr.io/docs-api:latest",
      "ports": [8080],
      "env": {},
      "resources": {}
    }
  }
}
```

### Terraform Generation

**Structure**:
```
infra/terraform/
├── main.tf              (resource definitions)
├── variables.tf         (input variables)
├── outputs.tf           (output values)
├── terraform.tfvars.dev (dev values)
└── terraform.tfvars.prod (prod values)
```

**Resource Types**:
- azurerm_log_analytics_workspace
- azurerm_application_insights
- azurerm_container_app_environment
- azurerm_container_app (x2)

**Key Features**:
- Variable validation
- Output references
- Common tags support
- Health check configuration

### Bicep Generation

**Structure**:
```
infra/bicep/
├── main.bicep              (template)
├── parameters.bicep        (default parameters)
├── main.dev.bicepparam     (dev parameters)
├── main.staging.bicepparam (staging parameters)
└── main.prod.bicepparam    (prod parameters)
```

**Parameter Categories**:
- Environment configuration
- Scaling parameters
- Image references
- Monitoring settings

---

## Deployment Patterns

### Blue-Green Deployment

Both Terraform and Bicep support traffic splitting for blue-green deployments:

```bicep
traffic: [
  {
    weight: 90
    latestRevision: false  // Blue version
  },
  {
    weight: 10
    latestRevision: true   // Green version
  }
]
```

### Rolling Updates

Container Apps automatically handles rolling updates via revisions:

```
Old Revision (v1)
    ↓ Gradual scale down
    ├─ 100% traffic
    ├─ 75% traffic
    ├─ 50% traffic
    └─ 0% traffic

New Revision (v2)
    ↑ Gradual scale up
    ├─ 0% traffic
    ├─ 25% traffic
    ├─ 50% traffic
    └─ 100% traffic
```

### Rollback Strategy

**Automatic Rollback** (via Container Apps):
```
New version fails health checks
    ↓
Container Apps detects failure
    ↓
Automatically scale down new revision
    ↓
Route traffic back to previous stable revision
```

**Manual Rollback** (via Git + Pipeline):
```
git revert <commit-hash>
git push origin main
    ↓
Pipeline automatically deploys previous version
```

---

## Data Flow

### Build to Deployment

```
Source Code
    ↓
Build Stage
├── Compile .NET
└── Build Angular
    ↓
Build Artifacts
    ↓
Manifest Generation
├── azd infra synth
└── manifest.json
    ↓
IaC Translation
├── Python script analysis
├── Terraform generation
└── Bicep generation
    ↓
IaC Artifacts
    ↓
Deployment Stage (Conditional)
├── Dev: Bicep → ACA
└── Prod: Terraform → ACA
    ↓
Running Services
    ├── Docs API Container App
    └── Docs Site Container App
    ↓
Observability
    ├── Log Analytics Workspace
    └── Application Insights
```

### Configuration Flow

```
azure-pipelines.yml
    ├── Variables (dotnetVersion, nodeVersion)
    ├── Service Connection (K12-Azure-Gov)
    ├── Environments (K12-Dev, K12-Production)
    └── Stages (Build, Manifest, IaC, Deploy)
        ↓
Manifest JSON
    ├── Container references
    ├── Environment variables
    └── Resource requirements
        ↓
Terraform/Bicep
    ├── Resource definitions
    ├── Parameter files
    └── Variable inputs
        ↓
Azure Deployment
    ├── Resource groups
    ├── Network infrastructure
    └── Applications
```

---

## State Management

### Terraform State

**Location**: Azure Storage Account
```
Storage Account: k12tfstate
├── Container: tfstate
└── Blob: k12.terraform.tfstate
```

**Access**:
- Service connection: Reader access to resource group
- Pipeline: Via backend configuration
- Manual: `az storage blob download`

**State Locking**:
- Azure Storage provides blob leasing
- Prevents concurrent modifications
- Automatic cleanup after timeout

**Backup Strategy**:
```
Daily Backup Job (Scheduled):
    ├── Download current state
    ├── Copy to backup container (k12tfstate-backups)
    └── Retain 30-day rolling window
```

### Artifact Management

**Pipeline Artifacts**:
```
Build Artifacts (7-day retention)
├── aspire-manifest (manifest.json)
├── terraform-iac (*.tf files)
├── bicep-iac (*.bicep files)
└── docs-site-build (static site)
```

**Cleanup Policy**:
- Successful deployments: 7 days
- Failed deployments: 14 days
- Manual releases: 30 days

---

## Security Architecture

### Authentication & Authorization

```
Developer
    ↓
Git Repository (GitHub/ADO)
    ├── Branch protection rules
    ├── Pull request reviews (2 approvers for main)
    └── Signed commits (optional)
    ↓
Azure Pipelines
    ├── Service connection (managed identity)
    ├── Role-based access (RBAC)
    └── Workload identity federation (optional)
    ↓
Azure Resources
    ├── System-assigned managed identity
    ├── Custom role assignments
    └── Resource group access
```

### Pipeline Security

**Service Connection Permissions**:
```
K12-Azure-Gov (Service Principal)
├── Contributor role on resource groups
├── Storage Blob Data Contributor (Terraform state)
├── Limited to specific subscriptions
└── Time-bound credentials
```

**Secret Management**:
```
Variable Groups (ADO):
├── Service Connection names
├── Environment-specific settings
├── Container Registry credentials
└── Marked as "Secret" for sensitive values
```

**Audit Trail**:
```
Azure Activity Log
├── All deployments tracked
├── Change history recorded
├── Approvals documented
└── 90-day retention
```

### Container Security

**Image Scanning**:
```
Docker Build
    ↓
Scan for vulnerabilities (Trivy)
    ↓
Push to ACR
    ├── Image signing
    ├── Metadata tags
    └── Vulnerability data
    ↓
Container Apps
    ├── Pull via managed identity
    └── Execute with least privileges
```

**Network Security**:
```
Container Apps Environment
├── Internal load balancer option
├── Virtual network integration
├── Azure Firewall compatible
└── Private endpoints supported
```

---

## Monitoring & Observability

### Logs Flow

```
Container Apps
    ├── stdout/stderr → Log Analytics
    └── Application logs → Application Insights
        ↓
Log Analytics Workspace (k12-docs-logs-{env})
    ├── Retention: 30 days (dev), 90 days (prod)
    ├── KQL queries
    └── Workbooks/dashboards
        ↓
Application Insights (k12-docs-insights-{env})
    ├── Performance metrics
    ├── Trace telemetry
    ├── Exception tracking
    └── Custom events
```

### Metrics & Alerts

**Key Metrics**:
- Container restart count
- CPU/memory utilization
- Request latency
- Error rates
- Replica count

**Alert Rules**:
```
High Error Rate (>5%)
    → Alert team via Teams/Email

Container Crashes (>2 in 5 min)
    → Auto-scale or escalate

Response Time (>2s p95)
    → Investigation ticket

Low Replica Count
    → Health check failure
```

---

## Maintenance & Operations

### Updating Dependencies

**Quarterly Update Schedule**:
```
1. Update .NET SDKs
   - Test locally
   - Update workload
   - Rebuild and test

2. Update Terraform Provider
   - Review changelog
   - Test plan against current state
   - Staged apply

3. Update Container Base Images
   - Security patches
   - New feature support
   - Rebuild via ACR Tasks
```

### Cost Optimization

**Dev Environment**:
- Minimal replicas (1)
- Smaller CPU/memory (0.25 CPU)
- 30-day log retention
- Estimated: $90/month

**Prod Environment**:
- High availability (3-20 replicas)
- Standard CPU/memory (0.5 CPU)
- 90-day log retention
- Estimated: $790/month

**Cost Analysis**:
```
az costmanagement query create \
  --timeframe Custom \
  --time-period \
    from=2024-01-01T00:00:00Z \
    to=2024-01-31T23:59:59Z
```

---

## Disaster Recovery

### RTO/RPO Targets

| Scenario | RTO | RPO |
|----------|-----|-----|
| Container restart | 1 min | 0 (stateless) |
| Region failure | 15 min | 0 (redeploy) |
| Terraform state loss | 5 min | 1 day |
| Complete environment | 30 min | 1 day |

### Backup Strategy

1. **Code**: Git repository (GitHub/ADO)
   - Daily push to remote
   - Branch protection
   - Tag releases

2. **Configuration**: Bicep/Terraform files
   - Stored in Git
   - Version controlled
   - Parameter files tracked

3. **State**: Terraform state
   - Azure Storage with versioning
   - Daily automated backup
   - 30-day retention

4. **Data**: Application data
   - Application-managed (external DBs)
   - Not managed by this pipeline

### Recovery Procedures

**Scenario 1: Container App Crash**
```
1. Manual trigger pipeline
2. Pipeline redeploys latest version
3. Container Apps performs health check
4. Traffic automatically restored
RTO: 2-5 minutes
```

**Scenario 2: Complete Environment Loss**
```
1. Recreate resource group (if needed)
2. Retrieve latest Bicep/Terraform files from Git
3. Manual trigger pipeline
4. Deploy from scratch
RTO: 15-30 minutes
```

**Scenario 3: Terraform State Corruption**
```
1. Restore from Storage Account backup
2. Verify resource group is healthy
3. Run terraform refresh
4. Continue operations
RTO: 5-10 minutes
```

---

## References & Documentation

- **Azure Pipelines**: https://learn.microsoft.com/en-us/azure/devops/pipelines/
- **Container Apps**: https://learn.microsoft.com/en-us/azure/container-apps/
- **Aspire**: https://learn.microsoft.com/en-us/dotnet/aspire/
- **Terraform Azure Provider**: https://registry.terraform.io/providers/hashicorp/azurerm/
- **Bicep**: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/
- **Azure DevOps CLI**: https://learn.microsoft.com/en-us/cli/azure/
