---
description: Define project purpose, scope, objectives, constraints, and success criteria
---

# Project Charter

Define the project charter for "$ARGUMENTS". Establish the project's purpose and vision, set measurable objectives, define scope boundaries, identify constraints and assumptions, and outline an initial timeline with milestones.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read shared context:**
   - Read `plugins/project-management/shared/project-charter-template.md` for charter structure
   - Read `plugins/project-management/shared/scrum-guide.md` for Scrum alignment
   - Read `.project/$ARGUMENTS/00-initiate.md` if it exists (to avoid overwriting other sections)

2. **Define project purpose and vision:**
   - Articulate the problem being solved and why it matters now
   - Write a clear, concise vision statement (1-2 sentences)
   - Identify the target users or beneficiaries
   - State the expected business value or impact

3. **Set measurable objectives:**
   - Define 3-5 SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)
   - For each objective: metric, baseline, target, target date
   - Distinguish between primary objectives (must-achieve) and stretch goals
   - Ensure objectives ladder up to the vision

4. **Define scope — in and out:**
   - **In scope:** features, deliverables, and capabilities included
   - **Out of scope:** explicitly excluded items to prevent scope creep
   - **Deferred:** items intentionally pushed to future phases
   - Document the rationale for each scope decision

5. **Identify constraints and assumptions:**
   - **Constraints:** budget, timeline, technology, regulatory, staffing
   - **Assumptions:** market conditions, dependencies, resource availability
   - **Dependencies:** external teams, third-party services, approvals needed
   - Flag high-risk assumptions that need early validation

6. **Outline high-level timeline and milestones:**
   - Define major milestones with target dates
   - Identify the critical path and key decision points
   - Map milestones to sprint boundaries where possible
   - Include go/no-go checkpoints

7. **Initial risk identification:**
   - Brainstorm top 5-10 risks using categories: technical, schedule, resource, external
   - For each risk: likelihood (high/medium/low), impact (high/medium/low), mitigation strategy
   - Identify risk owners where possible
   - Flag risks that could be project-ending

8. **Write the artifact** — append to `.project/$ARGUMENTS/00-initiate.md` under a `## Project Charter` section:
   - **Vision** — problem statement, vision, target users
   - **Objectives** — SMART objectives table with metrics and targets
   - **Scope** — in-scope, out-of-scope, deferred items
   - **Constraints & Assumptions** — categorized list with risk flags
   - **Milestones** — timeline with key dates and checkpoints
   - **Initial Risks** — risk register with likelihood, impact, mitigation

## Output

Project charter appended to `.project/$ARGUMENTS/00-initiate.md`. Present a summary highlighting:
- Project purpose and vision statement
- Top 3 objectives with target metrics
- Key scope decisions (what's in vs. out)
