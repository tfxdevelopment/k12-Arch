# DEPRECATED: This compatibility wrapper is scheduled for removal.
# Canonical module: terraform/modules/landing-zone/hub
# Environment roots now call the canonical module directly.
# Do not add new references to this path. Remove after one-release deprecation window.

module "landing_zone_hub" {
  source = "../../../../../modules/landing-zone/hub"

  workloadName                            = var.workloadName
  environment                             = var.environment
  location                                = var.location
  hubResourceGroupName                    = var.hubResourceGroupName
  tags                                    = var.tags
  vnetAddressPrefixes                     = var.vnetAddressPrefixes
  enableBastion                           = var.enableBastion
  bastionSubnetAddressPrefixes            = var.bastionSubnetAddressPrefixes
  ddosProtectionPlanId                    = var.ddosProtectionPlanId
  securityRules                           = var.securityRules
  gatewaySubnetName                       = var.gatewaySubnetName
  gatewaySubnetAddressPrefix              = var.gatewaySubnetAddressPrefix
  azureFirewallSubnetName                 = var.azureFirewallSubnetName
  azureFirewallSubnetAddressPrefix        = var.azureFirewallSubnetAddressPrefix
  azureFirewallSubnetManagementName       = var.azureFirewallSubnetManagementName
  azureFirewallSubnetManagementAddressPrefix = var.azureFirewallSubnetManagementAddressPrefix
  infraSubnetAddressPrefix                = var.infraSubnetAddressPrefix
}
