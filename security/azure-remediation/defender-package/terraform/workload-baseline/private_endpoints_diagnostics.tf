# ---------------------------------------------------------------------------
# MCSB NS-2.1 — Private endpoints. One map drives every "...should use private
# link" recommendation in plan Section 5.
# ---------------------------------------------------------------------------
locals {
  private_endpoints = {
    keyvault = {
      resource_id = azurerm_key_vault.this.id
      subresource = "vault"
      dns_zone    = "keyvault"
    }
    appconfig = {
      resource_id = azurerm_app_configuration.this.id
      subresource = "configurationStores"
      dns_zone    = "appconfig"
    }
    servicebus = {
      resource_id = azurerm_servicebus_namespace.this.id
      subresource = "namespace"
      dns_zone    = "servicebus"
    }
    eventhub = {
      resource_id = azurerm_eventhub_namespace.this.id
      subresource = "namespace"
      dns_zone    = "servicebus"
    }
    blob = {
      resource_id = azurerm_storage_account.this.id
      subresource = "blob"
      dns_zone    = "blob"
    }
    sql = {
      resource_id = azurerm_mssql_server.this.id
      subresource = "sqlServer"
      dns_zone    = "sql"
    }
    acr = {
      resource_id = azurerm_container_registry.this.id
      subresource = "registry"
      dns_zone    = "acr"
    }
    redis = {
      resource_id = azurerm_managed_redis.this.id
      subresource = "redisEnterprise"
      dns_zone    = "redis"
    }
    containerapps = {
      resource_id = azurerm_container_app_environment.this.id
      subresource = "managedEnvironments"
      dns_zone    = "containerapps"
    }
    staticwebapp = {
      resource_id = azurerm_static_web_app.admin_portal.id
      subresource = "staticSites"
      dns_zone    = "staticwebapp"
    }
  }
}

resource "azurerm_private_endpoint" "this" {
  for_each = local.private_endpoints

  name                = "pe-${local.prefix}-${each.key}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  subnet_id           = azurerm_subnet.pe.id
  tags                = local.tags

  private_service_connection {
    name                           = "psc-${each.key}"
    private_connection_resource_id = each.value.resource_id
    subresource_names              = [each.value.subresource]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [azurerm_private_dns_zone.this[each.value.dns_zone].id]
  }

  depends_on = [azurerm_subnet_network_security_group_association.pe]
}

# ---------------------------------------------------------------------------
# MCSB LT-3 — Resource logs. `allLogs` category group on everything; closes
# every "Resource logs in X should be enabled" recommendation. The DINE
# policies in platform-guardrails are the safety net for resources created
# outside this module.
# ---------------------------------------------------------------------------
locals {
  diagnostic_targets = {
    keyvault      = azurerm_key_vault.this.id
    appconfig     = azurerm_app_configuration.this.id
    servicebus    = azurerm_servicebus_namespace.this.id
    eventhub      = azurerm_eventhub_namespace.this.id
    acr           = azurerm_container_registry.this.id
    containerapps = azurerm_container_app_environment.this.id
    redis         = azurerm_managed_redis.this.id
    nsg_pe        = azurerm_network_security_group.pe.id
    blob          = "${azurerm_storage_account.this.id}/blobServices/default"
    sqldb         = azurerm_mssql_database.enrollment.id
  }
}

resource "azurerm_monitor_diagnostic_setting" "all_logs" {
  for_each = local.diagnostic_targets

  name                           = "diag-${each.key}-law"
  target_resource_id             = each.value
  log_analytics_workspace_id     = azurerm_log_analytics_workspace.this.id
  log_analytics_destination_type = "Dedicated"

  enabled_log {
    category_group = "allLogs"
  }

  enabled_metric {
    category = "AllMetrics"
  }
}
