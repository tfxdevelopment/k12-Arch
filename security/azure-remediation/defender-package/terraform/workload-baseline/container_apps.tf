# ---------------------------------------------------------------------------
# Plan 5.3 — Azure Container Apps (MCSB NS-1, NS-2, IM-3, DP-3, DP-6, LT-3)
# Closes: environments should use network injection; environment should
# disable public network access; apps should disable external network
# access; HTTPS only; managed identity enabled; diagnostics.
#
# NOTE (breaking change, plan Section 7): environment type, VNet and
# internal/external mode cannot be changed in place. Existing consumption-only
# public environments are replaced, not migrated.
# ---------------------------------------------------------------------------
resource "azurerm_container_app_environment" "this" {
  name                = "cae-${local.prefix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location

  infrastructure_subnet_id       = azurerm_subnet.aca.id # "should use network injection"
  internal_load_balancer_enabled = true                  # "should disable public network access"
  public_network_access          = "Disabled"            # required for the private endpoint; blocks the public *.azurecontainerapps.io
  zone_redundancy_enabled        = var.is_production_like
  mutual_tls_enabled             = var.is_production_like # peer-to-peer encryption between apps

  log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id
  logs_destination           = "log-analytics"

  # Workload profiles are required for private endpoints, UDR and NAT Gateway.
  workload_profile {
    name                  = "Consumption"
    workload_profile_type = "Consumption"
  }
  dynamic "workload_profile" {
    for_each = var.is_production_like ? [1] : []
    content {
      name                  = "general"
      workload_profile_type = "D4"
      minimum_count         = 1
      maximum_count         = 3
    }
  }

  tags = local.tags

  depends_on = [azurerm_subnet_nat_gateway_association.aca]
}

# ---------------------------------------------------------------------------
# Reference app — the shape every K12 API listener should follow.
# ---------------------------------------------------------------------------
resource "azurerm_container_app" "enrollment_api" {
  name                         = "ca-${local.prefix}-enrollment-api"
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = azurerm_resource_group.this.name
  revision_mode                = "Single"
  workload_profile_name        = "Consumption"

  identity {
    type         = "UserAssigned" # "Managed Identity should be enabled for Container Apps"
    identity_ids = [azurerm_user_assigned_identity.enrollment_api.id]
  }

  # Pull images with the app identity, never the ACR admin user.
  registry {
    server   = azurerm_container_registry.this.login_server
    identity = azurerm_user_assigned_identity.enrollment_api.id
  }

  # Secrets are Key Vault references resolved by the app identity — no inline
  # values, no connection strings (plan 5.3 "Secrets stored in app secrets").
  secret {
    name                = "nsc-api-key"
    identity            = azurerm_user_assigned_identity.enrollment_api.id
    key_vault_secret_id = azurerm_key_vault_secret.example_api_key.versionless_id
  }

  ingress {
    external_enabled           = false # "Container Apps should disable external network access"
    allow_insecure_connections = false # "Container Apps should only be accessible over HTTPS"
    target_port                = 8080
    transport                  = "http"
    client_certificate_mode    = "ignore" # set to "require" for service-to-service mTLS with APIM
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  dapr {
    app_id       = "enrollment-api"
    app_port     = 8080
    app_protocol = "http"
  }

  template {
    min_replicas = var.is_production_like ? 2 : 0
    max_replicas = 10

    container {
      name   = "api"
      image  = var.container_app_image
      cpu    = 0.5
      memory = "1Gi"

      # Identity-based configuration: the app reads App Configuration and
      # Key Vault with DefaultAzureCredential using this client ID.
      env {
        name  = "AZURE_CLIENT_ID"
        value = azurerm_user_assigned_identity.enrollment_api.client_id
      }
      env {
        name  = "APPCONFIG_ENDPOINT"
        value = azurerm_app_configuration.this.endpoint
      }
      env {
        name        = "NSC_API_KEY"
        secret_name = "nsc-api-key"
      }
    }
  }

  tags = local.tags

  depends_on = [azurerm_role_assignment.enrollment_api]
}

# ---------------------------------------------------------------------------
# Dapr components on managed identity (plan 5.5 / 5.6 "Dapr components using
# connection strings"). `azureClientId` replaces `connectionString` /
# `secretKeyRef`. Scoped to the apps that need them.
# ---------------------------------------------------------------------------
resource "azurerm_container_app_environment_dapr_component" "pubsub_servicebus" {
  name                         = "pubsub"
  container_app_environment_id = azurerm_container_app_environment.this.id
  component_type               = "pubsub.azure.servicebus.topics"
  version                      = "v1"
  scopes                       = ["enrollment-api"]

  metadata {
    name  = "namespaceName"
    value = "${azurerm_servicebus_namespace.this.name}.servicebus.windows.net"
  }
  metadata {
    name  = "azureClientId"
    value = azurerm_user_assigned_identity.enrollment_api.client_id
  }
}

resource "azurerm_container_app_environment_dapr_component" "statestore_redis" {
  name                         = "statestore"
  container_app_environment_id = azurerm_container_app_environment.this.id
  component_type               = "state.redis"
  version                      = "v1"
  scopes                       = ["enrollment-api"]

  metadata {
    name  = "redisHost"
    value = "${azurerm_managed_redis.this.hostname}:10000"
  }
  metadata {
    name  = "useEntraID"
    value = "true"
  }
  metadata {
    name  = "azureClientId"
    value = azurerm_user_assigned_identity.enrollment_api.client_id
  }
  metadata {
    name  = "enableTLS"
    value = "true"
  }
}

resource "azurerm_container_app_environment_dapr_component" "secretstore_keyvault" {
  name                         = "secretstore"
  container_app_environment_id = azurerm_container_app_environment.this.id
  component_type               = "secretstores.azure.keyvault"
  version                      = "v1"
  scopes                       = ["enrollment-api"]

  metadata {
    name  = "vaultName"
    value = azurerm_key_vault.this.name
  }
  metadata {
    name  = "azureClientId"
    value = azurerm_user_assigned_identity.enrollment_api.client_id
  }
}
