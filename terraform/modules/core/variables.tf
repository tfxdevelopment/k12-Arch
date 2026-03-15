variable "environment_name" {}
variable "location" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "tags" {type = map(string)}
variable "contributor_principal_id" {}
variable "resource_group_name" {}

variable "enable_key_vault_secret_sync" {
	description = "When true, sync DevOps SP credentials into {env}apikv. Disable for bootstrap environments where Key Vault may not exist yet."
	type        = bool
	default     = true
}