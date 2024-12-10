resource "azurerm_api_management" "api_enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  location            = var.location
  resource_group_name = var.resource_group_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email

  sku_name = "Developer_1"

  tags      = var.tags
}

resource "azurerm_api_management_api_version_set" "api-enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  display_name        = "${var.environment_name}-api-enrollment"
  versioning_scheme   = "Segment"
}

resource "azurerm_api_management_api" "api_enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  revision            = "1"
  display_name        = "${var.environment_name}-api-enrollment"
  protocols           = ["https"]
}