resource "azurerm_static_web_app" "web-app" {
  name                = "${var.app_name}-${var.environment_name}-web-app"
  resource_group_name = var.resource_group_name
  location            = "eastus2"
  sku_size            = "Standard"
  sku_tier            = "Standard"

  app_settings = {
    "PastDueTaskStatusCronSchedule"                 = "0 0 0 * * *"
    "UserResourceAccessMappingFullSyncCronSchedule" = "0 */10 * * * *"
  }

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
  sku_name            = "Standard_AzureFrontDoor"
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
  host_name                     = azurerm_static_web_app.web-app.default_host_name  # Always points to the latest deployed instance
  origin_host_header            = azurerm_static_web_app.web-app.default_host_name
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


#Enable this when we get proper CNAME for lower env

# resource "azurerm_web_application_firewall_policy" "waf_policy" {
#   name                = "${var.app_name}-${var.environment_name}-waf-policy"
#   resource_group_name = var.resource_group_name
#   location            = "eastus2"
#   policy_settings {
#     enabled = true
#     mode    = "Prevention"
#   }

#   custom_rules {
#     name     = "AllowSpecificIPs"
#     priority = 1
#     rule_type = "MatchRule"
#     action    = "Allow"

#     match_conditions {
#       match_variable     = "RemoteAddr"
#       operator           = "IPMatch"
#       match_values       = ["203.0.113.0/24"]
#       negation_condition = false
#     }
#   }

#   custom_rules {
#     name     = "DenyAllOthers"
#     priority = 2
#     rule_type = "MatchRule"
#     action    = "Block"
#   }
# }
# resource "azurerm_cdn_frontdoor_security_policy" "afd_waf_policy" {
#   name                     = "${var.app_name}-${var.environment_name}-afd-security-policy"
#   cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.afd_profile.id

#   security_policies {
#     waf_policy {
#       firewall_policy_id = azurerm_web_application_firewall_policy.waf_policy.id

#       associations {
#         domain {
#           cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_endpoint.frontend_endpoint.id
#         }

#         patterns_to_match = ["/*"]
#         route_ids         = [azurerm_cdn_frontdoor_route.default_route.id]
#       }
#     }
#   }
# }

# 2026-02-06: As part of https://cfi-nc.atlassian.net/browse/K12-5338 we are renaming the terraform resources that use the term "enrollment" to be more generic and reusable for other resources in the future. 
# The moved blocks indicate the old and new resource names. This applies to the resource definitions in terraform only. 
# The actual resources will retain their names in Azure for now. 
# Although they clutter up the code, Hashicorp recommends leaving moved blocks indefinitely to prevent accidental reuse of old resource names and to provide a clear history of changes.

moved {
  from = azurerm_static_web_app.web-enrollment
  to   = azurerm_static_web_app.web-app
}