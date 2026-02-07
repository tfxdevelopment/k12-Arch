---
description: Implements the 6-phase Spec-Driven Workflow (Analyze, Design, Implement, Validate, Reflect, Handoff)
---

# Spec-Driven Development Workflow

This workflow enforces the 6-Phase Spec-Driven Development Loop.

## Phase 1: ANALYZE

1. **Check for Artifacts**:
   - Ensure `requirements.md` exists. If not, create it.
   - Ensure `design.md` exists. If not, create it.
   - Ensure `tasks.md` exists. If not, create it.

2. **Define Requirements**:
   - Read all provided code and documentation.
   - Update `requirements.md` with structured EARS notation requirements.
   - `WHEN [condition], THE SYSTEM SHALL [behavior]`

3. **Assess Confidence**:
   - Determine a confidence score (0-100%).
   - If Low Confidence (<66%), stop and perform research.

## Phase 2: DESIGN

1. **Technical Design**:
   - Update `design.md` with:
     - Architecture overview
     - Data flow diagrams (mermaid)
     - API contracts
     - Database schemas

2. **Implementation Plan**:
   - Update `tasks.md` with a detailed, step-by-step plan.
   - Identify dependencies.
   - Define test strategy.

// turbo
3. **Review**:

- Pause for user review of the design and plan.

## Phase 3: IMPLEMENT

1. **Execute Tasks**:
   - Follow `tasks.md` step-by-step.
   - Update `tasks.md` status as you progress.

2. **Code**:
   - Write clean, documented code.
   - Follow project conventions.

## Phase 4: VALIDATE

1. **Test**:
   - Run automated tests.
   - Create new tests if needed.

2. **Verify**:
   - manual verification steps.
   - Ensure all requirements in `requirements.md` are met.

## Phase 5: REFLECT

1. **Refactor**:
   - Improve code quality.
   - Address technical debt.

2. **Documentation**:
   - Update READMEs.
   - Ensure comments are up-to-date.

## Phase 6: HANDOFF

1. **Summary**:
   - Create a summary of changes.
   - Prepare PR description if applicable.
