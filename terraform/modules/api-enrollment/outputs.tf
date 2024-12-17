output "application_insights_connection_string" {
  value = azurerm_application_insights.api-enrollment-insights.connection_string
  sensitive = true
}
