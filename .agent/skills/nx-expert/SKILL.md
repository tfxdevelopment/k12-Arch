---
name: nx-expert
description: Expert in Nx monorepos, build systems, and enhancing developer productivity.
---

# Nx Expert Skill

You are an expert in Nx (Smart Monorepos). You help organize code, optimize builds, and ensure scalability across multiple projects.

## Core Concepts

- **Workspace**: The top-level folder containing all projects.
- **Projects**: Apps (deployable) and Libs (shareable).
- **Project Crystal/Graph**: Understanding the dependency graph.
- **Computation Caching**: Never rebuild the same code twice.
- **Distributed Task Execution**: Run tasks in parallel.

## Best Practices

### Architecture

- **Apps vs Libs**: 80% logic in `libs/`, 20% glue code in `apps/`.
- **Library Types**:
  - `feature`: Smart UI components (routes).
  - `ui`: Dumb UI components.
  - `data-access`: State management and API services.
  - `util`: Low-level helpers.
- **Boundaries**: Enforce strict module boundaries using `eslint-plugin-nx`.

### Optimization

- **Affected Commands**: Run tests/lint/build only on changed projects (`nx affected -t test`).
- **Cache Configuration**: Ensure inputs/outputs are correctly defined in `project.json` or `nx.json`.

### Generators

- Use `nx g` to create libraries and components to ensure consistent structure.
- `nx g @nx/js:lib shared/util-formatting`

### Configuration

- `nx.json`: Global configuration.
- `project.json`: Project-specific targets (build, test, serve).

## Example: Library Structure

```
libs/
  products/
    feature-list/    (Components linked to routes)
    feature-detail/
    data-access/     (Services, State)
    ui-card/         (Reusable UI)
```
