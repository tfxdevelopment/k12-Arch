resource "azurerm_service_plan" "api-enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku_name = "Y1"
  os_type = "Windows"
}

resource "azurerm_windows_function_app" "api-enrollment" {
  name                       = "${var.environment_name}-api-enrollment"
  resource_group_name        = var.resource_group_name
  location                   = var.location

  storage_account_name       = azurerm_storage_account.api-enrollment.name
  storage_account_access_key = azurerm_storage_account.api-enrollment.primary_access_key
  service_plan_id            = azurerm_service_plan.api-enrollment.id

  app_settings = {
    "AzureWebJobs.MarkAccountMessageAsRead.Disabled" = "1"
    "StorageContainerName"                           = "document-leases"
    "AzureSignalRConnectionString"                   = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault.api_enrollment_kv.vault_uri}secrets/AzureSignalRConnectionString/)"
  }

  site_config {
    application_stack {
      dotnet_version = "v8.0"
      use_dotnet_isolated_runtime = true
    }

    cors {
      allowed_origins = ["*"]
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
  frequency               = 300  # 5 minutes in seconds
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
    "lenses": {
      "0": {
        "order": 0,
        "parts": {}
      }
    },
    "metadata": {
      "model": {
        "timeRange": {
          "value": {
            "relative": {
              "duration": 24,
              "timeUnit": "hour"
            }
          }
        },
        "filterLocale": "en-us",
        "filters": {
          "MsPortalFx_TimeRange": {
            "model": {
              "format": "utc",
              "relative": "24h"
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

  public_network_access_enabled               = true
  local_auth_enabled                          = true
  aad_auth_enabled                            = true
  tls_client_cert_enabled                     = false
  service_mode                                = "Serverless"
  serverless_connection_timeout_in_seconds    = 30

  connectivity_logs_enabled     = true
  messaging_logs_enabled        = true
  http_request_logs_enabled     = true

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
  name                        = "${var.environment_name}apikv"
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = "3f80a41f-c452-4071-a415-4df4176730e2"
  sku_name                    = "standard"
  purge_protection_enabled    = true
  soft_delete_retention_days  = 7
  enable_rbac_authorization   = true

  lifecycle {
    ignore_changes = [tags]
  }
}

resource "azurerm_role_assignment" "kv_reader" {
  depends_on = [ azurerm_key_vault.api_enrollment_kv]
  scope                = azurerm_key_vault.api_enrollment_kv.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = azurerm_windows_function_app.api-enrollment.identity[0].principal_id
}


resource "azurerm_role_assignment" "k12_contributors_kv_rw" {
  depends_on = [ azurerm_key_vault.api_enrollment_kv]
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

resource "azurerm_key_vault_secret" "signalr_connection_string" {
  name         = "AzureSignalRConnectionString"
  value        = azurerm_signalr_service.api_enrollment_signalr.primary_connection_string
  key_vault_id = azurerm_key_vault.api_enrollment_kv.id

  depends_on = [
    azurerm_role_assignment.kv_reader,
    azurerm_signalr_service.api_enrollment_signalr
  ]
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
  os_type  = "Windows"
  sku_name = "WS1"
}
resource "azurerm_logic_app_standard" "api_enrollment_logic_app" {
  name                       = "${var.environment_name}-api-enrollment-la"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  app_service_plan_id        = azurerm_service_plan.api_enrollment_logic_app_service_plan.id
  storage_account_name       = azurerm_storage_account.api_enrollment_logic_app_sa.name
  storage_account_access_key = azurerm_storage_account.api_enrollment_logic_app_sa.primary_access_key
  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"     = "dotnet"
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
  scope                = azurerm_mssql_database.api-enrollment-k12.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_logic_app_standard.api_enrollment_logic_app.identity[0].principal_id
}

data "azurerm_api_management" "apim" {
  name                = "${var.environment_name}-api-enrollment"  
  resource_group_name = var.resource_group_name
}

resource "azurerm_role_assignment" "logic_app_to_apim_reader" {
  depends_on           = [azurerm_logic_app_standard.api_enrollment_logic_app]
  scope                = data.azurerm_api_management.apim.id
  role_definition_name = "API Management Service Reader Role"
  principal_id         = azurerm_logic_app_standard.api_enrollment_logic_app.identity[0].principal_id
}

# 1. Log Analytics for container app env
resource "azurerm_log_analytics_workspace" "aca_logs" {
  name                = "${var.environment_name}-aca-logs"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
}

# 2. Azure Container App Environment 
resource "azurerm_container_app_environment" "api_env" {
  name                       = "${var.environment_name}-k12-cae"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.aca_logs.id
}

# 3. Azure Container Registry
resource "azurerm_container_registry" "acr" {
name                  = "${replace(var.environment_name, "-", "")}k12acr"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false # We are using Managed Identity instead
}

//Import
//terraform import 'module.enrollment-api.azurerm_container_app.api_app' "/subscriptions/cf6841bb-b70c-4d55-a489-2d53855e78b5/resourceGroups/development/providers/Microsoft.App/containerApps/development-app"

# 4. The Container App
resource "azurerm_container_app" "api_app" {
  name                         = "${var.environment_name}-app"
  container_app_environment_id = azurerm_container_app_environment.api_env.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  identity {
    type = "SystemAssigned"
  }

  # registry {
  #   server   = azurerm_container_registry.acr.login_server
  #   identity = "system" # Tells ACA to use the System Identity to pull images
  # }

  ingress {
    external_enabled = true
    target_port      = 80      # The quickstart image listens on port 80
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    container {
      name   = "dummynet"
      image  = "mcr.microsoft.com/k8se/quickstart:latest"
      cpu    = 0.5
      memory = "1Gi"
    }
  }
}

# 5. Permission: Allow the App to pull from the Registry
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_container_app.api_app.identity[0].principal_id
}