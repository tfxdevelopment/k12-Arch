# K12 Messaging Module (Service Bus)

## Overview
This module creates and manages Azure Service Bus resources for event-driven messaging in the K12 system.

## Resources Created
- **Azure Service Bus Namespace** - Central messaging hub with zone redundancy
- **Service Bus Queues** - Pre-configured queues for various application events:
  - `application-events` - Application lifecycle events
  - `new-residency-queue` - New residency applications
  - `residency-response-queue` - Residency response handling (session-enabled)
  - `residency-status-queue` - Residency status updates (session-enabled)
  - `system-events` - System-wide events
- **Network Rule Set** - Default allow configuration with trusted services
- **Authorization Rule** - RootManageSharedAccessKey for namespace access

## Key Features
- **Zone Redundancy**: Automatically enabled for high availability
- **Minimum TLS 1.2**: Enforced for security
- **Duplicate Detection**: Enabled for critical queues (new-residency-queue, residency queues)
- **Session Support**: Enabled for queues requiring ordered processing
- **Dead Letter Configuration**: Configurable per queue for failed message handling
- **Message TTL**: Default 14-day retention

## Usage

```hcl
module "messaging" {
  source = "../../modules/messaging"
  
  environment_name      = local.environment_name
  location              = local.location
  resource_group_name   = module.core.rg_name
  tags                  = merge(local.tags, { module = "messaging" })
}
```

## Outputs
- `namespace_id` - Service Bus namespace resource ID
- `namespace_name` - Namespace name
- `namespace_connection_string` - Primary connection string (sensitive)
- `namespace_connection_string_secondary` - Secondary connection string (sensitive)
- `namespace_primary_key` - Primary authentication key (sensitive)
- `namespace_secondary_key` - Secondary authentication key (sensitive)
- `queue_ids` - Map of queue names to their resource IDs
- `queue_names` - List of all queue names

## Variables
See `variables.tf` for complete variable documentation including queue customization options.

## Notes
- Queue configurations follow Azure best practices for scalability and reliability
- Use `local_auth_enabled = false` in production for enhanced security (use Managed Identity)
- Connection strings are marked as sensitive and won't appear in Terraform output
