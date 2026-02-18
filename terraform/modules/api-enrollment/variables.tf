variable "website_contentshare" {
  description = "WEBSITE_CONTENTSHARE for development environment"
  type        = string
  default     = ""
}
variable "website_contentazurefileconnectionstring" {
  description = "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING for development environment"
  type        = string
  default     = ""
}
variable "storage_container_name" {
  description = "StorageContainerName for development environment"
  type        = string
  default     = ""
}
variable "schoolsapp_uri" {
  description = "SchoolsApp Uri for development environment"
  type        = string
  default     = ""
}
variable "past_due_task_status_cron_schedule" {
  description = "PastDueTaskStatusCronSchedule for development environment"
  type        = string
  default     = ""
}
variable "pandadoc_webhook_shared_key" {
  description = "Pandadoc WebhookSharedKey for development environment"
  type        = string
  default     = ""
}
variable "pandadoc_uri" {
  description = "PandaDoc Uri for development environment"
  type        = string
  default     = ""
}
variable "pandadoc_apikey" {
  description = "PandaDoc ApiKey for development environment"
  type        = string
  default     = ""
}
variable "functions_worker_runtime" {
  description = "Functions worker runtime for development environment"
  type        = string
  default     = ""
}
variable "functions_extension_version" {
  description = "Functions extension version for development environment"
  type        = string
  default     = ""
}
variable "environment_var" {
  description = "Environment variable for development environment"
  type        = string
  default     = ""
}
variable "entra_tenant_id" {
  description = "Entra TenantId for development environment"
  type        = string
  default     = ""
}
variable "entra_school_tenant_id" {
  description = "Entra SchoolTenantId for development environment"
  type        = string
  default     = ""
}
variable "entra_logicapp_tenant_id" {
  description = "Entra LogicApp TenantId for development environment"
  type        = string
  default     = ""
}
variable "entra_logicapp_managed_identity_id" {
  description = "Entra LogicApp ManagedIdentityId for development environment"
  type        = string
  default     = ""
}
variable "entra_client_secret" {
  description = "Entra ClientSecret for development environment"
  type        = string
  default     = ""
}
variable "entra_client_id" {
  description = "Entra ClientId for development environment"
  type        = string
  default     = ""
}
variable "azurewebjobs_storage" {
  description = "AzureWebJobsStorage connection string for development environment"
  type        = string
  default     = ""
}
variable "azurewebjobs_dashboard" {
  description = "AzureWebJobsDashboard connection string for development environment"
  type        = string
  default     = ""
}
variable "run_scheduled_user_access_mapping_full_sync_disabled" {
  description = "Disable scheduled user access mapping full sync for development environment"
  type        = string
  default     = ""
}
variable "applicationinsights_connection_string" {
  description = "App Insights Connection String for development environment"
  type        = string
  default     = ""
}
variable "environment_name" {}
variable "appinsights_instrumentationkey" {
  description = "App Insights Instrumentation Key for development environment"
  type        = string
  default     = ""
}
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
