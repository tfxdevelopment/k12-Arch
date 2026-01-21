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

variable "queues" {
  type = list(object({
    name                                 = string
    lock_duration                        = string
    max_size_in_megabytes                = number
    requires_duplicate_detection         = bool
    requires_session                     = bool
    default_message_ttl                  = string
    dead_lettering_on_message_expiration = bool
    duplicate_detection_history_time_window = string
    max_delivery_count                   = number
  }))
  default = [
    {
      name                                 = "application-events"
      lock_duration                        = "PT1M"
      max_size_in_megabytes                = 1024
      requires_duplicate_detection         = false
      requires_session                     = false
      default_message_ttl                  = "P14D"
      dead_lettering_on_message_expiration = false
      duplicate_detection_history_time_window = "PT10M"
      max_delivery_count                   = 10
    },
    {
      name                                 = "new-residency-queue"
      lock_duration                        = "PT1M"
      max_size_in_megabytes                = 1024
      requires_duplicate_detection         = true
      requires_session                     = false
      default_message_ttl                  = "P14D"
      dead_lettering_on_message_expiration = true
      duplicate_detection_history_time_window = "PT10M"
      max_delivery_count                   = 10
    },
    {
      name                                 = "residency-response-queue"
      lock_duration                        = "PT1M"
      max_size_in_megabytes                = 1024
      requires_duplicate_detection         = true
      requires_session                     = true
      default_message_ttl                  = "P14D"
      dead_lettering_on_message_expiration = false
      duplicate_detection_history_time_window = "PT10M"
      max_delivery_count                   = 10
    },
    {
      name                                 = "residency-status-queue"
      lock_duration                        = "PT1M"
      max_size_in_megabytes                = 1024
      requires_duplicate_detection         = true
      requires_session                     = true
      default_message_ttl                  = "P14D"
      dead_lettering_on_message_expiration = false
      duplicate_detection_history_time_window = "PT10M"
      max_delivery_count                   = 10
    },
    {
      name                                 = "system-events"
      lock_duration                        = "PT1M"
      max_size_in_megabytes                = 1024
      requires_duplicate_detection         = false
      requires_session                     = false
      default_message_ttl                  = "P14D"
      dead_lettering_on_message_expiration = false
      duplicate_detection_history_time_window = "PT10M"
      max_delivery_count                   = 10
    }
  ]
  description = "List of Service Bus queues to create"
}

