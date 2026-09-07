# ---------------------------------------------------------------------------
# Assignments. Names are limited to 24 characters at management-group scope.
# ---------------------------------------------------------------------------

resource "azurerm_management_group_policy_assignment" "nonprod" {
  name                 = "k12-guardrails-nonprod"
  display_name         = "K12 Guardrails — NonProd (Audit)"
  description          = "MCSB-aligned guardrails in Audit mode for dev/test. Findings surface in Defender for Cloud; nothing is blocked."
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
    content = "Resource does not meet the K12 platform security baseline (MCSB). See Defender-Remediation-Plan.md section 5 for the fix."
  }
}

resource "azurerm_management_group_policy_assignment" "prod" {
  name                 = "k12-guardrails-prod"
  display_name         = "K12 Guardrails — Prod (Deny)"
  description          = "MCSB-aligned guardrails in Deny mode for stage/prod. Non-compliant deployments are rejected at ARM."
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
    content = "Deployment blocked: resource does not meet the K12 platform security baseline (MCSB). See Defender-Remediation-Plan.md section 5 for the fix."
  }
}

# DINE policies need the assignment identity to be able to write diagnostic
# settings on target resources and read the workspace.
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
  remediation_roles = ["Monitoring Contributor", "Log Analytics Contributor"]
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
