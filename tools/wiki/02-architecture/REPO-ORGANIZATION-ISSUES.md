# Repository Organization Issues

This page captures the current repo organization issues that make it hard to find and maintain information.

## 1) Unclear entry points

- The root README is currently not a navigation guide.
- The wiki has strong structure, but readers still struggle to know which document is authoritative for a given topic.

### Fix

- Make the root README a “start here” page.
- Add a curated “project structure” and “migration” navigation cluster under `wiki/02-architecture/`.

## 2) Cross-repo links are common and often not resolvable in this workspace

Many wiki pages link to paths like `../../k12-api-enrollment/README.md`, but those repos are not vendored here.

### Fix

- Replace fragile relative cross-repo links with:
  - canonical repo URLs, or
  - a dedicated “External Repositories” page with clone instructions.

## 3) Generated aggregate documents are hard to work with

- `wiki/wikifull.md` is useful as an export artifact, but it is not a good primary navigation surface.

### Fix

- Treat `wiki/wikifull.md` as an archive/source.
- Keep curated pages as the source of truth and link to `wikifull.md` only for deep reference.

## 4) Solutions reference missing project files

- `K12.Aspire.sln` references projects under `src/` (e.g., `src\K12.AppHost\K12.AppHost.csproj`) that are currently missing.
- `K12.sln` currently contains no projects.

### Fix

- Scaffold the missing projects under `src/` and make `K12.sln` the main solution.

## 5) Build configuration is not discoverable by default

- `build/global.json`, `build/Directory.Build.props`, and `build/Directory.Packages.props` exist, but new projects under `src/` won’t automatically inherit them unless the files are present at repo root (or imported).

### Fix

- Add root-level `global.json`, `Directory.Build.props`, and `Directory.Packages.props` that forward to `build/`.

## 6) Non-portable absolute paths appear in docs

Some docs reference local paths like `c:/Projects/...` which makes copy/paste and link navigation unreliable.

### Fix

- Normalize to repo-relative paths and avoid drive letters.

## Next Work

- Add a single “How to find information” section to the root README.
- Create a short “docs taxonomy” index that points to the authoritative page for each major topic.
