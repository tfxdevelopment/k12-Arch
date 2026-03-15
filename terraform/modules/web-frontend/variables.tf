variable "environment_name" {}
variable "app_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "tags" {type = map(string)}

variable "platform_spoke_vnet_id" {
	description = "Optional platform contract: spoke VNet resource ID"
	type        = string
	default     = null
}

variable "platform_private_endpoints_subnet_id" {
	description = "Optional platform contract: private endpoints subnet resource ID"
	type        = string
	default     = null
}

variable "platform_app_gateway_subnet_id" {
	description = "Optional platform contract: application gateway subnet resource ID"
	type        = string
	default     = null
}

variable "platform_frontdoor_profile_id" {
	description = "Optional platform contract: Azure Front Door profile resource ID"
	type        = string
	default     = null
}