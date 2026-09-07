const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in

// Palette — navy dominant, ice blue support, amber = risk, green = compliant
const NAVY = "1E2761", ICE = "CADCFC", WHITE = "FFFFFF", AMBER = "E8A33D", GREEN = "2E8B57",
      RED = "B03A2E", TEXT = "1F2430", MUTED = "5B6470", CARD = "F3F5F9", LINE = "D5DBE6";
const H = "Cambria", B = "Calibri";

function base(dark = false) {
  const s = pres.addSlide();
  s.background = { color: dark ? NAVY : WHITE };
  return s;
}
function title(s, text, sub) {
  s.addText(text, { x: 0.5, y: 0.35, w: 9.0, h: 0.6, fontFace: H, fontSize: 28, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  if (sub) s.addText(sub, { x: 0.5, y: 0.95, w: 9.0, h: 0.35, fontFace: B, fontSize: 13, color: MUTED, isTextBox: true, margin: 0 });
}
function footer(s, n) {
  s.addText("K12 MyPortal · Defender for Cloud remediation · Architecture review draft · Sep 2026", { x: 0.5, y: 5.2, w: 8.0, h: 0.3, fontFace: B, fontSize: 9, color: MUTED, isTextBox: true, margin: 0 });
  s.addText(String(n), { x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontFace: B, fontSize: 9, color: MUTED, align: "right", isTextBox: true, margin: 0 });
}
function card(s, x, y, w, h, head, body, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: opts.fill || CARD }, line: { color: opts.line || LINE, width: 0.75 }, rectRadius: 0.08 });
  const hh = opts.headH || 0.32;
  s.addText(head, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: hh, fontFace: B, fontSize: opts.headSize || 12, bold: true, color: opts.headColor || NAVY, isTextBox: true, margin: 0, valign: "top" });
  if (body) s.addText(body, { x: x + 0.15, y: y + 0.1 + hh, w: w - 0.3, h: opts.bodyH || (h - 0.18 - hh), fontFace: B, fontSize: opts.bodySize || 10, color: TEXT, isTextBox: true, margin: 0, valign: "top", paraSpaceAfter: 3 });
}
function chip(s, x, y, text, color, w = 0.9) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.26, fill: { color }, line: { color, width: 0 }, rectRadius: 0.13 });
  s.addText(text, { x, y, w, h: 0.26, fontFace: B, fontSize: 9, bold: true, color: WHITE, align: "center", valign: "middle", isTextBox: true, margin: 0 });
}
function num(s, x, y, n, color = NAVY, d = 0.4, tc = WHITE) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } });
  s.addText(String(n), { x, y, w: d, h: d, fontFace: B, fontSize: 12, bold: true, color: tc, align: "center", valign: "middle", isTextBox: true, margin: 0 });
}
function box(s, x, y, w, h, text, fill, color = NAVY, size = 9, bold = false, line = NAVY) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line, width: 0.75 }, rectRadius: 0.05 });
  s.addText(text, { x: x + 0.04, y, w: w - 0.08, h, fontFace: B, fontSize: size, bold, color, align: "center", valign: "middle", isTextBox: true, margin: 0 });
}
function arrow(s, x1, y1, x2, y2, color = NAVY, dash) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.01, h: Math.abs(y2 - y1) || 0.01, line: { color, width: 1.25, endArrowType: "triangle", dashType: dash || "solid" }, flipH: x2 < x1, flipV: y2 < y1 });
}

// ---------------------------------------------------------------- 1 Title
{
  const s = base(true);
  s.addText("Defender for Cloud remediation", { x: 0.7, y: 1.5, w: 8.6, h: 0.9, fontFace: H, fontSize: 40, bold: true, color: WHITE, isTextBox: true, margin: 0 });
  s.addText("K12 MyPortal platform · target-state security baseline and phased plan", { x: 0.7, y: 2.4, w: 8.6, h: 0.5, fontFace: B, fontSize: 18, color: ICE, isTextBox: true, margin: 0 });
  s.addText("Grounded in the Microsoft Cloud Security Benchmark, Cloud Adoption Framework landing-zone guidance and the Well-Architected Framework Security pillar.", { x: 0.7, y: 3.1, w: 8.0, h: 0.7, fontFace: B, fontSize: 13, color: WHITE, isTextBox: true, margin: 0 });
  s.addText("Architecture review draft · for DevOps leads · September 2026 · nothing in this package has been applied", { x: 0.7, y: 4.6, w: 8.6, h: 0.4, fontFace: B, fontSize: 11, color: ICE, isTextBox: true, margin: 0 });
  s.addNotes("Frame: this is a review draft built from the MCSB recommendation catalog for our service stack. Once the Defender export is in, the catalog is pruned to actual findings and the phases re-sequenced by severity counts.");
}

// ---------------------------------------------------------------- 2 What Defender is telling us
{
  const s = base();
  title(s, "What Defender is telling us", "Findings cluster into four families — counts to be filled from the Recommendations export");
  const fam = [
    ["Public PaaS endpoints", "Medium", AMBER, "“…should use private link”, “…should disable public network access”, “Key Vault should have firewall enabled…” — every Key Vault, App Config, Service Bus, Event Hubs, SQL, Storage and Redis resource, in every environment."],
    ["Local auth & keys", "Medium", AMBER, "“…local authentication methods disabled”, “…should not use access keys”, “…prevent shared key access”, “SQL … Entra-only”. Connection strings and SAS keys are still the default in Dapr components and App Configuration."],
    ["Defender plans off", "High", RED, "“Microsoft Defender for Key Vault / Storage / SQL / Containers / Resource Manager should be enabled”. No threat detection, no attack-path analysis, NIST overlay unavailable."],
    ["Subscription hygiene", "High / Low", RED, "MFA on privileged accounts, owner count, guest accounts, security contact, high-severity email alerts, resource logs not routed to Log Analytics."],
  ];
  fam.forEach((f, i) => {
    const x = 0.5 + i * 2.3;
    card(s, x, 1.5, 2.15, 3.2, f[0], f[3], { headSize: 13 });
    chip(s, x + 0.15, 4.3, f[1], f[2]);
  });
  s.addText("The same recommendation fires three times per resource type because dev, test and stage share one resource group. Fixing findings without fixing that just makes them come back.", { x: 0.5, y: 4.8, w: 9.0, h: 0.35, fontFace: B, fontSize: 11, italic: true, color: NAVY, isTextBox: true, margin: 0 });
  footer(s, 2);
}

// ---------------------------------------------------------------- 3 Root causes
{
  const s = base();
  title(s, "Root causes, not symptoms", "Two structural gaps explain most of the list; five configuration habits explain the rest");
  card(s, 0.5, 1.5, 4.4, 1.9, "RC-1 · One resource group for dev + test + stage", "Stage cannot be held to a stricter standard than dev; a dev mistake has stage blast radius; every finding is ×3.\nCAF: each environment should ideally have its own subscription, its own groups and its own role assignments.", { headSize: 13, bodySize: 11 });
  card(s, 5.1, 1.5, 4.4, 1.9, "RC-2 · No policy guardrails at MG scope", "Terraform and pipelines can create anything, so every misconfiguration becomes a finding after deployment instead of being denied before it.\nCAF design principle: policy-driven governance. This is the layer that was skipped.", { headSize: 13, bodySize: 11 });
  const small = [["RC-3", "SAS keys / connection strings"], ["RC-4", "Public endpoints on PaaS"], ["RC-5", "Defender plans not enabled"], ["RC-6", "Resource logs not routed"], ["RC-7", "Subscription hygiene"]];
  small.forEach((r, i) => {
    const x = 0.5 + i * 1.84;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.7, w: 1.7, h: 1.1, fill: { color: WHITE }, line: { color: LINE, width: 0.75 }, rectRadius: 0.08 });
    s.addText(r[0], { x: x + 0.12, y: 3.78, w: 1.5, h: 0.3, fontFace: B, fontSize: 11, bold: true, color: AMBER, isTextBox: true, margin: 0 });
    s.addText(r[1], { x: x + 0.12, y: 4.08, w: 1.5, h: 0.65, fontFace: B, fontSize: 10.5, color: TEXT, isTextBox: true, margin: 0, valign: "top" });
  });
  footer(s, 3);
  s.addNotes("Terry's observation: when we followed CAF before we didn't have these issues. That is RC-2 — CAF's guardrails stop drift before Defender ever sees it.");
}

// ---------------------------------------------------------------- 4 The standard
{
  const s = base();
  title(s, "The standard: MCSB + CAF + WAF", "Assess with MCSB, govern the CAF way, design with the WAF Security pillar — three layers of one guidance set");
  const cols = [
    ["ASSESS", "Microsoft Cloud Security Benchmark", "The default standard Defender assigns to every subscription. Recommendations and the Secure Score are computed from it. Per-service security baselines map it onto Key Vault, Container Apps, Service Bus, etc.\nMicrosoft recommends MCSB over CIS for customers maximising posture."],
    ["GOVERN", "CAF · Azure landing zones", "Policy-driven governance, subscription democratisation, environment separation. Ships a default policy baseline.\nOur custom initiative reuses ~70 MCSB built-ins: Audit on NonProd, Deny on Prod."],
    ["DESIGN", "WAF · Security pillar", "12-item design review checklist (SE:01–SE:12) plus per-service architecture guides. SE:01 is literally “establish a security baseline aligned to platform recommendations” — i.e. MCSB.\nUsed for ADRs and design reviews in the K12-Arch repo."],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.9, h: 0.4, fill: { color: NAVY }, line: { color: NAVY, width: 0 } });
    s.addText(c[0], { x, y: 1.5, w: 2.9, h: 0.4, fontFace: B, fontSize: 11, bold: true, color: ICE, align: "center", valign: "middle", isTextBox: true, margin: 0, charSpacing: 2 });
    card(s, x, 1.9, 2.9, 2.55, c[1], c[2], { headSize: 13, bodySize: 10.5, headH: 0.55 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.6, w: 9.0, h: 0.5, fill: { color: "FFF3D6" }, line: { color: AMBER, width: 0.75 }, rectRadius: 0.08 });
  s.addText("NIST SP 800-53 R5 (state-agency reporting) is added as an overlay in the Defender compliance dashboard once a paid plan is on. It maps to the same MCSB controls — we do not remediate against it separately.", { x: 0.65, y: 4.6, w: 8.7, h: 0.5, fontFace: B, fontSize: 10.5, color: TEXT, valign: "middle", isTextBox: true, margin: 0 });
  footer(s, 4);
}

// ---------------------------------------------------------------- 5 Target-state architecture (native diagram)
{
  const s = base();
  title(s, "Target-state architecture (per environment)", "Private endpoints everywhere · Entra ID + managed identity · no public PaaS endpoints · same shape in every environment");
  // Users / edge
  box(s, 0.5, 1.6, 1.5, 0.55, "Citizens · Schools\nSEAA admins", "EFEFF4", TEXT, 9, false, "B9BFCB");
  box(s, 0.5, 2.35, 1.5, 0.55, "Azure Pipelines\nWIF · agent in VNet", "EFEFF4", TEXT, 9, false, "B9BFCB");
    // VNet
  s.addShape(pres.shapes.RECTANGLE, { x: 2.3, y: 1.45, w: 4.0, h: 3.6, fill: { color: "FAFBFF" }, line: { color: NAVY, width: 1, dashType: "dash" } });
  s.addText("vnet-k12-<env> · 10.x.0.0/20", { x: 2.4, y: 1.48, w: 3.8, h: 0.25, fontFace: B, fontSize: 9, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  box(s, 2.45, 1.8, 1.7, 0.5, "App Gateway WAF v2\nsnet-appgw", ICE, NAVY, 9);
  box(s, 4.35, 1.8, 1.8, 0.5, "NAT Gateway → NSC · SFTP\nstable egress IP", ICE, NAVY, 9);
  s.addShape(pres.shapes.RECTANGLE, { x: 2.45, y: 2.5, w: 3.7, h: 1.25, fill: { color: "E9F0FF" }, line: { color: NAVY, width: 0.75 } });
  s.addText("Container Apps environment · snet-aca /23 · workload profiles · internal LB · public access Disabled · mTLS", { x: 2.5, y: 2.52, w: 3.6, h: 0.35, fontFace: B, fontSize: 8, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  ["enrollment-api", "admin-api", "validation-api"].forEach((n, i) => box(s, 2.55 + i * 1.2, 2.95, 1.1, 0.7, n + "\nUAMI + Dapr", WHITE, NAVY, 8.5));
  box(s, 2.45, 3.95, 3.7, 0.95, "snet-private-endpoints · NSG deny-by-default\n10 private endpoints + private DNS zones\n(vaultcore · azconfig · servicebus · database · blob · azurecr · redis · azurecontainerapps · azurestaticapps)", "F3F5F9", TEXT, 8, false, "B9BFCB");
  // PaaS column
  s.addShape(pres.shapes.RECTANGLE, { x: 6.55, y: 1.45, w: 2.95, h: 2.65, fill: { color: WHITE }, line: { color: NAVY, width: 1, dashType: "dash" } });
  s.addText("PaaS · public access Disabled · local auth Disabled · TLS 1.2", { x: 6.62, y: 1.48, w: 2.85, h: 0.25, fontFace: B, fontSize: 8, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  const paas = ["Key Vault · RBAC · purge protection", "App Configuration Standard", "Service Bus Premium", "Event Hubs Standard", "Azure SQL · Entra-only · audit → LAW", "Storage · no shared key", "Azure Managed Redis · Entra auth", "Container Registry Premium", "Static Web App Standard (admin)"];
  paas.forEach((p, i) => box(s, 6.65, 1.78 + i * 0.255, 2.75, 0.23, p, "F3F5F9", TEXT, 8, false, "B9BFCB"));
  // Governance + observability
  box(s, 6.55, 4.25, 2.95, 0.8, "Entra ID · Azure Policy initiative (Audit NonProd · Deny Prod)\nDefender for Cloud (MCSB · CSPM · plans)\nLog Analytics log-k12-<env> · allLogs · 120d + archive (prod)", "FFF3D6", "4A3100", 8, false, AMBER);
  // arrows
  arrow(s, 2.0, 1.87, 2.45, 2.05);           // users -> app gw
  arrow(s, 3.3, 2.3, 3.3, 2.5);              // app gw -> aca env
  arrow(s, 2.0, 2.62, 2.45, 3.3);            // pipelines -> aca
  arrow(s, 4.3, 3.65, 4.3, 3.95);            // aca -> pe subnet
  arrow(s, 6.15, 4.4, 6.55, 3.0);            // pe -> paas
  arrow(s, 5.25, 2.5, 5.25, 2.3);            // aca -> nat
  s.addText("managed identity, private endpoints", { x: 4.4, y: 3.72, w: 1.9, h: 0.22, fontFace: B, fontSize: 7.5, italic: true, color: MUTED, isTextBox: true, margin: 0 });
  footer(s, 5);
  s.addNotes("Read left to right: users hit App Gateway WAF (or Front Door for the citizen SWA), which reaches the Container Apps environment over its private endpoint. Apps authenticate to every PaaS service with a user-assigned managed identity over private endpoints. Nothing answers on a public endpoint. The same shape exists in each environment; only policy effect, plan coverage, retention and redundancy differ.");
}

// ---------------------------------------------------------------- 6 Target state by environment (table)
{
  const s = base();
  title(s, "Target state by environment", "Controls are identical; only the knobs change (plan decision D-1)");
  const hdr = ["Control", "Dev", "Test", "Stage", "Prod"];
  const rows = [
    ["Subscription / RG", "sub-k12-nonprod / rg-k12-dev", "sub-k12-nonprod / rg-k12-test", "sub-k12-stage / rg-k12-stage", "sub-k12-prod / rg-k12-prod"],
    ["Policy initiative effect", "Audit", "Audit", "Deny", "Deny"],
    ["Public network access on PaaS", "Disabled", "Disabled", "Disabled", "Disabled"],
    ["Private endpoints", "Yes", "Yes", "Yes", "Yes"],
    ["Container Apps env", "Internal, workload profiles", "same", "same", "same + zone redundant"],
    ["Public ingress", "App GW WAF (Detection)", "App GW WAF (Detection)", "App GW WAF (Prevention)", "App GW WAF (Prevention) + DDoS"],
    ["Auth to PaaS", "Entra + MI, local auth off", "same", "same", "same"],
    ["Key Vault soft delete", "7 days", "7 days", "90 days", "90 days"],
    ["Diagnostics → LAW", "allLogs, 30d", "30d", "90d", "120d + archive (3y)"],
    ["Defender plans", "CSPM + Key Vault", "CSPM + Key Vault", "Full set", "Full set"],
    ["Human access (Ops/Architects)", "Contributor + data Owner", "Contributor + data Owner", "Reader + PIM", "Reader + PIM (approval)"],
  ];
  const tRows = [hdr.map(h => ({ text: h, options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: B, fontSize: 10 } }))];
  rows.forEach((r, ri) => tRows.push(r.map((c, ci) => ({ text: c, options: { fontFace: B, fontSize: 9.5, color: TEXT, bold: ci === 0, fill: { color: ri % 2 ? WHITE : CARD } } }))));
  s.addTable(tRows, { x: 0.5, y: 1.45, w: 9.0, colW: [2.0, 1.75, 1.75, 1.75, 1.75], border: { type: "solid", color: LINE, pt: 0.5 }, rowH: 0.3, margin: 0.04 });
  footer(s, 6);
}

// ---------------------------------------------------------------- 7 Decisions
{
  const s = base();
  title(s, "Nine decisions that need DevOps sign-off", "D-2 and D-3 are DevOps-owned and gate Phase 4");
  const d = [
    ["D-1", "Environment parity", "Same network + identity architecture in every environment; only knobs differ.", "Architects"],
    ["D-2", "Per-env RGs now, per-env subscriptions in Phase 4", "rg-k12-dev/test/stage now; NonProd / Prod management groups later.", "DevOps"],
    ["D-3", "One initiative, two assignments", "~70 MCSB built-ins: Audit on NonProd, Deny on Prod after compliance.", "DevOps"],
    ["D-4", "Entra ID + managed identity everywhere", "Local auth off at namespace/store level; Dapr uses azureClientId.", "App teams"],
    ["D-5", "Azure Cache for Redis → Azure Managed Redis", "ACR retires 30 Sep 2028; AMR has Entra auth + private endpoints.", "Architects"],
    ["D-6", "Internal workload-profile Container Apps envs", "VNet-injected, private endpoint inbound, App GW WAF in front.", "Architects"],
    ["D-7", "Log Analytics per env, allLogs everywhere", "Prod 120d + archive to meet the CFI 3-year audit policy.", "Architects"],
    ["D-8", "Defender plan set", "CSPM, Key Vault, Storage v2, SQL, ARM, Containers (+App Service, APIs while present).", "DevOps"],
    ["D-9", "Deviations = exemptions with expiry", "Never disable a recommendation; record justification.", "Security Office"],
  ];
  d.forEach((x, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const px = 0.5 + col * 3.05, py = 1.45 + row * 1.22;
    card(s, px, py, 2.9, 1.15, x[0] + " · " + x[1], x[2], { headSize: 10.5, bodySize: 9.5, headH: 0.36, bodyH: 0.42 });
    chip(s, px + 2.9 - 1.05, py + 0.85, x[3], x[3] === "DevOps" ? NAVY : x[3] === "Architects" ? GREEN : x[3] === "App teams" ? AMBER : MUTED, 0.95);
  });
  footer(s, 7);
}

// ---------------------------------------------------------------- 8 Roadmap
{
  const s = base();
  title(s, "Roadmap — five phases, identity before network", "Within each phase: dev → test → stage → prod. Deny is only enforced after resources are compliant.");
  const ph = [
    ["0", "Hygiene", "Week 1", "Security contact, MFA CA, owners, Defender CSPM, diagnostics allLogs", false, "All High subscription findings closed"],
    ["1", "Config quick wins", "Weeks 1–2", "Key Vault RBAC/purge/expiry, TLS 1.2, HTTPS-only, storage hardening, SQL Entra admin", false, "All High config findings closed"],
    ["2", "Identity", "Weeks 2–5", "Managed identity + Dapr azureClientId, disable local auth, Azure Managed Redis, workload identity federation", true, "No SAS/keys anywhere"],
    ["3", "Network", "Weeks 4–8", "VNet + private DNS, internal ACA envs, private endpoints, App GW WAF, VNet pipeline agents", true, "No public PaaS endpoint"],
    ["4", "Guardrails & structure", "Weeks 6–10", "Per-env RGs/subs, MG hierarchy, initiative Audit → Deny, full Defender plans, NIST overlay", false, "Prod 100% compliant, Secure Score ≥ 85%"],
  ];
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 2.05, w: 8.6, h: 0.01, line: { color: ICE, width: 3 } });
  ph.forEach((p, i) => {
    const x = 0.5 + i * 1.84;
    num(s, x + 0.6, 1.83, p[0], p[4] ? AMBER : NAVY, 0.44);
    s.addText(p[1], { x, y: 2.35, w: 1.7, h: 0.3, fontFace: B, fontSize: 12, bold: true, color: NAVY, align: "center", isTextBox: true, margin: 0 });
    s.addText(p[2], { x, y: 2.62, w: 1.7, h: 0.25, fontFace: B, fontSize: 10, color: MUTED, align: "center", isTextBox: true, margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.95, w: 1.7, h: 1.45, fill: { color: CARD }, line: { color: LINE, width: 0.75 }, rectRadius: 0.08 });
    s.addText(p[3], { x: x + 0.1, y: 3.0, w: 1.5, h: 1.35, fontFace: B, fontSize: 9.5, color: TEXT, isTextBox: true, margin: 0, valign: "top" });
    s.addText("Exit: " + p[5], { x, y: 4.45, w: 1.7, h: 0.5, fontFace: B, fontSize: 9, italic: true, color: GREEN, align: "center", isTextBox: true, margin: 0, valign: "top" });
  });
  s.addShape(pres.shapes.OVAL, { x: 0.5, y: 5.0, w: 0.16, h: 0.16, fill: { color: AMBER }, line: { color: AMBER, width: 0 } });
  s.addText("= breaking change for apps or pipelines — coordinate per bounded context", { x: 0.72, y: 4.95, w: 6, h: 0.26, fontFace: B, fontSize: 9, color: MUTED, isTextBox: true, margin: 0 });
  footer(s, 8);
  s.addNotes("Sequencing rule: disabling public access while apps still use connection strings creates two simultaneous failure modes that are hard to debug. Finish Phase 2 in an environment before starting Phase 3 there.");
}

// ---------------------------------------------------------------- 9 Breaking changes
{
  const s = base();
  title(s, "What breaks, and what teams must do", "Plan Section 7 has the full checklist");
  const rows = [
    ["Local auth disabled", "Every connection string, SAS token and access key stops working.", "DefaultAzureCredential + managed identity; request Sender/Receiver/Data Reader on the specific entity; Dapr components use azureClientId."],
    ["Private endpoints + public access off", "Hosted pipeline agents, laptops, Metabase/Cube.js, Power Automate lose access.", "Managed DevOps Pool agents in the VNet; VPN + Private DNS Resolver for developers; move Metabase/Cube.js/Trino inside the VNet."],
    ["New internal Container Apps environment", "Environment FQDNs and IPs change; default domain becomes private.", "Front public apps with App Gateway WAF / Front Door Premium; re-point APIM backends and DNS."],
    ["Redis → Azure Managed Redis · Service Bus → Premium", "Hostname suffix and port (10000) change; access keys off; Premium cost.", "Update connection config; Entra token auth in StackExchange.Redis; validate partition/message-size settings."],
  ];
  rows.forEach((r, i) => {
    const y = 1.5 + i * 0.9;
    num(s, 0.5, y + 0.15, i + 1, AMBER, 0.4);
    s.addText(r[0], { x: 1.05, y, w: 2.3, h: 0.8, fontFace: B, fontSize: 11.5, bold: true, color: NAVY, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(r[1], { x: 3.45, y, w: 2.7, h: 0.8, fontFace: B, fontSize: 10, color: TEXT, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(r[2], { x: 6.3, y, w: 3.2, h: 0.8, fontFace: B, fontSize: 10, color: TEXT, isTextBox: true, margin: 0, valign: "middle" });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: 1.05, y: y + 0.85, w: 8.45, h: 0.01, line: { color: LINE, width: 0.5 } });
  });
  s.addText("Breaks", { x: 3.45, y: 1.2, w: 2.7, h: 0.25, fontFace: B, fontSize: 9, bold: true, color: MUTED, isTextBox: true, margin: 0, charSpacing: 1 });
  s.addText("Teams do", { x: 6.3, y: 1.2, w: 3.2, h: 0.25, fontFace: B, fontSize: 9, bold: true, color: MUTED, isTextBox: true, margin: 0, charSpacing: 1 });
  footer(s, 9);
}

// ---------------------------------------------------------------- 10 Guardrails (MG hierarchy)
{
  const s = base();
  title(s, "Guardrails: where the initiative attaches", "One custom initiative of ~70 MCSB built-ins · delivered in terraform/platform-guardrails");
  const bx = (x, y, w, h, t, f, c, l, sz) => box(s, x, y, w, h, t, f, c, sz || 9, false, l);
  bx(3.95, 1.45, 2.1, 0.45, "Tenant Root Group", NAVY, WHITE, NAVY, 10);
  bx(3.95, 2.1, 2.1, 0.5, "CFI · intermediate root\ninitiative defined here", NAVY, WHITE, NAVY, 9);
  bx(1.3, 2.85, 1.7, 0.45, "Platform\nidentity · connectivity", ICE, NAVY, NAVY, 8.5);
  bx(3.95, 2.85, 2.1, 0.45, "Landing Zones › Corp", ICE, NAVY, NAVY, 9);
  bx(7.0, 2.85, 1.7, 0.45, "Sandboxes\nrelaxed policy · POCs", ICE, NAVY, NAVY, 8.5);
  bx(2.6, 3.6, 2.3, 0.55, "NonProd MG\nk12-guardrails-nonprod → AUDIT", "FFF3D6", "4A3100", AMBER, 9);
  bx(5.1, 3.6, 2.3, 0.55, "Prod MG\nk12-guardrails-prod → DENY", "FADBD8", "641E16", RED, 9);
  bx(2.6, 4.4, 2.3, 0.55, "sub-k12-nonprod\nrg-k12-dev · rg-k12-test\nDefender: CSPM + Key Vault", CARD, TEXT, LINE, 8);
  bx(5.1, 4.4, 1.1, 0.55, "sub-k12-stage\nfull plans", CARD, TEXT, LINE, 8);
  bx(6.3, 4.4, 1.1, 0.55, "sub-k12-prod\nfull plans", CARD, TEXT, LINE, 8);
  arrow(s, 5.0, 1.9, 5.0, 2.1); arrow(s, 5.0, 2.6, 5.0, 2.85); arrow(s, 3.95, 2.35, 2.15, 2.85); arrow(s, 6.05, 2.35, 7.85, 2.85);
  arrow(s, 4.6, 3.3, 3.75, 3.6); arrow(s, 5.4, 3.3, 6.25, 3.6); arrow(s, 3.75, 4.15, 3.75, 4.4); arrow(s, 6.25, 4.15, 5.65, 4.4); arrow(s, 6.25, 4.15, 6.85, 4.4);
  // side panel
  card(s, 0.5, 3.6, 1.9, 1.35, "Initiative groups", "Identity & access (IM/PA)\nNetwork (NS)\nData protection (DP)\nLogging & detection (LT)\n+ DINE diagnostics → LAW", { headSize: 10, bodySize: 9 });
  card(s, 7.6, 3.6, 1.9, 1.35, "Flip to Deny when", "Prod resources show 100% compliant on the NonProd-style Audit assignment.\nprod_effect = \"Deny\" is a one-line tfvars change.", { headSize: 10, bodySize: 9 });
  footer(s, 10);
}

// ---------------------------------------------------------------- 11 Asks
{
  const s = base();
  title(s, "What we need from DevOps", "Five items — three are hours, not days");
  const asks = [
    ["Defender export (read-only)", "Recommendations CSV for all four environments, or the Resource Graph output from plan Section 8. Prunes the catalog to real findings and re-sequences the phases."],
    ["30 minutes on decisions D-1 to D-9", "D-2 (RGs / subscriptions / MGs) and D-3 (policy initiative) are yours and gate Phase 4."],
    ["Entra actions for Phase 0", "Security contact, Conditional Access requiring MFA for Azure management, owner clean-up, guest-account removal."],
    ["Workload identity federation + VNet-capable agents", "Removes the last long-lived pipeline secrets; Managed DevOps Pools reach the private endpoints in Phase 3."],
    ["Ops/Architects group on nonprod", "Contributor + data-plane roles per the RBAC proposal so the architecture team validates each phase without DevOps time."],
  ];
  asks.forEach((a, i) => {
    const y = 1.5 + i * 0.72;
    num(s, 0.5, y + 0.1, i + 1, NAVY, 0.44);
    s.addText(a[0], { x: 1.1, y, w: 3.0, h: 0.65, fontFace: B, fontSize: 12, bold: true, color: NAVY, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(a[1], { x: 4.2, y, w: 5.3, h: 0.65, fontFace: B, fontSize: 10.5, color: TEXT, isTextBox: true, margin: 0, valign: "middle" });
  });
  footer(s, 11);
}

// ---------------------------------------------------------------- 12 Close
{
  const s = base(true);
  s.addText("Next steps", { x: 0.7, y: 0.6, w: 8.6, h: 0.7, fontFace: H, fontSize: 32, bold: true, color: WHITE, isTextBox: true, margin: 0 });
  const steps = ["Approve the standard (MCSB / CAF / WAF) and decisions D-1 … D-9", "Share the Defender export → catalog pruned, phases re-sequenced by real counts", "Phase 0 this week: hygiene items + diagnostics — no application impact", "Terraform reviewed by DevOps: terraform/platform-guardrails (yours) and terraform/workload-baseline (ours)", "Guardrail initiative assigned in Audit on NonProd — compliance dashboard becomes the shared scorecard"];
  steps.forEach((t, i) => {
    num(s, 0.7, 1.55 + i * 0.6, i + 1, WHITE, 0.4, NAVY);
    s.addText(t, { x: 1.3, y: 1.5 + i * 0.6, w: 8.0, h: 0.5, fontFace: B, fontSize: 14, color: WHITE, isTextBox: true, margin: 0, valign: "middle" });
  });
  s.addText("Package: Defender-Remediation-Plan.md · terraform/ (validated, azurerm ~> 4.60) · diagrams/*.mmd · this deck. Nothing has been applied.", { x: 0.7, y: 4.7, w: 8.6, h: 0.5, fontFace: B, fontSize: 11, color: ICE, isTextBox: true, margin: 0 });
  // subtle change on closing num circle text color for contrast
}

pres.writeFile({ fileName: "/home/claude/defender-remediation/deck/Defender-Remediation-DevOps.pptx" }).then(() => console.log("written"));
