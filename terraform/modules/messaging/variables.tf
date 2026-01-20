variable "environment_name" {
  type        = string
  description = "Environment name (development, staging, testing, production)"
}

variable "location" {
  type        = string
  description = "Azure region for resources"
}

variable "resource_group_name" {
  type        = string
  description = "The name of the resource group"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Tags to apply to all resources"
}

variable "servicebus_namespace_name" {
  type        = string
  description = "Name of the Service Bus namespace"
  default     = "k12eventhub"
}

variable "minimum_tls_version" {
  type        = string
  description = "Minimum TLS version for the Service Bus namespace"
  default     = "1.2"
}

variable "public_network_access_enabled" {
  type        = bool
  description = "Enable public network access to the Service Bus namespace"
  default     = true
}

variable "local_auth_enabled" {
  type        = bool
  description = "Enable local authentication (shared access keys)"
  default     = false
}

variable "zone_redundant" {
  type        = bool
  description = "Enable zone redundancy for the namespace"
  default     = true
}

variable "queues" {
  type = list(object({
    name                                 = string
    lock_duration                        = optional(string, "PT1M")
    max_size_in_megabytes                = optional(number, 1024)
    requires_duplicate_detection         = optional(bool, false)
    requires_session                     = optional(bool, false)
    default_message_ttl                  = optional(string, "P14D")
    dead_lettering_on_message_expiration = optional(bool, false)
    enable_batched_operations            = optional(bool, true)
    duplicate_detection_history_time_window = optional(string, "PT10M")
    max_delivery_count                   = optional(number, 10)
  }))
  default = [
    {
      name                         = "application-events"
      requires_duplicate_detection = false
      requires_session             = false
      dead_lettering_on_message_expiration = false
    },
    {
      name                         = "new-residency-queue"
      requires_duplicate_detection = true
      requires_session             = false
      dead_lettering_on_message_expiration = true
    },
    {
      name                         = "residency-response-queue"
      requires_duplicate_detection = true
      requires_session             = true
      dead_lettering_on_message_expiration = false
    },
    {
      name                         = "residency-status-queue"
      requires_duplicate_detection = true
      requires_session             = true
      dead_lettering_on_message_expiration = false
    },
    {
      name                         = "system-events"
      requires_duplicate_detection = false
      requires_session             = false
      dead_lettering_on_message_expiration = false
    }
  ]
  description = "List of Service Bus queues to create"
}
