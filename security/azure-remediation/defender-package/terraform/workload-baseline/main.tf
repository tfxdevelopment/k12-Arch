locals {
  prefix = "k12-${var.environment}"
  # Names that must be globally unique and alphanumeric-only
  short = "k12${var.environment}${var.unique_suffix}"

  tags = merge(var.tags, {
    workload    = "k12-myportal"
    environment = var.environment
    baseline    = "mcsb"
    managed_by  = "terraform"
  })
}

# One resource group per environment (plan decision D-2). The shared
# "development" RG is retired once dev/test/stage each have their own.
resource "azurerm_resource_group" "this" {
  name     = "rg-${local.prefix}"
  location = var.location
  tags     = local.tags
}
