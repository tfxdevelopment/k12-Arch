variable "environment_name" {
  type = string
}

variable "location" {
  type = string
}

variable "workload_name" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "vnet_address_space" {
  type = list(string)
}
