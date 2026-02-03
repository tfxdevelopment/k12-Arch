# Azure Container Apps - Production Readiness Checklist

## Overview
This document outlines the security and production readiness improvements for the K12 Container App Environment.

## ✅ Current Strengths
- ✓ Log Analytics integration configured
- ✓ Managed Identity enabled (no credentials in code)
- ✓ ACR admin access disabled
- ✓ Role-based ACR pull permissions

## ⚠️ Critical Security Gaps (Must Fix Before Production)

### 1. **Network Isolation** 🔴 CRITICAL
**Current State:** Environment is publicly exposed to the internet.

**Required Actions:**
```terraform
# Add to variables.tf
variable "aca_vnet_address_space" {
  default = ["10.0.0.0/16"]
}

variable "aca_subnet_address_prefix" {
  default = ["10.0.0.0/23"]  # Minimum /23 for Container Apps
}
```

**Implementation:**
- Create dedicated VNet and subnet with `/23` address space minimum
- Enable subnet delegation for `Microsoft.App/environments`
- Set `internal_load_balancer_enabled = true` on Container App Environment
- Update ingress to `external_enabled = false` for internal-only access
- Configure Azure Firewall or Application Gateway for controlled external access

**Azure Policy Compliance:** "Container Apps environments should use network injection"

---

### 2. **Container Registry Security** 🔴 CRITICAL
**Current State:** Using Basic SKU, no geo-replication or zone redundancy.

**Required Actions:**
- ✅ **APPLIED:** Upgraded to Premium SKU
- ✅ **APPLIED:** Enabled zone redundancy
- ✅ **APPLIED:** Added geo-replication to secondary region
- 🔜 **TODO:** Disable public network access after VNet setup

```terraform
public_network_access_enabled = false  # Enable after VNet integration
```

**Cost Impact:** Premium SKU ~$20/day vs Basic ~$0.17/day (justified for production)

---

### 3. **Container App Configuration** 🟡 HIGH PRIORITY

**Current Issues:**
- Using dummy quickstart image
- No health probes configured
- Min replicas = 0 (scales to zero)
- ACR integration commented out

**Applied Fixes:**
- ✅ Enabled ACR registry integration with Managed Identity
- ✅ Added liveness and readiness probes
- ✅ Set `min_replicas = 2` for high availability
- ✅ Enforced HTTPS (`allow_insecure_connections = false`)
- ✅ Changed target port to 8080 (non-privileged)

**Next Steps:**
```bash
# Build and push your application image
az acr build --registry ${ACR_NAME} \
  --image k12-api:latest \
  --file Dockerfile .
```

---

### 4. **Secrets Management** 🟡 HIGH PRIORITY
**Current State:** No Key Vault integration.

**Recommended Implementation:**
```terraform
# 1. Create Key Vault (in core module or separate)
resource "azurerm_key_vault" "main" {
  name                = "${var.environment_name}-kv"
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
}

# 2. Grant Container App access
resource "azurerm_key_vault_access_policy" "aca" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_container_app.api_app.identity[0].principal_id
  
  secret_permissions = ["Get", "List"]
}

# 3. Store secrets
resource "azurerm_key_vault_secret" "db_connection" {
  name         = "db-connection-string"
  value        = var.sql_connection_string
  key_vault_id = azurerm_key_vault.main.id
}

# 4. Reference in Container App
secret {
  name                = "db-connection-string"
  identity            = "system"
  key_vault_secret_id = azurerm_key_vault_secret.db_connection.id
}
```

**Azure Policy Compliance:** "Container Apps should use Key Vault references"

---

### 5. **High Availability** 🟡 HIGH PRIORITY

**Applied:**
- ✅ Zone redundancy enabled on Container App Environment
- ✅ Zone redundancy enabled on ACR
- ✅ Geo-replication configured for ACR
- ✅ Min replicas set to 2

**Remaining:**
- 🔜 Configure Azure Front Door for multi-region failover
- 🔜 Implement health check endpoints in application code

---

## 📋 Implementation Roadmap

### Phase 1: Security Baseline (Week 1)
1. ✅ Upgrade ACR to Premium with zone redundancy
2. ✅ Enable ACR integration in Container App
3. ✅ Add health probes and min replicas
4. 🔜 Create Key Vault and migrate secrets
5. 🔜 Build and deploy actual application image

### Phase 2: Network Isolation (Week 2)
1. 🔜 Create VNet and subnet with proper CIDR
2. 🔜 Enable VNet integration on Container App Environment
3. 🔜 Configure internal load balancer
4. 🔜 Set up Azure Application Gateway for external access
5. 🔜 Apply Network Security Groups

### Phase 3: Monitoring & Compliance (Week 3)
1. 🔜 Enable diagnostic settings on all resources
2. 🔜 Configure Application Insights integration
3. 🔜 Set up Azure Monitor alerts
4. 🔜 Enable Microsoft Defender for Containers
5. 🔜 Run Azure Policy compliance scan

### Phase 4: Disaster Recovery (Week 4)
1. 🔜 Deploy to secondary region
2. 🔜 Configure Azure Front Door with health probes
3. 🔜 Test failover procedures
4. 🔜 Document recovery time objectives (RTO)

---

## 🎯 Production Readiness Checklist

| Category | Item | Status | Priority |
|----------|------|--------|----------|
| **Network** | VNet integration | 🔜 TODO | 🔴 Critical |
| **Network** | Internal load balancer | 🔜 TODO | 🔴 Critical |
| **Network** | Application Gateway/WAF | 🔜 TODO | 🟡 High |
| **Network** | NSG rules | 🔜 TODO | 🟡 High |
| **Security** | ACR Premium SKU | ✅ DONE | 🔴 Critical |
| **Security** | Zone redundancy | ✅ DONE | 🔴 Critical |
| **Security** | Key Vault integration | 🔜 TODO | 🟡 High |
| **Security** | HTTPS enforcement | ✅ DONE | 🔴 Critical |
| **Security** | Managed Identity | ✅ DONE | 🔴 Critical |
| **Reliability** | Min replicas ≥ 2 | ✅ DONE | 🔴 Critical |
| **Reliability** | Health probes | ✅ DONE | 🔴 Critical |
| **Reliability** | Geo-replication | ✅ DONE | 🟡 High |
| **Reliability** | Multi-region deployment | 🔜 TODO | 🟢 Medium |
| **Monitoring** | Application Insights | 🔜 TODO | 🟡 High |
| **Monitoring** | Diagnostic settings | 🔜 TODO | 🟡 High |
| **Monitoring** | Alert rules | 🔜 TODO | 🟡 High |
| **Compliance** | Azure Policy enabled | 🔜 TODO | 🟡 High |
| **Compliance** | Defender for Containers | 🔜 TODO | 🟡 High |

---

## 💰 Cost Impact Analysis

### Current Configuration (Development)
- Log Analytics: ~$2-5/day (depends on ingestion)
- Container App Environment: ~$0.50/day (consumption)
- ACR Basic: ~$0.17/day
- Container App: ~$1/day (minimal usage)
**Total:** ~$4/day (~$120/month)

### Recommended Production Configuration
- Log Analytics: ~$2-5/day
- Container App Environment: ~$1-2/day (with zone redundancy)
- ACR Premium: ~$20/day (includes geo-replication)
- Container App: ~$5-10/day (2 min replicas)
- Key Vault: ~$0.10/day
- VNet/NSG: ~$0.50/day
- Application Gateway (optional): ~$5/day
**Total:** ~$35-45/day (~$1,050-1,350/month)

**Cost Optimization Tips:**
- Use consumption plan (current) for non-prod environments
- Consider workload profiles only if dedicated compute needed
- Enable auto-scaling to handle peak loads efficiently
- Use Azure Hybrid Benefit if applicable

---

## 🔗 References

- [Azure Container Apps Best Practices](https://learn.microsoft.com/en-us/azure/well-architected/service-guides/azure-container-apps)
- [Secure Deployment Guide](https://learn.microsoft.com/en-us/azure/container-apps/secure-deployment)
- [VNet Integration](https://learn.microsoft.com/en-us/azure/container-apps/vnet-custom)
- [Key Vault Integration](https://learn.microsoft.com/en-us/azure/container-apps/key-vault-certificates-manage)
- [Zone Redundancy](https://learn.microsoft.com/en-us/azure/reliability/reliability-azure-container-apps)

---

## 📞 Next Actions

1. **Review with team:** Discuss VNet architecture and IP addressing
2. **Budget approval:** Confirm Premium SKU cost increase
3. **Application code:** Implement health check endpoints (`/health/live`, `/health/ready`)
4. **Build pipeline:** Set up ACR build and deployment workflow
5. **Secrets audit:** Identify all secrets to migrate to Key Vault
