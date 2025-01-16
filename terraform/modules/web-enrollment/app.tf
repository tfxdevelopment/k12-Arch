resource "azurerm_static_web_app" "web-enrollment" {
  name                = "${var.app_name}-${var.environment_name}-web-app"
  resource_group_name = var.resource_group_name
  location            = "eastus2"
  sku_tier            = "Standard"

  lifecycle {
    ignore_changes = [
      tags,
      sku_tier
    ]
  }
}