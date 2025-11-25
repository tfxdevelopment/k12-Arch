# ADR-004: Nx Monorepo for Frontend Applications

**Status:** Accepted
**Date:** 2024-08-05
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur), K12 Frontend Team
**Technical Story:** Frontend architecture for 4 related Angular applications with shared code

## Context and Problem Statement

The K12 MyPortal system requires four distinct frontend applications serving different user roles:
- **Admin Portal** (port 4200) - SEAA administrators and CFI support staff
- **Enrollment Portal** (port 4300) - Parents/guardians submitting applications
- **Provider Portal** (port 4500) - Education providers (schools, service providers)
- **Schools Portal** (port 4600) - School administrators and staff

All four applications share significant code:
- Authentication/authorization logic (Entra ID B2C integration)
- Common UI components (forms, tables, modals, navigation)
- Shared services (API clients, state management, utilities)
- Design system and styling (Material Design customization)
- Business logic and validation rules
- Type definitions and models

The question is: how should we structure and manage these four related applications?

## Decision Drivers

* **Code Reuse**: Maximize sharing of common code across all 4 applications
* **Developer Experience**: Enable efficient development across multiple apps
* **Build Performance**: Fast builds and incremental compilation
* **Atomic Changes**: Make changes to shared code and consuming apps simultaneously
* **Independent Deployment**: Each app deploys independently to Azure Static Web Apps
* **Type Safety**: Ensure type safety across shared code boundaries
* **Maintainability**: Clear dependency graph and impact analysis
* **Consistency**: Enforce consistent tooling, linting, and testing across all apps

## Considered Options

1. **Nx Monorepo** - Integrated monorepo with build caching and dependency management
2. **Separate Repositories** - Individual repos for each application
3. **Angular Workspace** - Standard Angular multi-project workspace
4. **Lerna Monorepo** - Generic JavaScript monorepo tool

## Decision Outcome

**Chosen option:** "Nx Monorepo", because it provides:
1. Intelligent build caching across all apps (3-10x faster builds)
2. Clear dependency graph with impact analysis
3. Shared library pattern with enforced boundaries
4. Independent deployment of each application
5. Excellent developer experience with integrated tooling
6. Supports both Angular apps and shared libraries
7. Atomic commits across multiple apps and shared code

### Consequences

#### Good
- Shared library (`projects/shared/`) contains all common code
- Build caching dramatically improves CI/CD performance
- Dependency graph shows impact of changes across apps
- Single set of dependencies and tooling versions
- Easy to make atomic changes across apps (e.g., update API client + all consuming apps)
- Code generation tools integrated (`nx generate`)
- Excellent VS Code integration with Nx Console
- All apps use same Angular version, Material Design version, etc.
- Easy to enforce architectural boundaries and module dependencies

#### Bad
- **Critical workflow dependency**: Shared library must be built before any app can run
- Changes to shared library require rebuilding the library + restarting dev servers
- Initial learning curve for developers new to Nx
- Build complexity higher than separate repos
- Git merge conflicts can affect multiple apps
- Larger repository size and clone time

#### Neutral
- All developers need to understand monorepo patterns
- Need clear guidelines for what goes in shared vs app-specific code
- Requires discipline to maintain clean module boundaries

## Pros and Cons of the Options

### Nx Monorepo (Chosen)

* **Pro:** Intelligent build caching (3-10x faster)
* **Pro:** Dependency graph and impact analysis
* **Pro:** Atomic commits across apps and shared code
* **Pro:** Enforced module boundaries and architecture
* **Pro:** Single source of truth for dependencies
* **Pro:** Consistent tooling, linting, testing
* **Pro:** Excellent IDE support (Nx Console)
* **Pro:** Built-in code generation and scaffolding
* **Pro:** Incremental builds (only rebuild what changed)
* **Pro:** CI/CD optimization with affected command
* **Con:** Shared library must be built first (critical workflow)
* **Con:** Learning curve for Nx-specific concepts
* **Con:** Build complexity higher than separate repos
* **Con:** Repository size grows with all 4 apps

### Separate Repositories

* **Pro:** Complete isolation between apps
* **Pro:** Simpler CI/CD per app
* **Pro:** No shared library build dependency
* **Pro:** Smaller repositories
* **Con:** Code duplication across repos
* **Con:** Difficult to make atomic changes
* **Con:** Dependency version drift between apps
* **Con:** No shared build caching
* **Con:** Harder to maintain consistency
* **Con:** Need to publish shared code as npm packages
* **Con:** Versioning and publishing overhead

### Angular Workspace (Standard)

* **Pro:** Built into Angular CLI
* **Pro:** Multiple projects in one repo
* **Pro:** Shared tsconfig and tooling
* **Con:** No build caching
* **Con:** No dependency graph analysis
* **Con:** No affected command for CI optimization
* **Con:** Limited tooling compared to Nx
* **Con:** Slower builds (everything rebuilds)
* **Con:** Less sophisticated than Nx

### Lerna Monorepo

* **Pro:** Generic JavaScript monorepo tool
* **Pro:** Works with any framework
* **Pro:** Package publishing support
* **Con:** Not Angular-specific
* **Con:** No build caching (without additional tooling)
* **Con:** Manual configuration required
* **Con:** Less integrated than Nx for Angular
* **Con:** Lerna development has slowed down

## Technical Details

### Repository Structure

```
k12-web-enrollment/
├── apps/
│   ├── admin/                    # Admin Portal (4200)
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.app.json
│   ├── enrollment/               # Enrollment Portal (4300)
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.app.json
│   ├── providers/                # Provider Portal (4500)
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.app.json
│   └── schools/                  # Schools Portal (4600)
│       ├── src/
│       ├── project.json
│       └── tsconfig.app.json
├── projects/
│   └── shared/                   # Shared library (MUST BUILD FIRST)
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/   # Shared UI components
│       │   │   ├── services/     # API clients, utilities
│       │   │   ├── models/       # TypeScript interfaces
│       │   │   ├── guards/       # Route guards
│       │   │   ├── interceptors/ # HTTP interceptors
│       │   │   └── directives/   # Shared directives
│       │   └── public-api.ts     # Public exports
│       ├── project.json
│       └── tsconfig.lib.json
├── nx.json                       # Nx configuration
├── package.json                  # Dependencies for all apps
└── tsconfig.base.json            # Base TypeScript config
```

### Critical Developer Workflow

**First-time setup:**
```bash
# Clone repository
git clone https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-web-enrollment

# Install dependencies
npm install

# Build shared library (REQUIRED BEFORE RUNNING ANY APP)
nx build shared

# Now run any application
nx serve admin      # http://localhost:4200
nx serve enrollment # http://localhost:4300
nx serve providers  # http://localhost:4500
nx serve schools    # http://localhost:4600
```

**When shared library changes:**
```bash
# 1. Make changes to projects/shared/

# 2. Rebuild shared library
nx build shared

# 3. Restart dev server for app you're working on
# Press Ctrl+C to stop, then:
nx serve admin
```

### Nx Configuration

**nx.json:**
```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test"],
        "parallel": 3
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "test": {
      "cache": true
    }
  },
  "affected": {
    "defaultBase": "main"
  }
}
```

**Dependency Configuration (project.json for admin app):**
```json
{
  "name": "admin",
  "sourceRoot": "apps/admin/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@angular-devkit/build-angular:browser",
      "options": {
        "outputPath": "dist/apps/admin",
        "index": "apps/admin/src/index.html",
        "main": "apps/admin/src/main.ts",
        "tsConfig": "apps/admin/tsconfig.app.json"
      },
      "configurations": {
        "production": {
          "budgets": [
            {
              "type": "initial",
              "maximumWarning": "2mb",
              "maximumError": "5mb"
            }
          ]
        }
      }
    },
    "serve": {
      "executor": "@angular-devkit/build-angular:dev-server",
      "options": {
        "browserTarget": "admin:build",
        "port": 4200
      }
    }
  },
  "implicitDependencies": ["shared"]
}
```

### Shared Library Structure

**projects/shared/src/public-api.ts:**
```typescript
// Components
export * from './lib/components/data-table/data-table.component';
export * from './lib/components/status-badge/status-badge.component';
export * from './lib/components/file-upload/file-upload.component';

// Services
export * from './lib/services/api/enrollment-api.service';
export * from './lib/services/api/student-api.service';
export * from './lib/services/auth/auth.service';
export * from './lib/services/storage/local-storage.service';

// Models
export * from './lib/models/student.model';
export * from './lib/models/application.model';
export * from './lib/models/household.model';

// Guards
export * from './lib/guards/auth.guard';
export * from './lib/guards/role.guard';

// Interceptors
export * from './lib/interceptors/auth.interceptor';
export * from './lib/interceptors/error.interceptor';
```

**Usage in applications:**
```typescript
// apps/admin/src/app/features/students/students.component.ts
import { Component } from '@angular/core';
import {
  StudentApiService,
  Student,
  DataTableComponent
} from 'projects/shared/src/public-api';

@Component({
  selector: 'app-students',
  template: `
    <shared-data-table
      [data]="students"
      [columns]="columns"
      (rowClick)="onStudentClick($event)">
    </shared-data-table>
  `
})
export class StudentsComponent {
  students: Student[] = [];

  constructor(private studentApi: StudentApiService) {}

  ngOnInit() {
    this.studentApi.getStudents().subscribe(
      students => this.students = students
    );
  }
}
```

### Build Caching Example

**Without caching (every build):**
```bash
> nx build admin
Building admin... (60s)
Building shared... (30s)
Total: 90s
```

**With caching (cached builds):**
```bash
> nx build admin
Building admin... (60s)
Building shared... (cache hit, 1s)
Total: 61s

# Second build with no changes
> nx build admin
Building admin... (cache hit, 2s)
Building shared... (cache hit, 1s)
Total: 3s
```

### Dependency Graph

**View dependency graph:**
```bash
nx graph
```

**Example output:**
```
┌─────────────┐
│   shared    │
└─────────────┘
       │
       ├─────────────────────────────┬─────────────┬─────────────┐
       │                             │             │             │
┌─────────────┐              ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    admin    │              │ enrollment  │ │  providers  │ │   schools   │
└─────────────┘              └─────────────┘ └─────────────┘ └─────────────┘
```

### CI/CD Optimization with Affected Command

**Azure DevOps Pipeline (azure-pipelines.yml):**
```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: npm ci
  displayName: 'Install dependencies'

- script: |
    # Only build affected projects
    npx nx affected:build --base=origin/main --head=HEAD --parallel=3
  displayName: 'Build affected apps'

- script: |
    # Only test affected projects
    npx nx affected:test --base=origin/main --head=HEAD --parallel=3
  displayName: 'Test affected apps'

- script: |
    # Only lint affected projects
    npx nx affected:lint --base=origin/main --head=HEAD --parallel=3
  displayName: 'Lint affected apps'

# Deploy each app independently
- script: |
    if npx nx affected:apps --base=origin/main --head=HEAD --plain | grep -q "admin"; then
      echo "##vso[task.setvariable variable=deployAdmin]true"
    fi
  displayName: 'Check if admin needs deploy'

- task: AzureCLI@2
  condition: eq(variables.deployAdmin, 'true')
  inputs:
    azureSubscription: 'Azure Gov Subscription'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az staticwebapp upload \
        --name k12-admin-portal \
        --resource-group k12-prod-rg \
        --source dist/apps/admin
  displayName: 'Deploy Admin Portal'
```

### Module Boundaries

**Enforce architectural boundaries (.eslintrc.json):**
```json
{
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "type:app",
                "onlyDependOnLibsWithTags": ["type:shared", "type:ui"]
              },
              {
                "sourceTag": "type:shared",
                "onlyDependOnLibsWithTags": ["type:shared"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### Code Generation

**Generate new component in shared library:**
```bash
nx generate @angular/core:component \
  --name=custom-button \
  --project=shared \
  --export=true
```

**Generate new feature module in app:**
```bash
nx generate @angular/core:module \
  --name=reports \
  --project=admin \
  --routing=true
```

### Performance Metrics

**Build times (clean build):**
| Scenario | Time (without Nx) | Time (with Nx) | Improvement |
|----------|-------------------|----------------|-------------|
| Build all apps (first time) | 240s | 180s | 25% |
| Build all apps (cached) | 240s | 15s | 94% |
| Build 1 app after shared change | 90s | 61s | 32% |
| Build 1 app (no changes) | 60s | 3s | 95% |

**CI/CD optimization:**
- **Before Nx:** Every PR builds all 4 apps = 240s
- **After Nx:** Only build affected apps = 60-180s average (50-75% faster)

## Validation

Success will be measured by:
- All 4 applications successfully built and deployed independently
- Build caching reduces CI/CD time by >50%
- Developers can run any app after building shared library
- No code duplication between apps (DRY principle)
- Consistent tooling and versions across all apps
- Clear dependency graph shows impact of changes
- All developers comfortable with Nx workflow within 2 weeks

## Related Decisions

* [ADR-007: Angular 19 Framework](ADR-007-angular-19-framework.md) - Framework choice for all apps
* [ADR-003: Entra ID B2C for CIAM](ADR-003-entra-id-b2c-ciam.md) - Authentication shared across all apps

## Implementation Notes

**Key Workflow Rules:**
1. Always build `shared` library first before running any app
2. After changes to `shared`, rebuild it and restart dev servers
3. Use `nx affected` commands in CI/CD to optimize builds
4. Keep shared library lean - only truly shared code belongs there
5. Each app can have its own app-specific services and components

**Common Pitfalls:**
- Forgetting to build shared library before running app (results in build errors)
- Forgetting to restart dev server after shared library changes (results in stale code)
- Putting app-specific code in shared library (creates unnecessary dependencies)
- Not using `nx affected` in CI/CD (wastes build time)

## References

* [Nx Documentation](https://nx.dev/)
* [Nx with Angular](https://nx.dev/getting-started/intro)
* [Nx Build Caching](https://nx.dev/core-features/cache-task-results)
* [Nx Dependency Graph](https://nx.dev/core-features/explore-graph)
* [Nx CI/CD Optimization](https://nx.dev/ci/intro/ci-with-nx)
* [Angular in Monorepo](https://angular.io/guide/file-structure#multiple-projects)

---

**Decision Made:** August 5, 2024
**Implemented:** August 2024
**Repository:** https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-web-enrollment
