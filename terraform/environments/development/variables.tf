variable "environment_name" {
  default = "development"
}
variable "location" {
  default = "East US"
}
variable "publisher_name" {
    default = "CFI"
}
variable "publisher_email" {
    default = "luke.samuels@randstadusa.onmicrosoft.com"
}

variable "dev_ip_list" {
    type    = map(string)
    default = {
        Luke            = "151.196.123.136"
        Brandon         = "75.241.107.96"
        Jason           = "136.226.2.112"
        John            = "99.114.124.169"
    }
}

variable "zscaler_ip_list" {
    type    = map(string)
    default = {
        start_ip        = "136.226.40.1"
        end_ip          = "136.226.60.255"
    }
}

variable "tags" {
    type    = map(string)
    default = {
        environment = "development"
        creator     = "Terraform"
        tf_module   = "unknown-module"
    }
}