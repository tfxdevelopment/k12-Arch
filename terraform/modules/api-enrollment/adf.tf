#Resources for Azure DataFactory

#A managed identity service principal for ADF to connect to storage
resource "azurerm_user_assigned_identity" "adf_mi" {
  name                = "K12${var.environment_name}-adf-sp"
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_role_assignment" "adf_mi_to_enrollmenthns" {
  scope                 = azurerm_storage_account.api-enrollment-hns.id
  role_definition_name  = "Storage Blob Contributor"
  principal_id          = azurerm_user_assigned_identity.adf_mi.principal_id
}