# ---------------------------------------------------------------------------
# Assignments. Names are limited to 24 characters at management-group scope.
# ---------------------------------------------------------------------------

resource "azurerm_management_group_policy_assignment" "nonprod" {
  name                 = "k12-guardrails-nonprod"
  display_name         = "K12 Guardrails — NonProd (${var.nonprod_effect})"
  description          = "MCSB-aligned guardrails for dev/test (effect: ${var.nonprod_effect}). Audit surfaces findings in Defender for Cloud without blocking; Deny rejects non-compliant deployments at ARM."
  management_group_id  = var.nonprod_management_group_id
  policy_definition_id = azurerm_policy_set_definition.k12_guardrails.id
  location             = var.assignment_location
  enforce              = true

  identity {
    type = "SystemAssigned"
  }

  parameters = jsonencode({
    denyCapableEffect       = { value = var.nonprod_effect }
    auditIfNotExistsEffect  = { value = "AuditIfNotExists" }
    auditOnlyEffect         = { value = "Audit" }
    diagnosticsEffect       = { value = "DeployIfNotExists" }
    logAnalyticsWorkspaceId = { value = var.log_analytics_workspace_ids["nonprod"] }
  })

  non_compliance_message {
    content = "Resource does not meet the K12 platform security baseline (MCSB); with Deny in effect the deployment is rejected. See Defender-Remediation-Plan.md section 5 for the fix."
  }
}

resource "azurerm_management_group_policy_assignment" "prod" {
  name                 = "k12-guardrails-prod"
  display_name         = "K12 Guardrails — Prod (${var.prod_effect})"
  description          = "MCSB-aligned guardrails for stage/prod (effect: ${var.prod_effect}). Start in Audit; flip to Deny at Phase 4 exit, after resources are compliant."
  management_group_id  = var.prod_management_group_id
  policy_definition_id = azurerm_policy_set_definition.k12_guardrails.id
  location             = var.assignment_location
  enforce              = true

  identity {
    type = "SystemAssigned"
  }

  parameters = jsonencode({
    denyCapableEffect       = { value = var.prod_effect }
    auditIfNotExistsEffect  = { value = "AuditIfNotExists" }
    auditOnlyEffect         = { value = "Audit" }
    diagnosticsEffect       = { value = "DeployIfNotExists" }
    logAnalyticsWorkspaceId = { value = var.log_analytics_workspace_ids["prod"] }
  })

  non_compliance_message {
    content = "Resource does not meet the K12 platform security baseline (MCSB); with Deny in effect the deployment is rejected. See Defender-Remediation-Plan.md section 5 for the fix."
  }
}

# DINE policies need the assignment identity to be able to write diagnostic
# settings on target resources and read the workspace. Every DINE policy in
# the initiative declares Log Analytics Contributor as its remediation role,
# so that single role is granted — least privilege at MG scope.
locals {
  assignment_identities = {
    nonprod = {
      principal_id = azurerm_management_group_policy_assignment.nonprod.identity[0].principal_id
      scope        = var.nonprod_management_group_id
    }
    prod = {
      principal_id = azurerm_management_group_policy_assignment.prod.identity[0].principal_id
      scope        = var.prod_management_group_id
    }
  }
  remediation_roles = ["Log Analytics Contributor"]
  remediation_role_assignments = {
    for pair in setproduct(keys(local.assignment_identities), local.remediation_roles) :
    "${pair[0]}-${replace(lower(pair[1]), " ", "-")}" => {
      principal_id = local.assignment_identities[pair[0]].principal_id
      scope        = local.assignment_identities[pair[0]].scope
      role         = pair[1]
    }
  }
}

resource "azurerm_role_assignment" "policy_remediation" {
  for_each = local.remediation_role_assignments

  scope                = each.value.scope
  role_definition_name = each.value.role
  principal_id         = each.value.principal_id
}

output "initiative_id" {
  value = azurerm_policy_set_definition.k12_guardrails.id
}
