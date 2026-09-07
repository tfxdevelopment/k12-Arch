# ---------------------------------------------------------------------------
# Plan 5.2 — Key Vault (MCSB DP-8, PA-7, NS-2, LT-3)
# Closes: RBAC should be used; soft delete; purge protection; firewall or
# public access disabled; private link; resource logs; secret expiry.
# ---------------------------------------------------------------------------
resource "azurerm_key_vault" "this" {
  name                = "kv-${local.short}" # <= 24 chars, globally unique
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tenant_id           = var.tenant_id
  sku_name            = "standard"

  rbac_authorization_enabled = true # "Role-Based Access Control should be used on Key Vault services"
  purge_protection_enabled   = true # "Key vaults should have purge protection enabled"
  soft_delete_retention_days = var.key_vault_soft_delete_days

  public_network_access_enabled = false # "firewall enabled or public network access disabled"
  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices" # trusted services (e.g. Container Apps secret refs during provisioning)
  }

  tags = local.tags
}

# Example: every secret carries an expiry (plan 5.2 "secrets should have an
# expiration date"). Rotation is driven by the SecretNearExpiry Event Grid
# event, not by editing Terraform.
resource "azurerm_key_vault_secret" "example_api_key" {
  name            = "nsc-api-key"
  value           = "replace-me-via-pipeline" # never commit real values
  key_vault_id    = azurerm_key_vault.this.id
  content_type    = "text/plain"
  expiration_date = timeadd(timestamp(), "8760h") # 365 days

  lifecycle {
    ignore_changes = [value, expiration_date] # rotated out-of-band
  }

  # Deployer needs Key Vault Secrets Officer (and network line-of-sight) first.
  depends_on = [azurerm_private_endpoint.this]
}
