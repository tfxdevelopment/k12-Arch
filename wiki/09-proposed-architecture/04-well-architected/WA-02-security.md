# WA-02: Security Assessment - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2024-11-24
- **Framework:** Microsoft Azure Well-Architected Framework - Security Pillar
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** SEC-01 (Entra ID), SEC-02 (Authorization), ADR-003 (Entra B2C)

## Executive Summary
Security assessment for K12 MyPortal's proposed Azure Container Apps architecture, maintaining **FedRAMP Moderate** compliance while adding container security, zero trust networking, and enhanced threat protection.

## Well-Architected Framework: Security Pillar

### Five Security Principles
1. **Plan your security readiness**
2. **Design to protect confidentiality**
3. **Design to protect integrity**
4. **Design to protect availability**
5. **Sustain and evolve your security posture**

## Current State Security Posture

### Existing Security Architecture (Maintained)
- ✅ **Hub & Spoke Model:** Entra ID as central identity authority
- ✅ **Custom Security Attributes:** studentAccessControl for fine-grained access
- ✅ **Defense-in-Depth:** Front Door → APIM → Claims-Based Authorization Middleware
- ✅ **PII Protection:** Encryption at rest (TDE), in transit (TLS 1.2+), PGP for DMV/DOR
- ✅ **FedRAMP Moderate:** Azure Government Cloud compliance

### Security Gaps in Current Architecture
1. ❌ **Container Security:** No vulnerability scanning, no image signing
2. ❌ **Zero Trust:** Network security relies on NSGs (not identity-based)
3. ❌ **Secret Management:** Some secrets in app settings (not Key Vault)
4. ❌ **Threat Protection:** Limited runtime protection for Functions
5. ❌ **Audit Logging:** Basic logging, no SIEM integration

## Proposed Architecture Security Enhancements

### 1. Identity & Access Management (No Changes - Existing Is Strong)

The Hub & Spoke model with Entra ID remains the foundation. Proposed architecture **preserves all existing security controls:**

#### Maintained Controls
```
┌────────────────────────────────────────────────────────────────┐
│ Entra ID B2C (Hub - Source of Truth)                           │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Custom Security Attributes (studentAccessControl)           │ │
│ │ - Application Roles: Admin, Provider, School, Household    │ │
│ │ - Fine-Grained Access: StudentIds[], ApplicationIds[]       │ │
│ │ - OBO Flow: User → API → SQL (identity propagation)        │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   [Container Apps]    [Data API Builder]    [Trino/CubeJS]
   JWT Validation      JWT Validation        JWT Validation
```

**No changes needed** - Existing EntraAuthenticationMiddleware works in containers.

### 2. Container Security (NEW)

#### Microsoft Defender for Containers
```bash
# Enable Defender for Containers on subscription
az security pricing create \
  --name ContainerRegistry \
  --tier Standard

az security pricing create \
  --name Containers \
  --tier Standard
```

**Features:**
- **Vulnerability Scanning:** Scan images on push, block critical CVEs
- **Runtime Protection:** Detect suspicious container behavior (crypto mining, reverse shells)
- **Compliance Scanning:** CIS Kubernetes Benchmark, NIST 800-53
- **Just-in-Time Access:** Temporary elevated permissions for debugging

**Cost:** $15/node/month (~$180/month for 12-node cluster) = **+2.6% total cost**

#### Container Image Security Policy
```yaml
# Azure Container Registry (ACR) Security
apiVersion: acr/v1
kind: SecurityPolicy
metadata:
  name: k12-image-policy
spec:
  imageScanning:
    enabled: true
    scanOnPush: true
    severity: CRITICAL  # Block images with CRITICAL vulnerabilities
  imageSigning:
    enabled: true
    notary: true  # Docker Content Trust
  allowedRegistries:
    - k12acr.azurecr.io  # Only allow images from our ACR
  baseImageUpdates:
    enabled: true
    autoRebuild: true  # Rebuild on base image security patch
```

#### Secure Dockerfile Patterns
```dockerfile
# GOOD: Use minimal base images, non-root user
FROM mcr.microsoft.com/dotnet/aspnet:10.0-azurelinux3.0-distroless AS runtime
USER app  # Non-root user (UID 1654)
WORKDIR /app
COPY --from=build --chown=app:app /app/publish .
EXPOSE 8080  # Non-privileged port

# BAD: Avoid
# FROM mcr.microsoft.com/dotnet/sdk:10.0  # SDK includes unnecessary tools
# USER root  # Running as root is insecure
# EXPOSE 80  # Privileged port requires root
```

### 3. Zero Trust Networking (NEW)

#### Dapr mTLS (Mutual TLS)
Container Apps include built-in Dapr service mesh with automatic mTLS:

```yaml
# Dapr configuration (enabled by default on Container Apps)
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: k12-dapr-config
spec:
  mtls:
    enabled: true
    workloadCertTTL: "24h"
    allowedClockSkew: "15m"
  secrets:
    scopes:
      - storeName: azure-keyvault
        defaultAccess: deny
        allowedSecrets: ["sql-password", "redis-key", "classwallet-secret"]
```

**Benefits:**
- All inter-service communication encrypted (TLS 1.3)
- Automatic certificate rotation every 24 hours
- Service-to-service authentication (identity-based, not IP-based)
- Zero trust: Deny by default, explicit allow

#### Network Security (Layered Defense)
```
Internet (HTTPS only)
    ↓
Azure Front Door (WAF + DDoS Protection)
    ↓
APIM (IP filtering, rate limiting, JWT validation)
    ↓
Container Apps Environment (VNET-integrated)
    ↓
    ├── Functions Container (Private IP, Dapr mTLS)
    ├── Data API Builder (Private IP, Dapr mTLS)
    └── Trino/CubeJS (Private IP, Dapr mTLS)
    ↓
Azure SQL (Private Endpoint, no public access)
ADLS Gen2 (Private Endpoint, SAS tokens)
Redis (Private Endpoint, TLS only)
```

**Cost:** Included in Container Apps Environment (no additional cost)

### 4. Secret Management (ENHANCED)

#### Azure Key Vault Integration
```csharp
// Program.cs - Key Vault configuration
var builder = WebApplication.CreateBuilder(args);

// Managed Identity authentication (no passwords!)
var credential = new DefaultAzureCredential();
builder.Configuration.AddAzureKeyVault(
    new Uri("https://k12-kv-prod.vault.azure.net/"),
    credential
);

// Secrets loaded as configuration values
var sqlPassword = builder.Configuration["sql-password"];  // From Key Vault
var redisKey = builder.Configuration["redis-key"];
```

**Container App Secret Reference:**
```yaml
secrets:
  - name: sql-password
    keyVaultUrl: https://k12-kv-prod.vault.azure.net/secrets/sql-password
    identity: system  # Managed Identity (no credentials in code!)
```

#### Secret Rotation Policy
```bash
# Automatic secret rotation (90 days)
az keyvault secret set-attributes \
  --vault-name k12-kv-prod \
  --name sql-password \
  --expires $(date -u -d "+90 days" +"%Y-%m-%dT%H:%M:%SZ")

# Rotation triggers app restart (zero downtime via multi-replica)
```

**Secrets Moved to Key Vault:**
- SQL connection strings
- Redis connection strings
- ClassWallet API keys
- PandaDoc API keys
- SendGrid API keys
- Melissa Data API keys
- DMV/DOR credentials

**Cost:** $5/month (10,000 operations) = **+0.07% total cost**

### 5. Data Protection (ENHANCED)

#### Encryption at Rest (Maintained + Enhanced)
| Layer | Current | Proposed | Encryption |
|-------|---------|----------|------------|
| **Azure SQL** | TDE (AES-256) | TDE + CMK | Customer-managed key (Key Vault) |
| **ADLS Gen2** | SSE (AES-256) | SSE + CMK | Customer-managed key |
| **Redis** | SSE (AES-256) | SSE + CMK | Customer-managed key |
| **Container Volumes** | N/A | SSE (AES-256) | Platform-managed |

**Customer-Managed Keys (CMK) Benefits:**
- Full control over encryption keys
- Audit key usage (Key Vault logs)
- Revoke access instantly (compliance requirement)
- **Cost:** +5% storage/database cost (~$60/month)

#### Encryption in Transit (TLS 1.3)
```yaml
# Container App ingress configuration
ingress:
  external: true
  targetPort: 8080
  transport: http  # Front Door terminates TLS
  allowInsecure: false  # Reject HTTP
  clientCertificateMode: require  # mTLS for service-to-service

# Azure Front Door (internet-facing)
customDomains:
  - name: myportal.seaa.nc.gov
    certificateType: managed  # Free SSL cert
    minimumTlsVersion: 1.3  # TLS 1.3 only (FIPS 140-2 compliant)
```

### 6. PII & FERPA Compliance (MAINTAINED)

The proposed architecture **does not change** how PII is handled. All existing controls are preserved:

#### Claims-Based Authorization (Application Layer)

**New Security Model:** Authorization filtering in application middleware (NOT database RLS)

```csharp
// EntraAuthorizationMiddleware.cs - Claims-based filtering
public class ClaimsAuthorizationService
{
    private readonly IHttpContextAccessor _context;

    public async Task<List<Student>> GetAuthorizedStudents()
    {
        // Extract claims from validated JWT token (Entra ID)
        var claims = _context.HttpContext.User.Claims;
        var role = claims.FirstOrDefault(c => c.Type == "extension_Role")?.Value;
        var studentIds = claims
            .Where(c => c.Type == "extension_StudentAccessControl_StudentIds")
            .Select(c => int.Parse(c.Value))
            .ToList();

        // Filter in application layer (NOT SQL RLS)
        if (role == "Admin")
        {
            return await _db.Students.ToListAsync(); // Admin sees all
        }
        else if (role == "Household")
        {
            return await _db.Students
                .Where(s => studentIds.Contains(s.StudentId))
                .ToListAsync(); // Household sees only their students
        }

        return new List<Student>(); // Default: no access
    }
}
```

**Benefits over SQL RLS:**
- ✅ **Portable:** Works with Trino, Cosmos DB, external APIs (not SQL-only)
- ✅ **Testable:** Mock JWT tokens in unit tests (easier than RLS testing)
- ✅ **Cacheable:** Application-layer caching with user-scoped cache keys
- ✅ **Simpler:** No SQL session context management required

#### PGP Encryption for State Agencies (Maintained)
```csharp
// DMV/DOR integration (no changes)
public class DmvIntegrationService
{
    public async Task<byte[]> EncryptPiiForDmv(StudentData student)
    {
        // Existing PGP encryption logic (unchanged)
        using var pgp = new PgpEncryptionService(_config["dmv-public-key"]);
        var encryptedData = pgp.Encrypt(JsonSerializer.Serialize(student));
        return encryptedData;
    }
}
```

### 7. API Security (DATA API BUILDER)

#### Data API Builder Security Model
```json
{
  "authentication": {
    "provider": "AzureAD",
    "jwt": {
      "audience": "api://k12-myportal",
      "issuer": "https://login.microsoftonline.com/{tenant-id}/v2.0"
    }
  },
  "authorization": {
    "claims-mapping": {
      "role": "extension_Role",
      "studentIds": "extension_StudentAccessControl_StudentIds"
    }
  },
  "entities": {
    "Student": {
      "source": "Enrollment.Students",
      "permissions": [
        {
          "role": "Admin",
          "actions": ["create", "read", "update", "delete"]
        },
        {
          "role": "Household",
          "actions": ["read"],
          "policy": "@item.StudentId in @claims.studentIds"
        }
      ]
    }
  }
}
```

**Security Benefits:**
- JWT validation (Entra ID integration)
- Claims-based policy enforcement in DAB layer
- GraphQL query depth limiting (DoS protection)
- Rate limiting (1000 req/min per user)

### 8. Audit Logging & SIEM Integration (ENHANCED)

#### Current State
- Application Insights (30-day retention)
- Azure SQL Audit Logs (90-day retention)
- Manual SIEM exports

#### Proposed Enhancement: Microsoft Sentinel Integration
```bash
# Enable Sentinel (Azure's cloud-native SIEM)
az sentinel workspace create \
  --resource-group k12-security-rg \
  --workspace-name k12-sentinel \
  --retention-in-days 365  # 1-year retention for FERPA compliance
```

**Log Sources Integrated:**
1. **Application Insights:** API calls, errors, performance, authorization failures
2. **Container App Logs:** Container lifecycle, crashes, resource usage
3. **Azure SQL Auditing:** All database queries, schema changes
4. **Key Vault:** Secret access (who accessed which secret when)
5. **Entra ID:** Sign-ins, MFA events, suspicious activities
6. **Azure Activity Log:** Infrastructure changes, role assignments

**Cost:** $2.46/GB ingested (~50 GB/month = $123/month) = **+1.8% total cost**

#### Security Analytics Rules (Automated Alerts)
```kql
// Alert: Unusual number of authorization failures (potential privilege escalation attempt)
AppTraces
| where Message contains "Authorization failed" or Message contains "Access denied"
| extend UserId = tostring(parse_json(Properties).UserId)
| summarize FailureCount = count() by UserId, bin(TimeGenerated, 5m)
| where FailureCount > 50  // >50 failures in 5 minutes
| extend Severity = "High"
```

```kql
// Alert: Secrets accessed from unexpected IP
AzureKeyVaultLogs
| where OperationName == "SecretGet"
| where CallerIPAddress !in ("52.168.x.x", "20.62.x.x")  // Not from Container Apps IPs
| extend Severity = "Critical"
```

### 9. Compliance Scorecard

| Requirement | Current | Proposed | Status |
|-------------|---------|----------|--------|
| **FedRAMP Moderate** | ✅ Compliant | ✅ Compliant | No change (Azure Gov) |
| **NIST 800-53** | ✅ Compliant | ✅ Enhanced | +Defender, +CMK |
| **FERPA (PII Protection)** | ✅ Compliant | ✅ Compliant | Claims-based auth, TDE |
| **WCAG 2.1 AA** | ✅ Compliant | ✅ Compliant | No frontend changes |
| **SOC 2 Type II** | ✅ Compliant | ✅ Compliant | Azure service compliance |
| **ISO 27001** | ✅ Compliant | ✅ Enhanced | +Sentinel SIEM |

## Security Cost Summary

| Security Feature | Monthly Cost | Annual Cost | Benefit |
|------------------|--------------|-------------|---------|
| **Defender for Containers** | $180 | $2,160 | Vulnerability scanning, runtime protection |
| **Key Vault** | $5 | $60 | Secure secret management |
| **Customer-Managed Keys** | $60 | $720 | Full encryption control |
| **Microsoft Sentinel** | $123 | $1,476 | SIEM, automated threat detection |
| **TOTAL SECURITY** | **+$368** | **+$4,416** | **+5.3% vs base proposal** |

**Updated Monthly Cost:** $7,323 (vs $6,955 base) = **+5.3% for enhanced security**

## Threat Model

### Threat Scenarios & Mitigations

| Threat | STRIDE Category | Mitigation |
|--------|-----------------|------------|
| **SQL Injection** | Tampering | Dapper parameterized queries, DAB auto-parameterization |
| **JWT Token Theft** | Spoofing | Short-lived tokens (1 hour), refresh token rotation |
| **Container Escape** | Elevation of Privilege | Non-root containers, Defender runtime protection |
| **Insider Threat (DB Admin)** | Information Disclosure | Claims-based filtering in app layer, Key Vault RBAC (no direct SQL access) |
| **DDoS Attack** | Denial of Service | Azure Front Door (10 Tbps protection), APIM rate limiting |
| **Supply Chain (Malicious NPM)** | Tampering | Defender for Containers dependency scanning, private NPM registry |

## Penetration Testing Plan (Week 8)

### Third-Party Pentest Scope
1. **External Attack Surface:** APIM, Front Door, public endpoints
2. **JWT Manipulation:** Attempt role elevation, claim tampering
3. **API Abuse:** GraphQL query bombing, excessive N+1 queries
4. **Container Escape:** Attempt breakout to host OS
5. **Data Exfiltration:** Attempt to bypass claims authorization, access unauthorized data

**Budget:** $15,000 (one-time, not monthly cost)
**Vendor:** FedRAMP-approved pentesting firm

## Security Operations (SecOps) Runbook

### Incident Response Procedures

#### P0: Critical Security Incident (Data Breach)
1. **Isolate (5 minutes):** Revoke container app managed identity (cuts off all access)
2. **Notify (15 minutes):** Page CFI CISO, SEAA Product Lead, legal counsel
3. **Investigate (1 hour):** Sentinel query to identify scope (which users, which data)
4. **Remediate (2 hours):** Patch vulnerability, rotate all secrets
5. **Report (24 hours):** FERPA breach notification (if PII accessed)

#### P1: High Security Alert (Authorization Bypass Attempt)
1. **Alert (real-time):** Sentinel triggers alert on excessive authorization failures
2. **Auto-Block (1 minute):** APIM rate limit kicks in for offending user
3. **Investigate (30 minutes):** Security team reviews Application Insights logs
4. **Escalate if needed:** Promote to P0 if confirmed breach

### Security Training Requirements
- **Development Team:** Secure coding (OWASP Top 10) - Annually
- **DevOps Team:** Container security, Key Vault management - Bi-annually
- **All Staff:** FERPA/PII handling - Annually (required by law)

## Recommendations

### Phase 1 (Month 1-6): Foundation
1. ✅ Enable Defender for Containers
2. ✅ Migrate all secrets to Key Vault
3. ✅ Implement customer-managed keys (SQL, ADLS, Redis)
4. ✅ Deploy non-root containers with distroless images
5. ✅ Enable Dapr mTLS for service-to-service communication

### Phase 2 (Month 7-12): Advanced
1. Deploy Microsoft Sentinel SIEM
2. Configure automated alert rules
3. Conduct penetration testing (FedRAMP-approved vendor)
4. Implement secret rotation automation

### Phase 3 (Year 2): Optimization
1. Add Conditional Access policies (Entra ID)
2. Implement Privileged Identity Management (PIM)
3. Add Azure DDoS Protection Standard ($2,944/month - evaluate if needed)

## Success Metrics

### Security KPIs (Measured Quarterly)
- **Vulnerability SLA:** 100% of CRITICAL CVEs patched within 7 days
- **Secret Rotation:** 100% of secrets rotated within 90 days
- **Audit Compliance:** Zero successful authorization bypass attempts
- **Incident Response:** <15 minute mean time to detection (MTTD)
- **Pentest Results:** Zero CRITICAL findings, <5 HIGH findings

## References

### Microsoft Documentation
- [Well-Architected Framework: Security](https://learn.microsoft.com/azure/well-architected/security/)
- [Defender for Containers](https://learn.microsoft.com/azure/defender-for-cloud/defender-for-containers-introduction)
- [Zero Trust with Container Apps](https://learn.microsoft.com/azure/container-apps/networking)
- [Microsoft Sentinel](https://learn.microsoft.com/azure/sentinel/overview)
- [FedRAMP on Azure Government](https://learn.microsoft.com/azure/compliance/offerings/offering-fedramp)

### Related K12 Documents
- [SEC-01: Entra ID Configuration](../../02-architecture/security/SEC-01-entra-id-configuration.md)
- [SEC-02: Authorization Model](../../02-architecture/security/SEC-02-authorization-model.md)
- [ADR-003: Entra ID B2C for CIAM](../../adr/ADR-003-entra-id-b2c-ciam.md)
- [SECURITY-MIGRATION-TODOS: RLS → Claims Migration Plan](../../../SECURITY-MIGRATION-TODOS.md)

---

**Document Status:** ✅ Complete
**Last Updated:** 2024-11-24
**Next Review:** After penetration testing (Week 8)
**Owner:** CFI Architecture Team + CFI Security Team
