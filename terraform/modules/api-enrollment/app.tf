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
      "XDT_MicrosoftApplicationInsights_NodeJS"
    ]
  }

  lifecycle {
    ignore_changes = [
      tags,
      site_config
    ]
  }
}

resource "azurerm_application_insights" "api-enrollment-insights" {
  name                = "${var.environment_name}-api-enrollment-insights"
  resource_group_name = var.resource_group_name
  location            = var.location
  application_type    = "web"
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


