# K12 Aspire Deployment Pipeline - Complete Summary

## Executive Overview

A production-ready Azure Pipelines CI/CD solution for deploying K12 Aspire applications to Azure Container Apps with automatic infrastructure-as-code generation from Aspire manifests.

**Key Achievement**: Automated end-to-end deployment from source code to Azure Container Apps, with dual IaC approaches (Bicep for dev, Terraform for prod).

---

## What Was Created

### 1. Main Pipeline File
**File**: `azure-pipelines.yml`
- **Size**: ~230 lines
- **Stages**: 5 (Build, GenerateManifest, TranslateIaC, DeployDev, DeployProd)
- **Jobs**: 6 total (4 build jobs, 2 deployment jobs)
- **Triggers**: Conditional based on branch (main/develop)

### 2. Translation Scripts

#### Python: manifest-to-terraform.py
- **Purpose**: Convert Aspire manifest.json → Terraform HCL
- **Outputs**:
  - `main.tf` (resources)
  - `variables.tf` (input variables with validation)
  - `outputs.tf` (output values)
  - `terraform.tfvars.example` (example parameters)
- **Features**:
  - Variable validation rules
  - Common tags support
  - Scaling configuration
  - Health checks
  - Dapr integration
- **Size**: ~400 lines

#### Python: manifest-to-bicep.py
- **Purpose**: Convert Aspire manifest.json → Bicep template
- **Outputs**:
  - `main.bicep` (template with all resources)
  - `parameters.bicep` (default parameters)
  - `main.dev.bicepparam` (dev parameters)
  - `main.staging.bicepparam` (staging parameters)
  - `main.prod.bicepparam` (prod parameters)
- **Features**:
  - System-assigned managed identities
  - Liveness and readiness probes
  - Multiple scaling rules
  - Environment-specific configs
- **Size**: ~500 lines

### 3. Documentation

#### PIPELINE-SETUP.md (Comprehensive Setup Guide)
- Prerequisites checklist
- Service connection configuration
- Environment setup instructions
- Pipeline configuration details
- Step-by-step deployment flow
- Scripts reference with examples
- Troubleshooting guide
- Security considerations
- **Length**: ~800 lines

#### PIPELINE-ARCHITECTURE.md (Technical Architecture)
- System architecture diagrams
- Complete pipeline workflow
- IaC translation strategy
- Deployment patterns (blue-green, rolling, rollback)
- Data flow diagrams
- State management
- Security architecture
- Monitoring and observability
- Disaster recovery procedures
- **Length**: ~600 lines

#### QUICK-DEPLOY.md (Fast-Track Guide)
- 5-minute quick setup
- Common commands reference
- Verification procedures
- Troubleshooting quick-tips
- Cost estimation
- Rollout checklist
- **Length**: ~300 lines

### 4. Configuration Files

#### Terraform Variables
- `infra/terraform/terraform.tfvars.dev` (dev environment)
- `infra/terraform/terraform.tfvars.prod` (prod environment)

### 5. Validation Script

#### scripts/validate-deployment.sh
- Bash script for post-deployment validation
- Checks: Prerequisites, Azure resources, Container Apps, logs, scaling
- Health endpoint verification
- Error detection and reporting
- **Size**: ~300 lines

---

## Pipeline Workflow Summary

```
┌─────────────────────────────────────────────────┐
│ 1. BUILD STAGE                                   │
│ ├─ Build .NET Aspire Projects                  │
│ │  └─ dotnet build + test                      │
│ └─ Build Angular Docs Site                     │
│    └─ npm build (Nuxt)                         │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│ 2. GENERATE MANIFEST STAGE                      │
│ └─ azd infra synth → manifest.json             │
│    └─ Artifact: aspire-manifest                │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│ 3. TRANSLATE IaC STAGE (Parallel)              │
│ ├─ Manifest → Terraform                        │
│ │  └─ Artifact: terraform-iac                  │
│ └─ Manifest → Bicep                            │
│    └─ Artifact: bicep-iac                      │
└──────────────┬──────────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
   (develop)         (main)
      │                 │
┌─────▼──────┐  ┌──────▼─────────┐
│ 4A. DEV    │  │ 4B. PROD       │
│ ├─ Bicep   │  │ ├─ Terraform   │
│ └─ Manual  │  │ └─ Approval    │
│   Approval │  │    Required    │
└───────────┘  └────────────────┘
      │                 │
      ▼                 ▼
 ACA Deploy         ACA Deploy
   (Dev)              (Prod)
```

---

## Multi-Environment Support

### Development Environment
- **Branch**: develop
- **Resource Group**: k12-dev-rg
- **IaC Tool**: Bicep
- **Approval**: Automatic
- **Scaling**: Min 1, Max 3-5 replicas
- **Retention**: 30 days logs

### Production Environment
- **Branch**: main
- **Resource Group**: k12-prod-rg
- **IaC Tool**: Terraform (with state management)
- **Approval**: Manual (K12-Production environment)
- **Scaling**: Min 3, Max 10-20 replicas
- **Retention**: 90 days logs
- **State Backend**: Azure Storage (k12tfstate)

### Staging Environment (Optional)
- **Branch**: release/* or main with tag
- **Deployment**: Manual via pipeline trigger
- **Configuration**: Separate parameters

---

## Key Features

### 1. Automated Infrastructure Generation
- Aspire manifest → Terraform/Bicep conversion
- Eliminates manual IaC creation
- Ensures consistency between environments

### 2. Multi-Stage Pipeline
- Clear separation of concerns
- Conditional deployment based on branch
- Artifact-driven deployments
- Parallel job execution

### 3. Dual IaC Approach
- **Bicep**: Simpler syntax for dev/quick deployments
- **Terraform**: State management for prod, idempotent

### 4. Security by Design
- Service principal with limited permissions
- Managed identities for containers
- Secret variable support
- Approval gates for production

### 5. Observability Built-In
- Log Analytics integration
- Application Insights for monitoring
- Health checks and probes
- Automatic logging configuration

### 6. Scalability Configuration
- Environment-specific scaling rules
- Min/max replica configuration
- Horizontal auto-scaling support
- Resource requests/limits

---

## Deployment Statistics

### Resource Consumption

| Resource | Dev | Prod |
|----------|-----|------|
| Container App Environments | 1 | 1 |
| Container Apps | 2 | 2 |
| Log Analytics Workspaces | 1 | 1 |
| Application Insights | 1 | 1 |
| Replicas (Docs API) | 1-5 | 3-20 |
| Replicas (Docs Site) | 1-3 | 3-10 |
| CPU (Docs API) | 0.25 | 0.25 |
| Memory (Docs API) | 0.5Gi | 0.5Gi |
| CPU (Docs Site) | 0.5 | 0.5 |
| Memory (Docs Site) | 1.0Gi | 1.0Gi |

### Cost Estimation

**Monthly Costs**:
| Component | Dev | Prod |
|-----------|-----|------|
| Container App Env | $30 | $30 |
| Container Apps | $50 | $200 |
| Log Analytics | $50 | $500 |
| App Insights | $10 | $50 |
| Storage (Terraform) | - | $10 |
| **Total** | **~$140** | **~$790** |

---

## Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
dotnet workload install aspire
pip install pyyaml jinja2
az bicep install
```

### 2. Generate Manifest
```bash
azd infra synth --output ./infra/manifest
```

### 3. Generate IaC
```bash
python scripts/manifest-to-terraform.py \
  --manifest ./infra/manifest/manifest.json \
  --output ./infra/terraform

python scripts/manifest-to-bicep.py \
  --manifest ./infra/manifest/manifest.json \
  --output ./infra/bicep
```

### 4. Deploy to Dev
```bash
az deployment group create \
  --resource-group k12-dev-rg \
  --template-file infra/bicep/main.bicep \
  --parameters @infra/bicep/main.dev.bicepparam
```

### 5. Verify
```bash
bash scripts/validate-deployment.sh dev k12-dev-rg
```

---

## File Locations

All files are located in `c:/Projects/CFI/K12/k12-Arch/`:

```
k12-Arch/
├── azure-pipelines.yml                 (Main pipeline definition)
├── PIPELINE-SETUP.md                   (Setup instructions)
├── PIPELINE-ARCHITECTURE.md            (Technical architecture)
├── QUICK-DEPLOY.md                     (Quick start guide)
├── PIPELINE-SUMMARY.md                 (This file)
├── scripts/
│   ├── manifest-to-terraform.py       (Manifest → Terraform converter)
│   ├── manifest-to-bicep.py           (Manifest → Bicep converter)
│   └── validate-deployment.sh         (Deployment validator)
└── infra/
    ├── terraform/
    │   ├── terraform.tfvars.dev       (Dev variables)
    │   └── terraform.tfvars.prod      (Prod variables)
    └── bicep/
        └── (Generated by pipeline)
```

---

## Configuration Checklist

### Pre-Deployment

- [ ] .NET 9.0+ installed
- [ ] Azure CLI installed and authenticated
- [ ] Azure Developer CLI (azd) installed
- [ ] Python 3.8+ with pyyaml and jinja2
- [ ] Terraform 1.9+ installed
- [ ] Bicep CLI installed

### Azure Setup

- [ ] Resource group created (k12-dev-rg)
- [ ] Resource group created (k12-prod-rg)
- [ ] Resource group created (k12-terraform-state-rg)
- [ ] Storage account created (k12tfstate) for Terraform state
- [ ] Container created in storage (tfstate)
- [ ] Service connection created (K12-Azure-Gov)
- [ ] Environments created (K12-Dev, K12-Production)
- [ ] Azure Container Registry accessible

### Repository Setup

- [ ] azure-pipelines.yml committed
- [ ] scripts/ directory committed
- [ ] infra/terraform/ directory committed
- [ ] Branch protection rules configured for main
- [ ] Pull request template updated
- [ ] Webhook configured for pipeline trigger

### Approval Setup

- [ ] K12-Production environment created
- [ ] Approval policy configured
- [ ] Approvers assigned
- [ ] Notification settings configured

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Build fails | `dotnet workload install aspire` |
| Manifest not generated | Check Aspire project path, run `azd infra synth --debug` |
| Python script fails | Verify manifest.json exists, install pyyaml/jinja2 |
| Deployment fails | Check resource group exists, service connection has permissions |
| Container won't start | Review container logs: `az containerapp logs show` |
| State lock error | Terraform already running; wait or delete lease if stuck |

---

## Operations & Maintenance

### Daily
- Monitor pipeline executions
- Review deployment logs
- Check container health

### Weekly
- Review error rates and logs
- Update dependency tracking
- Verify backup completion

### Monthly
- Cost analysis
- Security review
- Performance optimization

### Quarterly
- SDK/dependency updates
- Security patches
- Disaster recovery testing

---

## Support & References

### Documentation
- PIPELINE-SETUP.md - Complete setup guide
- PIPELINE-ARCHITECTURE.md - Technical deep-dive
- QUICK-DEPLOY.md - Fast deployment guide

### External Resources
- Aspire: https://learn.microsoft.com/dotnet/aspire/
- Container Apps: https://learn.microsoft.com/azure/container-apps/
- Terraform: https://registry.terraform.io/providers/hashicorp/azurerm/
- Bicep: https://learn.microsoft.com/azure/azure-resource-manager/bicep/

### Contact
- DevOps Team: devops@cfi-nc.com
- Architecture: Marty Flournory, Sumith Mathur
- Support: Azure DevOps admin console

---

## Success Metrics

After deployment, you should see:

1. **Pipeline Execution**
   - Build stage: 5-10 minutes
   - Manifest generation: 2-3 minutes
   - IaC translation: 1-2 minutes
   - Dev deployment: 5-10 minutes
   - Prod deployment: 10-15 minutes

2. **Container Apps Health**
   - Docs API: Running, revision active
   - Docs Site: Running, revision active
   - No restart loops
   - Health checks passing

3. **Monitoring**
   - Logs flowing to Log Analytics
   - Metrics in Application Insights
   - No critical alerts
   - Resource utilization within expected ranges

4. **Accessibility**
   - Docs API accessible via FQDN
   - Docs Site accessible via FQDN
   - Health endpoints responding
   - API endpoints functional

---

## Version Information

- **Pipeline Version**: 1.0.0
- **Terraform Provider Version**: 4.0+
- **Bicep Version**: Latest
- **Azure CLI Version**: 2.54+
- **.NET Version**: 9.0+
- **Node.js Version**: 22.x
- **Python Version**: 3.8+

---

## License & Usage

These files are part of the K12 MyPortal Architecture Documentation Repository.

**Document Version**: 1.0
**Last Updated**: 2025-11-24
**Created By**: Claude Code (claude.ai/code)
**Status**: Production Ready

---

## Next Steps

1. **Review**: Read PIPELINE-SETUP.md completely
2. **Configure**: Set up Azure resources and service connections
3. **Test**: Run through QUICK-DEPLOY.md steps manually
4. **Deploy**: Commit to repository and trigger pipeline
5. **Monitor**: Use validation script and review logs
6. **Optimize**: Adjust scaling and cost parameters as needed

---

## Change Log

### v1.0.0 (Initial Release)
- Initial pipeline setup
- Manifest generation via azd infra synth
- Terraform translation (production)
- Bicep translation (development)
- Multi-stage deployment
- Dev/Prod environments
- Complete documentation
- Validation scripts

---

*For more information, refer to the detailed documentation files in this directory.*
