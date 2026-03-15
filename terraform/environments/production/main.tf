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
  enable_key_vault_secret_sync = local.enable_key_vault_secret_sync
}

module "landing_zone_hub" {
  count  = local.enable_landing_zone_platform ? 1 : 0
  source = "../../modules/landing-zone/hub"

  workloadName                            = local.lz_workload_name
  environment                             = local.lz_environment
  location                                = local.location
  hubResourceGroupName                    = local.lz_hub_resource_group_name
  tags                                    = merge(local.tags, { module = "landing-zone-hub" })
  vnetAddressPrefixes                     = local.lz_hub_vnet_address_prefixes
  bastionSubnetAddressPrefixes            = local.lz_bastion_subnet_address_prefixes
  gatewaySubnetAddressPrefix              = local.lz_gateway_subnet_address_prefix
  azureFirewallSubnetAddressPrefix        = local.lz_firewall_subnet_address_prefix
  azureFirewallSubnetManagementAddressPrefix = local.lz_firewall_mgmt_subnet_address_prefix
  infraSubnetAddressPrefix                = local.lz_infra_subnet_address_prefix
}

module "landing_zone_spoke" {
  count  = local.enable_landing_zone_platform ? 1 : 0
  source = "../../modules/landing-zone/spoke"

  workloadName                        = local.lz_workload_name
  environment                         = local.lz_environment
  location                            = local.location
  hubVnetId                           = local.enable_landing_zone_platform ? module.landing_zone_hub[0].hubVnetId : coalesce(var.landing_zone_hub_vnet_id, "")
  spokeResourceGroupName              = local.lz_spoke_resource_group_name
  tags                                = merge(local.tags, { module = "landing-zone-spoke" })
  vnetAddressPrefixes                 = local.lz_spoke_vnet_address_prefixes
  infraSubnetAddressPrefix            = local.lz_infra_subnet_address_prefix
  privateEndpointsSubnetAddressPrefix = local.lz_private_endpoints_subnet_address_pref
  applicationGatewaySubnetAddressPrefix = local.lz_app_gateway_subnet_address_prefix
  jumpboxSubnetAddressPrefix          = local.lz_jumpbox_subnet_address_prefix
  vmSize                              = local.lz_vm_size
  vmAdminUsername                     = local.lz_vm_admin_username
  vmAdminPassword                     = local.lz_vm_admin_password
  vmLinuxSshAuthorizedKeys            = local.lz_vm_linux_ssh_public_keys
  firewallPrivateIp                   = local.enable_landing_zone_platform ? module.landing_zone_hub[0].firewallPrivateIp : coalesce(var.landing_zone_firewall_private_ip, "")
}

module "enrollment-web" {
  source = "../../modules/web-frontend"
  #variables
  app_name            = "enrollment"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
  platform_spoke_vnet_id               = local.enable_private_networking ? local.platform_spoke_vnet_id_effective : null
  platform_private_endpoints_subnet_id = local.enable_private_networking ? local.platform_private_endpoints_subnet_id_effective : null
  platform_app_gateway_subnet_id       = local.enable_private_networking ? local.platform_app_gateway_subnet_id_effective : null
  platform_frontdoor_profile_id        = local.platform_frontdoor_profile_id_effective
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
  acr_geo_replication_location   = local.acr_geo_replication_location
  dapr_enable_components         = local.dapr_enable_components
  dapr_pubsub_connection_string  = module.messaging.dapr_pubsub_primary_connection_string
  platform_spoke_vnet_id               = local.enable_private_networking ? local.platform_spoke_vnet_id_effective : null
  platform_infra_subnet_id             = local.enable_private_networking ? local.platform_infra_subnet_id_effective : null
  platform_private_endpoints_subnet_id = local.enable_private_networking ? local.platform_private_endpoints_subnet_id_effective : null
  platform_route_table_id              = local.enable_private_networking ? local.platform_route_table_id_effective : null
  platform_firewall_private_ip         = local.enable_private_networking ? local.platform_firewall_private_ip_effective : null
  platform_app_gateway_subnet_id       = local.enable_private_networking ? local.platform_app_gateway_subnet_id_effective : null
  platform_frontdoor_profile_id        = local.platform_frontdoor_profile_id_effective
}

module "admin-web" {
  source = "../../modules/web-frontend"
  #variables
  app_name            = "admin"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
  platform_spoke_vnet_id               = local.enable_private_networking ? local.platform_spoke_vnet_id_effective : null
  platform_private_endpoints_subnet_id = local.enable_private_networking ? local.platform_private_endpoints_subnet_id_effective : null
  platform_app_gateway_subnet_id       = local.enable_private_networking ? local.platform_app_gateway_subnet_id_effective : null
  platform_frontdoor_profile_id        = local.platform_frontdoor_profile_id_effective
}

module "providers-web" {
  source = "../../modules/web-frontend"
  #variables
  app_name            = "providers"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
  platform_spoke_vnet_id               = local.enable_private_networking ? local.platform_spoke_vnet_id_effective : null
  platform_private_endpoints_subnet_id = local.enable_private_networking ? local.platform_private_endpoints_subnet_id_effective : null
  platform_app_gateway_subnet_id       = local.enable_private_networking ? local.platform_app_gateway_subnet_id_effective : null
  platform_frontdoor_profile_id        = local.platform_frontdoor_profile_id_effective
}

module "schools-web" {
  source = "../../modules/web-frontend"
  #variables
  app_name            = "schools"
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "web-enrollment" })
  zscaler_ip_list     = local.zscaler_ip_list
  dev_ip_list         = local.dev_ip_list
  platform_spoke_vnet_id               = local.enable_private_networking ? local.platform_spoke_vnet_id_effective : null
  platform_private_endpoints_subnet_id = local.enable_private_networking ? local.platform_private_endpoints_subnet_id_effective : null
  platform_app_gateway_subnet_id       = local.enable_private_networking ? local.platform_app_gateway_subnet_id_effective : null
  platform_frontdoor_profile_id        = local.platform_frontdoor_profile_id_effective
}

module "messaging" {
  source = "../../modules/messaging"
  #variables
  environment_name    = local.environment_name
  location            = local.location
  resource_group_name = module.core.rg_name
  tags                = merge(local.tags, { module = "messaging" })
}
