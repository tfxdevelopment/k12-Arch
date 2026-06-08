#!/usr/bin/env node
// Re-home the CAF/WAF multi-agent handoff into ContextStream:
// creates the plan, its tasks, and the key decisions in the K12 Azure workspace.
//
// Prereq: a VALID ContextStream API key (the keys committed in the repo as of
// 2026-06-08 test UNAUTHORIZED — generate a fresh one in the ContextStream console).
//
// Usage:
//   CONTEXTSTREAM_API_KEY=cbiq_xxx node scripts/contextstream-rehome.mjs
//
// Idempotency: ContextStream may create duplicate plans/tasks if run repeatedly;
// run once, or delete the prior plan first via session(action="list_plans").

import { spawn } from 'node:child_process';
import readline from 'node:readline';

const WS = '88a586eb-0e78-4841-b4fd-32f080419e2a'; // K12 Azure workspace
const FOLDER = process.cwd();
const KEY = process.env.CONTEXTSTREAM_API_KEY;
if (!KEY) { console.error('Set CONTEXTSTREAM_API_KEY (a valid key) and re-run.'); process.exit(2); }

const env = { ...process.env, CONTEXTSTREAM_API_URL: process.env.CONTEXTSTREAM_API_URL || 'https://api.contextstream.io', CONTEXTSTREAM_API_KEY: KEY, CONTEXTSTREAM_CONTEXT_PACK: 'true' };
const p = spawn('npx', ['-y', '@contextstream/mcp-server@latest'], { env, stdio: ['pipe', 'pipe', 'pipe'] });
const rl = readline.createInterface({ input: p.stdout });
const waiters = new Map();
rl.on('line', line => { try { const j = JSON.parse(line); if (j.id && waiters.has(j.id)) { waiters.get(j.id)(j); waiters.delete(j.id); } } catch {} });
let _id = 0;
const rpc = (method, params) => new Promise((res, rej) => { const id = ++_id; waiters.set(id, res); p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); setTimeout(() => rej(new Error('timeout ' + method)), 120000); });
const notify = (m, pm) => p.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: m, params: pm }) + '\n');
const tool = async (name, args) => { const r = await rpc('tools/call', { name, arguments: args }); return r.result?.content?.map(c => c.text).join('\n') ?? JSON.stringify(r.error || r.result); };
function extract(text) { const m = text.indexOf('Tool Response'); const start = text.indexOf('{', m >= 0 ? m : 0); if (start < 0) return null; const s = text.slice(start); for (let end = s.length; end > 0; end = s.lastIndexOf('}', end - 1) + 1) { try { return JSON.parse(s.slice(0, end)); } catch {} if (end <= 1) break; } return null; }
const ok = o => o && o.success !== false && !/UNAUTHORIZED/.test(JSON.stringify(o));
const planId = o => o && (o.data?.id || o.id || o.plan?.id || o.data?.plan?.id || o.data?.plan_id);

(async () => {
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'rehome', version: '1.0' } });
  notify('notifications/initialized', {});

  console.log('[1] init (establishes session; ~60s)…');
  await tool('init', { workspace_id: WS, folder_path: FOLDER, context_hint: 'Re-home CAF/WAF multi-agent handoff into ContextStream', auto_index: false, skip_project_creation: true, include_recent_memory: false });

  console.log('[2] capture_plan…');
  const planRes = await tool('session', { action: 'capture_plan', workspace_id: WS, title: 'CAF/WAF Multi-Agent Handoff',
    content: 'Complete K12 MyPortal CAF + WAF docs via multi-agent handoff. Scope: tools/wiki/03-target-architecture/cloud-adoption (4 CAF) and well-architected (WA-04, WA-05). Mirror WA-02-security.md format, grounded in Microsoft Learn, CAF<->WAF cross-refs. Draft PR #127 -> development.',
    goals: ['Fill 6 CAF/WAF stub docs to WA-02 quality', 'Add index READMEs + orchestration charter', 'Open draft PR against development', 'Reconcile resource-groups/security-roles chat into CAF-04'],
    steps: [
      { id: '1', title: 'CAF-01 Strategy', order: 1 }, { id: '2', title: 'CAF-02 Plan', order: 2 },
      { id: '3', title: 'CAF-03 Adopt', order: 3 }, { id: '4', title: 'CAF-04 Govern & Manage', order: 4 },
      { id: '5', title: 'WA-04 Operational Excellence', order: 5 }, { id: '6', title: 'WA-05 Performance Efficiency', order: 6 } ] });
  const planObj = extract(planRes);
  if (!ok(planObj)) { console.error('   capture_plan FAILED:', planRes.slice(-300)); p.kill(); process.exit(1); }
  const pid = planId(planObj); console.log('   plan_id:', pid);

  const tasks = [
    ['CAF-01 Strategy doc', 'completed'], ['CAF-02 Plan doc', 'completed'], ['CAF-03 Adopt doc', 'completed'],
    ['CAF-04 Govern & Manage doc (resource groups + RBAC baseline)', 'completed'],
    ['WA-04 Operational Excellence doc', 'completed'], ['WA-05 Performance Efficiency doc', 'completed'],
    ['Index READMEs + orchestration charter', 'completed'],
    ['Fix ContextStream .mcp.json integration', 'completed'],
    ["Reconcile 'Azure resource groups and security roles best practices' chat into CAF-04", 'pending'] ];
  console.log('[3] create_task x' + tasks.length + '…');
  for (const [title, status] of tasks) {
    const o = extract(await tool('memory', { action: 'create_task', workspace_id: WS, title, plan_id: pid, task_status: status, priority: 'medium', content: 'Part of CAF/WAF multi-agent handoff (PR #127).' }));
    console.log('   -', status === 'completed' ? '[x]' : '[ ]', title, '=>', ok(o) ? 'ok' : 'ERR');
  }

  console.log('[4] capture decisions…');
  const decisions = [
    ['Use multi-agent handoff for CAF/WAF authoring', 'Orchestrator + specialist author agents (CAF, WAF Op-Ex, WAF Perf) drafting independent files in parallel; one owner per file; grounded via Microsoft Learn MCP.'],
    ['CAF/WAF docs mirror WA-02-security.md structure', 'Metadata + Executive Summary + themed sections + References (Microsoft Docs + Related K12), with CAF<->WAF cross-references, on Azure Government / FedRAMP Moderate, ~80K peak users.'],
    ['Repair ContextStream .mcp.json to canonical stdio server', 'Replaced unauthenticated context-awesome HTTP endpoint with npx @contextstream/mcp-server@latest against api.contextstream.io. NOTE: committed keys tested UNAUTHORIZED — a valid key is required.'] ];
  for (const [title, content] of decisions) {
    const o = extract(await tool('session', { action: 'capture', workspace_id: WS, event_type: 'decision', importance: 'high', title, content }));
    console.log('   -', title, '=>', ok(o) ? 'ok' : 'ERR');
  }
  console.log('DONE'); p.kill(); process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); p.kill(); process.exit(1); });
