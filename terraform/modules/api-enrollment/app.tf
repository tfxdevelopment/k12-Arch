# ============================================================================
# CONTAINER APPS INFRASTRUCTURE - Development Environment
# ============================================================================

resource "azurerm_service_plan" "api-enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku_name            = "Y1"
  os_type             = "Windows"
}

resource "azurerm_windows_function_app" "api-enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = azurerm_storage_account.api-enrollment.name
  storage_account_access_key = azurerm_storage_account.api-enrollment.primary_access_key
  service_plan_id            = azurerm_service_plan.api-enrollment.id

  app_settings = {
    "AzureWebJobs.MarkAccountMessageAsRead.Disabled" = "1"
    "StorageContainerName"                           = "document-leases"
  }

  site_config {
    application_stack {
      dotnet_version              = "v8.0"
      use_dotnet_isolated_runtime = true
    }

    cors {
      allowed_origins     = ["*"]
      support_credentials = false
    }
  }

  connection_string {
    name  = "DefaultConnectionString"
    type  = "SQLAzure"
    value = var.sql_connection_string
  }

  connection_string {
    name  = "AzureBlobStorage"
    type  = "Custom"
    value = var.blob_storage_connection_string
  }

  identity {
    type = "SystemAssigned"
  }

  sticky_settings {
    app_setting_names = [
      "APPINSIGHTS_INSTRUMENTATIONKEY",
      "APPLICATIONINSIGHTS_CONNECTION_STRING",
      "APPINSIGHTS_PROFILERFEATURE_VERSION",
      "APPINSIGHTS_SNAPSHOTFEATURE_VERSION",
      "ApplicationInsightsAgent_EXTENSION_VERSION",
      "XDT_MicrosoftApplicationInsights_BaseExtensions",
      "DiagnosticServices_EXTENSION_VERSION",
      "InstrumentationEngine_EXTENSION_VERSION",
      "SnapshotDebugger_EXTENSION_VERSION",
      "XDT_MicrosoftApplicationInsights_Mode",
      "XDT_MicrosoftApplicationInsights_PreemptSdk",
      "APPLICATIONINSIGHTS_CONFIGURATION_CONTENT",
      "XDT_MicrosoftApplicationInsightsJava",
      "XDT_MicrosoftApplicationInsights_NodeJS",
      "AzureSignalRConnectionString"
    ]
  }

  lifecycle {
    ignore_changes = [
      tags,
      site_config,
      connection_string,
      app_settings
    ]
  }
}

resource "azurerm_application_insights" "api-enrollment-insights" {
  name                = "${var.environment_name}-api-enrollment-insights"
  resource_group_name = var.resource_group_name
  location            = var.location
  application_type    = "web"

  lifecycle {
    ignore_changes = [
      workspace_id
    ]
  }
}

resource "azurerm_application_insights_web_test" "dev-api-enrollment-test" {
  name                    = "${var.environment_name}-api-availability-test"
  location                = var.location
  resource_group_name     = var.resource_group_name
  application_insights_id = azurerm_application_insights.api-enrollment-insights.id
  frequency               = 300 # 5 minutes in seconds
  timeout                 = 30
  enabled                 = true
  kind                    = "ping"

  geo_locations = [
    "us-va-ash-azr" //US East
  ]

  configuration = <<XML
  <WebTest Name="${var.environment_name}-api-availability-test" Id="00000000-0000-0000-0000-000000000000" Enabled="True" CssProjectStructure="" CssIteration="" Timeout="30" WorkItemIds="" xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
    <Items>
      <Request Method="GET" Version="1.1" Url="https://${var.environment_name}-api-enrollment.azure-api.net/status-0123456789abcdef" ThinkTime="0" Timeout="30" ParseDependentRequests="False" FollowRedirects="True" RecordResult="True" Cache="False" ResponseTimeGoal="0" Encoding="utf-8" ExpectedHttpStatusCode="200" />
    </Items>
  </WebTest>
  XML

  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

resource "azurerm_monitor_action_group" "app-insights-smart-detection" {
  name                = "Application Insights Smart Detection"
  resource_group_name = var.resource_group_name
  short_name          = "SmartDetect"
  location            = "Global"
  enabled             = true

  dynamic "arm_role_receiver" {
    for_each = var.arm_role_receivers
    content {
      name                    = arm_role_receiver.value.name
      role_id                 = arm_role_receiver.value.role_id
      use_common_alert_schema = arm_role_receiver.value.use_common_alert_schema
    }
  }
}

resource "azurerm_portal_dashboard" "dev-api-enrollment-dashboard" {
  name                = "${var.environment_name}-api-enrollment-dashboard"
  resource_group_name = var.resource_group_name
  location            = var.location

  dashboard_properties = jsonencode({
    "lenses" : {
      "0" : {
        "order" : 0,
        "parts" : {}
      }
    },
    "metadata" : {
      "model" : {
        "timeRange" : {
          "value" : {
            "relative" : {
              "duration" : 24,
              "timeUnit" : "hour"
            }
          }
        },
        "filterLocale" : "en-us",
        "filters" : {
          "MsPortalFx_TimeRange" : {
            "model" : {
              "format" : "utc",
              "relative" : "24h"
            }
          }
        }
      }
    }
  })
}

resource "azurerm_signalr_service" "api_enrollment_signalr" {
  name                = "${var.environment_name}-api-enrollment-signalr"
  location            = var.location
  resource_group_name = var.resource_group_name

  sku {
    name     = "Standard_S1"
    capacity = 1
  }

  cors {
    allowed_origins = ["*"]
  }

  public_network_access_enabled            = true
  local_auth_enabled                       = true
  aad_auth_enabled                         = true
  tls_client_cert_enabled                  = false
  service_mode                             = "Serverless"
  serverless_connection_timeout_in_seconds = 30

  connectivity_logs_enabled = true
  messaging_logs_enabled    = true
  http_request_logs_enabled = true

  live_trace {
    enabled                   = true
    connectivity_logs_enabled = true
    messaging_logs_enabled    = true
    http_request_logs_enabled = true
  }

  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

resource "azurerm_key_vault" "api_enrollment_kv" {
  name                       = "${var.environment_name}apikv"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  tenant_id                  = "3f80a41f-c452-4071-a415-4df4176730e2"
  sku_name                   = "standard"
  purge_protection_enabled   = true
  soft_delete_retention_days = 7
  enable_rbac_authorization  = true

  lifecycle {
    ignore_changes = [tags]
  }
}

resource "azurerm_role_assignment" "kv_reader" {
  depends_on           = [azurerm_key_vault.api_enrollment_kv]
  scope                = azurerm_key_vault.api_enrollment_kv.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = azurerm_windows_function_app.api-enrollment.identity[0].principal_id
}


resource "azurerm_role_assignment" "k12_contributors_kv_rw" {
  depends_on           = [azurerm_key_vault.api_enrollment_kv]
  scope                = azurerm_key_vault.api_enrollment_kv.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = "50a9f81f-da2d-4770-ba17-c642a38e9eb0"
}

resource "azurerm_role_assignment" "kv_apim_secrets" {
  depends_on = [azurerm_key_vault.api_enrollment_kv]

  scope                = azurerm_key_vault.api_enrollment_kv.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = azurerm_api_management.api_enrollment.identity[0].principal_id
}

resource "azurerm_storage_account" "api_enrollment_logic_app_sa" {
  name                     = "stapilogicapp${var.environment_name}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
resource "azurerm_service_plan" "api_enrollment_logic_app_service_plan" {
  name                = "${var.environment_name}-api-enrollment-sp"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Windows"
  sku_name            = "WS1"
}
resource "azurerm_logic_app_standard" "api_enrollment_logic_app" {
  name                       = "${var.environment_name}-api-enrollment-la"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  app_service_plan_id        = azurerm_service_plan.api_enrollment_logic_app_service_plan.id
  storage_account_name       = azurerm_storage_account.api_enrollment_logic_app_sa.name
  storage_account_access_key = azurerm_storage_account.api_enrollment_logic_app_sa.primary_access_key
  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME" = "dotnet"
  }
  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      tags,
      app_settings
    ]
  }
}
resource "azurerm_role_assignment" "api_enrollment_function_app_to_logic_app" {
  depends_on           = [azurerm_logic_app_standard.api_enrollment_logic_app]
  scope                = azurerm_logic_app_standard.api_enrollment_logic_app.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_windows_function_app.api-enrollment.identity[0].principal_id
}
resource "azurerm_role_assignment" "api_enrollment_logic_app_to_enrollment_database" {
  depends_on           = [azurerm_logic_app_standard.api_enrollment_logic_app]
  scope                = azurerm_mssql_database.k12-database.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_logic_app_standard.api_enrollment_logic_app.identity[0].principal_id
}

resource "azurerm_role_assignment" "logic_app_to_apim_reader" {
  depends_on           = [azurerm_logic_app_standard.api_enrollment_logic_app, azurerm_api_management.api_enrollment]
  scope                = azurerm_api_management.api_enrollment.id
  role_definition_name = "API Management Service Reader Role"
  principal_id         = azurerm_logic_app_standard.api_enrollment_logic_app.identity[0].principal_id
}

# 1. Log Analytics for container app env
resource "azurerm_log_analytics_workspace" "aca_logs" {
  name                = "${var.environment_name}-aca-logs"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30 # Add retention policy
}

# 1.5 Virtual Network and Subnet for Container Apps (RECOMMENDED)
resource "azurerm_virtual_network" "aca_vnet" {
  count               = var.enable_internal_load_balancer ? 1 : 0
  name                = "${var.environment_name}-aca-vnet"
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = var.aca_vnet_address_space

  tags = var.tags
}

resource "azurerm_subnet" "aca_subnet" {
  count                = var.enable_internal_load_balancer ? 1 : 0
  name                 = "aca-infrastructure-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.aca_vnet[0].name
  address_prefixes     = var.aca_subnet_address_prefix

  delegation {
    name = "aca-delegation"
    service_delegation {
      name    = "Microsoft.App/environments"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

# 2. Azure Container App Environment - PRODUCTION READY
resource "azurerm_container_app_environment" "api_env" {
  name                       = "${var.environment_name}-k12-cae"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.aca_logs.id

  infrastructure_subnet_id       = var.enable_internal_load_balancer ? azurerm_subnet.aca_subnet[0].id : null
  internal_load_balancer_enabled = var.enable_internal_load_balancer ? true : null
  zone_redundancy_enabled        = var.enable_internal_load_balancer ? var.enable_zone_redundancy : null

  # WORKLOAD PROFILES: For dedicated compute (optional, increases cost)
  # workload_profile {
  #   name                  = "Consumption"
  #   workload_profile_type = "Consumption"
  # }

  tags = var.tags
}

# 3. Azure Container Registry - PRODUCTION READY
resource "azurerm_container_registry" "acr" {
  name                = "${replace(var.environment_name, "-", "")}k12acr"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.enable_acr_geo_replication || var.enable_zone_redundancy ? "Premium" : "Basic"
  admin_enabled       = false # Using Managed Identity

  # SECURITY: Disable public network access (enable after VNet setup)
  # public_network_access_enabled = false
  # network_rule_bypass_option    = "AzureServices"

  zone_redundancy_enabled = var.enable_zone_redundancy

  dynamic "georeplications" {
    for_each = var.enable_acr_geo_replication ? [var.acr_geo_replication_location] : []
    content {
      location                = georeplications.value
      zone_redundancy_enabled = var.enable_zone_redundancy
      tags                    = var.tags
    }
  }

  tags = var.tags
}

# 4. The Container App - PRODUCTION READY
resource "azurerm_container_app" "api_app" {
  name                         = "${var.environment_name}-app"
  container_app_environment_id = azurerm_container_app_environment.api_env.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  identity {
    type = "SystemAssigned"
  }

  # Dapr Configuration
  dapr {
    app_id       = "k12-api"
    app_port     = 8080
    app_protocol = "http"
  }

  # ACR Integration with Managed Identity
  registry {
    server   = azurerm_container_registry.acr.login_server
    identity = "System" # Tells ACA to use the System Identity to pull images
  }

  ingress {
    external_enabled = !var.enable_internal_load_balancer
    target_port      = 8080   # Use standard non-privileged port
    transport        = "auto" # Supports both HTTP/1 and HTTP/2

    # HTTPS enforcement
    allow_insecure_connections = false # Redirects HTTP -> HTTPS

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }

    # Optional: IP restrictions for dev environment
    # dynamic "ip_security_restriction" {
    #   for_each = var.dev_ip_list
    #   content {
    #     name             = ip_security_restriction.key
    #     action           = "Allow"
    #     ip_address_range = ip_security_restriction.value
    #   }
    # }
  }

  template {
    min_replicas = var.aca_min_replicas
    max_replicas = var.aca_max_replicas

    container {
      name   = "k12-api"
      image  = "${azurerm_container_registry.acr.login_server}/k12-api:latest"
      cpu    = var.aca_cpu
      memory = var.aca_memory

      # Environment variables for telemetry and Dapr
      env {
        name  = "APPLICATIONINSIGHTS_CONNECTION_STRING"
        value = azurerm_application_insights.api-enrollment-insights.connection_string
      }

      env {
        name  = "ASPNETCORE_ENVIRONMENT"
        value = title(var.environment_name)
      }

      # Key Vault secret references (example)
      env {
        name        = "ConnectionStrings__SqlDatabase"
        secret_name = "sql-connection-string"
      }

      env {
        name        = "ConnectionStrings__BlobStorage"
        secret_name = "blob-connection-string"
      }

      # Health probes (already implemented in your app)
      liveness_probe {
        transport               = "HTTP"
        port                    = 8080
        path                    = "/health/live"
        initial_delay           = 30
        interval_seconds        = 10
        timeout                 = 3
        failure_count_threshold = 3
      }

      readiness_probe {
        transport               = "HTTP"
        port                    = 8080
        path                    = "/health/ready"
        initial_delay           = 10
        interval_seconds        = 5
        timeout                 = 3
        failure_count_threshold = 3
        success_count_threshold = 1
      }

      startup_probe {
        transport               = "HTTP"
        port                    = 8080
        path                    = "/health/startup"
        initial_delay           = 5
        interval_seconds        = 10
        timeout                 = 3
        failure_count_threshold = 6 # 60 seconds total startup time
      }
    }
  }

  # Secrets from Key Vault
  secret {
    name                = "sql-connection-string"
    identity            = "System"
    key_vault_secret_id = "${azurerm_key_vault.api_enrollment_kv.vault_uri}secrets/sql-connection-string"
  }

  secret {
    name                = "blob-connection-string"
    identity            = "System"
    key_vault_secret_id = "${azurerm_key_vault.api_enrollment_kv.vault_uri}secrets/blob-connection-string"
  }

  tags = var.tags
}

resource "azurerm_storage_container" "dapr_statestore" {
  count                 = var.dapr_enable_components ? 1 : 0
  name                  = "dapr-statestore"
  storage_account_id    = azurerm_storage_account.api-enrollment.id
  container_access_type = "private"
}

resource "azurerm_container_app_environment_dapr_component" "state_store" {
  count                        = var.dapr_enable_components ? 1 : 0
  name                         = "statestore"
  container_app_environment_id = azurerm_container_app_environment.api_env.id
  component_type               = "state.azure.blobstorage"
  version                      = "v1"
  ignore_errors                = false

  metadata {
    name  = "accountName"
    value = azurerm_storage_account.api-enrollment.name
  }

  metadata {
    name  = "containerName"
    value = azurerm_storage_container.dapr_statestore[0].name
  }

  metadata {
    name        = "accountKey"
    secret_name = "storage-account-key"
  }

  secret {
    name  = "storage-account-key"
    value = azurerm_storage_account.api-enrollment.primary_access_key
  }

  scopes = ["k12-api"]
}

resource "azurerm_container_app_environment_dapr_component" "pubsub" {
  count                        = var.dapr_enable_components ? 1 : 0
  name                         = "pubsub"
  container_app_environment_id = azurerm_container_app_environment.api_env.id
  component_type               = "pubsub.azure.servicebus"
  version                      = "v1"
  ignore_errors                = false

  metadata {
    name        = "connectionString"
    secret_name = "servicebus-connection-string"
  }

  secret {
    name  = "servicebus-connection-string"
    value = var.dapr_pubsub_connection_string
  }

  scopes = ["k12-api"]
}

resource "azurerm_monitor_diagnostic_setting" "aca_env" {
  name                       = "${var.environment_name}-aca-env-diag"
  target_resource_id         = azurerm_container_app_environment.api_env.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.aca_logs.id

  enabled_log {
    category_group = "allLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "aca_app" {
  name                       = "${var.environment_name}-aca-app-diag"
  target_resource_id         = azurerm_container_app.api_app.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.aca_logs.id

  enabled_log {
    category_group = "allLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# 5. Permission: Allow the App to pull from the Registry
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_container_app.api_app.identity[0].principal_id
}

# 6. RBAC: Allow Container App to read Key Vault secrets
resource "azurerm_role_assignment" "kv_aca_reader" {
  scope                = azurerm_key_vault.api_enrollment_kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_container_app.api_app.identity[0].principal_id
}
