output "namespace_id" {
  value       = azurerm_servicebus_namespace.k12.id
  description = "The ID of the Service Bus namespace"
}

output "namespace_name" {
  value       = azurerm_servicebus_namespace.k12.name
  description = "The name of the Service Bus namespace"
}

output "queue_ids" {
  value       = { for queue_name, queue in azurerm_servicebus_queue.queues : queue_name => queue.id }
  description = "IDs of all created Service Bus queues"
}

output "queue_names" {
  value       = [for queue in azurerm_servicebus_queue.queues : queue.name]
  description = "Names of all created Service Bus queues"
}

output "dapr_pubsub_primary_connection_string" {
  value       = azurerm_servicebus_namespace_authorization_rule.dapr_pubsub.primary_connection_string
  description = "Primary connection string for Dapr pub/sub component"
  sensitive   = true
}
