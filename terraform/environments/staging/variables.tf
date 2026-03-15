variable "sql_connection_string" {
  description = "SQL connection string injected securely at runtime (TF_VAR_sql_connection_string)"
  type        = string
  sensitive   = true
}

variable "blob_storage_connection_string" {
  description = "Blob storage connection string injected securely at runtime (TF_VAR_blob_storage_connection_string)"
  type        = string
  sensitive   = true
}

variable "enable_landing_zone_platform" {
  description = "Enable landing-zone platform orchestration for this environment"
  type        = bool
  default     = false
}

variable "enable_private_networking" {
  description = "Enable private networking contracts between platform and workload modules"
  type        = bool
  default     = false
}

variable "enable_internal_ingress" {
  description = "Enable internal-only ingress posture for workload entrypoints"
  type        = bool
  default     = false
}

variable "landing_zone_hub_vnet_id" {
  description = "Optional landing-zone contract: hub VNet resource ID"
  type        = string
  default     = null
}

variable "landing_zone_spoke_vnet_id" {
  description = "Optional landing-zone contract: spoke VNet resource ID"
  type        = string
  default     = null
}

variable "landing_zone_infra_subnet_id" {
  description = "Optional landing-zone contract: infrastructure subnet resource ID"
  type        = string
  default     = null
}

variable "landing_zone_private_endpoints_subnet_id" {
  description = "Optional landing-zone contract: private endpoints subnet resource ID"
  type        = string
  default     = null
}

variable "landing_zone_route_table_id" {
  description = "Optional landing-zone contract: route table resource ID"
  type        = string
  default     = null
}

variable "landing_zone_firewall_private_ip" {
  description = "Optional landing-zone contract: firewall private IP"
  type        = string
  default     = null
}

variable "landing_zone_app_gateway_subnet_id" {
  description = "Optional landing-zone contract: application gateway subnet resource ID"
  type        = string
  default     = null
}

variable "landing_zone_frontdoor_profile_id" {
  description = "Optional landing-zone contract: Azure Front Door profile resource ID"
  type        = string
  default     = null
}
