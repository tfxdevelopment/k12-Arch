# ---------------------------------------------------------------------------
# Plan 5.9 — Azure SQL (MCSB IM-1, NS-2, DP-3, LT-3, PV-6)
# Closes: Entra admin provisioned; Entra-only authentication; public network
# access disabled; private endpoint; TLS 1.2; auditing; vulnerability
# assessment (express configuration with Defender for SQL).
# ---------------------------------------------------------------------------
resource "azurerm_mssql_server" "this" {
  name                = "sql-${local.short}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  version             = "12.0"

  minimum_tls_version                      = "1.2"
  public_network_access_enabled            = false
  outbound_network_restriction_enabled     = var.is_production_like
  express_vulnerability_assessment_enabled = true # pairs with Defender for SQL (no storage account needed)

  azuread_administrator {
    login_username              = var.sql_entra_admin_login
    object_id                   = var.ops_architects_group_object_id # DBA group in prod
    tenant_id                   = var.tenant_id
    azuread_authentication_only = true # "Entra-only authentication enabled"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

resource "azurerm_mssql_database" "enrollment" {
  name           = "sqldb-${local.prefix}-enrollment"
  server_id      = azurerm_mssql_server.this.id
  sku_name       = var.sql_sku
  zone_redundant = var.is_production_like
  ledger_enabled = var.is_production_like # aligns with the Audit & Ledger design

  # Gap D3 / DR brief: live export shows PITR 7 d and no LTR on every K12 DB.
  short_term_retention_policy {
    retention_days = 35
  }
  long_term_retention_policy {
    weekly_retention  = "P4W"
    monthly_retention = "P12M"
    yearly_retention  = "P3Y" # CFI retention policy: 3 years
    week_of_year      = 1
  }

  tags = local.tags
}

# Auditing → Log Analytics (SQLSecurityAuditEvents), consistent with the
# Azure SQL Audit & Ledger design (LAW as the audit sink).
resource "azurerm_mssql_server_extended_auditing_policy" "this" {
  server_id              = azurerm_mssql_server.this.id
  log_monitoring_enabled = true
}

resource "azurerm_monitor_diagnostic_setting" "sql_master_audit" {
  name                       = "diag-sql-audit"
  target_resource_id         = "${azurerm_mssql_server.this.id}/databases/master"
  log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id

  enabled_log {
    category = "SQLSecurityAuditEvents"
  }
  depends_on = [azurerm_mssql_server_extended_auditing_policy.this]
}

resource "azurerm_mssql_server_security_alert_policy" "this" {
  resource_group_name  = azurerm_resource_group.this.name
  server_name          = azurerm_mssql_server.this.name
  state                = "Enabled"
  email_account_admins = true
}

# ---------------------------------------------------------------------------
# Plan 5.10 — Storage (MCSB DP-3, NS-2, IM-1, BR-1)
# Closes: secure transfer; public blob access disallowed; shared key access
# prevented; network rules / public network access; private link; min TLS;
# cross-tenant replication.
# ---------------------------------------------------------------------------
resource "azurerm_storage_account" "this" {
  name                = "st${local.short}docs" # 3-24 lowercase alphanumerics
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location

  account_tier             = "Standard"
  account_replication_type = var.is_production_like ? "GZRS" : "LRS"
  account_kind             = "StorageV2"

  https_traffic_only_enabled        = true     # "Secure transfer should be enabled"
  min_tls_version                   = "TLS1_2" # "minimum TLS version"
  allow_nested_items_to_be_public   = false    # "public access should be disallowed"
  shared_access_key_enabled         = false    # "should prevent shared key access"
  default_to_oauth_authentication   = true
  public_network_access_enabled     = false # "should disable public network access"
  cross_tenant_replication_enabled  = false # "should prevent cross tenant object replication"
  infrastructure_encryption_enabled = var.is_production_like

  network_rules {
    default_action = "Deny" # "restrict network access using virtual network rules"
    bypass         = ["AzureServices"]
  }

  blob_properties {
    versioning_enabled = var.is_production_like
    delete_retention_policy {
      days = 30
    }
    container_delete_retention_policy {
      days = 30
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

resource "azurerm_storage_container" "documents" {
  name                  = "documents"
  storage_account_id    = azurerm_storage_account.this.id
  container_access_type = "private"
}

# ---------------------------------------------------------------------------
# Plan 5.8 — Static Web Apps (internal admin portal shape). Citizen-facing
# portals stay public behind Front Door Premium + WAF instead.
# Gated: SWA is absent from the Azure Government GA roadmap — Gov environments
# set deploy_static_web_app = false and use the documented fallback
# (App Service static hosting or Front Door + Storage static website).
# ---------------------------------------------------------------------------
resource "azurerm_static_web_app" "admin_portal" {
  count               = var.deploy_static_web_app ? 1 : 0
  name                = "stapp-${local.prefix}-admin"
  resource_group_name = azurerm_resource_group.this.name
  location            = "eastus2" # SWA is available in a subset of regions

  sku_tier = "Standard" # private endpoints, custom auth, managed identity
  sku_size = "Standard"

  public_network_access_enabled      = false # reachable only through the private endpoint
  preview_environments_enabled       = !var.is_production_like
  configuration_file_changes_enabled = true

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}
