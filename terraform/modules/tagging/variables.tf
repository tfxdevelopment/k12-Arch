variable "environment" {
  type        = string
  description = "Environment name (e.g., development, staging, production)"
}

variable "project" {
  type        = string
  description = "Project name (e.g., k12)"
  default     = "k12"
}

variable "owner" {
  type        = string
  description = "Owner or team responsible for the resources"
  default     = "CFI-AzureDevOps"
}

variable "cost_center" {
  type        = string
  description = "Cost center for billing"
  default     = "IT"
}

variable "additional_tags" {
  type        = map(string)
  description = "Additional custom tags to merge"
  default     = {}
}