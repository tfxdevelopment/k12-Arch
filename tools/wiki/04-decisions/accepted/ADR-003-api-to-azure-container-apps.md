# ADR-003: Migrate Enrollment API to Azure Container Apps (ACA)

Status: Proposed
Date: 2025-12-24

## Context
Enrollment APIs are Azure Functions today behind APIM. We plan to run APIs in ACA for better container parity with Nx apps and Dapr enablement.

## Decision
Containerize the API (Functions → containerized host) and deploy to ACA. Enable Dapr sidecar only for API. Keep APIM in production path; bypass APIM locally.

## Rationale
- Parity: Same container model across web and API.
- Dapr: Native ACA support simplifies service invocation and state.
- Control: Health probes, scaling policies, and blue/green deployments with ACA.

## Consequences
- Requires containerization effort for Functions.
- Pipeline updates for image build/push and ACA deploy.

## Alternatives
- Keep Functions on Consumption/Elastic Premium (less parity, harder Dapr).
- AKS (more ops overhead).

## References
- Azure Container Apps documentation
- Dapr on ACA docs
