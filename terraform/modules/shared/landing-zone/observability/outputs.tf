output "design_contract" {
  value = {
    module_name      = local.module_name
    environment_name = var.environment_name
    location         = var.location
  }
}
