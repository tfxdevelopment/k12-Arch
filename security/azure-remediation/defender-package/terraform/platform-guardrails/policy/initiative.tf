# ---------------------------------------------------------------------------
# K12 Platform Security Guardrails — custom initiative
#
# Every definition below is a Microsoft built-in from the MCSB default
# initiative (see plan Section 5 for the Defender recommendation each one
# backs). One initiative, two assignments:
#   NonProd MG -> Audit   (visibility while Phases 1-3 remediate)
#   Prod MG    -> Deny    (prevents regression once compliant)
# ---------------------------------------------------------------------------

locals {
  policy_prefix = "/providers/Microsoft.Authorization/policyDefinitions/"

  # Effects: Audit | Deny | Disabled  -> initiative parameter denyCapableEffect
  deny_capable = {
    # Key Vault
    "kv-rbac-model"          = { id = "12d4fa5e-1f9f-4c21-97a9-b99b3c6611b5", group = "identity" } # Azure Key Vault should use RBAC permission model
    "kv-soft-delete"         = { id = "1e66c121-a66a-4b1f-9b83-0fd99bf0fc2d", group = "data" }     # Key vaults should have soft delete enabled
    "kv-purge-protection"    = { id = "0b60c0b2-2dc2-4e1c-b5c9-abbed971de53", group = "data" }     # Key vaults should have purge protection enabled
    "kv-firewall-or-private" = { id = "55615ac9-af46-4a59-874e-391cc3dfb490", group = "network" }  # Key Vault firewall enabled or public access disabled
    "kv-secret-expiry"       = { id = "98728c90-32c7-4049-8429-847dc0f4fe37", group = "data" }     # Key Vault secrets should have an expiration date
    "kv-key-expiry"          = { id = "152b15f7-8e1f-4c1f-ab71-8c010ba5dbc0", group = "data" }     # Key Vault keys should have an expiration date
    # Container Apps
    "aca-https-only"        = { id = "0e80e269-43a4-4ae9-b5bc-178126b8a5cb", group = "network" }  # Container Apps should only be accessible over HTTPS
    "aca-managed-identity"  = { id = "b874ab2d-72dd-47f1-8cb5-4a306478a4e7", group = "identity" } # Managed Identity should be enabled for Container Apps
    "aca-env-vnet-injected" = { id = "8b346db6-85af-419b-8557-92cee2c0f9bb", group = "network" }  # Container App environments should use network injection
    "aca-env-no-public"     = { id = "d074ddf8-01a5-4b5e-a2b8-964aed452c0a", group = "network" }  # Container Apps environment should disable public network access
    "aca-internal-ingress"  = { id = "783ea2a8-b8fd-46be-896a-9ae79643a0b1", group = "network" }  # Container Apps should disable external network access
    # Container Registry
    "acr-admin-disabled"     = { id = "dc921057-6b28-4fbe-9b83-f7bec05db6c2", group = "identity" } # Container registries should have local admin account disabled
    "acr-anonymous-disabled" = { id = "9f2dea28-e834-476c-99c5-3507b4728395", group = "identity" } # Container registries should have anonymous authentication disabled
    "acr-network-restricted" = { id = "d0793b48-0edc-4296-a390-4c75d1bdfd71", group = "network" }  # Container registries should not allow unrestricted network access
    # App Configuration
    "appcfg-local-auth-off" = { id = "b08ab3ca-1062-4db3-8803-eec9cae605d6", group = "identity" } # App Configuration stores should have local auth disabled
    "appcfg-no-public"      = { id = "3d9f5e4c-9947-4579-9539-2a7695fbc187", group = "network" }  # App Configuration should disable public network access
    "appcfg-sku-private"    = { id = "89c8a434-18f0-402c-8147-630a8dea54e0", group = "network" }  # App Configuration should use a SKU that supports private link
    # Redis (Azure Cache for Redis — AMR inherits these controls natively)
    "redis-ssl-only"       = { id = "22bee202-a82f-4305-9a2a-6d7f44d4dedb", group = "data" }     # Only secure connections to Azure Cache for Redis should be enabled
    "redis-no-public"      = { id = "470baccb-7e51-4549-8b1a-3e5be069f663", group = "network" }  # Azure Cache for Redis should disable public network access
    "redis-no-access-keys" = { id = "3827af20-8f80-4b15-8300-6db0873ec901", group = "identity" } # Azure Cache for Redis should not use access keys for authentication
    # Service Bus
    "sb-local-auth-off"   = { id = "cfb11c26-f069-4c14-8e36-56c394dae5af", group = "identity" } # Service Bus namespaces should have local auth disabled
    "sb-no-public"        = { id = "cbd11fd3-3002-4907-b6c8-579f0e700e13", group = "network" }  # Service Bus Namespaces should disable public network access
    "sb-no-namespace-sas" = { id = "a1817ec0-a368-432a-8057-8371e17ac6ee", group = "identity" } # All auth rules except RootManageSharedAccessKey removed (SB)
    # Event Hubs
    "eh-local-auth-off"   = { id = "5d4e3c65-4873-47be-94f3-6f8b953a3598", group = "identity" } # Event Hub namespaces should have local auth disabled
    "eh-no-public"        = { id = "0602787f-9896-402a-a6e1-39ee63ee435e", group = "network" }  # Event Hub Namespaces should disable public network access
    "eh-no-namespace-sas" = { id = "b278e460-7cfc-4451-8294-cccc40a940d7", group = "identity" } # All auth rules except RootManageSharedAccessKey removed (EH)
    # Azure SQL
    "sql-entra-only" = { id = "b3a22bc9-66de-45fb-98fa-00f5df42f41a", group = "identity" } # Azure SQL Database should have Microsoft Entra-only authentication enabled
    "sql-no-public"  = { id = "1b8ca024-1d5c-4dec-8995-b1a932b41780", group = "network" }  # Public network access on Azure SQL Database should be disabled
    "sql-tls12"      = { id = "32e6bbec-16b6-44c2-be37-c5b672d103cf", group = "data" }     # Azure SQL Database should be running TLS version 1.2 or newer
    # Storage
    "st-secure-transfer"   = { id = "404c3081-a854-4457-ae30-26a93ef643f9", group = "data" }     # Secure transfer to storage accounts should be enabled
    "st-no-public-blobs"   = { id = "4fa4b6c0-31ca-4c0d-b10d-24b96f62a751", group = "network" }  # Storage account public access should be disallowed
    "st-no-shared-key"     = { id = "8c6a50c6-9ffd-4ae7-986f-5fa6111f9a54", group = "identity" } # Storage accounts should prevent shared key access
    "st-vnet-rules"        = { id = "2a1a9cdf-e04d-429a-8416-3bfb72a1b26f", group = "network" }  # Storage accounts should restrict network access using VNet rules
    "st-no-public-network" = { id = "b2982f36-99f2-4db5-8eff-283140c09693", group = "network" }  # Storage accounts should disable public network access
    "st-min-tls"           = { id = "fe83a0eb-a853-422d-aac2-1bffd182c5d0", group = "data" }     # Storage accounts should have the specified minimum TLS version
    "st-no-cross-tenant"   = { id = "92a89a79-6c52-4a7e-a03f-61306fc49312", group = "data" }     # Storage accounts should prevent cross tenant object replication
    # API Management (if present)
    "apim-encrypted-only" = { id = "ee7495e7-3ba7-40b6-bfee-c29e22cc75d4", group = "data" }     # API Management APIs should use only encrypted protocols
    "apim-backend-auth"   = { id = "c15dcc82-b93c-4dcb-9332-fbf121685b54", group = "identity" } # API Management calls to API backends should be authenticated
    "apim-secrets-in-kv"  = { id = "f1cc7827-022c-473e-836e-5a51cae0b249", group = "data" }     # API Management secret named values should be stored in Key Vault
    "apim-scoped-subs"    = { id = "3aa03346-d8c5-4994-a5bc-7652c2a2aef1", group = "identity" } # API Management subscriptions should not be scoped to all APIs
  }

  # Effects: AuditIfNotExists | Disabled -> initiative parameter auditIfNotExistsEffect
  audit_if_not_exists = {
    "kv-private-link"      = { id = "a6abeaec-4d90-4a02-805f-6b26c4d3fbe9", group = "network" }  # Azure Key Vaults should use private link
    "kv-resource-logs"     = { id = "cf820ca0-f99e-4f3e-84fb-66e913812d21", group = "logging" }  # Resource logs in Key Vault should be enabled
    "aca-auth-enabled"     = { id = "2b585559-a78e-4cc4-b1aa-fb169d2f6b96", group = "identity" } # Authentication should be enabled on Container Apps
    "appcfg-private-link"  = { id = "ca610c1d-041c-4332-9d88-7ed3094967c7", group = "network" }  # App Configuration should use private link
    "redis-private-link"   = { id = "7803067c-7d34-46e3-8c79-0ca68fc4036d", group = "network" }  # Azure Cache for Redis should use private link
    "sb-private-link"      = { id = "1c06e275-d63d-4540-b761-71f364c2111d", group = "network" }  # Azure Service Bus namespaces should use private link
    "sb-resource-logs"     = { id = "f8d36e2f-389b-4ee4-898d-21aeb69a0f45", group = "logging" }  # Resource logs in Service Bus should be enabled
    "eh-private-link"      = { id = "b8564268-eb4a-4337-89be-a19db070c59d", group = "network" }  # Event Hub namespaces should use private link
    "eh-resource-logs"     = { id = "83a214f7-d01a-484b-91a9-ed54470c9a6a", group = "logging" }  # Resource logs in Event Hub should be enabled
    "sql-entra-admin"      = { id = "1f314764-cb73-4fc9-b863-8eca98ac36e9", group = "identity" } # Entra administrator should be provisioned for SQL servers
    "sql-auditing"         = { id = "a6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9", group = "logging" }  # Auditing on SQL server should be enabled
    "sql-va-findings"      = { id = "feedbf84-6b99-488c-acc2-71c829aa5ffc", group = "data" }     # SQL databases should have vulnerability findings resolved
    "st-private-link"      = { id = "6edd7eda-6dd8-40f7-810d-67160c639cd9", group = "network" }  # Storage accounts should use private link
    "defender-keyvault"    = { id = "0e6763cc-5078-4e64-889d-ff4d9a839047", group = "logging" }  # Azure Defender for Key Vault should be enabled
    "defender-storage"     = { id = "640d2586-54d2-465f-877f-9ffc1d2109f4", group = "logging" }  # Microsoft Defender for Storage should be enabled
    "defender-sql"         = { id = "abfb4388-5bf4-4ad7-ba82-2cd2f41ceae9", group = "logging" }  # Azure Defender for SQL should be enabled for unprotected SQL servers
    "defender-containers"  = { id = "1c988dd6-ade4-430f-a608-2a3e5b0a6d38", group = "logging" }  # Microsoft Defender for Containers should be enabled
    "sub-security-contact" = { id = "4f4f78b8-e367-4b10-a341-d9a4ad5cf1c7", group = "logging" }  # Subscriptions should have a contact email address for security issues
    "sub-alert-email"      = { id = "6e2593d9-add6-4083-9c9b-4b7d2188c899", group = "logging" }  # Email notification for high severity alerts should be enabled
    "sub-alert-owners"     = { id = "0b15565f-aa9e-48ba-8619-45960f2c314d", group = "logging" }  # Email notification to subscription owner for high severity alerts
    "sub-max-owners"       = { id = "4f11b553-d42e-4e3a-89be-32ca364cad4c", group = "identity" } # A maximum of 3 owners should be designated for your subscription
    "sub-min-owners"       = { id = "09024ccc-0c5f-475e-9457-b7c0d9ed487b", group = "identity" } # There should be more than one owner assigned to your subscription
    "sub-no-guest-owners"  = { id = "339353f6-2387-4a45-abe4-7f529d121046", group = "identity" } # Guest accounts with owner permissions should be removed
  }

  # Effects: Audit | Disabled -> initiative parameter auditOnlyEffect
  audit_only = {
    "sql-private-endpoint" = { id = "7698e800-9299-47a6-b3b6-5a0fee576eed", group = "network" } # Private endpoint connections on Azure SQL Database should be enabled
    "acr-private-link"     = { id = "e8eef0a8-67cf-4eb4-9386-14b0e78733d4", group = "network" } # Container registries should use private link
  }

  # DeployIfNotExists diagnostics -> Log Analytics (parameter logAnalyticsWorkspaceId)
  dine_diagnostics = {
    "diag-keyvault"   = { id = "6b359d8f-f88d-4052-aa7c-32015963ecc1", group = "logging" } # Enable logging by category group for Key vaults to Log Analytics
    "diag-servicebus" = { id = "0277b2d5-6e6f-4d97-9929-a5c4eab56fd7", group = "logging" } # ... Service Bus Namespaces to Log Analytics
    "diag-eventhub"   = { id = "441af8bf-7c88-4efc-bd24-b7be28d4acce", group = "logging" } # ... Event Hubs Namespaces to Log Analytics
    "diag-appconfig"  = { id = "4b05de63-3ad2-4f6d-b421-da21f1328f3b", group = "logging" } # ... App Configuration to Log Analytics
    "diag-aca-env"    = { id = "6a664864-e2b5-413e-b930-f11caa132f16", group = "logging" } # ... Container Apps Environments to Log Analytics
  }
}

resource "azurerm_policy_set_definition" "k12_guardrails" {
  name                = "k12-platform-security-guardrails"
  policy_type         = "Custom"
  display_name        = "K12 Platform Security Guardrails (MCSB-aligned)"
  description         = "Built-in MCSB policies covering the K12/NCSEAA service stack: Key Vault, Container Apps, ACR, App Configuration, Redis, Service Bus, Event Hubs, Azure SQL, Storage, APIM, plus subscription hygiene and diagnostics. Parameterised so the same initiative audits NonProd and denies in Prod."
  management_group_id = var.definition_management_group_id

  metadata = jsonencode({
    category = "K12 Platform"
    version  = "1.0.0"
    source   = "Defender-Remediation-Plan.md section 5"
  })

  parameters = jsonencode({
    denyCapableEffect = {
      type = "String"
      metadata = {
        displayName = "Effect for Audit/Deny-capable policies"
        description = "Audit on NonProd, Deny on Prod once compliant."
      }
      allowedValues = ["Audit", "Deny", "Disabled"]
      defaultValue  = "Audit"
    }
    auditIfNotExistsEffect = {
      type = "String"
      metadata = {
        displayName = "Effect for AuditIfNotExists policies"
      }
      allowedValues = ["AuditIfNotExists", "Disabled"]
      defaultValue  = "AuditIfNotExists"
    }
    auditOnlyEffect = {
      type = "String"
      metadata = {
        displayName = "Effect for Audit-only policies"
      }
      allowedValues = ["Audit", "Disabled"]
      defaultValue  = "Audit"
    }
    diagnosticsEffect = {
      type = "String"
      metadata = {
        displayName = "Effect for diagnostic-settings DINE policies"
      }
      allowedValues = ["DeployIfNotExists", "AuditIfNotExists", "Disabled"]
      defaultValue  = "DeployIfNotExists"
    }
    logAnalyticsWorkspaceId = {
      type = "String"
      metadata = {
        displayName = "Log Analytics workspace resource ID"
        description = "Target workspace for DINE diagnostic settings."
        strongType  = "omsWorkspace"
      }
    }
  })

  policy_definition_group {
    name         = "identity"
    display_name = "Identity & access (MCSB IM / PA)"
  }
  policy_definition_group {
    name         = "network"
    display_name = "Network security (MCSB NS)"
  }
  policy_definition_group {
    name         = "data"
    display_name = "Data protection (MCSB DP)"
  }
  policy_definition_group {
    name         = "logging"
    display_name = "Logging & threat detection (MCSB LT)"
  }

  dynamic "policy_definition_reference" {
    for_each = local.deny_capable
    content {
      reference_id         = policy_definition_reference.key
      policy_definition_id = "${local.policy_prefix}${policy_definition_reference.value.id}"
      policy_group_names   = [policy_definition_reference.value.group]
      parameter_values = jsonencode({
        effect = { value = "[parameters('denyCapableEffect')]" }
      })
    }
  }

  dynamic "policy_definition_reference" {
    for_each = local.audit_if_not_exists
    content {
      reference_id         = policy_definition_reference.key
      policy_definition_id = "${local.policy_prefix}${policy_definition_reference.value.id}"
      policy_group_names   = [policy_definition_reference.value.group]
      parameter_values = jsonencode({
        effect = { value = "[parameters('auditIfNotExistsEffect')]" }
      })
    }
  }

  dynamic "policy_definition_reference" {
    for_each = local.audit_only
    content {
      reference_id         = policy_definition_reference.key
      policy_definition_id = "${local.policy_prefix}${policy_definition_reference.value.id}"
      policy_group_names   = [policy_definition_reference.value.group]
      parameter_values = jsonencode({
        effect = { value = "[parameters('auditOnlyEffect')]" }
      })
    }
  }

  dynamic "policy_definition_reference" {
    for_each = local.dine_diagnostics
    content {
      reference_id         = policy_definition_reference.key
      policy_definition_id = "${local.policy_prefix}${policy_definition_reference.value.id}"
      policy_group_names   = [policy_definition_reference.value.group]
      parameter_values = jsonencode({
        effect        = { value = "[parameters('diagnosticsEffect')]" }
        categoryGroup = { value = "allLogs" }
        logAnalytics  = { value = "[parameters('logAnalyticsWorkspaceId')]" }
      })
    }
  }
}
