---
description: Define team roles, responsibilities, skills matrix, and working agreements
---

# Team Setup

Define the team structure for "$ARGUMENTS". Establish Scrum roles and responsibilities, create a skills matrix, identify capability gaps, and set working agreements.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` if it exists (for project charter and stakeholder context)

2. **Define Scrum roles and responsibilities:**
   - **Product Owner:**
     - Owns and prioritizes the product backlog
     - Defines acceptance criteria for user stories
     - Represents stakeholder interests
     - Makes scope and priority decisions
     - Availability commitment (e.g., accessible during sprint for clarifications)
   - **Scrum Master:**
     - Facilitates Scrum ceremonies
     - Removes impediments and blockers
     - Coaches team on Scrum practices
     - Shields team from external disruptions
     - Tracks and reports on team metrics
   - **Development Team:**
     - Cross-functional and self-organizing
     - Define team size (recommended 3-9 members)
     - List team members with their primary and secondary skill areas
     - Identify tech lead or architecture responsibilities if applicable

3. **Create skills matrix:**
   - Define key skill areas needed for the project (e.g., frontend, backend, infrastructure, testing, design, domain expertise)
   - For each team member, rate proficiency: expert, proficient, learning, none
   - Present as a team member x skill area grid
   - Identify bus factor risks (skills held by only one person)
   - Highlight cross-training opportunities

4. **Identify capability gaps and mitigation:**
   - Compare required skills against team matrix
   - For each gap, define mitigation strategy:
     - **Training:** internal knowledge sharing, courses, pair programming
     - **Hiring:** timeline and requirements for new team members
     - **External:** contractors, consultants, or partner teams
   - Prioritize gaps by impact on project delivery
   - Set target dates for closing critical gaps

5. **Set working agreements:**
   - **Core hours:** overlapping availability window for collaboration
   - **Response time expectations:** Slack (within X hours), email (within X hours), code reviews (within X hours)
   - **Code review SLAs:** maximum time to first review, approval requirements (e.g., 2 approvals)
   - **Tool usage:** which tools for what purpose, naming conventions, tagging standards
   - **Meeting etiquette:** cameras on/off, agenda required, notes published within X hours
   - **Work-in-progress limits:** maximum items per person, maximum items per sprint
   - **Definition of Ready:** criteria for stories entering a sprint
   - **Branching strategy:** trunk-based, GitFlow, or other — with naming conventions
   - **Documentation standards:** what gets documented, where, and when

6. **Write the artifact** — append to `.project/$ARGUMENTS/00-initiate.md` under a `## Team Setup` section:
   - **Scrum Roles** — PO, SM, Dev Team with named individuals and responsibilities
   - **Skills Matrix** — team member x skill area grid with proficiency levels
   - **Capability Gaps** — identified gaps, mitigation strategy, timeline
   - **Working Agreements** — core hours, response times, review SLAs, tool usage
   - **Definition of Ready** — criteria for story readiness

## Output

Team setup appended to `.project/$ARGUMENTS/00-initiate.md`. Present a summary highlighting:
- Team composition and role assignments
- Key capability gaps and mitigation plans
- Working agreements highlights (core hours, review SLAs, WIP limits)
