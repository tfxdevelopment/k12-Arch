# Service Bus Namespace
resource "azurerm_servicebus_namespace" "k12" {
  name                = "${var.servicebus_namespace_name}-k12-${var.environment_name}-sbns"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  
  minimum_tls_version           = var.minimum_tls_version
  public_network_access_enabled = var.public_network_access_enabled
  local_auth_enabled            = var.local_auth_enabled

  tags = var.tags
}

# Authorization Rule (RootManageSharedAccessKey)
resource "azurerm_servicebus_namespace_authorization_rule" "root_manage" {
  name         = "RootManageSharedAccessKey"
  namespace_id = azurerm_servicebus_namespace.k12.id

  listen = true
  send   = true
  manage = true
}

# Service Bus Queues
resource "azurerm_servicebus_queue" "queues" {
  for_each = { for queue in var.queues : queue.name => queue }

  name         = each.value.name
  namespace_id = azurerm_servicebus_namespace.k12.id

  lock_duration                        = coalesce(each.value.lock_duration, "PT1M")
  max_size_in_megabytes                = coalesce(each.value.max_size_in_megabytes, 1024)
  requires_duplicate_detection         = coalesce(each.value.requires_duplicate_detection, false)
  requires_session                     = coalesce(each.value.requires_session, false)
  default_message_ttl                  = coalesce(each.value.default_message_ttl, "P14D")
  dead_lettering_on_message_expiration = coalesce(each.value.dead_lettering_on_message_expiration, false)
  duplicate_detection_history_time_window = coalesce(each.value.duplicate_detection_history_time_window, "PT10M")
  max_delivery_count                   = coalesce(each.value.max_delivery_count, 10)
}
