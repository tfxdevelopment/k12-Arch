import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const nav = {
  generatedAt: new Date().toISOString(),
  sections: [
    {
      id: 'waf',
      label: 'Well-Architected',
      items: [
        { id: 'wa-01', label: 'WA-01 Reliability', portalPath: '/docs/architecture/waf/wa-01-reliability/' },
        { id: 'wa-02', label: 'WA-02 Security', portalPath: '/docs/architecture/waf/wa-02-security/' },
        { id: 'wa-03', label: 'WA-03 Cost Optimization', portalPath: '/docs/architecture/waf/wa-03-cost-optimization/' },
        { id: 'wa-04', label: 'WA-04 Operational Excellence', portalPath: '/docs/architecture/waf/wa-04-operational-excellence/' },
        { id: 'wa-05', label: 'WA-05 Performance Efficiency', portalPath: '/docs/architecture/waf/wa-05-performance-efficiency/' }
      ]
    },
    {
      id: 'caf',
      label: 'Cloud Adoption',
      items: [
        { id: 'caf-01', label: 'CAF-01 Strategy', portalPath: '/docs/architecture/caf/caf-01-strategy/' },
        { id: 'caf-02', label: 'CAF-02 Plan', portalPath: '/docs/architecture/caf/caf-02-plan/' },
        { id: 'caf-03', label: 'CAF-03 Adopt', portalPath: '/docs/architecture/caf/caf-03-adopt/' },
        { id: 'caf-04', label: 'CAF-04 Govern and Manage', portalPath: '/docs/architecture/caf/caf-04-govern-manage/' }
      ]
    }
  ]
};

const generatedDir = path.join(projectRoot, 'generated');
const portalDataDir = path.resolve(projectRoot, '..', 'portal', 'app', 'data');

fs.mkdirSync(generatedDir, { recursive: true });
fs.mkdirSync(portalDataDir, { recursive: true });

const payload = JSON.stringify(nav, null, 2);
fs.writeFileSync(path.join(generatedDir, 'nav.json'), payload, 'utf8');
fs.writeFileSync(path.join(portalDataDir, 'caf-waf-nav.json'), payload, 'utf8');

console.log('Generated CAF/WAF navigation for portal and scaffold outputs.');
