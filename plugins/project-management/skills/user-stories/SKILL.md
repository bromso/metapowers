---
description: Write user stories with acceptance criteria following INVEST principles
---

# User Stories

Write detailed user stories for "$ARGUMENTS". Use the "As a / I want / So that" format, add Given/When/Then acceptance criteria, validate against the INVEST checklist, and split stories that are too large.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for charter and stakeholder context
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for vision, roadmap, and backlog)
   - Read `plugins/project-management/shared/user-story-template.md` for the standard story format
   - Read `plugins/project-management/shared/scrum-guide.md` for Scrum alignment

2. **Write stories in standard format:**
   - For each story (from the backlog, or created fresh if no backlog exists):
     - **As a** [specific persona — not just "user"], **I want** [concrete action], **so that** [measurable benefit]
   - Use personas identified in stakeholder mapping or charter
   - Ensure the "so that" clause expresses real user or business value
   - Avoid implementation details in the story statement — focus on the need, not the solution

3. **Add Given/When/Then acceptance criteria:**
   - Write 2-5 acceptance criteria per story using the Gherkin format:
     - **Given** [precondition or context]
     - **When** [action performed by the user]
     - **Then** [expected observable outcome]
   - Cover the happy path, key edge cases, and error scenarios
   - Make criteria specific and testable — avoid vague terms like "should work properly"
   - Include data examples where relevant (e.g., "Given a cart with 3 items totaling $45.00")

4. **Validate against INVEST checklist:**
   - For each story, check:
     - **Independent** — can be developed without depending on another story
     - **Negotiable** — details can be discussed; it is not a rigid specification
     - **Valuable** — delivers clear value to the user or business
     - **Estimable** — the team can reasonably estimate the effort
     - **Small** — can be completed within a single sprint
     - **Testable** — acceptance criteria are concrete enough to verify
   - Flag stories that fail any INVEST criterion and note what needs to change

5. **Add story details:**
   - **Priority:** Must / Should / Could / Won't (from backlog prioritization)
   - **Labels:** feature, bug, tech-debt, spike + component labels (frontend, backend, etc.)
   - **Dependencies:** other stories or external dependencies
   - **Size estimate:** story points using Fibonacci scale (1, 2, 3, 5, 8, 13) if known
   - **Epic:** parent epic from the backlog

6. **Split stories that are too large:**
   - Any story estimated at >13 points needs splitting
   - Splitting strategies:
     - **By workflow step:** split a multi-step process into individual steps
     - **By data variation:** handle one data type first, add others later
     - **By operation:** split CRUD into separate Create, Read, Update, Delete stories
     - **By persona:** if multiple users benefit, split by user type
     - **By acceptance criteria:** each complex criterion becomes its own story
   - After splitting, re-validate each new story against INVEST

7. **Write the artifact** — append to `.project/$ARGUMENTS/01-plan.md` under a `## User Stories` section:
   - **Stories** — each story with full format: statement, acceptance criteria, INVEST status, details
   - **Split Log** — stories that were split, the strategy used, and resulting stories
   - **INVEST Violations** — any remaining violations with notes on resolution
   - **Story Count Summary** — total stories, by priority, by epic, by size

## Output

User stories appended to `.project/$ARGUMENTS/01-plan.md`. Present a summary highlighting:
- Total number of stories written
- Stories passing all INVEST criteria vs. those with violations
- Stories that were split and why
- Distribution by priority and size estimate
