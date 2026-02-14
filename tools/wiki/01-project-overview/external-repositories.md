# External Repositories

This workspace contains the architecture wiki and supporting artifacts. The solution source code lives in separate repositories.

## Azure DevOps Project

- Project: https://dev.azure.com/CFI-AzureDevOps/K12

## Repositories

> Notes:
> - Repo links are intended to be canonical and workspace-independent.
> - If a repo name changes, update it here and link to this page from elsewhere.

### Backend

- **k12-api-enrollment** (primary backend API)
  - Repo: https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-api-enrollment
  - Clone: `git clone https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-api-enrollment`

- **k12-infra** (Terraform)
  - Repo: https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-infra
  - Clone: `git clone https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-infra`

- **k12-test-api-postman** (Postman/Newman)
  - Repo: https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-test-api-postman
  - Clone: `git clone https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-test-api-postman`

### Frontend

- **k12-web-enrollment** (Angular + Nx)
  - Repo: https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-web-enrollment
  - Clone: `git clone https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-web-enrollment`

## How links should work

- Prefer linking to this page instead of using fragile relative links like `../../k12-api-enrollment/README.md`.
- If you need a deep link, link to the repo URL plus the path (or use the repo’s own docs navigation).
