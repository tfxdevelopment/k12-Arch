---
agent: 'agent'
description: 'Create time-boxed technical spike documents for researching and resolving critical development decisions before implementation.'
tools: ['runCommands', 'runTasks', 'edit', 'search', 'extensions', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'todos', 'Microsoft Docs', 'search']
---

# Create Technical Spike Document

Create time-boxed technical spike documents for researching critical questions that must be answered before development can proceed. Each spike focuses on a specific technical decision with clear deliverables and timelines.

## Document Structure

Create individual files in `${input:FolderPath|docs/spikes}` directory. Name each file using the pattern: `[category]-[short-description]-spike.md` (e.g., `api-copilot-integration-spike.md`, `performance-realtime-audio-spike.md`).

```md
---
title: "${input:SpikeTitle}"
category: "${input:Category|Technical}"
status: "🔴 Not Started"
priority: "${input:Priority|High}"
timebox: "${input:Timebox|1 week}"
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
owner: "${input:Owner}"
tags: ["technical-spike", "${input:Category|technical}", "research"]
---

# ${input:SpikeTitle}

## Summary

**Spike Objective:** [Clear, specific question or decision that needs resolution]

**Why This Matters:** [Impact on development/architecture decisions]

**Timebox:** [How much time allocated to this spike]

**Decision Deadline:** [When this must be resolved to avoid blocking development]

## Research Question(s)

**Primary Question:** [Main technical question that needs answering]

**Secondary Questions:**

- [Related question 1]
- [Related question 2]
- [Related question 3]

## Investigation Plan

### Research Tasks

- [ ] [Specific research task 1]
- [ ] [Specific research task 2]
- [ ] [Specific research task 3]
- [ ] [Create proof of concept/prototype]
- [ ] [Document findings and recommendations]

### Success Criteria

**This spike is complete when:**

- [ ] [Specific criteria 1]
- [ ] [Specific criteria 2]
- [ ] [Clear recommendation documented]
- [ ] [Proof of concept completed (if applicable)]

## Technical Context

**Related Components:** [List system components affected by this decision]

**Dependencies:** [What other spikes or decisions depend on resolving this]

**Constraints:** [Known limitations or requirements that affect the solution]

## Research Findings

### Investigation Results

[Document research findings, test results, and evidence gathered]

### Prototype/Testing Notes

[Results from any prototypes, spikes, or technical experiments]

### External Resources

- [Link to relevant documentation]
- [Link to API references]
- [Link to community discussions]
- [Link to examples/tutorials]

## Decision

### Recommendation

[Clear recommendation based on research findings]

### Rationale

[Why this approach was chosen over alternatives]

### Implementation Notes

[Key considerations for implementation]

### Follow-up Actions

- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Update architecture documents]
- [ ] [Create implementation tasks]

## Status History

| Date   | Status         | Notes                      |
| ------ | -------------- | -------------------------- |
| [Date] | 🔴 Not Started | Spike created and scoped   |
| [Date] | 🟡 In Progress | Research commenced         |
| [Date] | 🟢 Complete    | [Resolution summary]       |

---

_Last updated: [Date] by [Name]_
```

## Categories for Technical Spikes

### API Integration

- Third-party API capabilities and limitations
- Integration patterns and authentication
- Rate limits and performance characteristics

### Architecture & Design

- System architecture decisions
- Design pattern applicability
- Component interaction models

### Performance & Scalability

- Performance requirements and constraints
- Scalability bottlenecks and solutions
- Resource utilization patterns

### Platform & Infrastructure

- Platform capabilities and limitations
- Infrastructure requirements
- Deployment and hosting considerations

### Security & Compliance

- Security requirements and implementations
- Compliance constraints
- Authentication and authorization approaches

### User Experience

- User interaction patterns
- Accessibility requirements
- Interface design decisions
