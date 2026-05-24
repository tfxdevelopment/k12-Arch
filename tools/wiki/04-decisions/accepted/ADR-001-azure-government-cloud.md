# ADR-001: Azure Government Cloud Selection

**Status:** Accepted
**Date:** 2024-07-15
**Deciders:** CFI Architecture Team, SEAA Leadership, NC State CIO Office
**Technical Story:** FedRAMP High compliance requirement for state government application

## Context and Problem Statement

The K12 MyPortal system will process sensitive student data (PII, financial information, educational records) for a North Carolina state government agency (SEAA). The system must comply with federal and state security requirements, particularly FedRAMP High authorization. The question is: which cloud platform should we use to host this system?

### Requirements

- **FedRAMP High Authorization**: Required for systems processing sensitive state government data
- **FERPA Compliance**: Protection of student educational records
- **NIST 800-53 Controls**: Comprehensive security control implementation
- **Data Sovereignty**: Data must remain within US borders with government-approved controls
- **State Government Standards**: Compliance with NC state IT security policies
- **Audit and Compliance**: Regular security audits and compliance reporting

## Decision Drivers

* **Regulatory Compliance**: FedRAMP High is mandatory, not optional
* **Security Posture**: Enhanced security controls beyond commercial cloud
* **Government Requirements**: State agency requires government cloud infrastructure
* **Audit Trail**: Comprehensive logging and monitoring for government oversight
* **Data Location**: Physical and logical separation from commercial tenants
* **Support**: Government-specific support and SLAs
* **Cost**: Higher cost is acceptable for compliance benefits

## Considered Options

1. **Azure Government Cloud** - Dedicated cloud for US government
2. **Azure Commercial Cloud** - Standard Azure public cloud
3. **AWS GovCloud** - Amazon's government cloud offering
4. **On-Premises (State Data Center)** - Self-hosted infrastructure

## Decision Outcome

**Chosen option:** "Azure Government Cloud", because it is the only option that provides:
1. FedRAMP High authorization out-of-the-box
2. Physical and logical separation from commercial tenants
3. US government-screened personnel
4. Compliance with ITAR and other government regulations
5. Existing relationship and expertise within CFI and NC State Government

### Consequences

#### Good
- FedRAMP High compliance automatically inherited from platform
- Enhanced security posture with government-grade controls
- Physical data centers located in US with government-only access
- Dedicated Microsoft support team familiar with government requirements
- All Azure PaaS services available with government compliance
- Simplified compliance auditing and reporting
- Future-proof for additional government contracts

#### Bad
- Higher cost (~30-40% premium over Azure Commercial)
- Some Azure features may lag commercial cloud by 3-6 months
- Smaller community and fewer third-party integrations
- Migration to commercial cloud would be complex if requirements change
- Requires US citizenship for personnel with elevated access

#### Neutral
- Learning curve minimal (Azure Gov nearly identical to Commercial)
- Tooling and SDKs work without modification
- Same Azure portal experience

## Pros and Cons of the Options

### Azure Government Cloud (Chosen)

* **Pro:** FedRAMP High authorization out-of-the-box
* **Pro:** Physical separation from commercial tenants
* **Pro:** Screened US personnel only
* **Pro:** Meets all state government security requirements
* **Pro:** All necessary Azure services available (Functions, SQL, Storage, Entra ID)
* **Pro:** Simplified compliance auditing
* **Pro:** No need to achieve FedRAMP authorization ourselves
* **Con:** Higher cost (30-40% premium)
* **Con:** Some features lag commercial by months
* **Con:** Smaller ecosystem and community
* **Con:** Requires US citizenship for some roles

### Azure Commercial Cloud

* **Pro:** Lower cost
* **Pro:** Latest features and innovations first
* **Pro:** Larger community and ecosystem
* **Pro:** More third-party integrations
* **Con:** ❌ Not FedRAMP High authorized
* **Con:** ❌ Would require extensive additional controls
* **Con:** ❌ State agency may not approve
* **Con:** ❌ Compliance burden shifts to us
* **Con:** ❌ Shared infrastructure with commercial tenants
* **Con:** ❌ Would need separate compliance assessment

### AWS GovCloud

* **Pro:** FedRAMP High authorized
* **Pro:** Government-grade security controls
* **Pro:** Similar compliance benefits to Azure Gov
* **Pro:** Competitive pricing
* **Con:** CFI has no AWS expertise (Azure shop)
* **Con:** NC State Government standardized on Azure
* **Con:** Would need to build all Azure-specific knowledge
* **Con:** Different tooling, deployment pipelines, training
* **Con:** No existing enterprise agreement with AWS
* **Con:** Would need to learn completely different platform

### On-Premises (State Data Center)

* **Pro:** Complete control over infrastructure
* **Pro:** Data never leaves state facilities
* **Pro:** No cloud provider dependency
* **Con:** ❌ Would still need FedRAMP authorization (not automatic)
* **Con:** ❌ Massive upfront capital expense
* **Con:** ❌ Ongoing operational burden (patching, upgrades, scaling)
* **Con:** ❌ Slower time to market
* **Con:** ❌ Limited scalability
* **Con:** ❌ Disaster recovery complexity
* **Con:** ❌ State data center may lack capacity

## Technical Details

### Azure Government Cloud Specifications

**Regions:**
- US Gov Virginia (Primary)
- US Gov Texas (Secondary for DR)
- US Gov Arizona (Available)

**Compliance Certifications:**
- FedRAMP High
- DoD Impact Level 5
- CJIS
- IRS 1075
- ITAR
- NIST 800-53
- HIPAA/HITECH

**Physical Security:**
- Dedicated data centers
- Separate from commercial Azure
- US government-screened personnel only
- No foreign nationals with physical access
- Enhanced physical security controls

**Logical Separation:**
- Separate Azure Active Directory (Entra ID) tenant
- No network connectivity to commercial Azure
- Dedicated API endpoints
- Separate support organization

**Available Services (Relevant to K12):**
- ✅ Azure Functions
- ✅ Azure SQL Database
- ✅ Azure Storage (Blob, ADLS Gen2)
- ✅ Azure Static Web Apps
- ✅ Azure API Management
- ✅ Azure SignalR Service
- ✅ Azure Entra ID (B2C available)
- ✅ Application Insights
- ✅ Azure Key Vault

### Endpoint Differences

| Service | Commercial | Government |
|---------|-----------|------------|
| **Portal** | https://portal.azure.com | https://portal.azure.us |
| **Entra ID** | https://login.microsoftonline.com | https://login.microsoftonline.us |
| **Graph API** | https://graph.microsoft.com | https://graph.microsoft.us |
| **Azure Management** | https://management.azure.com | https://management.usgovcloudapi.net |
| **Storage** | *.blob.core.windows.net | *.blob.core.usgovcloudapi.net |

### Code Changes Required

**Minimal configuration changes:**

```csharp
// Azure Commercial
var credential = new DefaultAzureCredential();
var blobClient = new BlobServiceClient(
    new Uri("https://account.blob.core.windows.net"),
    credential);

// Azure Government
var credential = new DefaultAzureCredential(
    new DefaultAzureCredentialOptions
    {
        AuthorityHost = AzureAuthorityHosts.AzureGovernment
    });
var blobClient = new BlobServiceClient(
    new Uri("https://account.blob.core.usgovcloudapi.net"),
    credential);
```

**Terraform Configuration:**

```hcl
# Azure Commercial
provider "azurerm" {
  features {}
}

# Azure Government
provider "azurerm" {
  features {}
  environment = "usgovernment"
}
```

### Cost Comparison (Monthly Estimates)

| Resource | Commercial | Government | Premium |
|----------|-----------|------------|---------|
| **Azure Functions** (Premium) | $150 | $200 | +33% |
| **Azure SQL** (Standard S3) | $200 | $270 | +35% |
| **Azure Storage** (1 TB) | $20 | $28 | +40% |
| **APIM** (Standard) | $300 | $400 | +33% |
| **Static Web Apps** (Standard) | $9 | $12 | +33% |
| **Total Monthly** | ~$679 | ~$910 | +34% |

**Annual Premium:** ~$2,772/year for government compliance

## Validation

Success will be measured by:
- Successful FedRAMP High authorization obtained (or inherited from Azure)
- SEAA security office approval of cloud platform
- Passing all state government security audits
- No compliance violations or security incidents
- Ability to scale to 100,000+ users without infrastructure changes

## Related Decisions

* ADR-003 - Entra ID B2C for CIAM (impacts authentication endpoints)
* ADR-006 - Terraform for IaC (impacts provider configuration)
* All infrastructure decisions must account for Azure Government availability

## Implementation Notes

**Deployment Changes:**
1. Update all Azure SDK configurations to use Government endpoints
2. Configure Terraform provider with `environment = "usgovernment"`
3. Update Entra ID authentication URLs in Angular apps
4. Update CI/CD pipelines to target Government regions
5. Configure Azure DevOps service connections for Government cloud

**Development Environment:**
- Developers will use Azure Government for all environments (Dev, Test, Staging, Prod)
- No commercial Azure environments for this project
- All developers must use Government endpoints from day one

**Migration Path (If Ever Needed):**
- Data export from Government to Commercial is possible but requires approval
- Code changes minimal (mostly configuration)
- Re-apply for FedRAMP if moving to Commercial
- State agency approval required

## References

* [Azure Government Documentation](https://learn.microsoft.com/en-us/azure/azure-government/)
* [FedRAMP Marketplace](https://marketplace.fedramp.gov/products/F1607057910)
* [Azure Government Compliance](https://learn.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope)
* [Azure Government vs Commercial Comparison](https://learn.microsoft.com/en-us/azure/azure-government/compare-azure-government-global-azure)
* [NIST 800-53 Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)

---

**Decision Made:** July 15, 2024
**Approved By:** CFI CTO, SEAA CIO, NC State Security Office
**Next Review:** Annual (or if requirements change)
