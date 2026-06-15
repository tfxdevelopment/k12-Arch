# CAF/WAF Review — Development VNet / Networking Changes

- **Date:** 2026-06-15
- **Reviewer:** CFI Architecture (CAF/WAF assessment)
- **Subject:** Stuart Goings' latest VNet/networking changes to the `development` resource group
- **Frameworks:** Microsoft Cloud Adoption Framework (Govern, Ready/landing-zone) + Azure Well-Architected Framework (5 pillars)
- **Status:** Draft — based on documented state; live Azure not yet verified (see Method)

## Method & evidence

I do **not** have direct read access to the live Azure subscription or the Azure DevOps IaC repo from
this environment (no Azure CLI/credentials/Azure MCP; Git scope is GitHub `k12-arch` only). This review
is reconstructed from the authoritative team records:

| Source | What it tells us | Date |
|--------|------------------|------|
| Confluence **"K12 Azure Development P2S VPN Connection Guide"** (authored by Stuart Goings) | The current change: private VNet + VPN gateway `development-vpn-gw` + private endpoints + hosts-file DNS | **modified 2026-06-11** |
| Confluence **"02-Azure Architecture"** (auto-generated from Azure Resource Graph) | Prior dev networking state: `sample-vnet` / `sample-nsg`, no private endpoints | export 2025-12-11 |
| Jira **K12-5690** "[Prep] Migrate all unmanaged resources from development into terraform" (Done) | Dev resources were hand-built (ClickOps) and being reconciled into Terraform | — |
| Microsoft Learn (CAF/WAF, Private Link DNS, P2S Entra) | Best-practice baseline used for grading | current |

**Everything below marked _(verify)_ is an inference that must be confirmed against the live resource
group** (subnet map, NSG rules, gateway SKU, peering, whether Private DNS zones exist). I'd recommend an
`az network vnet/nsg/private-endpoint/vnet-gateway list` sweep (or an Azure Resource Graph export) of the
`development` RG to confirm.

## What changed (reconstructed)

The Development environment moved from a placeholder/open network to a **private-by-default** model:

1. **Private VNet** in `development` (East US 2) with an address space including subnet `10.0.2.0/x`.
2. **VPN Gateway `development-vpn-gw`** with **Point-to-Site (P2S)** configuration using **Microsoft Entra ID
   authentication** (OpenVPN/SSL), giving developers SSO + MFA from their laptops.
3. **Private Endpoints** for PaaS on the `10.0.2.x` subnet:
   - `10.0.2.12` → `development-api-enrollment.database.windows.net` (Azure SQL)
   - `10.0.2.14` → `k12eventhub-k12-development-sbns.servicebus.windows.net` (Service Bus)
4. **Name resolution via client `hosts` file** (`/etc/hosts`, `C:\Windows\System32\drivers\etc\hosts`),
   appended by a repo `setup-vpn.sh` / `setup-vpn.ps1` script that also downloads the `k12-dev-vpn.xml`
   profile.

This is a real and positive security improvement: developer access to dev data-plane services now requires
authenticated, MFA-backed VPN rather than public endpoints. The findings below are about hardening and
aligning it with CAF/WAF — not about reversing it.

---

## CAF (Cloud Adoption Framework) review

### Govern — Identity & Security Baseline ✅ / ⚠️
- ✅ Entra-ID-authenticated P2S VPN aligns with the Hub-&-Spoke / Entra-central-identity baseline already
  documented for K12. MFA + Conditional Access become available on the VPN front door.
- ⚠️ **Scope VPN access by users/groups _(verify)_.** A single gateway grants all-or-nothing access. If dev
  data is FERPA-relevant (even masked), restrict the Azure VPN enterprise app / custom-audience to a
  specific Entra group rather than all corporate users. (Learn: *Configure P2S access based on users and groups*.)

### Govern — Resource Consistency & IaC ⚠️ (High)
- ⚠️ The networking appears **hand-built (ClickOps)**, consistent with K12-5690 ("resources created by hand…
  migrated into Terraform"). CAF Ready and WAF Operational Excellence both call for **all** landing-zone
  network components (VNet, subnets, NSGs, gateway, private endpoints, **Private DNS zones**) to be defined
  in IaC. Until the VNet/gateway/PEs are in Terraform, the change isn't reproducible across testing/staging/prod
  and drifts from the auto-generated architecture record (which still says `sample-vnet`).
- **Action:** import the VNet, gateway, NSGs, and private endpoints into Terraform (the user's stated
  next phase) and refresh the "02-Azure Architecture" page from a new Resource Graph export.

### Ready — Network topology / landing zone ⚠️
- ⚠️ The design reads as a **single standalone VNet per environment**, not the CAF-recommended **hub-and-spoke**
  with a central Connectivity subscription hosting shared gateway + DNS. With four environments
  (dev/test/staging/prod) each likely needing private connectivity, a per-environment VPN gateway is costly
  and operationally heavy. Consider a **hub VNet** (or Azure Virtual WAN) holding one gateway + central
  Private DNS, with spokes peered per environment. (Learn: *Hub-spoke network topology*, *Network topology
  and connectivity*.)
- ⚠️ **Gateway subnet sizing _(verify)_.** Confirm a dedicated `GatewaySubnet` of **/26 or larger** to avoid
  future gateway/ER limitations.

### Sovereignty / compliance ⚠️ (note)
- The K12 **target** state is Azure **Government** / FedRAMP Moderate, but dev is in **commercial** Azure
  (East US 2), and K12-7113 references both "Commercial and Gov Cloud." If/when dev must mirror the Gov
  posture, the P2S Entra tenant URL differs (`login.microsoftonline.us`) and private DNS zone names differ
  for Gov. Flag for the landing-zone roadmap; not a blocker for dev today.

---

## WAF (Well-Architected) review — networking lens

### Security ✅ (strong direction)
- ✅ Private endpoints remove public exposure of SQL and Service Bus data-plane in dev — directly supports
  the "design to protect confidentiality" principle and the existing defense-in-depth model.
- ⚠️ **Extend private endpoints to the other PaaS _(verify)_:** Key Vault (`developmentapikv`), Storage/ADLS
  (`developmentapienrollment`, `developmentenrollmenthns`), SignalR, Event Grid, Container Registry
  (`k12devcontainerreg`). Only SQL + Service Bus are evidenced; partial private-endpoint coverage leaves
  public data paths open. WAF/CAF: "use private endpoints for all supported services."
- ⚠️ **Disable public network access _(verify)_** on the PaaS resources that now have private endpoints
  (set `publicNetworkAccess = Disabled` + deny-by-default firewall), otherwise the public endpoint still
  works and the private path is optional.
- ⚠️ **NSG posture _(verify)_:** the prior NSG was the default `sample-nsg`. Confirm NSGs on each subnet with
  least-privilege rules (and consider Application Security Groups). Confirm whether private endpoint subnet
  has network policies enabled.

### Operational Excellence ⚠️ (the headline finding)
- 🔴 **DNS via client hosts file is a testing-only pattern.** Microsoft explicitly states the host file is
  *"only recommended for testing"*; the supported approach is **Azure Private DNS zones**
  (`privatelink.database.windows.net`, `privatelink.servicebus.windows.net`) linked to the VNet, with an
  **Azure Private DNS Resolver / forwarder** so VPN clients resolve the private IPs automatically.
  (Learn: *Azure Private Endpoint private DNS zone values*; *Private Link and DNS integration at scale*.)
  - **Why it matters:** hard-coded IPs (`10.0.2.12/14`) break silently when a private endpoint is recreated
    and gets a new IP; every developer must hand-edit hosts files; it doesn't scale to more services or to
    CI agents/Container Apps that can't use a hosts file. This is brittle, high-toil, and error-prone.
  - **Action:** stand up Private DNS zones + a Private Resolver inbound endpoint in the VNet (centralized in
    a hub ideally), push the resolver IP via the VPN profile's DNS settings, and retire the hosts-file step
    from `setup-vpn.*`.
- ⚠️ The `setup-vpn` script and `k12-dev-vpn.xml` profile distribution are a nice DX touch — keep them, but
  the script should stop mutating the OS hosts file once Private DNS is in place.
- ⚠️ **IaC + monitoring _(verify)_:** ensure gateway/PE/NSG diagnostics flow to Log Analytics; Network
  Watcher exists (`NetworkWatcher_eastus`) — enable NSG flow logs / connection monitor for the dev VNet.

### Reliability ⚠️
- ⚠️ **VPN gateway SKU & redundancy _(verify)_.** Entra-ID P2S requires a non-Basic, OpenVPN-capable SKU.
  For a dev environment a single instance is acceptable, but confirm the SKU (e.g., VpnGw1) and document the
  RTO if the gateway is lost. Private endpoints themselves are zone-resilient; the gateway is the SPOF for
  developer access.
- ℹ️ **Azure VPN Client for Linux retires 2026-08-31.** If any developers use the Linux client, plan the
  migration; Windows/macOS are unaffected.

### Cost ⚠️
- ⚠️ A VPN gateway runs ~24×7 per environment (hourly + egress). Replicating this gateway across
  dev/test/staging/prod is the main cost driver and the strongest argument for a **shared hub gateway**.
  Private endpoints add a small per-endpoint hourly + per-GB cost. For dev specifically, confirm the gateway
  SKU isn't oversized and consider auto-/scheduled shutdown isn't applicable to gateways (they can't be
  deallocated) — so consolidation is the lever, not scheduling. Cross-link: WA-03 Cost Optimization.

### Performance Efficiency ✅ (minor)
- ✅ Private endpoints keep traffic on the Microsoft backbone; latency impact is negligible and generally
  better than public routing. No concerns for a dev workload. Cross-link: WA-05.

---

## Findings summary

| # | Finding | Pillar | Severity |
|---|---------|--------|----------|
| 1 | Private-endpoint DNS uses client `hosts` file (testing-only); no Private DNS zones/resolver | Op. Excellence | 🔴 High |
| 2 | Network appears hand-built, not in Terraform/IaC (per K12-5690) | CAF Govern | 🔴 High |
| 3 | Private endpoints likely partial (SQL+SB only); public network access not confirmed disabled | Security | 🟠 Medium |
| 4 | Single standalone VNet/gateway per env vs CAF hub-spoke; gateway cost/ops | CAF Ready / Cost | 🟠 Medium |
| 5 | VPN access not scoped to an Entra group (all-or-nothing) | CAF Govern / Security | 🟠 Medium |
| 6 | Gateway SKU/redundancy, NSG rules, GatewaySubnet size unverified | Reliability/Security | 🟡 Verify |
| 7 | Commercial vs Government-cloud target divergence | Compliance | 🟡 Note |
| 8 | Azure VPN Linux client retirement (2026-08-31) | Op. Excellence | 🟡 Note |

## Prioritized recommendations

1. **Replace hosts-file DNS with Azure Private DNS zones + Private Resolver** (Finding 1) — single highest-value
   fix; removes the brittle per-developer step and the hard-coded IPs.
2. **Bring the network into Terraform** (Finding 2) — VNet, subnets, NSGs, gateway, private endpoints, and the
   new Private DNS zones; refresh the architecture page from a fresh Resource Graph export.
3. **Complete private-endpoint coverage + disable public access** on Key Vault, Storage/ADLS, SignalR, Event
   Grid, ACR (Finding 3).
4. **Scope VPN to an Entra group** and confirm Conditional Access policy (Finding 5).
5. **Evaluate a shared hub gateway / Virtual WAN** before each remaining environment gets its own gateway
   (Findings 4 + Cost).
6. **Verify** gateway SKU, NSG rules, GatewaySubnet /26, diagnostics/flow logs (Finding 6).

## To turn this from "documented" into "verified"
Provide one of: read-only Azure access (or an Azure MCP) to the `development` subscription, an Azure Resource
Graph export of the `development` RG (network resources), or add the `k12-infra` Azure DevOps/Terraform repo
to scope. Any of these lets me confirm the _(verify)_ items and tighten the severities.

## References (Microsoft Learn)
- Azure Private Endpoint private DNS zone values — https://learn.microsoft.com/azure/private-link/private-endpoint-dns
- Private Link and DNS integration at scale (hub-spoke) — https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale
- Configure P2S VPN Gateway for Microsoft Entra ID authentication — https://learn.microsoft.com/azure/vpn-gateway/point-to-site-entra-gateway
- Configure P2S access based on users and groups — https://learn.microsoft.com/azure/vpn-gateway/point-to-site-entra-users-access
- Hub-spoke network topology in Azure — https://learn.microsoft.com/azure/architecture/networking/architecture/hub-spoke
- Network topology and connectivity (Azure landing zone) — https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/network-topology-and-connectivity
- Azure VPN Client for Linux retirement — https://learn.microsoft.com/azure/vpn-gateway/azure-vpn-client-linux-retirement

## Related K12 documents
- WA-02 Security, WA-04 Operational Excellence, WA-05 Performance Efficiency, WA-03 Cost Optimization (`../../tools/wiki/03-target-architecture/well-architected/`)
- CAF-03 Adopt, CAF-04 Govern & Manage (`../../tools/wiki/03-target-architecture/cloud-adoption/`)
- Confluence: "K12 Azure Development P2S VPN Connection Guide", "02-Azure Architecture"; Jira K12-5690
