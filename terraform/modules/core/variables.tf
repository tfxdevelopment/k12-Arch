variable "environment_name" {}
variable "location" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "tags" {type = map(string)}
variable "contributor_principal_id" {}