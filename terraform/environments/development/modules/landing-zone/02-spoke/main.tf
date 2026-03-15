# DEPRECATED: This compatibility wrapper is scheduled for removal.
# Canonical module: terraform/modules/landing-zone/spoke
# Environment roots now call the canonical module directly.
# Do not add new references to this path. Remove after one-release deprecation window.

module "landing_zone_spoke" {
  source = "../../../../../modules/landing-zone/spoke"

  workloadName                          = var.workloadName
  environment                           = var.environment
  location                              = var.location
  hubVnetId                             = var.hubVnetId
  spokeResourceGroupName                = var.spokeResourceGroupName
  tags                                  = var.tags
  vnetAddressPrefixes                   = var.vnetAddressPrefixes
  infraSubnetAddressPrefix              = var.infraSubnetAddressPrefix
  infraSubnetName                       = var.infraSubnetName
  privateEndpointsSubnetName            = var.privateEndpointsSubnetName
  privateEndpointsSubnetAddressPrefix   = var.privateEndpointsSubnetAddressPrefix
  applicationGatewaySubnetName          = var.applicationGatewaySubnetName
  applicationGatewaySubnetAddressPrefix = var.applicationGatewaySubnetAddressPrefix
  jumpboxSubnetName                     = var.jumpboxSubnetName
  jumpboxSubnetAddressPrefix            = var.jumpboxSubnetAddressPrefix
  vmSize                                = var.vmSize
  vmAdminUsername                       = var.vmAdminUsername
  vmAdminPassword                       = var.vmAdminPassword
  vmLinuxSshAuthorizedKeys              = var.vmLinuxSshAuthorizedKeys
  vmJumpboxOSType                       = var.vmJumpboxOSType
  vmLinuxAuthenticationType             = var.vmLinuxAuthenticationType
  vmSubnetName                          = var.vmSubnetName
  containerAppsSecurityRules            = var.containerAppsSecurityRules
  appGatewaySecurityRules               = var.appGatewaySecurityRules
  firewallPrivateIp                     = var.firewallPrivateIp
  routeSpokeTrafficInternally           = var.routeSpokeTrafficInternally
}
