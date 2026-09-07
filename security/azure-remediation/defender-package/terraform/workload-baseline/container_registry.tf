# ---------------------------------------------------------------------------
# Plan 5.3 — Container Registry (MCSB IM-3, NS-2, PV-6)
# Closes: admin account disabled; anonymous auth disabled; unrestricted
# network access; private link; image vulnerability findings (with Defender
# for Containers + Trivy in MSDO).
# ---------------------------------------------------------------------------
resource "azurerm_container_registry" "this" {
  name                = "cr${local.short}" # alphanumerics only, globally unique
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku                 = "Premium" # private link + export policy need Premium

  admin_enabled                 = false
  anonymous_pull_enabled        = false
  public_network_access_enabled = false
  export_policy_enabled         = false
  network_rule_bypass_option    = "AzureServices" # lets Defender for Containers scan images
  zone_redundancy_enabled       = var.is_production_like

  retention_policy_in_days = 7 # untagged manifests
  tags                     = local.tags
}
