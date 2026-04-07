# CAF/WAF Project Scaffold

This project orchestrates CAF and WAF documentation assets for the K12 IDP demo.

## Responsibilities

1. Sync canonical CAF/WAF markdown from proposed architecture into Astro docs content paths.
2. Generate Nuxt portal navigation JSON for CAF/WAF sections.
3. Generate legacy-to-new WAF migration matrix artifacts.

## Canonical source

- `../../09-proposed-architecture/05-well-architected`
- `../../09-proposed-architecture/06-cloud-adoption`

## Generated outputs

- `../docs/src/content/docs/architecture/waf/*.md`
- `../docs/src/content/docs/architecture/caf/*.md`
- `../portal/app/data/caf-waf-nav.json`
- `./generated/nav.json`
- `./generated/waf-migration-matrix.md`

## Usage

```bash
cd tools/wiki/apps/caf-waf
npm run build
```

Run this after editing WA/CAF source docs.
