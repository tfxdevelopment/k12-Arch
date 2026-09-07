output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "log_analytics_workspace_id" {
  description = "Feed this into platform-guardrails/policy log_analytics_workspace_ids."
  value       = azurerm_log_analytics_workspace.this.id
}

output "container_app_environment_default_domain" {
  description = "Private default domain; resolvable only inside the VNet via the privatelink zone."
  value       = azurerm_container_app_environment.this.default_domain
}

output "private_endpoint_ips" {
  value = { for k, pe in azurerm_private_endpoint.this : k => pe.private_service_connection[0].private_ip_address }
}

output "enrollment_api_identity_client_id" {
  value = azurerm_user_assigned_identity.enrollment_api.client_id
}

output "nat_egress_ip" {
  description = "Allow-list this at NSC / SFTP partners."
  value       = azurerm_public_ip.nat.ip_address
}
