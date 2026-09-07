terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.60"
    }
  }
}

# Run once per environment: terraform apply -var-file=environments/<env>.tfvars
provider "azurerm" {
  features {
    key_vault {
      # Purge protection is on everywhere (plan decision D-1/5.2); make destroy behave.
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
  }
  subscription_id = var.subscription_id
}
