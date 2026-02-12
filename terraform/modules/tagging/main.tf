locals {
  base_tags = {
    Environment = var.environment
    Project     = var.project
    Owner       = var.owner
    CostCenter  = var.cost_center
    ManagedBy   = "Terraform"
  }

  merged_tags = merge(local.base_tags, var.additional_tags)
}