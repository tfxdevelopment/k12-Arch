# Security Migration TODOs: RLS → Entra ID Claims-Based Authorization

**Context:** Moving away from Azure SQL Row-Level Security (RLS) to Entra ID claims-based authorization.

**Impact:** All documents that reference RLS need to be updated with the new security model.

---

## 🔴 Critical Documents Requiring Updates

### 1. Proposed Architecture - Security Assessment
**File:** `wiki/09-proposed-architecture/04-well-architected/WA-02-security.md`

**Sections to Update:**
- Line ~100-130: "Row-Level Security (RLS) - Unchanged" → **CHANGE TO:** Entra ID claims-based filtering
- Line ~200-250: RLS policy examples → **REPLACE WITH:** Claims-based authorization middleware

**New Security Model:**
```csharp
// INSTEAD OF: SQL RLS policies
// USE: Entra ID claims-based filtering in middleware

[Authorize]
public class StudentsController : ControllerBase
{
    private readonly IHttpContextAccessor _context;

    [HttpGet]
    public async Task<IActionResult> GetStudents()
    {
        // Get claims from JWT token (validated by Entra ID)
        var claims = _context.HttpContext.User.Claims;
        var studentIds = claims.Where(c => c.Type == "extension_StudentAccessControl_StudentIds")
                               .Select(c => c.Value).ToList();

        // Filter in application layer (NOT database RLS)
        var students = await _db.Students
            .Where(s => studentIds.Contains(s.StudentId.ToString()))
            .ToListAsync();

        return Ok(students);
    }
}
```

---

### 2. Current State Security - Row-Level Security Implementation
**File:** `wiki/02-architecture/security/SEC-03-row-level-security.md`

**Action:** Create companion document `SEC-03-PROPOSED-claims-based-authorization.md`

**Sections to Migrate:**
- Session context → JWT claims parsing
- RLS policies → Middleware authorization filters
- Testing strategy → Claims-based testing (mock JWT tokens)

---

### 3. Proposed Architecture - Data API Builder Implementation
**File:** `wiki/09-proposed-architecture/03-hybrid-api/API-01-dab-implementation.md`

**Sections to Update:**
- Line ~250-300: RLS integration via SQL session context → **CHANGE TO:** DAB policy-based authorization

**New DAB Security Config:**
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
          "policy": {
            "database": "@item.StudentId in @claims.studentIds"
          }
        }
      ]
    }
  }
}
```

**Key Change:** DAB's `policy.database` filter replaces SQL RLS predicates.

---

### 4. Proposed Architecture - Analytics APIs
**File:** `wiki/09-proposed-architecture/03-hybrid-api/API-03-analytics-apis.md`

**Sections to Update:**
- Trino queries with RLS enforcement → **CHANGE TO:** CubeJS security context filtering

**New CubeJS Security:**
```javascript
// CubeJS applies claims-based filtering BEFORE sending queries to Trino
cube(`EnrollmentApplications`, {
  sql: `SELECT * FROM trino.sqlserver.enrollment.applications`,

  // Security context from JWT claims (NOT SQL RLS)
  dataSource: ({ securityContext }) => {
    const role = securityContext.role;
    const studentIds = securityContext.studentIds || [];

    if (role === 'Admin') {
      return `SELECT * FROM trino.sqlserver.enrollment.applications`;
    } else if (role === 'Household') {
      // Filter in application layer
      return `
        SELECT * FROM trino.sqlserver.enrollment.applications
        WHERE student_id IN (${studentIds.join(',')})
      `;
    }
  }
});
```

---

### 5. Proposed Architecture - Data Federation Strategy
**File:** `wiki/09-proposed-architecture/05-analytics/ANALYTICS-01-data-federation.md`

**Sections to Update:**
- Line ~400-450: "Row-Level Security (RLS) in Federated Queries" → **REPLACE WITH:** Claims-based filtering in Trino

**Alternative Approach:** Use Trino's `system access control` with file-based rules:

**File:** `/etc/trino/access-control/rules.json`
```json
{
  "catalogs": [
    {
      "user": "household_.*",
      "catalog": "sqlserver",
      "schema": "Enrollment",
      "table": "Applications",
      "privileges": ["SELECT"],
      "filter": "student_id IN (SELECT json_array_elements_text(current_user_claims->'studentIds')::int)"
    }
  ]
}
```

**Problem:** Trino doesn't natively support JWT claims.

**Solution:** Filter in CubeJS layer (see #4 above).

---

### 6. Executive Brief & Progress Report
**Files:**
- `wiki/09-proposed-architecture/EXECUTIVE-BRIEF.md`
- `wiki/09-proposed-architecture/EXECUTIVE-PROGRESS-REPORT.md`

**Sections to Update:**
- References to "RLS integration maintained" → **CHANGE TO:** "Claims-based authorization implemented"
- Security compliance statements

---

### 7. Presentation Slides
**File:** `wiki/09-proposed-architecture/EXECUTIVE-PRESENTATION.md`

**Slides to Update:**
- Slide 8: "Data API Builder - Zero-Code APIs" → Update security section
- Slide 17: "What We're Asking for Today" → Clarify security model change

---

## 🛠️ Implementation Checklist

### Phase 1: Document Updates (Week 1)
- [ ] Update WA-02-security.md (remove RLS sections, add claims-based auth)
- [ ] Create SEC-03-PROPOSED-claims-based-authorization.md (new document)
- [ ] Update API-01-dab-implementation.md (DAB policy examples)
- [ ] Update API-03-analytics-apis.md (CubeJS security context)
- [ ] Update ANALYTICS-01-data-federation.md (remove Trino RLS workarounds)
- [ ] Update EXECUTIVE-BRIEF.md (security statements)
- [ ] Update EXECUTIVE-PROGRESS-REPORT.md (security statements)
- [ ] Update EXECUTIVE-PRESENTATION.md (Slides 8, 17)

### Phase 2: Code Implementation (Week 2-3)
- [ ] Create `EntraAuthorizationMiddleware` (.NET)
- [ ] Implement claims parsing from JWT
- [ ] Update Data API Builder configuration (dab-config.json)
- [ ] Update CubeJS security context (cube.js data models)
- [ ] Remove all SQL RLS policies (SQL scripts)
- [ ] Update integration tests (mock JWT tokens)

### Phase 3: Migration Runbook (Week 4)
- [ ] Create migration guide: RLS → Claims-based
- [ ] Document rollback procedure (if needed)
- [ ] Performance testing (claims filtering vs RLS)
- [ ] Security audit (validate no data leakage)

---

## 📋 New Security Architecture

### High-Level Flow

```
User Browser
    ↓ (HTTPS + JWT Token)
Azure Front Door
    ↓
APIM (JWT Validation)
    ↓
Container Apps Environment
    ├─ Functions Container
    │   ├─ EntraAuthorizationMiddleware (Parse JWT claims)
    │   └─ Filter data by claims (e.g., studentIds)
    ├─ Data API Builder
    │   └─ DAB policy.database filter (claims-based)
    └─ CubeJS
        └─ Security context filter (claims-based)
    ↓
Azure SQL (NO RLS POLICIES)
```

### Key Benefits vs RLS
✅ **Simpler:** No complex SQL session context management
✅ **Portable:** Works with Trino, Cosmos DB, external APIs (not just SQL)
✅ **Testable:** Mock JWT tokens in unit tests (easier than SQL RLS testing)
✅ **Performance:** Filter in application layer with caching (vs SQL execution plans)

### Key Risks
⚠️ **Application-level filtering:** Must ensure ALL queries include claims filter (code review critical)
⚠️ **Cache poisoning:** Redis cache keys must include user identity (prevent cross-user data leakage)
⚠️ **Performance:** May need indices on `StudentId` column (ensure query performance)

---

## 🔗 Related Documents

- [SEC-01: Entra ID Configuration](tools/wiki/02-architecture/security/SEC-01-entra-id-configuration.md) - JWT token structure
- [SEC-02: Authorization Model](tools/wiki/02-architecture/security/SEC-02-authorization-model.md) - Roles and permissions
- [ADR-003: Entra ID B2C for CIAM](tools/wiki/adr/ADR-003-entra-id-b2c-ciam.md) - Identity provider decision

---

**Created:** 2024-11-24
**Owner:** CFI Architecture Team
**Status:** 🔴 CRITICAL - Must address before Week 4 (Analytics implementation)
