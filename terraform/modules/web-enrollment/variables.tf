variable "environment_name" {}
variable "location" {}
variable "resource_group_name" {}
variable "dev_ip_list" {
    type    = map(string)
}
variable "zscaler_ip_list" {
    type    = map(string)
}

variable "tags" {
    type    = map(string)
    # default = {
    #     environment = "${var.environment_name}"
    #     creator     = "Terraform"
    #     tf_module   = "web-enrollment"
    # }
}