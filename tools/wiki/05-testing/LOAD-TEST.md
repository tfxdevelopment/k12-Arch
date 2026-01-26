# LOAD-TEST: Load Testing (Right-Sizing Data Source)

**Status:** Draft
**Last updated:** 2026-01-20

## Purpose
Provide a single place to document load testing assumptions, scenarios, and the evidence used to right-size infrastructure.

This file is linked from cost and reliability documents and should remain stable.

## Scope
- Target workloads (peak enrollment, batch processing)
- Test scenarios and acceptance criteria
- Tooling and environment
- Results summary and where raw artifacts live

## Workload assumptions
- Peak enrollment usage periods
- Concurrency targets and traffic mix
- Key user journeys to model

## Scenarios
- Authentication + application submission flow
- Read-heavy portal browsing
- Background processing and messaging

## Acceptance criteria
- Latency percentiles (p50/p95/p99)
- Error rate
- Scaling behavior (KEDA / Container Apps)
- Database saturation thresholds

## Tooling
- Document the harness/tool (k6, JMeter, etc.) and how to run it.
- Link to scripts/artifacts under a stable folder (for example: `scripts/loadtest/`).

## Results
- Summarize the latest agreed-upon results and link to raw outputs.

## References
- Proposed architecture: [wiki/09-proposed-architecture](./../09-proposed-architecture)
