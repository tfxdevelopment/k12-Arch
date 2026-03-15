# DEPRECATED: This file belongs to a compatibility wrapper scheduled for removal.
# Canonical module: terraform/modules/landing-zone/hub

output "hubVnetId" {
  description = "The resource ID of hub virtual network."
  value       = module.landing_zone_hub.hubVnetId
}

output "hubVnetName" {
  value = module.landing_zone_hub.hubVnetName
}

output "hubResourceGroupName" {
  description = "The name of the Hub resource group."
  value       = module.landing_zone_hub.hubResourceGroupName
}

output "firewallPrivateIp" {
  description = "The private IP address of the firewall."
  value       = module.landing_zone_hub.firewallPrivateIp
}
