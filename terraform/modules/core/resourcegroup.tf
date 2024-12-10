resource "azurerm_resource_group" "rg" {
  name      = var.environment_name
  location  = var.location
  tags      = var.tags
}

resource "azurerm_role_assignment" "rg" {
  scope                = azurerm_resource_group.rg.id
  role_definition_name = "Contributor"
  principal_id         = var.contributor_principal_id
}