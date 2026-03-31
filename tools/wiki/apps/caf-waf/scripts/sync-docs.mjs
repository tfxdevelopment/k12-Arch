import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(projectRoot, '..', '..', '09-proposed-architecture');
const astroRoot = path.resolve(projectRoot, '..', 'docs', 'src', 'content', 'docs', 'architecture');

const files = [
  {
    category: 'waf',
    slug: 'wa-01-reliability',
    title: 'WA-01 Reliability',
    description: 'Reliability guidance for the proposed cloud-native architecture.',
    source: path.join(sourceRoot, '05-well-architected', 'WA-01-reliability.md')
  },
  {
    category: 'waf',
    slug: 'wa-02-security',
    title: 'WA-02 Security',
    description: 'Security guidance for the proposed cloud-native architecture.',
    source: path.join(sourceRoot, '05-well-architected', 'WA-02-security.md')
  },
  {
    category: 'waf',
    slug: 'wa-03-cost-optimization',
    title: 'WA-03 Cost Optimization',
    description: 'Cost optimization guidance for the proposed cloud-native architecture.',
    source: path.join(sourceRoot, '05-well-architected', 'WA-03-cost-optimization.md')
  },
  {
    category: 'waf',
    slug: 'wa-04-operational-excellence',
    title: 'WA-04 Operational Excellence',
    description: 'Operational excellence guidance for the proposed cloud-native architecture.',
    source: path.join(sourceRoot, '05-well-architected', 'WA-04-operational-excellence.md')
  },
  {
    category: 'waf',
    slug: 'wa-05-performance-efficiency',
    title: 'WA-05 Performance Efficiency',
    description: 'Performance guidance for the proposed cloud-native architecture.',
    source: path.join(sourceRoot, '05-well-architected', 'WA-05-performance-efficiency.md')
  },
  {
    category: 'caf',
    slug: 'caf-01-strategy',
    title: 'CAF-01 Strategy',
    description: 'Cloud adoption strategy for modernization execution.',
    source: path.join(sourceRoot, '06-cloud-adoption', 'CAF-01-strategy.md')
  },
  {
    category: 'caf',
    slug: 'caf-02-plan',
    title: 'CAF-02 Plan',
    description: 'Cloud adoption planning model and milestones.',
    source: path.join(sourceRoot, '06-cloud-adoption', 'CAF-02-plan.md')
  },
  {
    category: 'caf',
    slug: 'caf-03-adopt',
    title: 'CAF-03 Adopt',
    description: 'Cloud adoption onboarding and migration workflow.',
    source: path.join(sourceRoot, '06-cloud-adoption', 'CAF-03-adopt.md')
  },
  {
    category: 'caf',
    slug: 'caf-04-govern-manage',
    title: 'CAF-04 Govern and Manage',
    description: 'Governance and management controls for cloud operations.',
    source: path.join(sourceRoot, '06-cloud-adoption', 'CAF-04-govern-manage.md')
  }
];

function stripFirstHeading(markdown) {
  return markdown.replace(/^#\s+.+\r?\n\r?\n/, '').trim();
}

for (const item of files) {
  if (!fs.existsSync(item.source)) {
    throw new Error(`Missing source file: ${item.source}`);
  }

  const raw = fs.readFileSync(item.source, 'utf8');
  const body = stripFirstHeading(raw);
  const outDir = path.join(astroRoot, item.category);
  const outPath = path.join(outDir, `${item.slug}.md`);

  fs.mkdirSync(outDir, { recursive: true });

  const rendered = `---\ntitle: ${item.title}\ndescription: ${item.description}\n---\n\n> Generated from canonical source: \`${path.relative(path.resolve(projectRoot, '..', 'docs'), item.source).replace(/\\/g, '/')}\`.\n\n${body}\n`;
  fs.writeFileSync(outPath, rendered, 'utf8');
}

const wafIndex = `---\ntitle: Well-Architected Framework\ndescription: K12 proposed architecture WAF assessments and execution guidance.\n---\n\nThis section contains the WAF-aligned documentation used by the IDP demo and implementation planning.\n`;
const cafIndex = `---\ntitle: Cloud Adoption Framework\ndescription: K12 cloud adoption strategy, planning, and governance artifacts.\n---\n\nThis section contains CAF-aligned documentation used by the IDP demo and migration planning.\n`;

fs.writeFileSync(path.join(astroRoot, 'waf', 'index.md'), wafIndex, 'utf8');
fs.writeFileSync(path.join(astroRoot, 'caf', 'index.md'), cafIndex, 'utf8');

console.log(`Synced ${files.length} CAF/WAF documents into Astro content.`);
