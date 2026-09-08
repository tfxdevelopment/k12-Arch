# CI/CD Research Checklist — "what's configured vs. what's available" (DRAFT, local only)

**Purpose:** collect the evidence for the CI/CD redesign + integration-environment proposal in a 3-day timebox, so the proposal argues from numbers, not from "it feels slow."
**Output:** (1) baseline metrics, (2) configured-vs-available findings table, (3) ranked causes, (4) quick wins that are safe before the 10/7 freeze vs. redesign items for the parallel build.
**ADO:** `dev.azure.com/CFI-AzureDevOps/K12` — repos `k12-infra`, `k12-api-enrollment`, `k12-web-enrollment` `[+ querybuilder, metabase, ADF repos — confirm list]`
`[...]` = confirm / fill in.

> **v0.2 (2026-09-07):** Azure-side items pre-answered from the live commercial tenant + Learn
> research (evidence in `../evidence/`): **Managed DevOps Pools are NOT available in Azure
> Government** (commercial only) — Gov needs VMSS/self-hosted agents; **WIF is GA** with
> in-place service-connection conversion and Entra Workload Identities are GA in Gov (validate
> one manual WIF connection against the Gov sub); pipeline **agents can register via service
> principal — no PAT** (closes K12-8497's PAT item); **Defender for DevOps is commercial-cloud
> only**; **Defender for Containers is currently OFF** on the sub, so in-pipeline Trivy is the
> only image scanner today (D4 answer: no duplication — yet); ACR live state: admin off ×5,
> 3 Premium private, 2 stray Basic public. The ADO-side rows (§1 metrics, A/B/C/E/F) still need
> org access.

---

## 0. What we already know (Jira / Confluence, as of 9/5)

- **Agents:** private ADO runner pools on **ACI** (`k12-ado-runner` image in `developmentk12acr`), three `v2` containers per env; Development effective capacity **2 jobs** (one agent disabled); Testing pool built for K12-8294 but has never completed a job; some deployments still run on the Microsoft-hosted queue. Known defects: OCI-index image rejected by ACI (v4), workspace/disk state across jobs (K12-8444), .NET 9 vs 10 runtime drift masked by the shared Terraform module. Target already named: **Managed DevOps Pools**. (K12-8497, your write-up; ADO Runner Stabilization page 5206114323.)
- **Security in every build:** MSDO with `credscan, binskim, trivy` + SBOM tool + a **.NET 6 SDK install** just for CredScan, `break:false`, gated in PR policies. (AzD4D runbook, Stuart Goings, Nov 2025.) IaC scanning is listed as "out of scope / separate tools" — but MSDO already ships Checkov/Terrascan/Template Analyzer `[verify current MSDO tool list]`.
- **Promotion model:** branch-per-environment (`development` → `testing` → `staging` → `[preprod/prod]`); PR build validation + a deploy pipeline per branch; two required approvers from FE/BE leads groups. Each promotion **rebuilds** rather than promotes an artifact `[confirm]`.
- **Environments:** Dev (CI), Testing, Staging (UAT — still in the commercial tenant), **Pre-prod in Azure GovCloud** being wired now (K12-7539 env, K12-7867 pipelines — Steve), Prod in GovCloud. Terraform pre-prod follow-ups in K12-8385 (manual KV role assignments, `timestamp()` drift, phased deploys). ADF migration pipeline dev→pre-prod in K12-9181 (Ananda). Chad's K12-5344 "Pipelines" epic has no description — a natural home for the redesign stories `[confirm with Chad]`.

---

## 1. Baseline metrics — do this first (Day 1)

| Metric | How to get it | Why |
|---|---|---|
| Queue time (created → agent start), p50/p95, last 30 days, per pipeline | ADO Analytics OData `PipelineRuns` (`QueueDuration`), or the script below | Separates "agents are scarce" from "builds are slow" |
| Total duration p50/p95 per pipeline (PR validation, CI deploy, infra) | Same | The headline number |
| Stage/job/task breakdown (restore, build, SQL build, tests, coverage, MSDO, SBOM, publish, deploy, APIM) | Timeline API per run; script aggregates by task name | Finds the long poles |
| Agent utilization: jobs/day ÷ (agents × hours) per pool | Pool → Jobs history; `az pipelines pool` + agent list | Capacity argument for Managed DevOps Pools |
| Retry / re-queue rate and top failing tasks | Runs where `result = failed/canceled` grouped by first failing task | Flakiness cost |
| Lead time: PR opened → deployed to Dev; Dev → Testing → Staging promotion time | PR completion timestamps + deploy run timestamps | DORA lead time; exposes approval waits |
| Deployment frequency per env; change-failure rate (deploys followed by hotfix/rollback) | Deploy runs + release notes | DORA |
| Cost: purchased parallel jobs, hosted minutes used, ACI compute | ADO Organization settings → Parallel jobs; Azure cost for ACI RGs | Redesign has to be cost-neutral or better |

**Pull runs + timelines (PowerShell, read-only):**
```powershell
$org="https://dev.azure.com/CFI-AzureDevOps"; $proj="K12"
$pat=Read-Host "PAT (read: build)" -AsSecureString
$h=@{Authorization="Basic "+[Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":"+[Net.NetworkCredential]::new("",$pat).Password))}
$since=(Get-Date).AddDays(-30).ToString("o")
$runs=(Invoke-RestMethod "$org/$proj/_apis/build/builds?minTime=$since&`$top=2000&api-version=7.1" -Headers $h).value
$rows=foreach($r in $runs){
  $tl=Invoke-RestMethod "$org/$proj/_apis/build/builds/$($r.id)/timeline?api-version=7.1" -Headers $h
  foreach($t in ($tl.records|?{$_.type -eq 'Task' -and $_.startTime})){
    [pscustomobject]@{Pipeline=$r.definition.name;RunId=$r.id;Result=$r.result;Branch=$r.sourceBranch
      Queued=([datetime]$r.startTime-[datetime]$r.queueTime).TotalSeconds
      Total=([datetime]$r.finishTime-[datetime]$r.startTime).TotalSeconds
      Task=$t.name;TaskSec=([datetime]$t.finishTime-[datetime]$t.startTime).TotalSeconds;Pool=$tl.records[0].workerName}}}
$rows|Export-Csv ado-runs-30d.csv -NoTypeInformation
$rows|group Pipeline|%{[pscustomobject]@{Pipeline=$_.Name;Runs=($_.Group.RunId|sort -Unique).Count
  QueueP50=($_.Group.Queued|sort)[[int]($_.Group.Count*0.5)];TotalP50=($_.Group.Total|sort)[[int]($_.Group.Count*0.5)]}}|ft
$rows|group Pipeline,Task|sort {($_.Group.TaskSec|measure -Sum).Sum} -desc|select -First 25 Name,@{n='TotalMin';e={[math]::Round(($_.Group.TaskSec|measure -Sum).Sum/60)}}|ft
```

---

## 2. Inventory — what's configured (Days 1–2)

Tick each; write the finding in the last column. "Where" = ADO UI path or CLI.

| # | Question | Where to look | Finding |
|---|---|---|---|
| **A. Agents & pools** | | | |
| A1 | Pools: hosted vs private; agents per pool; enabled/disabled; last job per agent | Project Settings → Agent pools; `az pipelines agent list` | `[ ]` |
| A2 | Which pipelines/jobs *need* private network (SQL, private endpoints, APIM) vs could run hosted | YAML `pool:` per job; job steps touching private DNS | `[ ]` |
| A3 | Runner image: base, size, pre-installed SDKs (.NET 6/8/9/10, Node, SqlPackage, Terraform, az); rebuild cadence; digest pinning | `k12-infra` runner Dockerfile; ACR tags/digests | `[ ]` |
| A4 | Workspace handling: `workspace: clean`, disk size, leftovers between jobs (K12-8444) | YAML + ACI container spec | `[ ]` |
| A5 | Parallel jobs purchased vs used; hosted-minute consumption | Org Settings → Parallel jobs / Billing | `[ ]` |
| **B. Pipeline structure** | | | |
| B1 | Pipelines per repo: PR validation, branch deploy, scheduled, infra; triggers; path filters | Pipelines list; YAML `trigger`/`pr` | `[ ]` |
| B2 | Templates: shared YAML templates? `extends` with required-template check? or copy-paste per repo | Repo `/pipelines` or `/.azure-pipelines`; Environment checks | `[ ]` |
| B3 | Stages/jobs: what runs serially that could be parallel (SQL build ∥ .NET build ∥ FE build; tests ∥ scans) | YAML `dependsOn` | `[ ]` |
| B4 | Artifact promotion: does Testing/Staging rebuild from source, or deploy the artifact built for Dev? | Deploy pipelines' inputs | `[ ]` |
| B5 | Monorepo (Nx): `nx affected` used? remote/ADO cache? or full build of all 4 apps each run | FE YAML; `nx.json` | `[ ]` |
| B6 | Cancel-in-progress on new commits; batch triggers; retention | YAML `batch`, org settings | `[ ]` |
| **C. Build steps** | | | |
| C1 | SDK installs per run (UseDotNet ×N, NodeTool) vs pre-baked image | YAML | `[ ]` |
| C2 | Dependency caching: `Cache@2` for NuGet (`~/.nuget/packages`), npm/pnpm, Nx cache | YAML | `[ ]` |
| C3 | Tests: unit (xUnit/Jest) run once or per stage? sharding? Postman/Newman suites in PR or nightly? coverage tooling cost | YAML; `k12-test-api-postman` | `[ ]` |
| C4 | SQL: DACPAC build + `SqlPackage` publish time; pre/post-deploy scripts; drift reports | SQL project YAML | `[ ]` |
| **D. Security scanning** | | | |
| D1 | MSDO scope: which tools, on which triggers (every build vs PR vs nightly); Trivy DB download time; `break` setting | YAML `MicrosoftSecurityDevOps@1` inputs | `[ ]` |
| D2 | Defender for DevOps connector health; findings volume; who triages; SLA adherence | Defender for Cloud → DevOps security; ADO Security tab | `[~]` Connectors exist in commercial (`K12DefenderDevOps`, `defenderfordevops`). **Research: Defender for DevOps is commercial-only — no Gov connector possible; Gov coverage must come from MSDO in-pipeline** |
| D3 | SBOM: generated on every build or release builds only; where stored; anyone consuming it? | YAML; artifact drop | `[ ]` |
| D4 | Container/image scanning at the registry (Defender for Containers on ACR) — is Trivy in the pipeline duplicating it? | Defender for Cloud plans; ACR | `[✔]` **Answered: Defender for Containers plan is OFF** — no duplication today, Trivy is the only scanner. Live export shows 85 `Update <pkg>` image vulns across ~21 images. Enable the plan (remediation G2), then rescope Trivy to PR-fast checks |
| D5 | IaC scanning present? (Checkov/Terrascan via MSDO, tflint, PSRule) | `k12-infra` YAML | `[ ]` |
| D6 | Secrets: PAT usage on agents (K12-8497 mentions PATs); service connections using SPN secrets vs **workload identity federation**; Gov-tenant connections | Service connections; agent registration | `[~]` ADO-side inventory pending. **Available now: agent registration via `--auth SP` (service principal) — PAT-free; WIF conversion is in-place with no pipeline edits.** Live: SQL Entra admin is the `CFI-AzureDevOps - K12 - Contributors` group — tighten when converting |
| **E. Quality gates (SonarQube)** | | | |
| E1 | SonarQube server/edition; which repos analyzed; PR decoration enabled; quality-gate status check as PR policy | SonarQube project settings; ADO branch policies | `[ ]` |
| E2 | Analysis time per run; incremental PR analysis; coverage import (Cobertura/OpenCover/lcov) working? | Sonar `Prepare/Analyze/Publish` task timings | `[ ]` |
| E3 | New-code definition, exclusions, duplicated-code and hotspot gates; who fixes what (ties to K12-8553 code-quality epic) | Sonar quality gate config | `[ ]` |
| **F. Environments, approvals, gates** | | | |
| F1 | ADO Environments defined per env? deployment jobs used? or plain jobs with a service connection | Pipelines → Environments | `[ ]` |
| F2 | Checks configured: approvals, business hours, exclusive lock, Azure Monitor alert check, invoke-REST (e.g., Newman smoke) | Environment → Approvals and checks | `[ ]` |
| F3 | Branch policies per env branch: reviewers, build validation, required status checks (Sonar, AzD4D), auto-complete | Repo → Branches → policies | `[ ]` |
| F4 | Change control for Staging/Pre-prod/Prod: release notes process, who approves, how long approvals wait (measure) | Confluence "Promoting Code" page; approval timestamps | `[ ]` |
| **G. Infra pipelines (k12-infra)** | | | |
| G1 | Terraform `plan` on PR with plan posted as PR comment? `apply` behind environment approval? state backend + locking; drift detection schedule | `k12-infra` YAML; storage backend | `[ ]` |
| G2 | Module hygiene issues already listed in K12-8385 (`timestamp()`, phased deploys, manual role assignments) | K12-8385 | `[ ]` |
| G3 | Reconciliation status (K12-9219, Luke): what's still click-ops | Ask Luke | `[ ]` |
| **H. Data & integrations** | | | |
| H1 | ADF CI/CD (K12-9181): ARM export vs git-integrated; parameterization; dev→pre-prod path | ADF repo; Ananda | `[ ]` |
| H2 | Container Apps deploys (Metabase, querybuilder gateway, audit-sink job): image build path (Docker on agent? `PublishContainer`? ACR Tasks?), revision strategy | Their YAML | `[ ]` |
| **I. Observability & DevEx** | | | |
| I1 | Pipeline analytics dashboards exist? failure notifications routed? | Pipelines → Analytics; Project settings → Notifications | `[ ]` |
| I2 | Developer wait experience: how long from `git push` to green check? from merge to Dev deployed? (ask 3 devs, then compare to metrics) | Chad, Harshal, a FE lead | `[ ]` |

---

## 3. What ADO / Defender / SonarQube already offer (the shopping list)

Use this to score each gap as **already available** (config change), **needs build** (templates/pools), or **Phase 2**.

| Capability | What it gives us | Cost / prerequisite |
|---|---|---|
| **Managed DevOps Pools** | Microsoft-managed, VNet-injected, stateless agents that scale on demand; ends the ACI image/PAT/disk maintenance in K12-8497 | Dev Center; **Gov: NOT available (commercial cloud only — confirmed on Learn 2026-09)** → Gov uses VMSS agent pools or SP-registered self-hosted agents |
| **Pipeline caching (`Cache@2`)** | NuGet/npm/Nx cache restore in seconds instead of full restores | Config only |
| **Pre-baked runner image** (all SDKs, SqlPackage, Terraform, az) | Removes per-run SDK installs; combine with digest pinning from PR 5059 | Image pipeline |
| **YAML templates in a `pipeline-templates` repo + `extends` + "required template" check** | One governed build/deploy shape for every repo; security steps can't be skipped | Templates repo |
| **Parallel jobs + `dependsOn` fan-out** | Build ∥ SQL build ∥ scans ∥ tests | Enough agents |
| **Nx affected + remote cache** (Nx Cloud or ADO cache) | Build/test only what changed across the 4 apps | Config; Nx Cloud is optional |
| **Build once, promote artifact** | Testing/Staging/Pre-prod/Prod deploy the same drop; provenance + speed | Deploy-pipeline refactor |
| **ADO Environments + deployment jobs + checks** (approvals, business hours, exclusive lock, Azure Monitor alerts, invoke-REST) | Real release gates instead of branch-policy waits; audit trail per env | Config |
| **Workload identity federation service connections** | No SPN secrets/PATs to rotate; GA with in-place conversion of existing connections | Config. **Gov: Entra Workload Identities are GA in Azure Government; use the manual (managed-identity) WIF flow with the Azure Government environment — validate one connection first** |
| **MSDO tool scoping** | CredScan on PR; full BinSkim/Trivy nightly or on release builds; IaC scanning via Checkov/Terrascan in `k12-infra` | Config |
| **Defender for Containers registry scanning** | Scan images once at ACR instead of Trivy in every build | Defender plan |
| **SonarQube PR decoration + quality-gate status check + incremental PR analysis** | Fast PR feedback; gate as a branch policy | Sonar config |
| **SWA preview environments per PR** | Front-end preview URL per PR for reviewers/QA | Config (SWA supports it) |
| **Container Apps revisions + labels** | Blue/green for the container workloads; per-PR revisions for an ephemeral BE | Config |
| **Terraform plan-on-PR + apply-behind-approval + scheduled drift plan** | GitOps for infra; feeds the GitOps/Terraform proposal | Templates |
| **Test sharding + Test Analytics** | Parallel Jest/xUnit; flaky-test tracking | Config |

---

## 4. Hypotheses to test against the numbers (rank after Day 1)

| # | Hypothesis | Evidence that would confirm | Fix class |
|---|---|---|---|
| H1 | Queueing on 2-job private pools dominates wall-clock | Queue p95 ≫ build p50 | Pools |
| H2 | Per-run SDK installs + no caching add 5–10 min per build | Task breakdown: UseDotNet/NodeTool/restore | Config (quick win) |
| H3 | MSDO ×3 + SBOM on every build costs more than the build itself | Task breakdown: MSDO/SBOM minutes | Scope (quick win) |
| H4 | Serial stages that could be parallel | Sum(task) ≈ Total (no overlap) | Templates |
| H5 | Workspace/disk state causes retries (K12-8444) | Retry rate; failing task = restore/publish | Image/pools |
| H6 | Promotion rebuilds from source instead of promoting artifacts | Testing deploy runs a full build | Refactor |
| H7 | Full Nx build of all 4 apps on FE changes | FE build time flat regardless of diff | Nx affected (quick win) |
| H8 | Full Postman/Jest suites in the PR loop | Test task minutes | Shard / nightly |
| H9 | Approval and required-policy waits (PR 5066 "policy remains queued") | Lead time ≫ pipeline time | Environments + checks |
| H10 | APIM / Terraform deploy steps are the long pole in deploy pipelines | Deploy task breakdown | Design |

---

## 5. Integration environment — define the gap (Day 3)

**Today:** Dev (CI, shared, always moving) → Testing (QA) → Staging (UAT, commercial tenant) → Pre-prod (Gov, RC) → Prod (Gov). Nothing between "my PR built" and "it's in the shared Dev env with everyone else's changes," and no place where FE + BE + DB + ADF + external integrations are proven together with realistic data before QA sees it.

| Option | What it is | Fits | Cost / effort |
|---|---|---|---|
| **A. Ephemeral per-PR** | SWA preview env per PR + Container Apps revision (label) per PR + Azure SQL **database copy** from Dev (or schema-branch) per PR; torn down on merge | FE/BE contract validation; reviewer previews | Medium; needs Terraform module reuse + cleanup job |
| **B. Persistent Integration env** | A 5th environment between Dev and Testing, refreshed nightly from masked Testing data; only green Dev builds promote | "Does it all work together" with real-ish data; place for ADF/integration/SFTP/mTLS tests | Low-medium; one more env's cost — reuse K12-8385-fixed modules |
| **C. Contract + smoke in PR** | OpenAPI contract tests + Newman smoke against Dev in the PR loop | Cheapest; catches breakage early | Low; no env |
| Recommendation | **C now (quick win) + B for launch + A as Phase 2** — B doubles as the mock go-live rehearsal environment `[discuss with Jacqui/Steve]` | | |

Questions to settle: data refresh + masking (PII), who owns it (QA lead vs. DevOps), naming/branch (`integration`), promotion rule (artifact, not branch), Gov vs commercial tenant.

---

## 6. What the research produces (end of Day 3)

1. **Baseline table** — queue/total/stage p50 & p95 per pipeline; utilization; retry rate; lead time; cost.
2. **Findings table** (section 2) with each gap scored *available / build / Phase 2*.
3. **Quick wins safe before 10/7** (Dev/Testing pipelines only, never the release path): caching, pre-baked SDKs, MSDO scoping, Nx affected, parallel stages, Sonar PR decoration, contract/smoke tests.
4. **Redesign scope for the parallel build** (Oct): templates repo, Managed DevOps Pools pilot, build-once/promote, Environments + checks, Integration env, Terraform plan-on-PR — run side-by-side, cut over after launch.
5. **Targets to propose:** PR validation < 10 min p50; Dev deploy < 15 min after merge; queue < 2 min p95; retry rate < 5 %; promotion = artifact + approval, no rebuild.
6. **Phase 2 (extension scope):** cutover of the release path, Managed DevOps Pools for Gov, ephemeral PR envs, GitOps apply gates.

## 7. Timebox
Day 1 — metrics script, pools, image, cost (with Luke). Day 2 — pipeline YAML, security/quality, environments/policies (with Chad, Steve). Day 3 — infra/ADF/Container Apps, integration-env options, write-up. Consult: Luke, Chad, Steve Pardo, Harshal, Ananda.
