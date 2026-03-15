locals {
  tags = {
    environment = "testing"
    source      = "terraform"
  }
  environment_name              = "testing"
  location                      = "East US 2"
  publisher_name                = "CFI"
  publisher_email               = "luke.samuels@randstadusa.onmicrosoft.com"
  contributor_principal_id      = "df8b0836-7e1b-41dc-8e66-6b6792256785" # principal id of the group/user that will have the Contributor role assigned
  enable_key_vault_secret_sync  = true
  enable_zone_redundancy        = false
  enable_acr_geo_replication    = false
  enable_landing_zone_platform  = var.enable_landing_zone_platform
  enable_private_networking     = var.enable_private_networking
  enable_internal_ingress       = var.enable_internal_ingress
  # Contract note: enable_internal_load_balancer is an alias for enable_internal_ingress.
  # It controls whether the ACA environment uses an internal load balancer (private ingress).
  enable_internal_load_balancer = var.enable_internal_ingress

  # landing-zone defaults (used when platform orchestration is enabled)
  lz_workload_name                         = "k12"
  lz_environment                           = "tst"
  lz_hub_resource_group_name               = ""
  lz_hub_vnet_address_prefixes             = ["10.50.0.0/16"]
  lz_gateway_subnet_address_prefix         = "10.50.0.0/24"
  lz_firewall_subnet_address_prefix        = "10.50.1.0/24"
  lz_firewall_mgmt_subnet_address_prefix   = "10.50.2.0/24"
  lz_bastion_subnet_address_prefixes       = ["10.50.3.0/26"]
  lz_spoke_resource_group_name             = ""
  lz_spoke_vnet_address_prefixes           = ["10.60.0.0/16"]
  lz_infra_subnet_address_prefix           = "10.60.0.0/23"
  lz_private_endpoints_subnet_address_pref = "10.60.2.0/24"
  lz_app_gateway_subnet_address_prefix     = "10.60.3.0/24"
  lz_jumpbox_subnet_address_prefix         = "10.60.4.0/24"
  lz_vm_size                               = "Standard_B2s"
  lz_vm_admin_username                     = "vmadmin"
  lz_vm_admin_password                     = "ChangeMe-NotUsedWhenDisabled123!"
  lz_vm_linux_ssh_public_keys              = []

  platform_hub_vnet_id_effective = local.enable_landing_zone_platform ? try(module.landing_zone_hub[0].hubVnetId, null) : var.landing_zone_hub_vnet_id
  platform_spoke_vnet_id_effective = local.enable_landing_zone_platform ? try(module.landing_zone_spoke[0].spokeVNetId, null) : var.landing_zone_spoke_vnet_id
  platform_infra_subnet_id_effective = local.enable_landing_zone_platform ? try(module.landing_zone_spoke[0].spokeInfraSubnetId, null) : var.landing_zone_infra_subnet_id
  platform_private_endpoints_subnet_id_effective = local.enable_landing_zone_platform ? try(module.landing_zone_spoke[0].spokePrivateEndpointsSubnetId, null) : var.landing_zone_private_endpoints_subnet_id
  platform_route_table_id_effective = local.enable_landing_zone_platform ? try(module.landing_zone_spoke[0].routeTableId, null) : var.landing_zone_route_table_id
  platform_firewall_private_ip_effective = local.enable_landing_zone_platform ? try(module.landing_zone_hub[0].firewallPrivateIp, null) : var.landing_zone_firewall_private_ip
  platform_app_gateway_subnet_id_effective = local.enable_landing_zone_platform ? try(module.landing_zone_spoke[0].spokeApplicationGatewaySubnetId, null) : var.landing_zone_app_gateway_subnet_id
  # RESERVED: platform_frontdoor_profile_id is wired to workload modules but not yet consumed.
  # It is a placeholder for future shared Front Door consolidation (see terraform/modules/shared/frontdoor).
  # Currently each web-frontend module creates its own per-app Standard AFD profile.
  platform_frontdoor_profile_id_effective  = var.landing_zone_frontdoor_profile_id

  aca_min_replicas              = 1
  aca_max_replicas              = 5
  aca_cpu                       = 0.5
  aca_memory                    = "1Gi"
  acr_geo_replication_location  = "Central US"
  dapr_enable_components        = true
  dev_ip_list = {
    Luke      = "151.196.123.136"
    Brandon   = "75.232.70.158"
    Jason     = "136.226.2.112"
    John      = "99.114.124.169"
    Saj       = "70.106.216.229"
    Angelo    = "184.89.241.44"
    Mounisha  = "99.23.196.62"
    BrandonD  = "100.38.8.193"
    Jafeth    = "73.51.228.118"
    Margarita = "96.255.236.185"
    Habib     = "170.85.70.85"
    Patrick   = "70.114.238.88"
    Mario     = "47.203.166.159"
  }
  zscaler_ip_list = {
    start_ip = "136.226.40.1"
    end_ip   = "136.226.60.255"
  }
  arm_role_receivers = [
    {
      name                    = "Monitoring Contributor"
      role_id                 = "749f88d5-cbae-40b8-bcfc-e573ddc772fa"
      use_common_alert_schema = true
    },
    {
      name                    = "Monitoring Reader"
      role_id                 = "43d0d8ad-25c7-4714-9337-8ba259a9fe05"
      use_common_alert_schema = true
    }
  ]
  sql_connection_string          = var.sql_connection_string
  blob_storage_connection_string = var.blob_storage_connection_string

}