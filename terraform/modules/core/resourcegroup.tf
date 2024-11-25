resource "azurerm_resource_group" "rg" {
  name      = var.environment_name
  location  = var.location
  tags      = var.tags
}