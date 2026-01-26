# Broken Link Fix Plan
**Generated**: 2025-01-20  
**Total Broken Links**: 200+  
**Categorized**: 174 reviewed (excluding SQL false positives)

---

## Category Summary

| Category | Count | Priority | Action |
|----------|-------|----------|--------|
| **SQL False Positives** | 26 | N/A | Exclude from fixes (legitimate SQL DDL) |
| **High-Priority Navigation** | 10 | **HIGH** | Fix immediately (README, TOC) |
| **Missing Security Files** | 22 | **HIGH** | Create stub files (SEC-03, SEC-04) |
| **Missing Standard Files** | 4 | **HIGH** | Verify/create (STD-01 through STD-04) |
| **Missing Frontend Files** | 5 | **HIGH** | Verify/create (FE-01 through FE-05) |
| **Missing Operations Files** | 4 | **MEDIUM** | Create stubs (OPS-01 through OPS-04) |
| **Missing Deployment Files** | 4 | **MEDIUM** | Create stubs (DEPLOY-01 through DEPLOY-04) |
| **Missing Backend Files** | 4 | **MEDIUM** | Create stubs (BE-01 through BE-04) |
| **Missing Data Files** | 4 | **MEDIUM** | Create stubs (DATA-01 through DATA-04) |
| **Missing C4 Level-4 Diagrams** | 47 | **MEDIUM** | Create stubs or remove refs (C4-05 through C4-08) |
| **Missing Integration Files** | 8 | **MEDIUM** | Verify/remove (INT-07, WF-01, QueryBuilder) |
| **Missing Proposed Arch Files** | 13 | **LOW** | Review if still needed |
| **Cross-Repo References** | 9 | **LOW** | Document or remove (k12-infra, k12-test-api-postman, CLAUDE.md) |
| **ADR Path Issues** | 10 | **MEDIUM** | Already fixed in previous session |

---

## SQL False Positives (26 links) - EXCLUDE

**Files**: `wikifull.md` (13), `arch-full.md` (13)  
**Pattern**: SQL CREATE TABLE/INDEX statements with `[ColumnName]` syntax

**Examples**:
- `[SemanticLayerId]`, `[CreatedBy]`, `[IsPublic]`
- `[ExecutedDateTime] DESC`, `[CreatedDate]`

**Action**: These are legitimate SQL DDL, not broken markdown links. Already filtered by generator but showing in old aggregated files. **No fix needed**.

---

## HIGH PRIORITY: Navigation & Core Documentation

### 1. Root README.md (5 broken links)
**Impact**: Main entry point for all documentation users

| Line | Broken Link | Issue | Fix |
|------|-------------|-------|-----|
| 35 | `./03-technical/README.md` | Directory doesn't exist | Remove link or create placeholder |
| 42 | `./04-requirements/README.md` | Directory doesn't exist | Remove link or create placeholder |
| 61 | `./07-program-management/README.md` | Directory doesn't exist | Remove link or create placeholder |
| 72 | `../../k12-infra/terraform/README.md` | Cross-repo reference | Document external repo or remove |
| 73 | `../../k12-test-api-postman/README.md` | Cross-repo reference | Document external repo or remove |

**Recommendation**: Remove references to non-existent directories since they're not in current wiki scope.

### 2. TABLE_OF_CONTENTS.md (5 broken links)
**Impact**: Primary navigation structure

| Line | Broken Link | Issue | Fix |
|------|-------------|-------|-----|
| 111 | `02-architecture/QueryBuilder-Analytics-Platform.md` | File renamed/moved | Update to correct path |
| 120 | `02-architecture/QueryBuilder-SDK-Design.md` | File renamed/moved | Update to correct path |
| 175 | `../../k12-infra/terraform/README.md` | Cross-repo reference | Document or remove |
| 189 | `../../k12-test-api-postman/README.md` | Cross-repo reference | Document or remove |
| 411 | URL-encoded link issue | Encoding problem | Fix encoding |

**Recommendation**: Update renamed files, remove cross-repo references.

---

## HIGH PRIORITY: Security Documentation (22 broken links)

**Files with issues**: `hub-spoke-security-model.md`, `README.md`, `SEC-01`, `SEC-02`, `SEC-03`, `SEC-04`

**Missing files**:
- `SEC-03-row-level-security.md` (referenced 9 times)
- `SEC-04-audit-logging.md` (referenced 9 times)

**Broken cross-references**: Existing security files reference each other but 2 files are missing

**Recommendation**: **Create stub files** for SEC-03 and SEC-04 with TODO markers, since they're heavily referenced by existing security documentation.

---

## HIGH PRIORITY: Standards Documentation (4 broken links)

**File**: `04-standards/README.md`

**Missing files**:
- `STD-01-frontend-coding-standards.md`
- `STD-02-backend-coding-standards.md`
- `STD-03-code-review-guidelines.md`
- `STD-04-git-workflow.md`

**Note**: Health report shows these files exist (they have incompleteness markers), so links may have path issues.

**Recommendation**: **Verify file existence** - if they exist, fix paths; if not, create stubs.

---

## HIGH PRIORITY: Frontend Documentation (5 broken links)

**File**: `05-development/frontend/README.md`

**Missing files**:
- `FE-01-nx-monorepo-architecture-guide.md`
- `FE-02-shared-library-documentation.md`
- `FE-03-component-architecture-patterns.md`
- `FE-04-state-management-strategy.md`
- `FE-05-routing-strategy.md`

**Note**: Health report shows at least FE-03 exists (has incompleteness markers).

**Recommendation**: **Verify file existence** - if they exist, fix paths; if not, create stubs.

---

## MEDIUM PRIORITY: Operations Documentation (4 broken links)

**File**: `06-operations/README.md`

**Missing files**:
- `OPS-01-azure-defender-runbook.md`
- `OPS-02-rbac-guide.md`
- `OPS-03-test-user-account-management.md`
- `OPS-04-cutover-planning.md`

**Note**: Health report shows these files exist with many incompleteness markers (9-12 each).

**Recommendation**: **Verify paths** - files likely exist, just path issues.

---

## MEDIUM PRIORITY: Deployment Documentation (4 broken links)

**File**: `07-deployment/README.md`

**Missing files**:
- `DEPLOY-01-environment-topology.md`
- `DEPLOY-02-network-architecture.md`
- `DEPLOY-03-cicd-pipeline-architecture.md`
- `DEPLOY-04-infrastructure-monitoring.md`

**Note**: Health report shows these files exist with many incompleteness markers (11-13 each).

**Recommendation**: **Verify paths** - files likely exist, just path issues.

---

## MEDIUM PRIORITY: Backend & Data Documentation (8 broken links)

**Backend files** (`02-architecture/backend/README.md`):
- `BE-01-layered-architecture-deep-dive.md`
- `BE-02-api-design-patterns.md`
- `BE-03-data-access-patterns.md`
- `BE-04-external-service-integration-patterns.md`

**Data files** (`02-architecture/data/README.md`):
- `DATA-01-data-flow-diagrams.md`
- `DATA-02-adls-gen2-structure.md`
- `DATA-03-data-retention-policies.md`
- `DATA-04-backup-and-recovery.md`

**Note**: Health report confirms these files exist with incompleteness markers (11-14 each).

**Recommendation**: **Verify paths** - files exist, likely just path issues.

---

## MEDIUM PRIORITY: C4 Diagram Cross-References (47 broken links)

**Files**: Various in `02-architecture/c4-diagrams/`

**Issue**: Internal cross-references between C4 diagram levels, plus missing level-4 diagrams

**Missing level-4 diagrams**:
- `C4-05-domain-model-class-diagram.md`
- `C4-06-authorization-sequence-diagram.md`
- `C4-07-enrollment-process-sequence-diagram.md`
- `C4-08-payment-process-sequence-diagram.md`

**Note**: Health report shows C4-05 through C4-08 exist with incompleteness markers (9-11 each).

**Recommendation**: **Verify paths** - files exist, fix internal cross-references.

---

## MEDIUM PRIORITY: Integration Documentation (8 broken links)

**Files**: `02-architecture/README.md`, integration files

**Missing files**:
- `INT-07-rds-integration.md` (referenced 3 times)
- `WF-01-roster-to-be-certified.md`
- QueryBuilder files (renamed/moved)

**Recommendation**: Verify if INT-07 and WF-01 are needed; update QueryBuilder paths.

---

## MEDIUM PRIORITY: ADR Path Normalization (10 broken links)

**Status**: Already addressed in previous session consolidation

**Remaining issues**: A few integration files still using old `../../../wiki/adr/` pattern

**Recommendation**: Quick grep and replace for consistency.

---

## LOW PRIORITY: Proposed Architecture (13 broken links)

**File**: `09-proposed-architecture/README.md`, `EXECUTIVE-BRIEF.md`, `EXECUTIVE-PROGRESS-REPORT.md`

**Missing files**:
- `01-container-apps/CONT-*` files (6 different)
- `02-aspire/ASPIRE-*` files (2 different)
- `04-well-architected/WA-03-cost-optimization.md`
- `07-adr-proposed/ADR-PROP-*` files (3 different)

**Recommendation**: Review if proposed architecture is still relevant, create stubs or remove section.

---

## LOW PRIORITY: Cross-Repo References (9 broken links)

**Repositories referenced**:
- `../../k12-infra/terraform/README.md` (5 times)
- `../../k12-test-api-postman/README.md` (3 times)
- `../../CLAUDE.md` (1 time)

**Recommendation**: Document these as external references in a "Related Repositories" section or remove.

---

## Execution Plan

### Batch 1: High-Priority Navigation (15 broken links)
**Files**: `README.md`, `TABLE_OF_CONTENTS.md`  
**Action**: Remove non-existent directory references, update renamed files  
**Expected time**: 15 minutes  

### Batch 2: Security Files (22 broken links)
**Files**: Security documentation  
**Action**: Create SEC-03 and SEC-04 stub files with TODO markers  
**Expected time**: 20 minutes  

### Batch 3: Path Verification (50+ broken links)
**Files**: Standards, Frontend, Operations, Deployment, Backend, Data, C4  
**Action**: Verify file existence, fix paths in parent READMEs  
**Expected time**: 30 minutes  

### Batch 4: Integration & Proposed Arch (21 broken links)
**Files**: Integration docs, proposed architecture  
**Action**: Create needed stubs or remove outdated references  
**Expected time**: 20 minutes  

### Batch 5: Cross-Repo Cleanup (9 broken links)
**Files**: Various  
**Action**: Remove cross-repo references or document as external  
**Expected time**: 10 minutes  

---

## Success Metrics

**Before**: 200+ broken links  
**After Batch 1**: ~185 broken links (15 fixed)  
**After Batch 2**: ~163 broken links (37 fixed total)  
**After Batch 3**: ~113 broken links (87 fixed total)  
**After Batch 4**: ~92 broken links (108 fixed total)  
**After Batch 5**: ~83 broken links (117 fixed total)  

**Target**: Reduce broken links by 50%+ in first pass, leaving only legitimate edge cases or low-priority proposed architecture.

---

## Notes

- **SQL false positives**: Already excluded by analysis, won't be "fixed"
- **ADR paths**: Already normalized in previous session
- **File verification**: Many "missing" files likely exist with path issues - verify before creating stubs
- **Proposed architecture**: Low priority since it may be outdated; review with user before spending time
