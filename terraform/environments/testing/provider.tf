terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.11.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "k12-infra"
    storage_account_name = "k12infra"
    container_name       = "tfstate"
    key                  = "testing.tfstate"
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
  subscription_id = "cf6841bb-b70c-4d55-a489-2d53855e78b5"
}

provider "azuread" {}