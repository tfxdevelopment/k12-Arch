variable "environment_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "publisher_name" {}
variable "publisher_email" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "tags" {type = map(string)}
variable "db_size" {type = number}
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
