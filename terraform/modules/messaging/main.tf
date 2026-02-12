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
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

# Service Bus Queues
resource "azurerm_servicebus_queue" "queues" {
  for_each = { for queue in var.queues : queue.name => queue }

  name         = each.value.name
  namespace_id = azurerm_servicebus_namespace.k12.id

  lock_duration                        = each.value.lock_duration
  max_size_in_megabytes                = each.value.max_size_in_megabytes
  requires_duplicate_detection         = each.value.requires_duplicate_detection
  requires_session                     = each.value.requires_session
  default_message_ttl                  = each.value.default_message_ttl
  dead_lettering_on_message_expiration = each.value.dead_lettering_on_message_expiration
  duplicate_detection_history_time_window = each.value.duplicate_detection_history_time_window
  max_delivery_count                   = each.value.max_delivery_count
}

