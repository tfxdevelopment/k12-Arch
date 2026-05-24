# Security Architecture

This directory contains comprehensive security architecture documentation for the K12 MyPortal system.

## Overview

The K12 MyPortal security architecture implements a **Hub and Spoke** model with Microsoft Entra ID as the central identity authority. The system is designed for:

- **FedRAMP High** compliance
- **NIST 800-53** security controls
- **FERPA** student data protection
- **Zero Trust** architecture principles

## Security Documents

| Document | Description | Status |
|----------|-------------|--------|
| [SEC-01: Entra ID Configuration](./SEC-01-entra-id-configuration.md) | Hub & Spoke model, custom security attributes, administrative units | Complete |
| [SEC-02: Authorization Model](./SEC-02-authorization-model.md) | Application roles, permissions, authorization flow | Complete |
| [SEC-03: Row-Level Security](./SEC-03-row-level-security.md) | RLS policy definitions, context info, testing strategy | Complete |
| [SEC-04: Audit Logging](./SEC-04-audit-logging.md) | Audit events, log retention, compliance | Complete |

## Security Architecture Highlights

### Identity Management
- **Microsoft Entra ID B2C** for Customer Identity and Access Management (CIAM)
- **Custom Security Attributes** for fine-grained access control
- **Administrative Units** for delegated administration

### Defense-in-Depth Layers
1. **Perimeter**: Azure Front Door, WAF, DDoS Protection
2. **Network**: Private endpoints, NSGs, service tags
3. **API Gateway**: Azure API Management with policies
4. **Application**: JWT validation, role-based access
5. **Data**: Row-Level Security, encryption at rest

### Authorization Flow
```
User Login → Entra ID B2C → JWT Token with Claims
    → APIM Policy Validation → API Gateway Middleware
    → Custom Security Attribute Check → SQL RLS Filter
```

## Related Documentation

- [ADR-003: Entra ID B2C for CIAM](./../../adr/ADR-003-entra-id-b2c-ciam.md)
- [System Architecture Overview](./../README.md)
- [Hub & Spoke Model (Confluence)](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4053696597)

## Security Contacts

- **Security Questions**: CFI Security Team
- **Compliance Questions**: SEAA Compliance Officer
- **Architecture Questions**: CFI Architecture Team

---

*Last Updated: December 2025*
