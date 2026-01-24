---
agent: 'agent'
description: 'Analyze Azure resources for cost optimization opportunities'
---
# Azure Cost Optimization Analysis

Analyze the Azure infrastructure for cost optimization opportunities.

## Analysis Areas

1. **Right-sizing**: Identify over-provisioned VMs, databases, and services
2. **Reserved Instances**: Find candidates for 1-year or 3-year reservations
3. **Spot Instances**: Identify workloads suitable for spot VMs
4. **Storage Optimization**: Review storage tiers and lifecycle policies
5. **Unused Resources**: Find orphaned disks, IPs, and unused services
6. **Dev/Test Pricing**: Identify resources eligible for dev/test discounts

## Output Format

For each recommendation:
- Current configuration and cost
- Recommended change
- Estimated monthly savings
- Implementation complexity (Low/Medium/High)
- Risk assessment

## Priority

Focus on:
- Quick wins with minimal risk
- High-impact changes with clear ROI
- Long-term cost governance improvements
