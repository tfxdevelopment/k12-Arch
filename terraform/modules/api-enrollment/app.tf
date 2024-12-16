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
  service_plan_id        = azurerm_service_plan.api-enrollment.id

  site_config {
    application_stack {
      dotnet_version = "v8.0"
      use_dotnet_isolated_runtime = true
    }
  }

  identity {
    type = "SystemAssigned"
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
    "us-va-ash-azr"  //East US??
  ]

  configuration = <<XML
<WebTest Name="${var.environment_name}-api-availability-test" Id="00000000-0000-0000-0000-000000000000" Enabled="True" CssProjectStructure="" CssIteration="" Timeout="30" WorkItemIds="" xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
  <Items>
    <Request Method="GET" Version="1.1" Url="https://development-api-enrollment.azure-api.net/status-0123456789abcdef" ThinkTime="0" Timeout="30" ParseDependentRequests="False" FollowRedirects="True" RecordResult="True" Cache="False" ResponseTimeGoal="0" Encoding="utf-8" ExpectedHttpStatusCode="200" />
  </Items>
</WebTest>
XML
}
