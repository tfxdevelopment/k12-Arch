# WA-02: Security Assessment - Proposed Architecture

## Metadata
- **Status:** Draft
- **Framework:** Microsoft Azure Well-Architected Framework - Security Pillar
- **Compliance Targets:** FedRAMP Moderate, NIST 800-53, FERPA
- **Related:** [WA-01 Reliability](WA-01-reliability.md), [WA-04 Operational Excellence](WA-04-operational-excellence.md)

## Executive Summary
The proposed architecture maintains the existing hub-and-spoke identity and authorization model while strengthening workload, network, and supply chain controls for containerized workloads.

## Security Priorities
1. **Identity-first access control** using Entra ID, managed identities, and least privilege RBAC.
2. **Data protection** with encryption in transit and at rest, plus scoped secrets in Key Vault.
3. **Workload hardening** with signed images, vulnerability scanning, and runtime protection.
4. **Operational security** through centralized logging, SIEM integration, and incident workflows.

## Control Mapping
| Security Domain | Proposed Control | Evidence Source |
|---|---|---|
| Identity and access | Managed identity + RBAC segmentation | Azure role assignments, access reviews |
| Application secrets | Key Vault references only | Terraform/AVM config and app settings |
| Network boundary | Private endpoints + restricted ingress | Network topology and NSG/Firewall policy |
| Threat detection | Defender for Cloud + Sentinel alerts | SOC alert history and response SLAs |

## Security Implementation Checklist
- [ ] Remove remaining app-setting secrets and migrate to Key Vault references
- [ ] Enable container image scanning and critical CVE deployment gates
- [ ] Enforce private networking for data stores and internal APIs
- [ ] Validate incident response playbook for enrollment-period scenarios

## References
- [Azure Well-Architected Framework: Security](https://learn.microsoft.com/azure/well-architected/security/)
