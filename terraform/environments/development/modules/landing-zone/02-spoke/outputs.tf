# DEPRECATED: This file belongs to a compatibility wrapper scheduled for removal.
# Canonical module: terraform/modules/landing-zone/spoke

output "spokeResourceGroupName" {
  value = module.landing_zone_spoke.spokeResourceGroupName
}

output "spokeVNetId" {
  value = module.landing_zone_spoke.spokeVNetId
}

output "spokeVNetName" {
  value = module.landing_zone_spoke.spokeVNetName
}

output "spokeInfraSubnetId" {
  value = module.landing_zone_spoke.spokeInfraSubnetId
}

output "spokeInfraSubnetName" {
  value = module.landing_zone_spoke.spokeInfraSubnetName
}

output "spokePrivateEndpointsSubnetId" {
  value = module.landing_zone_spoke.spokePrivateEndpointsSubnetId
}

output "spokePrivateEndpointsSubnetName" {
  value = module.landing_zone_spoke.spokePrivateEndpointsSubnetName
}

output "spokeApplicationGatewaySubnetId" {
  value = module.landing_zone_spoke.spokeApplicationGatewaySubnetId
}

output "spokeApplicationGatewaySubnetName" {
  value = module.landing_zone_spoke.spokeApplicationGatewaySubnetName
}

output "logAnalyticsWorkspaceId" {
  value = module.landing_zone_spoke.logAnalyticsWorkspaceId
}
