variable "environment_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "publisher_name" {}
variable "publisher_email" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "tags" {type = map(string)}

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
