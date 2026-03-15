resource "azurerm_storage_account" "api-enrollment" {
  name                     = "${var.environment_name}apienrollment"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = var.tags
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

resource "azurerm_storage_account" "api-enrollment-hns" {
  name                     = "${var.environment_name}enrollmenthns"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  is_hns_enabled           = true
  tags                     = var.tags
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

resource "azurerm_role_assignment" "function_blob_delegator" {
  scope                = azurerm_storage_account.api-enrollment-hns.id
  role_definition_name = "Storage Blob Delegator"
  principal_id         = azurerm_windows_function_app.api-enrollment.identity[0].principal_id
}

resource "azurerm_role_assignment" "k12_contributors_sa" {
  scope                = azurerm_storage_account.api-enrollment-hns.id
  role_definition_name = "Storage Blob Delegator"
  principal_id         = "50a9f81f-da2d-4770-ba17-c642a38e9eb0"
}