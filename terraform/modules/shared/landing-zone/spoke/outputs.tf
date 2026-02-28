output "design_contract" {
  value = {
    module_name        = local.module_name
    environment_name   = var.environment_name
    location           = var.location
    workload_name      = var.workload_name
    vnet_address_space = var.vnet_address_space
  }
}
