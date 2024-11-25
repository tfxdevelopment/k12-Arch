resource "azurerm_static_web_app" "web-enrollment" {
  name                = "${var.environment_name}-web-enrollment"
  resource_group_name = var.resource_group_name
  location            = "eastus2"
}