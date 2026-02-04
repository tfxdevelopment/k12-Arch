data "azurerm_key_vault" "api_enrollment_kv" {
  name                = "${local.environment_name}apikv"
  resource_group_name = "${local.environment_name}"
}

data "azurerm_key_vault_secret" "storage_account_key" {
  name         = "storage-account-key"
  key_vault_id = data.azurerm_key_vault.api_enrollment_kv.id
}
