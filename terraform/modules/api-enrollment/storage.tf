resource "azurerm_storage_account" "api-enrollment" {
  name                     = "${var.environment_name}apienrollment"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_account" "api-enrollment-hns" {
  name                     = "${var.environment_name}enrollmenthns"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  is_hns_enabled           = true
}