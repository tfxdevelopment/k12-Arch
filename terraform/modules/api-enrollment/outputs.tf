output "application_insights_connection_string" {
  value = azurerm_application_insights.api-enrollment-insights.connection_string
  sensitive = true
}

# Container Apps Outputs
output "aca_environment_id" {
  description = "Container App Environment ID"
  value       = azurerm_container_app_environment.api_env.id
}

output "aca_environment_default_domain" {
  description = "Default domain for Container Apps"
  value       = azurerm_container_app_environment.api_env.default_domain
}

output "aca_app_fqdn" {
  description = "Container App FQDN"
  value       = azurerm_container_app.api_app.latest_revision_fqdn
}

output "aca_app_url" {
  description = "Container App URL"
  value       = "https://${azurerm_container_app.api_app.latest_revision_fqdn}"
}

output "acr_login_server" {
  description = "ACR login server URL"
  value       = azurerm_container_registry.acr.login_server
}

output "redis_hostname" {
  description = "Redis Cache hostname"
  value       = azurerm_redis_cache.dapr_state.hostname
}

output "vnet_id" {
  description = "Virtual Network ID"
  value       = azurerm_virtual_network.k12_vnet.id
}

output "aca_subnet_id" {
  description = "Container Apps subnet ID"
  value       = azurerm_subnet.aca_subnet.id
}

output "apim_subnet_id" {
  description = "APIM subnet ID for future integration"
  value       = azurerm_subnet.apim_subnet.id
}
