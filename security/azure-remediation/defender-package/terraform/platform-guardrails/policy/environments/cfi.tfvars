# Run once at management-group scope.
definition_management_group_id = "/providers/Microsoft.Management/managementGroups/cfi"
nonprod_management_group_id    = "/providers/Microsoft.Management/managementGroups/cfi-lz-corp-nonprod"
prod_management_group_id       = "/providers/Microsoft.Management/managementGroups/cfi-lz-corp-prod"
assignment_location            = "eastus"

nonprod_effect = "Audit"
prod_effect    = "Audit" # flip to "Deny" at Phase 4 exit (plan Section 6)

log_analytics_workspace_ids = {
  nonprod = "/subscriptions/<nonprod-sub>/resourceGroups/rg-k12-dev/providers/Microsoft.OperationalInsights/workspaces/log-k12-dev"
  prod    = "/subscriptions/<prod-sub>/resourceGroups/rg-k12-prod/providers/Microsoft.OperationalInsights/workspaces/log-k12-prod"
}
