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

# Azure Front Door Profile
resource "azurerm_cdn_frontdoor_profile" "afd_profile" {
  name                = "${var.app_name}-${var.environment_name}-afd-profile"
  resource_group_name = var.resource_group_name
  sku_name            = "Premium_AzureFrontDoor"
}

# Backend Pool
resource "azurerm_cdn_frontdoor_origin_group" "backend_pool" {
  name                     = "${var.app_name}-${var.environment_name}-backendpool"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.afd_profile.id
  session_affinity_enabled = false

  load_balancing {
  }
}

# Define the Web App as an Origin (Backend)
resource "azurerm_cdn_frontdoor_origin" "webapp_origin" {
  name                          = "${var.app_name}-${var.environment_name}-origin"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.backend_pool.id
  enabled                       = true
  certificate_name_check_enabled = false
  host_name                     = azurerm_static_web_app.web-enrollment.default_host_name  # Always points to the latest deployed instance
  origin_host_header            = azurerm_static_web_app.web-enrollment.default_host_name
  http_port                     = 80
  https_port                    = 443
  priority                      = 1
  weight                        = 1000
}

# Front Door Frontend Endpoint
resource "azurerm_cdn_frontdoor_endpoint" "frontend_endpoint" {
  name                     = "${var.app_name}-${var.environment_name}-frontend"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.afd_profile.id
}

# Routing Rule to Forward Requests to the Web App
resource "azurerm_cdn_frontdoor_route" "default_route" {
  name                          = "${var.app_name}-${var.environment_name}-route"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.frontend_endpoint.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.backend_pool.id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.webapp_origin.id]
  forwarding_protocol           = "MatchRequest"
  patterns_to_match             = ["/*"]
  supported_protocols           = ["Http", "Https"]
  https_redirect_enabled        = true
  link_to_default_domain        = true  # <--- Keep Azure Front Door Default Domain
}