#!/usr/bin/env bash
# discover-gov-preprod.sh — READ-ONLY discovery for the K12 Gov preprod alignment (plan 08, B3 step 1).
# Runs from Terry's WSL machine. Only show/list/get/plan commands; never prints Key Vault secret VALUES.
# Usage:  bash discover-gov-preprod.sh [--with-terraform] [--with-ado]
#   --with-terraform  also runs terraform init/state list/plan in $K12_INFRA_DIR/terraform/environments/preprod
#                     (default K12_INFRA_DIR=~/src/k12-infra, branch feature/preprodUpdates must be checked out)
#   --with-ado        also reads Azure DevOps (pools, service connections, environment checks, branch policies)
# Output: a timestamped folder under ./out/ — commit it to k12-Arch evidence/gov-preprod/ after reviewing for secrets.
set -uo pipefail
WITH_TF=0; WITH_ADO=0
for a in "$@"; do case "$a" in --with-terraform) WITH_TF=1;; --with-ado) WITH_ADO=1;; esac; done
SUB=f2a2966b-27ff-4694-88c5-c283e957d0ce
TEN=0e166b06-f5ce-4e09-b738-687d97ab48be
RG=preprod
OUT="$(pwd)/out/$(date +%Y%m%d-%H%M)"; mkdir -p "$OUT"
log(){ printf '%s %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$OUT/run.log"; }
run(){ # run <outfile> <command...>  (never aborts the script)
  local f="$OUT/$1"; shift; log "-> $1 ${2:-} ... > $(basename "$f")"; "$@" > "$f" 2>>"$OUT/errors.log" || echo "FAILED: $*" >> "$OUT/errors.log"; }
redact(){ sed -E 's/((AccountKey|SharedAccessKey|Password|PASSWORD|Secret|SECRET|Token|TOKEN|ClientSecret)[=:]\s*)[^;"[:space:]]+/\1<redacted>/g'; }

log "Gov cloud login check"
az cloud set -n AzureUSGovernment
az account show -o json > "$OUT/account.json" 2>/dev/null || { log "not logged in: run  az login --tenant $TEN --use-device-code"; exit 1; }
az account set -s "$SUB" || { log "cannot select subscription $SUB"; exit 1; }
ME=$(az ad signed-in-user show --query id -o tsv 2>/dev/null || echo "")

# D1 identity and roles
run d1-roles-subscription.txt az role assignment list --assignee "$ME" --subscription "$SUB" --include-inherited --all -o table
run d1-roles-state-storage.txt az role assignment list --assignee "$ME" --scope "/subscriptions/$SUB/resourceGroups/k12-infra/providers/Microsoft.Storage/storageAccounts/k12infra" -o table
run d1-roles-preprod-rg.txt az role assignment list --assignee "$ME" --scope "/subscriptions/$SUB/resourceGroups/$RG" -o table
run d1-graph-memberof.json az rest --method get --url "https://graph.microsoft.us/v1.0/me/memberOf?\$select=id,displayName" -o json

# D2 state backend
run d2-state-storage.json az storage account show -n k12infra -g k12-infra --query "{pna:publicNetworkAccess,sharedKey:allowSharedKeyAccess,rules:networkRuleSet,tls:minimumTlsVersion}" -o json
run d2-state-blobprops.json az storage account blob-service-properties show --account-name k12infra --auth-mode login -o json
run d2-tfstate-blobs.txt az storage blob list --account-name k12infra -c tfstate --auth-mode login -o table

# D3 inventory (and whether prod already exists — F21)
run d3-groups.txt az group list -o table
run d3-preprod-resources.txt az resource list -g "$RG" -o table
run d3-preprod-types.txt bash -c "az resource list -g $RG --query '[].type' -o tsv | sort | uniq -c"
run d3-prod-rg.json bash -c "az group show -n prod -o json 2>/dev/null || echo '{\"note\":\"no prod RG\"}'"
run d3-k12-infra-rg.txt az resource list -g k12-infra -o table

# D4 private DNS correctness (F1) and Gov hostnames
run d4-private-dns-zones.txt az network private-dns zone list -g "$RG" -o table
run d4-private-endpoints.json az network private-endpoint list -g "$RG" --query "[].{n:name,state:privateLinkServiceConnections[0].privateLinkServiceConnectionState.status,fqdns:customDnsConfigs[].fqdn,zoneGroups:privateDnsZoneConfigs[].name}" -o json
run d4-sql.json az sql server show -g "$RG" -n "$RG-api-enrollment" --query "{fqdn:fullyQualifiedDomainName,pna:publicNetworkAccess,entraOnly:administrators.azureAdOnlyAuthentication,admin:administrators.login,tls:minimalTlsVersion}" -o json
run d4-signalr.json az signalr show -g "$RG" -n "$RG-api-enrollment-signalr" --query "{host:hostName,pna:publicNetworkAccess,localAuthDisabled:disableLocalAuth}" -o json
run d4-servicebus.txt az servicebus namespace list -g "$RG" --query "[].{n:name,host:serviceBusEndpoint,pna:publicNetworkAccess,localAuth:disableLocalAuth,tls:minimumTlsVersion}" -o table

# D5 edge and compute
run d5-afd-profiles.txt az afd profile list -g "$RG" --query "[].{n:name,sku:sku.name,id:resourceGuid}" -o table
run d5-afd-endpoints.json bash -c "for p in \$(az afd profile list -g $RG --query '[].name' -o tsv); do az afd endpoint list -g $RG --profile-name \$p --query '[].{profile:\`'\$p'\`,n:name,host:hostName}' -o json; done"
run d5-cae.txt az containerapp env list -g "$RG" --query "[].{n:name,vnet:properties.vnetConfiguration.infrastructureSubnetId,internal:properties.vnetConfiguration.internal,wp:properties.workloadProfiles[].name}" -o table
run d5-acr.txt az acr list -g "$RG" --query "[].{n:name,login:loginServer,sku:sku.name,pna:publicNetworkAccess,admin:adminUserEnabled}" -o table
run d5-webapps.txt az webapp list -g "$RG" --query "[].{n:name,vnet:virtualNetworkSubnetId,https:httpsOnly,pna:publicNetworkAccess,state:state}" -o table
run d5-vpngw.json az network vnet-gateway list -g "$RG" --query "[].{n:name,sku:sku.name,aadTenant:vpnClientConfiguration.aadTenant,aadAudience:vpnClientConfiguration.aadAudience,protocols:vpnClientConfiguration.vpnClientProtocols}" -o json
run d5-nat.txt az network nat gateway list -g "$RG" --query "[].{n:name,subnets:subnets[].id}" -o table
run d5-subnets.txt az network vnet subnet list -g "$RG" --vnet-name "$RG-vnet" --query "[].{n:name,prefix:addressPrefix,nsg:networkSecurityGroup.id,nat:natGateway.id,delegation:delegations[0].serviceName}" -o table
run d5-nsgs.txt az network nsg list -g "$RG" -o table

# D6 Key Vault live config vs code (names only, never values)
run d6-kv.json az keyvault show -n "${RG}apikv" --query "properties.{pna:publicNetworkAccess,acls:networkAcls,rbac:enableRbacAuthorization,purge:enablePurgeProtection,softDeleteDays:softDeleteRetentionInDays}" -o json
run d6-kv-deleted.txt az keyvault list-deleted -o table
run d6-kv-secret-names.txt az keyvault secret list --vault-name "${RG}apikv" --query "[].{n:name,exp:attributes.expires,enabled:attributes.enabled}" -o table
log "NOTE: if d6-kv-secret-names.txt is empty with a Forbidden/network error, the vault is not reachable from this machine (plan 08 risk R1)."

# D7 principals referenced by the code
run d7-principals.txt bash -c 'for g in 8990340b-2506-4b8f-9c4e-a34ff8d8077d df8b0836-7e1b-41dc-8e66-6b6792256785 a172c66a-616c-43f7-aa8a-3bbf5d7441e4 50a9f81f-da2d-4770-ba17-c642a38e9eb0; do echo "== $g"; az ad group show --group $g --query displayName -o tsv 2>/dev/null || az ad sp show --id $g --query displayName -o tsv 2>/dev/null || echo "NOT FOUND in this tenant"; done'
run d7-identities.txt az identity list -g "$RG" -o table
run d7-app-regs.txt az ad app list --display-name "PreProd K12 API" --query "[].{n:displayName,appId:appId,audience:signInAudience}" -o table
run d7-docker-sp.txt az ad app list --display-name k12devops-docker-sp --query "[].{n:displayName,appId:appId}" -o table

# D8 providers, quotas, Defender and policy posture
run d8-providers.txt bash -c "az provider list --query \"[?registrationState=='Registered'].namespace\" -o tsv | sort"
run d8-aca-locations.json az provider show -n Microsoft.App --query "resourceTypes[?resourceType=='managedEnvironments'].locations" -o json
run d8-net-usage.txt az network list-usages -l usgovvirginia -o table
run d8-defender-plans.txt az security pricing list -o table
run d8-policy-assignments.txt az policy assignment list --scope "/subscriptions/$SUB" -o table
run d8-law.json az monitor log-analytics workspace show -g "$RG" -n "k12-$RG-law" --query "{ret:retentionInDays,pnaIngest:publicNetworkAccessForIngestion,pnaQuery:publicNetworkAccessForQuery}" -o json
run d8-law-all.txt az monitor log-analytics workspace list --query "[].{n:name,rg:resourceGroup,ret:retentionInDays}" -o table

# D9 Terraform baseline on Angelo's branch (optional; acquires the state lock briefly)
if [ "$WITH_TF" = 1 ]; then
  DIR="${K12_INFRA_DIR:-$HOME/src/k12-infra}/terraform/environments/preprod"
  log "terraform baseline in $DIR"
  ( cd "$DIR" && git rev-parse --abbrev-ref HEAD && git log -1 --oneline ) > "$OUT/d9-branch.txt" 2>&1
  ( cd "$DIR" && terraform version && terraform init -input=false -upgrade=false ) > "$OUT/d9-init.txt" 2>&1
  ( cd "$DIR" && terraform state list ) > "$OUT/d9-state-list.txt" 2>&1
  ( cd "$DIR" && terraform plan -input=false -lock-timeout=300s -no-color ) 2>&1 | redact > "$OUT/d9-baseline-plan.txt"
  log "state resources: $(grep -c . "$OUT/d9-state-list.txt" 2>/dev/null)"
fi

# D10 Azure DevOps (commercial token; read-only REST)
if [ "$WITH_ADO" = 1 ]; then
  az cloud set -n AzureCloud
  TOK=$(az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken -o tsv 2>/dev/null || echo "")
  if [ -n "$TOK" ]; then
    ORG=https://dev.azure.com/CFI-AzureDevOps; H="Authorization: Bearer $TOK"
    curl -s -H "$H" "$ORG/_apis/distributedtask/pools?api-version=7.1" > "$OUT/d10-ado-pools.json"
    curl -s -H "$H" "$ORG/K12/_apis/serviceendpoint/endpoints?api-version=7.1" | python3 -c 'import json,sys; [print(e["name"],"|",e["type"],"|",e.get("authorization",{}).get("scheme"),"|",e.get("data",{}).get("environment")) for e in json.load(sys.stdin)["value"]]' > "$OUT/d10-ado-service-connections.txt"
    curl -s -H "$H" "$ORG/K12/_apis/pipelines/checks/configurations?resourceType=environment&api-version=7.1-preview.1" > "$OUT/d10-ado-env-checks.json"
    curl -s -H "$H" "$ORG/K12/_apis/policy/configurations?api-version=7.1" > "$OUT/d10-ado-branch-policies.json"
    for d in 74 86 119; do curl -s -H "$H" "$ORG/K12/_apis/build/definitions/$d?api-version=7.1" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("id"),d.get("name"),d.get("process",{}).get("yamlFilename"),d.get("queueStatus"))'; done > "$OUT/d10-ado-defs.txt"
  else
    log "ADO: no commercial login; run az login (AzureCloud) first"
  fi
  az cloud set -n AzureUSGovernment
fi

log "done. Review $OUT for anything sensitive (the plan text is redacted for keys/tokens) before committing."
