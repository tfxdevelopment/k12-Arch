terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.60" # 5.0 (July 2026) renames/removes fields; upgrade deliberately via the 5.0 guide
    }
  }
}

provider "azurerm" {
  features {}
  # Deployed with a pipeline identity that holds:
  #   - Resource Policy Contributor on the management group (initiative + assignments)
  #   - Security Admin on each subscription (Defender plans, security contact)
}
