resource "azurerm_mssql_server" "api-enrollment-db" {
  name                         = "${var.environment_name}-api-enrollment"
  resource_group_name          = var.resource_group_name
  location                     = "eastus2"
  version                      = "12.0"
  minimum_tls_version          = "1.2"

  azuread_administrator {
    login_username = "CFI-AzureDevOps - K12 - Project Collection Admin - Limited"
    object_id = "df8b0836-7e1b-41dc-8e66-6b6792256785"
    azuread_authentication_only = true
  }

  tags      = var.tags
}

resource "azurerm_mssql_database" "api-enrollment-k12" {
  name         = "K12"
  server_id    = azurerm_mssql_server.api-enrollment-db.id
  collation    = "SQL_Latin1_General_CP1_CI_AS"
  license_type = "LicenseIncluded"
  max_size_gb  = 2
  sku_name     = "GP_S_Gen5_2"

  tags      = var.tags

  # prevent the possibility of accidental data loss
#  lifecycle {
#    prevent_destroy = true
#  }
}

resource "azurerm_mssql_firewall_rule" "api-enrollment-allow-azure-services" {
  name              = "AllowAzureServices"
  server_id         = azurerm_mssql_server.api-enrollment-db.id
  start_ip_address  = "0.0.0.0"
  end_ip_address    = "0.0.0.0"
}

resource "azurerm_mssql_firewall_rule" "api-enrollment-allow-zscaler" {
  name              = "AllowZScalerIPs"
  server_id         = azurerm_mssql_server.api-enrollment-db.id
  start_ip_address  = "${var.zscaler_ip_list.start_ip}"
  end_ip_address    = "${var.zscaler_ip_list.end_ip}"
}

resource "azurerm_mssql_firewall_rule" "api-enrollment-allow-devs" {
  for_each = var.dev_ip_list
  name             = "FirewallRule-${each.key}"
  server_id        = azurerm_mssql_server.api-enrollment-db.id
  start_ip_address = each.value
  end_ip_address   = each.value
}