# K12 Aspire Pipeline - Complete File Index

Navigation guide for all pipeline-related files created for deploying K12 Aspire applications to Azure Container Apps.

## Quick Navigation

### For First-Time Users
Start here in this order:
1. **PIPELINE-SUMMARY.md** - 5-minute overview
2. **QUICK-DEPLOY.md** - 5-minute quick setup
3. **PIPELINE-SETUP.md** - Detailed configuration

### For DevOps/Platform Engineers
1. **PIPELINE-SETUP.md** - Complete setup guide
2. **PIPELINE-ARCHITECTURE.md** - Technical deep-dive
3. **azure-pipelines.yml** - Pipeline configuration
4. **scripts/** - Implementation scripts

### For Developers
1. **QUICK-DEPLOY.md** - Quick deployment guide
2. **PIPELINE-SUMMARY.md** - Overview
3. **infra/** - Infrastructure parameters

### For Operations Teams
1. **QUICK-DEPLOY.md** - Common commands
2. **scripts/validate-deployment.sh** - Verification
3. **PIPELINE-ARCHITECTURE.md** - Monitoring section

---

## File Reference

### Core Pipeline Files

#### 1. **azure-pipelines.yml** (7.5 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/azure-pipelines.yml`

**Contents**:
- 5-stage pipeline definition (Build, Manifest, IaC, DeployDev, DeployProd)
- 6 jobs with parallel execution support
- Conditional deployments based on git branch
- Service connection and environment configuration
- Build/test steps for .NET Aspire and Angular

**Key Sections**:
- Variables (dotnet version, node version, azure subscription)
- Stage 1: Build (.NET + Angular)
- Stage 2: Aspire Manifest Generation
- Stage 3: IaC Translation (Terraform & Bicep)
- Stage 4: Dev Deployment (Bicep)
- Stage 5: Production Deployment (Terraform)

**When to modify**:
- Change build steps
- Add/remove stages
- Update service connection
- Modify environment names

**Usage**: Commit to repository root

---

### Documentation Files

#### 2. **PIPELINE-SUMMARY.md** (15 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/PIPELINE-SUMMARY.md`

**Contents**:
- Executive overview of pipeline solution
- What was created summary
- Pipeline workflow diagram
- Multi-environment support details
- Key features (6 major)
- 5-minute quick start
- Configuration checklist
- Troubleshooting quick reference
- Success metrics
- File locations
- Version information

**Best for**: First introduction to pipeline
**Read time**: 10-15 minutes
**Includes**: Diagrams, checklists, file structure

---

#### 3. **QUICK-DEPLOY.md** (6.5 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/QUICK-DEPLOY.md`

**Contents**:
- Prerequisites checklist
- 5-minute setup (5 steps)
- Verify deployment
- Common commands (20+ commands)
- Troubleshooting (7 common issues)
- Pipeline deployment via git push
- Monitor pipeline section
- Cost estimation
- Rollout checklist

**Best for**: Fast deployments and operations
**Read time**: 5-10 minutes
**Includes**: Bash command examples, troubleshooting

---

#### 4. **PIPELINE-SETUP.md** (16 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/PIPELINE-SETUP.md`

**Contents**:
- Comprehensive prerequisites
- Pipeline configuration details
- Service connection setup
- Approval environments setup
- Repository setup
- Detailed deployment flow for each stage
- Scripts reference (manifest-to-terraform.py and manifest-to-bicep.py)
- Troubleshooting guide (8 detailed scenarios)
- Security considerations
- Maintenance and operations guide
- Logging and monitoring endpoints

**Best for**: Initial setup and troubleshooting
**Read time**: 30-40 minutes
**Includes**: Step-by-step instructions, command examples, security best practices

---

#### 5. **PIPELINE-ARCHITECTURE.md** (23 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/PIPELINE-ARCHITECTURE.md`

**Contents**:
- System architecture diagrams
- Pipeline workflow (6 main sections)
- IaC translation strategy
- Deployment patterns (blue-green, rolling, rollback)
- Data flow diagrams
- State management (Terraform state, artifact management)
- Security architecture
- Monitoring & observability
- Maintenance & operations
- Disaster recovery (RTO/RPO targets, backup strategy, recovery procedures)
- References

**Best for**: Technical deep-dive and architecture understanding
**Read time**: 45-60 minutes
**Includes**: ASCII diagrams, flow charts, technical details

---

#### 6. **PIPELINE-INDEX.md** (This File)
**Location**: `c:/Projects/CFI/K12/k12-Arch/PIPELINE-INDEX.md`

**Contents**:
- Navigation guide
- File reference for all created files
- Purpose and usage for each file
- Cross-references between documents
- Quick lookup table

**Best for**: Finding what you need
**Read time**: 5-10 minutes

---

### Script Files

#### 7. **scripts/manifest-to-terraform.py** (12 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/scripts/manifest-to-terraform.py`

**Purpose**: Convert Aspire manifest.json to Terraform HCL files

**Usage**:
```bash
python scripts/manifest-to-terraform.py \
  --manifest ./infra/manifest/manifest.json \
  --output ./infra/terraform
```

**Generates**:
- `main.tf` - Resource definitions (azurerm_log_analytics_workspace, azurerm_application_insights, azurerm_container_app_environment, azurerm_container_app)
- `variables.tf` - Input variables with validation rules
- `outputs.tf` - Output values (FQDNs, URLs, IDs)
- `terraform.tfvars.example` - Example parameter file

**Features**:
- Automatic variable validation
- Common tags support
- Min/max replica scaling configuration
- Health checks
- Dapr service integration
- Comprehensive comments and documentation

**Language**: Python 3.8+
**Dependencies**: None (uses only stdlib)
**Modifications**: Update resource definitions or variables as needed

---

#### 8. **scripts/manifest-to-bicep.py** (15 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/scripts/manifest-to-bicep.py`

**Purpose**: Convert Aspire manifest.json to Bicep templates

**Usage**:
```bash
python scripts/manifest-to-bicep.py \
  --manifest ./infra/manifest/manifest.json \
  --output ./infra/bicep
```

**Generates**:
- `main.bicep` - Main template with all resources
- `parameters.bicep` - Default parameter definitions
- `main.dev.bicepparam` - Development environment parameters
- `main.staging.bicepparam` - Staging environment parameters
- `main.prod.bicepparam` - Production environment parameters

**Features**:
- System-assigned managed identities
- Liveness and readiness probes (HTTP health checks)
- Multiple scaling rules
- Environment-specific configuration
- Dapr integration
- Comprehensive documentation
- Parameter files for each environment

**Language**: Python 3.8+
**Dependencies**: None (uses only stdlib)
**Modifications**: Update resource definitions or probe configurations as needed

---

#### 9. **scripts/validate-deployment.sh** (6.9 KB)
**Location**: `c:/Projects/CFI/K12/k12-Arch/scripts/validate-deployment.sh`

**Purpose**: Validate K12 Aspire deployment to Azure Container Apps

**Usage**:
```bash
bash scripts/validate-deployment.sh dev k12-dev-rg
bash scripts/validate-deployment.sh prod k12-prod-rg
```

**Checks**:
1. Prerequisites (az, python, terraform, dotnet)
2. Azure resources (container apps env, log analytics, app insights)
3. Container apps (existence and status)
4. Container app configuration (ingress, FQDN)
5. Logs and monitoring (Log Analytics, App Insights)
6. Container logs (no errors in recent logs)
7. Scaling configuration

**Output**: Color-coded results with pass/fail/warning status

**Language**: Bash (Unix/Linux compatible)
**Returns**: 0 on success, 1 on failure

---

### Configuration Files

#### 10. **infra/terraform/terraform.tfvars.dev** (481 B)
**Location**: `c:/Projects/CFI/K12/k12-Arch/infra/terraform/terraform.tfvars.dev`

**Purpose**: Development environment terraform variables

**Contents**:
- environment = "dev"
- resource_group_name = "k12-dev-rg"
- location = "eastus"
- image_tag = "dev-latest"
- docs_api min/max replicas (1/5)
- docs_site min/max replicas (1/3)
- common_tags (Engineering cost center)

**Usage**: Pass to terraform with `-var-file=terraform.tfvars.dev`

---

#### 11. **infra/terraform/terraform.tfvars.prod** (507 B)
**Location**: `c:/Projects/CFI/K12/k12-Arch/infra/terraform/terraform.tfvars.prod`

**Purpose**: Production environment terraform variables

**Contents**:
- environment = "prod"
- resource_group_name = "k12-prod-rg"
- location = "eastus"
- image_tag = "v1.0.0"
- docs_api min/max replicas (3/20)
- docs_site min/max replicas (3/10)
- common_tags (Operations cost center, FedRAMP compliance)

**Usage**: Pass to terraform with `-var-file=terraform.tfvars.prod`

---

## Quick Reference Table

| Document | Type | Purpose | Read Time | Best For |
|----------|------|---------|-----------|----------|
| PIPELINE-SUMMARY.md | Intro | Overview and summary | 10 min | First-time users |
| QUICK-DEPLOY.md | Guide | Fast deployment | 5 min | Operations, developers |
| PIPELINE-SETUP.md | Guide | Complete setup | 40 min | DevOps, setup |
| PIPELINE-ARCHITECTURE.md | Reference | Technical details | 60 min | Architects, advanced |
| azure-pipelines.yml | Config | Pipeline definition | N/A | Implementation |
| manifest-to-terraform.py | Script | IaC generation | N/A | Pipeline execution |
| manifest-to-bicep.py | Script | IaC generation | N/A | Pipeline execution |
| validate-deployment.sh | Script | Verification | N/A | Post-deployment |
| terraform.tfvars.* | Config | Environment vars | N/A | Terraform execution |

---

## Common Tasks & Where to Find Answers

### "How do I set up the pipeline?"
1. Read: **PIPELINE-SUMMARY.md** (5 min overview)
2. Follow: **PIPELINE-SETUP.md** (step-by-step)
3. Execute: **QUICK-DEPLOY.md** (commands)

### "How do I deploy to production?"
1. Review: **QUICK-DEPLOY.md** (Quick reference)
2. Follow: **PIPELINE-SETUP.md** → Deploy Prod Stage section
3. Execute: Git push to main branch, approve deployment

### "What are the prerequisites?"
1. Check: **PIPELINE-SETUP.md** → Prerequisites section
2. Or: **PIPELINE-SUMMARY.md** → Configuration Checklist

### "How does the pipeline work?"
1. Overview: **PIPELINE-SUMMARY.md** → Pipeline Workflow
2. Details: **PIPELINE-ARCHITECTURE.md** → Pipeline Workflow section
3. Code: **azure-pipelines.yml** → Examine stages

### "How do I troubleshoot a failure?"
1. Quick tips: **QUICK-DEPLOY.md** → Troubleshooting section
2. Detailed: **PIPELINE-SETUP.md** → Troubleshooting section
3. Debug: **PIPELINE-ARCHITECTURE.md** → Relevant section

### "How do I verify deployment?"
1. Run: **scripts/validate-deployment.sh**
2. Check: **QUICK-DEPLOY.md** → Verify Deployment
3. Monitor: **PIPELINE-SETUP.md** → Monitoring Endpoints

### "What are the costs?"
1. Estimate: **PIPELINE-SUMMARY.md** → Deployment Statistics
2. Details: **QUICK-DEPLOY.md** → Cost Estimation
3. Analysis: **PIPELINE-ARCHITECTURE.md** → Cost Optimization

### "How do I scale up?"
1. Check: **PIPELINE-ARCHITECTURE.md** → Maintenance & Operations
2. Modify: **infra/terraform/terraform.tfvars.prod**
3. Deploy: Push changes and trigger pipeline

### "How do I rollback?"
1. Learn: **PIPELINE-ARCHITECTURE.md** → Rollback Strategy
2. Execute: **QUICK-DEPLOY.md** → Rollback Deployment

---

## File Relationships

```
azure-pipelines.yml (Main orchestration)
├── References: PIPELINE-SETUP.md, QUICK-DEPLOY.md
├── Calls: scripts/manifest-to-terraform.py
├── Calls: scripts/manifest-to-bicep.py
└── Deploys: infra/terraform/, infra/bicep/

manifest-to-terraform.py
├── Input: Aspire manifest.json
└── Output: infra/terraform/ (main.tf, variables.tf, outputs.tf)

manifest-to-bicep.py
├── Input: Aspire manifest.json
└── Output: infra/bicep/ (main.bicep, *.bicepparam)

validate-deployment.sh
└── Validates: Deployed Container Apps and resources

PIPELINE-SUMMARY.md
├── References: All other documents
└── Summarizes: Complete solution

PIPELINE-SETUP.md
├── Details: azure-pipelines.yml configuration
├── Explains: Scripts usage
└── Troubleshoots: Common issues

PIPELINE-ARCHITECTURE.md
├── Diagrams: Full pipeline flow
├── Explains: IaC translation
└── References: All components
```

---

## Recommended Reading Order

### Path 1: Quick Setup (30 minutes)
1. PIPELINE-SUMMARY.md (5 min) - Get overview
2. QUICK-DEPLOY.md (10 min) - Understand steps
3. PIPELINE-SETUP.md → Prerequisites (5 min) - Check requirements
4. Execute QUICK-DEPLOY.md steps (10 min) - Deploy

### Path 2: Complete Understanding (90 minutes)
1. PIPELINE-SUMMARY.md (10 min) - Overview
2. PIPELINE-SETUP.md (40 min) - Complete setup guide
3. PIPELINE-ARCHITECTURE.md (30 min) - Technical details
4. Review code files (10 min)

### Path 3: Troubleshooting (20 minutes)
1. QUICK-DEPLOY.md → Troubleshooting (5 min)
2. PIPELINE-SETUP.md → Troubleshooting (10 min)
3. Relevant PIPELINE-ARCHITECTURE.md section (5 min)

---

## Customization Guide

### To modify the pipeline:
- Edit: `azure-pipelines.yml`
- Reference: `PIPELINE-SETUP.md` for explanation

### To change IaC generation:
- Edit: `scripts/manifest-to-terraform.py` or `scripts/manifest-to-bicep.py`
- Test: Generate files locally first
- Reference: Comments in scripts for guidance

### To adjust environment parameters:
- Edit: `infra/terraform/terraform.tfvars.*`
- Or: `infra/bicep/*.bicepparam`
- Reference: `PIPELINE-SETUP.md` for parameter explanations

### To add new Container Apps:
- Modify: Manifest generation (Aspire project)
- Auto-update: Translation scripts will generate new resources

### To add new environments:
- Create: New `*.bicepparam` or `*.tfvars` file
- Update: `azure-pipelines.yml` with new stage
- Test: Use validation script

---

## Support Resources

### Internal Documents
- This file: PIPELINE-INDEX.md
- Summaries: PIPELINE-SUMMARY.md
- Setup: PIPELINE-SETUP.md
- Architecture: PIPELINE-ARCHITECTURE.md

### External Resources
- Aspire Docs: https://learn.microsoft.com/dotnet/aspire/
- Container Apps: https://learn.microsoft.com/azure/container-apps/
- Terraform: https://registry.terraform.io/providers/hashicorp/azurerm/
- Bicep: https://learn.microsoft.com/azure/azure-resource-manager/bicep/
- Azure CLI: https://learn.microsoft.com/cli/azure/
- Azure DevOps: https://learn.microsoft.com/azure/devops/

### Getting Help
1. Check relevant document sections
2. Search for keywords in all documents
3. Review troubleshooting sections
4. Consult external documentation
5. Contact DevOps team: devops@cfi-nc.com

---

## Document Maintenance

**All documents created**: 2025-11-24
**Version**: 1.0
**Status**: Production Ready
**Last Updated**: 2025-11-24

**To update documentation**:
1. Make changes to relevant file(s)
2. Update version numbers if major changes
3. Update this index if new files added
4. Commit all changes together

---

## Quick Links Summary

| Document | Purpose | Start Here |
|----------|---------|-----------|
| PIPELINE-SUMMARY.md | Executive overview | First-time users |
| QUICK-DEPLOY.md | Fast deployment | Developers, ops |
| PIPELINE-SETUP.md | Complete guide | DevOps engineers |
| PIPELINE-ARCHITECTURE.md | Technical details | Architects |
| azure-pipelines.yml | Pipeline code | Implementation |
| manifest-to-terraform.py | Terraform generation | Pipeline execution |
| manifest-to-bicep.py | Bicep generation | Pipeline execution |
| validate-deployment.sh | Verification | Post-deployment |

---

*For the most current information, always reference these files in the repository.*
