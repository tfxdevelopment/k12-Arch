#!/usr/bin/env bash
# =============================================================================
# K12 MyPortal — Defender remediation READ-ONLY queries (Azure Resource Graph)
# Sources: 07AzureSecurityRemediationPlan.md §1  +  Defender-Remediation-Plan.md §8
# Scope:   portal estate only — the k12-cms estate is excluded in every query
#          (rg "k12-cms" + app-k12-site-prd*, sql-k12-site-shared*,
#           fd-k12-site-shared*, la-k12-site-shared*, Notify_Netsupport*)
# Needs:   Reader on the subscriptions. Makes NO changes to Azure.
# Usage:   ./run-remediation-queries.sh [--cloud AzureCloud|AzureUSGovernment]
#          Run once per tenant (commercial, then Gov).
# =============================================================================
set -euo pipefail

AZ="${AZ_BIN:-az}"
command -v "$AZ" >/dev/null || AZ=/root/azcli-venv/bin/az

CLOUD="AzureCloud"
[[ "${1:-}" == "--cloud" ]] && CLOUD="$2"

OUT="$(dirname "$0")/results/$(date +%Y%m%d-%H%M%S)-${CLOUD}"
mkdir -p "$OUT"

"$AZ" cloud set --name "$CLOUD"
if ! "$AZ" account show >/dev/null 2>&1; then
  echo "Not logged in to $CLOUD — starting device-code login (read-only session)…"
  "$AZ" login --use-device-code --allow-no-subscriptions >/dev/null
fi

# k12-cms estate exclusion, applied to every query
CMS_RG='tolower(resourceGroup) !in ("k12-cms")'
CMS_NAMES='not(name matches regex @"(?i)^(app-k12-site-prd|sql-k12-site-shared|fd-k12-site-shared|la-k12-site-shared|Notify_Netsupport)")'
# securityresources rows carry the resource id, not the resource name:
CMS_RID='rid !has "/resourcegroups/k12-cms/" and not(rid matches regex @"(?i)/(app-k12-site-prd|sql-k12-site-shared|fd-k12-site-shared|la-k12-site-shared|notify_netsupport)[^/]*$")'

run() { # run <name> <kql>
  local name="$1" kql="$2"
  echo "── $name"
  "$AZ" graph query -q "$kql" --first 1000 -o json > "$OUT/$name.json" \
    && jq -r '(.data[0] // {} | keys_unsorted) as $k | ($k | @csv), (.data[] | [.[$k[]]] | @csv)' \
         "$OUT/$name.json" > "$OUT/$name.csv" \
    || echo "   (failed — see above)"
}

# ── 07AzureSecurityRemediationPlan.md §1 ────────────────────────────────────
run "01-defender-unhealthy-summary" "
securityresources
| where type == 'microsoft.security/assessments'
| extend name = tostring(properties.displayName), sev = tostring(properties.metadata.severity),
         status = tostring(properties.status.code), rid = tolower(tostring(properties.resourceDetails.Id)),
         rg = tolower(tostring(properties.resourceDetails.ResourceGroup))
| where status == 'Unhealthy'
| where rg !in ('k12-cms')
| where $CMS_RID
| summarize resources = dcount(rid), example = any(rid) by name, sev, subscriptionId
| order by sev asc, resources desc"

# NOTE: secure score is computed per subscription and cannot be scoped to
# exclude k12-cms — treat query 02's number as SUBSCRIPTION-WIDE. The findings
# queries (01, 04–07) are the portal-only (k12-cms-excluded) view.
run "02-secure-score" "
securityresources
| where type == 'microsoft.security/securescores'
| project subscriptionId, score = properties.score.current, max = properties.score.max"

run "03-policy-compliance" "
policyresources
| where type == 'microsoft.policyinsights/policystates'
| summarize count() by tostring(properties.complianceState), tostring(properties.policyDefinitionName)"

# ── Defender-Remediation-Plan.md §8 ─────────────────────────────────────────
run "04-findings-by-type-severity" "
securityresources
| where type == 'microsoft.security/assessments'
| where properties.status.code == 'Unhealthy'
| extend rid = tolower(tostring(properties.resourceDetails.Id)),
         severity = tostring(properties.metadata.severity),
         rec = tostring(properties.displayName)
| where $CMS_RID
| extend resourceType = extract(@'providers/([^/]+/[^/]+)', 1, rid)
| summarize count() by severity, resourceType, rec
| order by severity asc, count_ desc"

run "05-local-auth-enabled" "
resources
| where type in~ ('microsoft.servicebus/namespaces','microsoft.eventhub/namespaces',
                  'microsoft.appconfiguration/configurationstores')
| where $CMS_RG and $CMS_NAMES
| extend localAuthDisabled = tobool(properties.disableLocalAuth)
| where isnull(localAuthDisabled) or localAuthDisabled == false
| project name, type, resourceGroup, subscriptionId"

run "06-public-network-access" "
resources
| where type in~ ('microsoft.keyvault/vaults','microsoft.servicebus/namespaces','microsoft.eventhub/namespaces',
                  'microsoft.appconfiguration/configurationstores','microsoft.storage/storageaccounts',
                  'microsoft.sql/servers','microsoft.app/managedenvironments','microsoft.cache/redisenterprise')
| where $CMS_RG and $CMS_NAMES
| extend pna = tostring(coalesce(properties.publicNetworkAccess, properties.properties.publicNetworkAccess))
| where pna !~ 'Disabled'
| project name, type, resourceGroup, pna"

run "07-guardrails-compliance" "
policyresources
| where type == 'microsoft.policyinsights/policystates'
| where properties.policySetDefinitionName =~ 'k12-platform-security-guardrails'
| summarize count() by tostring(properties.complianceState), tostring(properties.policyDefinitionReferenceId)"

echo ""
echo "Done. Results in $OUT (JSON + CSV per query)."
echo "Cloud: $CLOUD — run again with --cloud AzureUSGovernment for the Gov tenant."
