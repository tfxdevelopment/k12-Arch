---
agent: 'agent'
description: 'Diagnose Azure resource health issues and provide remediation steps'
---
# Azure Resource Health Diagnostics

Diagnose the health and performance issues for Azure resources.

## Diagnostic Steps

1. **Resource Status**: Check current health status and any active incidents
2. **Metrics Analysis**: Review key performance metrics for anomalies
3. **Activity Logs**: Examine recent operations and changes
4. **Diagnostic Logs**: Analyze application and platform logs
5. **Dependency Health**: Check health of connected resources

## Common Issues to Check

- Connectivity problems
- Performance degradation
- Configuration drift
- Quota limitations
- Regional outages
- Authentication failures

## Output Format

For each issue found:
- **Symptom**: What is observed
- **Root Cause**: Likely cause of the issue
- **Impact**: Severity and affected components
- **Remediation**: Step-by-step fix instructions
- **Prevention**: How to prevent recurrence

Provide Azure CLI or PowerShell commands where applicable.
