variable "definition_management_group_id" {
  description = "Management group where the custom initiative is defined (usually the intermediate root, e.g. /providers/Microsoft.Management/managementGroups/cfi)."
  type        = string
}

variable "nonprod_management_group_id" {
  description = "Management group containing dev/test subscriptions. Initiative is assigned with Audit effects here."
  type        = string
}

variable "prod_management_group_id" {
  description = "Management group containing stage/prod subscriptions. Initiative is assigned with Deny effects here (only after resources are compliant)."
  type        = string
}

variable "nonprod_effect" {
  description = "Effect for Audit/Deny-capable policies on the NonProd assignment."
  type        = string
  default     = "Audit"
  validation {
    condition     = contains(["Audit", "Deny", "Disabled"], var.nonprod_effect)
    error_message = "nonprod_effect must be Audit, Deny or Disabled."
  }
}

variable "prod_effect" {
  description = "Effect for Audit/Deny-capable policies on the Prod assignment. Start with Audit; flip to Deny at Phase 4 exit."
  type        = string
  default     = "Deny"
  validation {
    condition     = contains(["Audit", "Deny", "Disabled"], var.prod_effect)
    error_message = "prod_effect must be Audit, Deny or Disabled."
  }
}

variable "assignment_location" {
  description = "Region for the policy assignment identity (required because the initiative contains DINE policies)."
  type        = string
  default     = "eastus"
}

variable "log_analytics_workspace_ids" {
  description = "Map of management-group key (nonprod|prod) to the Log Analytics workspace ID that DINE diagnostic policies should target."
  type        = map(string)
}
