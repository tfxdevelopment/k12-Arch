resource "azurerm_mssql_server" "api-enrollment-db" {
  name                         = "${var.environment_name}-api-enrollment"
  resource_group_name          = var.resource_group_name
  location                     = var.location
  version                      = "12.0"
  minimum_tls_version          = "1.2"

  azuread_administrator {
    login_username = "CFI-AzureDevOps - K12 - Contributors"
    object_id = "50a9f81f-da2d-4770-ba17-c642a38e9eb0"
    azuread_authentication_only = false
  }

  tags      = var.tags
}

resource "azurerm_mssql_database" "api-enrollment-k12" {
  name         = "K12"
  server_id    = azurerm_mssql_server.api-enrollment-db.id
  collation    = "SQL_Latin1_General_CP1_CI_AS"
  min_capacity = 2
  auto_pause_delay_in_minutes = 240
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

# # Sometimes you have to manually set env variables before running terraform
# # export SQLCMDUSER="CFI-AzureDevOps - K12 - Contributors"
# # export SQLCMDAUTHMODE="ActiveDirectoryInteractive"

# resource "null_resource" "run-sql-scripts" {
#   provisioner "local-exec" {
#     command = <<EOT
#       export SQLCMDUSER="CFI-AzureDevOps - K12 - Contributors"
#       export SQLCMDAUTHMODE="ActiveDirectoryInteractive"
      
#       for file in CFlK12.Database/Enrollment/Tables/*.sql; do
#         sqlcmd -S ${azurerm_mssql_server.api-enrollment-db.fully_qualified_domain_name} -G -d K12 -i $file
#       done
#     EOT
#   }
#   depends_on = [azurerm_mssql_database.api-enrollment-k12]
# }