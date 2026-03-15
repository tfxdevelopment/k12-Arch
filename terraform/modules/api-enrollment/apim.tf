resource "azurerm_api_management" "api_enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  location            = var.location
  resource_group_name = var.resource_group_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email

  sku_name = "Developer_1"

  tags      = var.tags
  identity {
    type = "SystemAssigned"
  }
  lifecycle {
    ignore_changes = all # covers tags
  }
}

#K12-3580 - Generate self-signed certficate for local environments to talk to APIM
resource "azurerm_key_vault_certificate" "apim_cert" {
  name         = "${var.environment_name}-apim-cert"
  key_vault_id = azurerm_key_vault.api_enrollment_kv.id

  certificate_policy {
    issuer_parameters {
      name = "Self"
    }

    key_properties {
      exportable = true
      key_size   = 2048
      key_type   = "RSA"
      reuse_key  = true
    }

    lifetime_action {
      action {
        action_type = "AutoRenew"
      }

      trigger {
        days_before_expiry = 30
      }
    }

    secret_properties {
      content_type = "application/x-pkcs12"
    }

    x509_certificate_properties {
      # Server Authentication = 1.3.6.1.5.5.7.3.1
      # Client Authentication = 1.3.6.1.5.5.7.3.2
      extended_key_usage = ["1.3.6.1.5.5.7.3.1"]

      key_usage = [
        "cRLSign",
        "dataEncipherment",
        "digitalSignature",
        "keyAgreement",
        "keyCertSign",
        "keyEncipherment",
      ]

      subject            = "CN=${var.environment_name}-api-enrollment.azurewebsites.net"
      validity_in_months = 12
    }
  }
}

# Assign certificate to APIM
resource "azurerm_api_management_certificate" "apim_cert" {
  name                = "${var.environment_name}-apim-cert"
  api_management_name = azurerm_api_management.api_enrollment.name
  resource_group_name = var.resource_group_name

  key_vault_secret_id = azurerm_key_vault_certificate.apim_cert.secret_id

  depends_on = [
    azurerm_role_assignment.kv_apim_secrets
  ]
}

resource "azurerm_api_management_api_version_set" "api-enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  display_name        = "${var.environment_name}-api-enrollment"
  versioning_scheme   = "Segment"

  lifecycle {
    ignore_changes = all
  }
}

resource "azurerm_api_management_backend" "function_backend" {
  count               = var.enable_apim_strangler_rollout && var.apim_function_backend_url != "" ? 1 : 0
  name                = var.apim_function_backend_name
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  protocol            = "http"
  url                 = var.apim_function_backend_url
}

resource "azurerm_api_management_backend" "aca_backend" {
  count               = var.enable_apim_strangler_rollout && var.apim_aca_backend_url != "" ? 1 : 0
  name                = var.apim_aca_backend_name
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  protocol            = "http"
  url                 = var.apim_aca_backend_url
}

resource "azurerm_api_management_api_policy" "strangler_rollout" {
  count               = var.enable_apim_strangler_rollout && var.apim_existing_api_name != "" && var.apim_function_backend_url != "" && var.apim_aca_backend_url != "" ? 1 : 0
  api_name            = var.apim_existing_api_name
  api_management_name = azurerm_api_management.api_enrollment.name
  resource_group_name = var.resource_group_name

  depends_on = [
    azurerm_api_management_backend.function_backend,
    azurerm_api_management_backend.aca_backend
  ]

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <choose>
      <when condition="@((string)context.Request.Headers.GetValueOrDefault(&quot;${var.apim_rollout_header_name}&quot;, &quot;&quot;)).Equals(&quot;${var.apim_rollout_header_value_aca}&quot;, System.StringComparison.OrdinalIgnoreCase)">
        <set-backend-service backend-id="${var.apim_aca_backend_name}" />
      </when>
      <otherwise>
        <set-backend-service backend-id="${var.apim_function_backend_name}" />
      </otherwise>
    </choose>
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
XML
}



