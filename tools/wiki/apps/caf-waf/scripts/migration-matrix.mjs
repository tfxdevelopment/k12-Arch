import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const rows = [
  ['../04-well-architected/WA-01-reliability.md', '../05-well-architected/WA-01-reliability.md', 'Migrated and condensed into draft structure'],
  ['../04-well-architected/WA-02-security.md', '../05-well-architected/WA-02-security.md', 'Migrated and condensed into draft structure'],
  ['../04-well-architected/WA-03-cost-optimization.md', '../05-well-architected/WA-03-cost-optimization.md', 'Migrated and condensed into draft structure'],
  ['N/A', '../05-well-architected/WA-04-operational-excellence.md', 'New draft created'],
  ['N/A', '../05-well-architected/WA-05-performance-efficiency.md', 'New draft created']
];

let table = '# WAF Migration Matrix\n\n';
table += '| Legacy Source | New Target | Notes |\n';
table += '|---|---|---|\n';

for (const row of rows) {
  table += `| ${row[0]} | ${row[1]} | ${row[2]} |\n`;
}

const outputPath = path.join(projectRoot, 'generated', 'waf-migration-matrix.md');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, table, 'utf8');

console.log('Generated WAF migration matrix.');
