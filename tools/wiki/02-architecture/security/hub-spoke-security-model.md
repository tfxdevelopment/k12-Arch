# Hub & Spoke Security Model

**Status:** Draft
**Last updated:** 2026-01-20

## Purpose
Describe the hub-and-spoke security model used for this system’s Azure networking and security boundaries.

## Summary
The hub-and-spoke model centralizes shared security and networking capabilities in a hub while isolating workloads into spokes.

## Hub responsibilities
- Shared connectivity (for example, connectivity to on-premises or shared services)
- Centralized firewalling and routing controls
- Shared monitoring and security tooling where appropriate

## Spoke responsibilities
- Isolated workload environments
- Workload-specific access controls
- Least-privilege access to shared hub services

## Security considerations
- Deny-by-default network rules
- Centralized egress control
- Private endpoints where supported
- Separation of duties for access

## Related documentation
- [SEC-01: Entra ID Configuration](./SEC-01-entra-id-configuration.md)
- [SEC-02: Authorization Model](./SEC-02-authorization-model.md)
- [SEC-04: Audit Logging](./SEC-04-audit-logging.md)
