variable "environment_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "publisher_name" {}
variable "publisher_email" {}
variable "dev_ip_list" {type = map(string)}
variable "zscaler_ip_list" {type = map(string)}
variable "tags" {type = map(string)}