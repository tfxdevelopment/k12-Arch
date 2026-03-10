# Tagging module for standardized tags
module "tagging" {
  source = "../../modules/tagging"
  environment = local.environment_name
}

module "core" {
    source = "../../modules/core"
    #variables
    environment_name = local.environment_name
    location = local.location
    tags = merge(module.tagging.tags, {module = "core"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    contributor_principal_id = local.contributor_principal_id
    resource_group_name = module.core.rg_name
}

module "enrollment-web" {
    source = "../../modules/web-frontend"
    #variables
    app_name = "enrollment"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "web-frontend"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    web_app_sku_name = "S1"
}

module "enrollment-api" {
    source = "../../modules/api-enrollment"
    #variables
    website_contentshare = "development-api-enrollment-1d52"
    website_contentazurefileconnectionstring = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/devazurefileconnectionstring)"
    storage_container_name = "document-leases"
    schoolsapp_uri = "https://schools-development-frontend-eag5hph5fhd2epa3.z02.azurefd.net/"
    past_due_task_status_cron_schedule = "0 */5 * * * *"
    pandadoc_webhook_shared_key = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/dev-pandadoc-webhook-sharedkey)"
    pandadoc_uri = "https://api.pandadoc.com/public/v1/"
    pandadoc_apikey = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/dev-pandadoc-apikey)"
    functions_worker_runtime = "dotnet-isolated"
    functions_extension_version = "~4"
    environment_var = "Development"
    entra_tenant_id = "4d0b1d13-40fc-479b-870b-9f17bf4b23b6"
    entra_school_tenant_id = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/K12APISCHOOLDEVELOPMENTID)"
    entra_logicapp_tenant_id = "3f80a41f-c452-4071-a415-4df4176730e2"
    entra_logicapp_managed_identity_id = "3d7d590d-6015-404a-bee0-e78d2927b800"
    entra_client_secret = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/K12APIDBCLIENTSECRETVALUE)"
    entra_client_id = "6e115cdf-da20-4054-932e-496cdd285d9f"
    azurewebjobs_storage = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/dev-azurewebjobs-storage)"
    azurewebjobs_dashboard = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/dev-azurewebjobs-dashboard)"
    run_scheduled_user_access_mapping_full_sync_disabled = "0"
    applicationinsights_connection_string = "@Microsoft.KeyVault(SecretUri=https://developmentapikv.vault.azure.net/secrets/dev-applicationinsights-connection-string)"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "api-enrollment"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    publisher_email = local.publisher_email
    publisher_name = local.publisher_name
    arm_role_receivers  = local.arm_role_receivers
    sql_connection_string  = local.sql_connection_string
    blob_storage_connection_string = local.blob_storage_connection_string
    db_size = local.db_size
    appinsights_instrumentationkey = "a3e223c5-953b-459f-b7c8-60dae85325fc"
}

module "admin-web" {
    source = "../../modules/web-frontend"
    #variables
    app_name = "admin"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "web-frontend"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    web_app_sku_name = "S1"
}

module "household-web" {
    source = "../../modules/web-frontend"
    #variables
    app_name = "household"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "web-frontend"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    web_app_sku_name = "S1"
}

module "providers-web" {
    source = "../../modules/web-frontend"
    #variables
    app_name = "providers"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "web-frontend"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    web_app_sku_name = "S1"
}

module "schools-web" {
    source = "../../modules/web-frontend"
    #variables
    app_name = "schools"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "web-frontend"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    web_app_sku_name = "S1"
}

module "messaging" {
    source = "../../modules/messaging"
    #variables
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(module.tagging.tags, {module = "messaging"})
}