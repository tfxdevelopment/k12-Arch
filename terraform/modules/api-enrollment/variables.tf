variable "environment_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "publisher_name" {}
variable "publisher_email" {}
variable "dev_ip_list" { type = map(string) }
variable "zscaler_ip_list" { type = map(string) }
variable "tags" { type = map(string) }

variable "enable_zone_redundancy" {
  description = "Enable zone redundancy (prod only; keep false for lower envs)"
  type        = bool
  default     = false
}

variable "enable_acr_geo_replication" {
  description = "Enable ACR geo-replication (prod only; keep false for lower envs)"
  type        = bool
  default     = false
}

variable "enable_internal_load_balancer" {
  description = "Enable private ILB for Container Apps Environment (prod). Dev/staging keep public ingress."
  type        = bool
  default     = false
}

variable "aca_min_replicas" {
  description = "Minimum replicas for the container app"
  type        = number
  default     = 1
}

variable "aca_max_replicas" {
  description = "Maximum replicas for the container app"
  type        = number
  default     = 5
}

variable "aca_cpu" {
  description = "vCPU allocation for the container app"
  type        = number
  default     = 0.5
}

variable "aca_memory" {
  description = "Memory allocation for the container app"
  type        = string
  default     = "1Gi"
}

variable "aca_vnet_address_space" {
  description = "Address space for ACA VNet when internal load balancer is enabled"
  type        = list(string)
  default     = ["10.20.0.0/16"]
}

variable "aca_subnet_address_prefix" {
  description = "Infrastructure subnet prefix for ACA environment injection (must be /23 or larger)"
  type        = list(string)
  default     = ["10.20.0.0/23"]
}

variable "acr_geo_replication_location" {
  description = "Secondary region for ACR geo-replication when enabled"
  type        = string
  default     = "Central US"
}

variable "dapr_enable_components" {
  description = "Enable Dapr components (state store and pub/sub) for the ACA environment"
  type        = bool
  default     = true
}

variable "dapr_pubsub_connection_string" {
  description = "Service Bus connection string used by Dapr pub/sub component"
  type        = string
  sensitive   = true
  default     = ""
}

variable "enable_apim_strangler_rollout" {
  description = "Enable APIM backend + policy resources for strangler routing between Function App and ACA"
  type        = bool
  default     = false
}

variable "apim_existing_api_name" {
  description = "Existing APIM API name to attach the rollout policy to (leave empty to skip policy creation)"
  type        = string
  default     = ""
}

variable "apim_function_backend_url" {
  description = "Function App backend base URL for APIM routing (e.g., https://<env>-api-enrollment.azurewebsites.net)"
  type        = string
  default     = ""
}

variable "apim_aca_backend_url" {
  description = "Container App backend base URL for APIM routing (e.g., https://<aca-fqdn>)"
  type        = string
  default     = ""
}

variable "apim_function_backend_name" {
  description = "APIM backend resource name for Function App"
  type        = string
  default     = "function-backend"
}

variable "apim_aca_backend_name" {
  description = "APIM backend resource name for ACA"
  type        = string
  default     = "aca-backend"
}

variable "apim_rollout_header_name" {
  description = "Request header name used to route traffic to ACA during strangler rollout"
  type        = string
  default     = "x-k12-backend"
}

variable "apim_rollout_header_value_aca" {
  description = "Header value that routes requests to ACA backend"
  type        = string
  default     = "aca"
}

variable "arm_role_receivers" {
  type = list(object({
    name                    = string
    role_id                 = string
    use_common_alert_schema = bool
  }))
  description = "List of ARM role receivers for action groups."
}

variable "sql_connection_string" {
  description = "Connection string for the SQL database"
  type        = string
  sensitive   = false
}

variable "blob_storage_connection_string" {
  description = "Connection string for Azure Blob Storage"
  type        = string
  sensitive   = false
}

variable "platform_spoke_vnet_id" {
  description = "Optional platform contract: spoke VNet resource ID"
  type        = string
  default     = null
}

variable "platform_infra_subnet_id" {
  description = "Optional platform contract: infrastructure subnet resource ID"
  type        = string
  default     = null
}

variable "platform_private_endpoints_subnet_id" {
  description = "Optional platform contract: private endpoints subnet resource ID"
  type        = string
  default     = null
}

variable "platform_route_table_id" {
  description = "Optional platform contract: route table resource ID"
  type        = string
  default     = null
}

variable "platform_firewall_private_ip" {
  description = "Optional platform contract: firewall private IP"
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
