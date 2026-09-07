terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.60"
    }
  }
}

# Run once per subscription: -var-file=environments/<env>.tfvars
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

variable "subscription_id" {
  type = string
}

variable "plan_tier" {
  description = "full = stage/prod plan set (plan decision D-8); baseline = CSPM + Key Vault for dev/test."
  type        = string
  default     = "baseline"
  validation {
    condition     = contains(["full", "baseline"], var.plan_tier)
    error_message = "plan_tier must be full or baseline."
  }
}

variable "security_contact_email" {
  description = "Security Office distribution list (Defender rec: Subscriptions should have a contact email address)."
  type        = string
}

variable "security_contact_phone" {
  type    = string
  default = ""
}

variable "workload_has_app_service" {
  description = "Set true while Azure Functions / App Service front-ends remain (enables Defender for App Service)."
  type        = bool
  default     = false
}

variable "workload_has_apim" {
  description = "Set true if API Management is the public edge (enables Defender for APIs)."
  type        = bool
  default     = false
}

# ---------------------------------------------------------------------------
# Defender plans. Keys are azurerm resource_type values.
# CloudPosture (Defender CSPM) carries attack-path analysis, CIEM and the
# serverless-container posture used for Azure Container Apps.
# ---------------------------------------------------------------------------
locals {
  baseline_plans = {
    CloudPosture = { tier = "Standard", subplan = null }
    KeyVaults    = { tier = "Standard", subplan = null }
  }
  full_plans = merge(local.baseline_plans, {
    StorageAccounts = { tier = "Standard", subplan = "DefenderForStorageV2" }
    SqlServers      = { tier = "Standard", subplan = null }
    Arm             = { tier = "Standard", subplan = "PerSubscription" }
    Containers      = { tier = "Standard", subplan = null }
    },
    var.workload_has_app_service ? { AppServices = { tier = "Standard", subplan = null } } : {},
    var.workload_has_apim ? { Api = { tier = "Standard", subplan = "P1" } } : {}
  )
  plans = var.plan_tier == "full" ? local.full_plans : local.baseline_plans
}

resource "azurerm_security_center_subscription_pricing" "plan" {
  for_each = local.plans

  resource_type = each.key
  tier          = each.value.tier
  subplan       = each.value.subplan

  # Defender for Storage v2: turn on malware scanning + sensitive data discovery
  # (prod document store and the SFTP landing zone are the reason).
  dynamic "extension" {
    for_each = each.key == "StorageAccounts" ? ["OnUploadMalwareScanning", "SensitiveDataDiscovery"] : []
    content {
      name = extension.value
      additional_extension_properties = extension.value == "OnUploadMalwareScanning" ? {
        CapGBPerMonthPerStorageAccount = "5000"
      } : null
    }
  }
}

# Defender recs: security contact, high-severity email, email to owners.
resource "azurerm_security_center_contact" "default" {
  name                = "default1"
  email               = var.security_contact_email
  phone               = var.security_contact_phone
  alert_notifications = true
  alerts_to_admins    = true
}
