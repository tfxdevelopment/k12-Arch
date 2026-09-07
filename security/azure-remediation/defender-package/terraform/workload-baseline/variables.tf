variable "subscription_id" {
  type = string
}

variable "environment" {
  description = "dev | test | stage | prod"
  type        = string
  validation {
    condition     = contains(["dev", "test", "stage", "prod"], var.environment)
    error_message = "environment must be dev, test, stage or prod."
  }
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "unique_suffix" {
  description = "3-6 lowercase alphanumerics appended to globally-unique names (Key Vault, Storage, ACR, App Config, SQL)."
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9]{3,6}$", var.unique_suffix))
    error_message = "unique_suffix must be 3-6 lowercase alphanumerics."
  }
}

variable "tags" {
  type    = map(string)
  default = {}
}

# ---------------------------------------------------------------------------
# Network
# ---------------------------------------------------------------------------
variable "vnet_address_space" {
  type    = list(string)
  default = ["10.40.0.0/20"]
}

variable "subnet_prefixes" {
  description = "aca = Container Apps infrastructure subnet (>= /27 for workload profiles); pe = private endpoints; appgw = Application Gateway."
  type = object({
    aca   = string
    pe    = string
    appgw = string
  })
  default = {
    aca   = "10.40.0.0/23"
    pe    = "10.40.2.0/24"
    appgw = "10.40.3.0/24"
  }
}

variable "is_production_like" {
  description = "stage/prod: zone redundancy, longer retention, larger SKUs."
  type        = bool
  default     = false
}

# ---------------------------------------------------------------------------
# Retention / sizing knobs (plan Section 4)
# ---------------------------------------------------------------------------
variable "log_retention_days" {
  description = "Interactive retention on the environment Log Analytics workspace. 30 dev/test, 90 stage, 120 prod (archive covers the rest of the 3-year CFI policy)."
  type        = number
  default     = 30
}

variable "key_vault_soft_delete_days" {
  description = "7 for dev/test, 90 for stage/prod."
  type        = number
  default     = 7
}

variable "servicebus_capacity" {
  description = "Premium messaging units (private link requires Premium)."
  type        = number
  default     = 1
}

variable "eventhub_capacity" {
  description = "Standard throughput units (Basic does not support private link)."
  type        = number
  default     = 1
}

variable "redis_sku" {
  description = "Azure Managed Redis SKU. Balanced_B0/B1 for dev, Balanced_B5+ for prod."
  type        = string
  default     = "Balanced_B0"
}

variable "sql_sku" {
  type    = string
  default = "GP_S_Gen5_2"
}

variable "container_app_image" {
  description = "Image for the reference app (only used to show the secure app shape)."
  type        = string
  default     = "mcr.microsoft.com/k8se/quickstart:latest"
}

# ---------------------------------------------------------------------------
# Identity inputs
# ---------------------------------------------------------------------------
variable "ops_architects_group_object_id" {
  description = "Object ID of the Ops/Architects Entra group (SQL Entra admin on nonprod; data-plane roles per RBAC proposal)."
  type        = string
}

variable "sql_entra_admin_login" {
  description = "Display name for the SQL Entra administrator (group)."
  type        = string
  default     = "sg-k12-ops-architects"
}

variable "tenant_id" {
  type = string
}
