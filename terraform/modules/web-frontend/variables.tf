variable "environment_name" {}
variable "app_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "web_app_sku_name" {}
variable "tags" {type = map(string)}