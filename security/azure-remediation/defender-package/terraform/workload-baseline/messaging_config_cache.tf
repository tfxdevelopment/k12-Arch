# ---------------------------------------------------------------------------
# Plan 5.4 — App Configuration (MCSB NS-2, IM-1, DP-8)
# Closes: private link; disable public network access; local auth disabled;
# SKU supports private link.
# ---------------------------------------------------------------------------
resource "azurerm_app_configuration" "this" {
  name                = "appcs-${local.short}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku                 = "standard" # private link needs >= standard

  local_auth_enabled         = false      # "stores should have local authentication methods disabled"
  public_network_access      = "Disabled" # "should disable public network access"
  purge_protection_enabled   = true
  soft_delete_retention_days = 7

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

# ---------------------------------------------------------------------------
# Plan 5.5 — Redis: Azure Managed Redis replaces Azure Cache for Redis
# (retires 30 Sep 2028). Entra auth only, TLS only, private endpoint.
# ---------------------------------------------------------------------------
resource "azurerm_managed_redis" "this" {
  name                = "redis-${local.prefix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku_name            = var.redis_sku

  high_availability_enabled = var.is_production_like
  public_network_access     = "Disabled" # "should disable public network access"

  default_database {
    access_keys_authentication_enabled = false       # "should not use access keys for authentication"
    client_protocol                    = "Encrypted" # "only secure connections"
    clustering_policy                  = "OSSCluster"
    eviction_policy                    = "VolatileLRU"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

# Entra data-access policy for the app identity (replaces the access key).
resource "azurerm_managed_redis_access_policy_assignment" "enrollment_api" {
  managed_redis_id = azurerm_managed_redis.this.id
  object_id        = azurerm_user_assigned_identity.enrollment_api.principal_id
  # Assigned to the "default" database with the built-in "default" access policy.
}

# ---------------------------------------------------------------------------
# Plan 5.6 — Service Bus (MCSB IM-1, NS-2, PA-1, DP-3, LT-3)
# Closes: local auth disabled; private link (Premium); disable public network
# access; no namespace-level SAS rules; resource logs.
# ---------------------------------------------------------------------------
resource "azurerm_servicebus_namespace" "this" {
  name                = "sb-${local.short}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku                 = "Premium" # private link requires Premium
  capacity            = var.servicebus_capacity

  local_auth_enabled            = false # "should have local authentication methods disabled"
  public_network_access_enabled = false # "should disable public network access"
  minimum_tls_version           = "1.2"

  network_rule_set {
    default_action                = "Deny"
    public_network_access_enabled = false
    trusted_services_allowed      = true # Event Grid, Logic Apps, Stream Analytics, etc.
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

resource "azurerm_servicebus_topic" "system_events" {
  name         = "system-events"
  namespace_id = azurerm_servicebus_namespace.this.id
}

resource "azurerm_servicebus_subscription" "enrollment_api" {
  name               = "enrollment-api"
  topic_id           = azurerm_servicebus_topic.system_events.id
  max_delivery_count = 10
}

# ---------------------------------------------------------------------------
# Plan 5.7 — Event Hubs (MCSB IM-1, NS-2, PA-1, DP-3, LT-3)
# Closes: local auth disabled; private link (Standard+); disable public
# network access; no namespace-level SAS rules; resource logs.
# ---------------------------------------------------------------------------
resource "azurerm_eventhub_namespace" "this" {
  name                     = "evhns-${local.short}"
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  sku                      = "Standard" # Basic has no private link
  capacity                 = var.eventhub_capacity
  auto_inflate_enabled     = true
  maximum_throughput_units = var.is_production_like ? 10 : 2

  local_authentication_enabled  = false # "should have local authentication methods disabled"
  public_network_access_enabled = false # "should disable public network access"
  minimum_tls_version           = "1.2"

  network_rulesets {
    default_action                 = "Deny"
    public_network_access_enabled  = false
    trusted_service_access_enabled = true
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

resource "azurerm_eventhub" "app_telemetry" {
  name              = "app-telemetry"
  namespace_id      = azurerm_eventhub_namespace.this.id
  partition_count   = 4
  message_retention = var.is_production_like ? 7 : 1
}
