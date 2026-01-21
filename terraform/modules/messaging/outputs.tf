output "namespace_id" {
  value       = azurerm_servicebus_namespace.k12.id
  description = "The ID of the Service Bus namespace"
}

output "namespace_name" {
  value       = azurerm_servicebus_namespace.k12.name
  description = "The name of the Service Bus namespace"
}

output "namespace_connection_string" {
  value       = data.azurerm_servicebus_namespace_authorization_rule.root_manage.primary_connection_string
  description = "The primary connection string for the namespace"
  sensitive   = true
}

output "namespace_connection_string_secondary" {
  value       = data.azurerm_servicebus_namespace_authorization_rule.root_manage.secondary_connection_string
  description = "The secondary connection string for the namespace"
  sensitive   = true
}

output "namespace_primary_key" {
  value       = data.azurerm_servicebus_namespace_authorization_rule.root_manage.primary_key
  description = "The primary key for the namespace"
  sensitive   = true
}

output "namespace_secondary_key" {
  value       = data.azurerm_servicebus_namespace_authorization_rule.root_manage.secondary_key
  description = "The secondary key for the namespace"
  sensitive   = true
}

output "queue_ids" {
  value       = { for queue_name, queue in azurerm_servicebus_queue.queues : queue_name => queue.id }
  description = "IDs of all created Service Bus queues"
}

output "queue_names" {
  value       = [for queue in azurerm_servicebus_queue.queues : queue.name]
  description = "Names of all created Service Bus queues"
}
