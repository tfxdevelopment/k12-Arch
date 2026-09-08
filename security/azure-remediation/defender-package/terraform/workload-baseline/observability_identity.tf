# ---------------------------------------------------------------------------
# MCSB LT-3: one Log Analytics workspace per environment is the diagnostics
# sink for every resource (plan decision D-7). Prod interactive retention is
# 120 days; the CFI 3-year audit requirement is met with the archive tier
# (set per table after creation — not modelled here).
# ---------------------------------------------------------------------------
resource "azurerm_log_analytics_workspace" "this" {
  name                = "log-${local.prefix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days
  tags                = local.tags
}

# ---------------------------------------------------------------------------
# MCSB IM-3: one user-assigned identity per application (bounded context).
# A UAI (rather than system-assigned) lets Key Vault / ACR / Service Bus role
# assignments exist before the Container App is created, which avoids the
# first-deploy chicken-and-egg with Key Vault secret references.
# ---------------------------------------------------------------------------
resource "azurerm_user_assigned_identity" "enrollment_api" {
  name                = "id-${local.prefix}-enrollment-api"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tags                = local.tags
}

# Data-plane roles for the app identity — least privilege per entity.
locals {
  app_role_assignments = {
    kv_secrets_user     = { scope = azurerm_key_vault.this.id, role = "Key Vault Secrets User" }
    acr_pull            = { scope = azurerm_container_registry.this.id, role = "AcrPull" }
    appconfig_reader    = { scope = azurerm_app_configuration.this.id, role = "App Configuration Data Reader" }
    sb_sender_events    = { scope = azurerm_servicebus_topic.system_events.id, role = "Azure Service Bus Data Sender" }
    sb_receiver_events  = { scope = azurerm_servicebus_subscription.enrollment_api.id, role = "Azure Service Bus Data Receiver" }
    eh_sender_telemetry = { scope = azurerm_eventhub.app_telemetry.id, role = "Azure Event Hubs Data Sender" }
    blob_documents      = { scope = azurerm_storage_container.documents.id, role = "Storage Blob Data Contributor" }
  }
}

resource "azurerm_role_assignment" "enrollment_api" {
  for_each = local.app_role_assignments

  scope                = each.value.scope
  role_definition_name = each.value.role
  principal_id         = azurerm_user_assigned_identity.enrollment_api.principal_id
}

# Ops/Architects group — data-plane roles for nonprod per the RBAC proposal.
locals {
  ops_architects_roles = var.is_production_like ? {} : {
    kv_admin         = { scope = azurerm_key_vault.this.id, role = "Key Vault Administrator" }
    appconfig_owner  = { scope = azurerm_app_configuration.this.id, role = "App Configuration Data Owner" }
    sb_owner         = { scope = azurerm_servicebus_namespace.this.id, role = "Azure Service Bus Data Owner" }
    eh_owner         = { scope = azurerm_eventhub_namespace.this.id, role = "Azure Event Hubs Data Owner" }
    blob_contributor = { scope = azurerm_storage_account.this.id, role = "Storage Blob Data Contributor" }
  }
}

resource "azurerm_role_assignment" "ops_architects" {
  for_each = local.ops_architects_roles

  scope                = each.value.scope
  role_definition_name = each.value.role
  principal_id         = var.ops_architects_group_object_id
}
