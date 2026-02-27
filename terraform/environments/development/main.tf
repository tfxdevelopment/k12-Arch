module "core" {
  source = "../../modules/core"
  #variables
  environment_name         = local.environment_name
  location                 = local.location
  tags                     = merge(local.tags, { module = "core" })
  zscaler_ip_list          = local.zscaler_ip_list
  dev_ip_list              = local.dev_ip_list
  contributor_principal_id = local.contributor_principal_id
  resource_group_name      = module.core.rg_name
}

module "enrollment-web" {
  source = "../../modules/web-enrollment"
  #variables
  app_name            = "enrollment"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
}

module "enrollment-api" {
  source = "../../modules/api-enrollment"
  #variables
  environment_name               = local.environment_name
  location                       = local.location
  resource_group_name            = module.core.rg_name
  tags                           = merge(local.tags, { module = "api-enrollment" })
  zscaler_ip_list                = local.zscaler_ip_list
  dev_ip_list                    = local.dev_ip_list
  publisher_email                = local.publisher_email
  publisher_name                 = local.publisher_name
  arm_role_receivers             = local.arm_role_receivers
  sql_connection_string          = local.sql_connection_string
  blob_storage_connection_string = local.blob_storage_connection_string
  enable_zone_redundancy         = local.enable_zone_redundancy
  enable_acr_geo_replication     = local.enable_acr_geo_replication
  enable_internal_load_balancer  = local.enable_internal_load_balancer
  aca_min_replicas               = local.aca_min_replicas
  aca_max_replicas               = local.aca_max_replicas
  aca_cpu                        = local.aca_cpu
  aca_memory                     = local.aca_memory
}

module "admin-web" {
  source = "../../modules/web-enrollment"
  #variables
  app_name            = "admin"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
}

module "providers-web" {
  source = "../../modules/web-enrollment"
  #variables
  app_name            = "providers"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
}

module "schools-web" {
  source = "../../modules/web-enrollment"
  #variables
  app_name            = "schools"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
}

module "messaging" {
  source = "../../modules/messaging"
  #variables
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "messaging" })
}

module "landing-zone-hub" {
  count  = local.enable_landing_zone ? 1 : 0
  source = "../../modules/shared/landing-zone/hub"

  environment_name   = local.environment_name
  location           = local.location
  workload_name      = local.landing_zone_workload_name
  tags               = merge(local.tags, { module = "landing-zone-hub" })
  vnet_address_space = local.landing_zone_hub_address_space
}

module "landing-zone-spoke" {
  count  = local.enable_landing_zone ? 1 : 0
  source = "../../modules/shared/landing-zone/spoke"

  environment_name   = local.environment_name
  location           = local.location
  workload_name      = local.landing_zone_workload_name
  tags               = merge(local.tags, { module = "landing-zone-spoke" })
  vnet_address_space = local.landing_zone_spoke_address_space
}

module "landing-zone-policy" {
  count  = local.enable_landing_zone ? 1 : 0
  source = "../../modules/shared/landing-zone/policy"

  environment_name = local.environment_name
  location         = local.location
  tags             = merge(local.tags, { module = "landing-zone-policy" })
}

module "landing-zone-observability" {
  count  = local.enable_landing_zone ? 1 : 0
  source = "../../modules/shared/landing-zone/observability"

  environment_name = local.environment_name
  location         = local.location
  tags             = merge(local.tags, { module = "landing-zone-observability" })
}

