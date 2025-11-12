# Get current Azure AD client config
data "azuread_client_config" "current" {}

resource "azuread_application" "devops_sp" {
  display_name = "k12devops-docker-sp"
  owners       = [data.azuread_client_config.current.object_id]
  
  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" 
    
    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d" # User.Read
      type = "Scope"
    }
  }
}

# Create Service Principal for the Application
resource "azuread_service_principal" "devops_sp" {
  client_id                    = azuread_application.devops_sp.client_id 
  app_role_assignment_required = false
  owners                       = [data.azuread_client_config.current.object_id]
}

# Create a client secret (password)
resource "azuread_application_password" "devops_sp_secret" {
  application_id    = azuread_application.devops_sp.id
  display_name      = "DevOps Docker Scripts Secret"
  end_date_relative = "8760h"
}

data "azurerm_key_vault" "api_enrollment_kv" {
  name                = "${var.environment_name}apikv"
  resource_group_name = var.resource_group_name
}

# Store Client ID in Key Vault
resource "azurerm_key_vault_secret" "sp_client_id" {
  name         = "docker-sp-client-id"
  value        = azuread_application.devops_sp.client_id
  key_vault_id = data.azurerm_key_vault.api_enrollment_kv.id
  
  depends_on = [azuread_application.devops_sp]
}

# Store Client Secret in Key Vault
resource "azurerm_key_vault_secret" "sp_client_secret" {
  name         = "docker-sp-client-secret"
  value        = azuread_application_password.devops_sp_secret.value
  key_vault_id = data.azurerm_key_vault.api_enrollment_kv.id  
  
  depends_on = [azuread_application_password.devops_sp_secret]
}


resource "azurerm_key_vault_access_policy" "devops_sp_policy" {
  key_vault_id = data.azurerm_key_vault.api_enrollment_kv.id  
  tenant_id    = data.azuread_client_config.current.tenant_id
  object_id    = azuread_service_principal.devops_sp.object_id

  secret_permissions = [
    "Get",
    "List"
  ]
}