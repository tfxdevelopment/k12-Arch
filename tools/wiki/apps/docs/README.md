# K12 Docs Site (Custom IDP Docs)

This is a **documentation site** built with **Astro + Starlight**.

It is part of the **custom Internal Developer Portal** effort (NOT Backstage).

## Intended Content Sources

We have multiple markdown sources in this repo today:

- `wiki/` (canonical enterprise wiki)
- `tools/wiki/` (tooling sandbox + copies/derivatives)

This app will ultimately render **curated documentation** (either by copying content into `src/content/docs/` or generating it during build).

## Local Development

```bash
cd tools/wiki/apps/docs
npm install
npm run dev
```

Default: http://localhost:4321

## Production Build

```bash
npm run build
npm run preview
```

## Planned Work

- Replace sample Starlight content with K12 docs content
- Decide ingestion strategy:
  - **Option A**: Copy/sync `wiki/` into `src/content/docs/` (simplest)
  - **Option B**: Generate docs from `wiki/` at build time
  - **Option C**: Runtime fetch from `src/K12.Docs.Api` (more dynamic)
- Align navigation with `wiki/TABLE_OF_CONTENTS.md`
- Add search (Starlight search + optional Pagefind)
