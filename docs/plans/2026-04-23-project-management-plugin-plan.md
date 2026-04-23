# Project Management Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a 32-skill project management plugin implementing the Scrum framework, plus documentation in apps/docs.

**Architecture:** Claude Code plugin following the metapowers pattern — SKILL.md files with YAML frontmatter, shared templates, hooks for phase gating, MCP config for Linear/Jira. Documentation as MDX pages in Fumadocs.

**Tech Stack:** Markdown (SKILL.md), Bash (hooks), JSON (manifests), MDX (docs)

---

### Task 1: Plugin scaffold — manifest, hooks, MCP config

**Files:**
- Create: `plugins/project-management/.claude-plugin/plugin.json`
- Create: `plugins/project-management/.mcp.json`
- Create: `plugins/project-management/hooks/hooks.json`
- Create: `plugins/project-management/hooks/check-initiate-exists.sh`
- Modify: `.claude-plugin/marketplace.json`

**Step 1: Create directories**

```bash
mkdir -p plugins/project-management/.claude-plugin plugins/project-management/hooks plugins/project-management/shared plugins/project-management/skills plugins/project-management/commands plugins/project-management/agents
```

**Step 2: Create plugin.json**

Write `plugins/project-management/.claude-plugin/plugin.json`:
```json
{
  "name": "project-management",
  "version": "0.1.0",
  "description": "Scrum-based project management — initiate, plan, sprint, review, improve with 32 skills",
  "author": {
    "name": "Jonas Broms"
  },
  "repository": "https://github.com/bromso/metapowers",
  "license": "MIT",
  "skills": "../skills/",
  "commands": "../commands/",
  "agents": "../agents/",
  "hooks": "../hooks/hooks.json",
  "mcpServers": "../.mcp.json"
}
```

**Step 3: Create .mcp.json**

Write `plugins/project-management/.mcp.json`:
```json
{
  "mcpServers": {
    "metapowers-pm": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/../../packages/pm-mcp/dist/index.js"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

**Step 4: Create hooks.json**

Write `plugins/project-management/hooks/hooks.json`:
```json
{
  "hooks": {}
}
```

**Step 5: Create check-initiate-exists.sh**

Write `plugins/project-management/hooks/check-initiate-exists.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${PM_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .project/<name>/ directories to infer current project
PROJECT_DIR=$(find .project -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$PROJECT_DIR" ]]; then
  echo "BLOCKED: No .project/ directory found. Run /pm:project-charter first." >&2
  exit 1
fi

PROJECT=$(basename "$PROJECT_DIR")
INITIATE_FILE=".project/${PROJECT}/00-initiate.md"

if [[ ! -f "$INITIATE_FILE" ]]; then
  echo "BLOCKED: ${INITIATE_FILE} not found." >&2
  echo "" >&2
  echo "The Initiate phase must be completed before running this skill." >&2
  echo "Run an Initiate skill first (e.g., /pm:project-charter ${PROJECT})" >&2
  echo "" >&2
  echo "To bypass: export PM_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
```

Make executable: `chmod +x plugins/project-management/hooks/check-initiate-exists.sh`

**Step 6: Register in marketplace.json**

Add to the `plugins` array in `.claude-plugin/marketplace.json`:
```json
{
  "name": "project-management",
  "source": "./plugins/project-management",
  "description": "Scrum-based project management — initiate, plan, sprint, review, improve with 32 skills",
  "version": "0.1.0",
  "keywords": ["project-management", "scrum", "agile", "sprint", "retrospective", "planning"],
  "category": "project-management"
}
```

**Step 7: Commit**

```bash
git add plugins/project-management/ .claude-plugin/marketplace.json
git commit -m "feat(pm): scaffold plugin with manifest, hooks, and MCP config"
```

---

### Task 2: Shared templates

**Files:**
- Create: `plugins/project-management/shared/scrum-guide.md`
- Create: `plugins/project-management/shared/project-charter-template.md`
- Create: `plugins/project-management/shared/user-story-template.md`
- Create: `plugins/project-management/shared/retrospective-formats.md`

**Step 1: Create scrum-guide.md**

Write `plugins/project-management/shared/scrum-guide.md`:
```markdown
# Scrum Framework

Scrum is a lightweight agile framework for developing, delivering, and sustaining complex products. It employs an iterative, incremental approach to optimize predictability and control risk.

## Scrum Values

- **Commitment:** Team commits to achieving sprint goals
- **Focus:** Everyone focuses on the sprint work and team goals
- **Openness:** Team and stakeholders are open about work and challenges
- **Respect:** Team members respect each other's capabilities and independence
- **Courage:** Team has courage to do the right thing and work on tough problems

## Roles

### Product Owner
Responsible for maximizing the value of the product and managing the Product Backlog. Single person, not a committee. Orders backlog items to best achieve goals.

### Scrum Master
Serves the team by removing impediments, facilitating events, and coaching on Scrum practices. Helps the organization adopt Scrum effectively.

### Development Team
Self-organizing, cross-functional group that delivers a potentially releasable Increment each Sprint. Optimal size: 3-9 members.

## Events

### Sprint
Time-box of 1-4 weeks (typically 2) during which a "Done" Increment is created. Consistent duration throughout development.

### Sprint Planning
Defines what can be delivered in the Sprint and how. Time-boxed to 8 hours for a one-month Sprint (proportionally less for shorter Sprints).

**Inputs:** Product Backlog, latest Increment, team capacity, past performance
**Outputs:** Sprint Goal, Sprint Backlog

### Daily Scrum (Standup)
15-minute daily event for the Development Team to inspect progress and adapt the plan. Same time, same place, every day.

**Three questions:** What did I do yesterday? What will I do today? What blockers do I have?

### Sprint Review
Held at the end of Sprint to inspect the Increment and adapt the Product Backlog. Time-boxed to 4 hours for a one-month Sprint.

**Attendees:** Scrum Team + stakeholders
**Activities:** Demo, feedback collection, backlog refinement

### Sprint Retrospective
The team inspects itself and creates a plan for improvements. Time-boxed to 3 hours for a one-month Sprint.

**Focus:** People, relationships, process, tools

## Artifacts

### Product Backlog
Ordered list of everything needed in the product. Single source of requirements. Owned by Product Owner. Continuously refined.

### Sprint Backlog
Set of Product Backlog items selected for the Sprint, plus the plan for delivering them. Owned by Development Team.

### Increment
Sum of all Product Backlog items completed during a Sprint plus all prior Increments. Must meet the Definition of Done.

### Definition of Done
Shared understanding of what "Done" means for each Increment. Ensures transparency and quality.
```

**Step 2: Create project-charter-template.md**

Write `plugins/project-management/shared/project-charter-template.md`:
```markdown
# Project Charter: [Project Name]

## Purpose & Vision
[Why does this project exist? What problem does it solve?]

## Objectives
| Objective | Measurable Outcome | Target Date |
|-----------|-------------------|-------------|
| | | |

## Success Criteria
| Criterion | Metric | Target |
|-----------|--------|--------|
| | | |

## Scope
### In Scope
- ...

### Out of Scope
- ...

## Stakeholders
| Name/Role | Interest | Influence | Communication Frequency |
|-----------|----------|-----------|------------------------|
| | | | |

## Team
| Role | Name | Availability |
|------|------|-------------|
| Product Owner | | |
| Scrum Master | | |
| Developer | | |

## Constraints & Assumptions
### Constraints
- ...

### Assumptions
- ...

## Timeline & Milestones
| Milestone | Target Date | Description |
|-----------|------------|-------------|
| | | |

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| | | | |

## Budget & Resources
| Item | Budget | Notes |
|------|--------|-------|
| | | |
```

**Step 3: Create user-story-template.md**

Write `plugins/project-management/shared/user-story-template.md`:
```markdown
# User Story Template

## Story Format
**As a** [type of user],
**I want** [action/feature],
**So that** [benefit/value].

## Acceptance Criteria
Use Given/When/Then format:

**Given** [precondition],
**When** [action],
**Then** [expected result].

## INVEST Checklist
- [ ] **Independent:** Can be developed and delivered independently
- [ ] **Negotiable:** Details can be negotiated between team and PO
- [ ] **Valuable:** Delivers clear value to the user or business
- [ ] **Estimable:** Team can estimate the effort required
- [ ] **Small:** Can be completed within a single sprint
- [ ] **Testable:** Has clear criteria to verify completion

## Story Details
| Field | Value |
|-------|-------|
| Priority | [Must/Should/Could/Won't] |
| Story Points | [1/2/3/5/8/13/21] |
| Sprint | [Sprint number] |
| Epic | [Parent epic] |
| Labels | [Feature/Bug/Tech Debt/Spike] |

## Definition of Done
- [ ] Code written and peer-reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Accepted by Product Owner
- [ ] Deployed to staging

## Notes
[Additional context, technical notes, dependencies, mockups]
```

**Step 4: Create retrospective-formats.md**

Write `plugins/project-management/shared/retrospective-formats.md`:
```markdown
# Retrospective Formats

## Start / Stop / Continue
**Best for:** General-purpose retrospectives, new teams
**Time:** 45-60 minutes

1. **Start:** What should we start doing? (5 min brainstorm, 5 min discuss)
2. **Stop:** What should we stop doing? (5 min brainstorm, 5 min discuss)
3. **Continue:** What should we keep doing? (5 min brainstorm, 5 min discuss)
4. **Action items:** Vote on top items, assign owners (10 min)

## 4Ls (Liked, Learned, Lacked, Longed For)
**Best for:** Balanced reflection, milestone retrospectives
**Time:** 60 minutes

1. **Liked:** What went well? What did you enjoy?
2. **Learned:** What did you learn? What surprised you?
3. **Lacked:** What was missing? What didn't we have enough of?
4. **Longed for:** What do you wish had happened? What would make things better?

## Sailboat
**Best for:** Visual thinkers, identifying risks and goals
**Time:** 45-60 minutes

- **Island (Goal):** Where are we trying to go?
- **Wind (Tailwinds):** What's pushing us forward?
- **Anchor (Drag):** What's slowing us down?
- **Rocks (Risks):** What dangers lie ahead?

Draw the sailboat on a whiteboard. Team places sticky notes on each element.

## Mad / Sad / Glad
**Best for:** Emotional check-in, after difficult sprints
**Time:** 30-45 minutes

1. **Mad:** What made you frustrated or angry?
2. **Sad:** What disappointed you?
3. **Glad:** What made you happy or proud?

Good for surfacing team morale issues.

## Timeline Retrospective
**Best for:** Long sprints, multi-sprint retrospectives, project post-mortems
**Time:** 60-90 minutes

1. Draw a timeline of the sprint/project on a whiteboard
2. Each team member adds events, feelings, and observations at relevant points
3. Walk through chronologically as a group
4. Identify patterns and themes
5. Generate action items from patterns

## Facilitation Tips

- **Time-box everything:** Set timers for each section
- **Silent brainstorming first:** Let everyone write before discussing
- **Dot voting:** Each person gets 3 votes to prioritize items
- **Action items:** Every retro must produce 1-3 specific, owned action items
- **Follow up:** Review last retro's action items at the start
- **Rotate facilitator:** Don't always have the same person run it
- **Safe space:** What's said in retro stays in retro
```

**Step 5: Commit**

```bash
git add plugins/project-management/shared/
git commit -m "feat(pm): add shared templates — Scrum guide, charter, user story, retro formats"
```

---

### Task 3: Phase 0 — Initiate skills (5 skills)

**Files:** Create 5 directories under `plugins/project-management/skills/`, each with `SKILL.md`.

**Skills to create:**

1. **project-charter/SKILL.md** — `description: Define project purpose, scope, objectives, constraints, and success criteria`
   - Prerequisites: None — first Initiate skill
   - Process: Define purpose and vision, set measurable objectives, scope in/out, identify constraints and assumptions, initial risk identification
   - Reads: `plugins/project-management/shared/project-charter-template.md`
   - Writes: `.project/$ARGUMENTS/00-initiate.md` under `## Project Charter`

2. **stakeholder-map/SKILL.md** — `description: Identify and map stakeholders by influence, interest, and communication needs`
   - Prerequisites: None
   - Process: Identify all stakeholders, classify by power/interest grid (Manage Closely, Keep Satisfied, Keep Informed, Monitor), define communication plan per stakeholder, map decision-making authority
   - Writes: `.project/$ARGUMENTS/00-initiate.md` under `## Stakeholder Map`

3. **team-setup/SKILL.md** — `description: Define team roles, responsibilities, skills matrix, and working agreements`
   - Prerequisites: None
   - Process: Define Scrum roles (PO, SM, Dev Team), create skills matrix, identify capability gaps, set working agreements (core hours, response times, tool usage)
   - Writes: `.project/$ARGUMENTS/00-initiate.md` under `## Team Setup`

4. **definition-of-done/SKILL.md** — `description: Establish shared DoD criteria for stories, sprints, and releases`
   - Prerequisites: None
   - Process: Define DoD at story level (code review, tests, docs), sprint level (all stories done, demo-ready), release level (deployed, monitored, communicated). Calibrate DoD to team maturity.
   - Writes: `.project/$ARGUMENTS/00-initiate.md` under `## Definition of Done`

5. **ways-of-working/SKILL.md** — `description: Define team ceremonies, tools, communication norms, and rituals`
   - Prerequisites: None
   - Process: Define sprint cadence and ceremonies (planning, standup, review, retro with times and durations), communication channels (sync vs async), tool stack, escalation paths, team rituals
   - Reads: `plugins/project-management/shared/scrum-guide.md`
   - Writes: `.project/$ARGUMENTS/00-initiate.md` under `## Ways of Working`

Each SKILL.md follows the standard format: YAML frontmatter with `description`, title, prerequisites, numbered process steps, output section. All Initiate skills have no prerequisites (Phase 0).

**Commit:** `git commit -m "feat(pm): add Phase 0 Initiate skills (5 skills)"`

---

### Task 4: Phase 1 — Plan skills (7 skills)

**Files:** Create 7 directories under `plugins/project-management/skills/`, each with `SKILL.md`.

All Plan skills check for `.project/$ARGUMENTS/00-initiate.md` prerequisite, support `--skip-checks`, and write to `.project/$ARGUMENTS/01-plan.md`.

**Skills to create:**

1. **product-vision/SKILL.md** — `description: Craft product vision statement, goals, and success metrics`
   - Process: Read initiate artifacts, craft vision statement using "For [target], who [need], [product] is [category] that [benefit]" format, define 3-5 product goals with measurable success metrics, create vision board summary
   - Writes: `## Product Vision`

2. **roadmap/SKILL.md** — `description: Build a release roadmap with milestones, themes, and timeline`
   - Process: Read vision and charter, define 3-6 month roadmap with release milestones, group work into themes/epics, set target dates and dependencies, identify critical path
   - Writes: `## Roadmap`

3. **backlog-creation/SKILL.md** — `description: Create and structure the initial product backlog from vision and roadmap`
   - Process: Break roadmap themes into epics, break epics into user stories, prioritize using MoSCoW or WSJF, structure backlog by priority, identify MVP scope
   - Reads: `plugins/project-management/shared/user-story-template.md`
   - Writes: `## Product Backlog`

4. **user-stories/SKILL.md** — `description: Write user stories with acceptance criteria following INVEST principles`
   - Process: Write stories in "As a... I want... So that..." format, add Given/When/Then acceptance criteria, validate against INVEST checklist, add story details (priority, labels, dependencies)
   - Reads: `plugins/project-management/shared/user-story-template.md`
   - Writes: `## User Stories`

5. **story-mapping/SKILL.md** — `description: Map user journey to stories, identify releases and MVP scope`
   - Process: Map user activities (top row), map user tasks under each activity, map stories under each task, draw horizontal release lines, identify MVP (first release line), identify gaps
   - Writes: `## Story Map`

6. **estimation/SKILL.md** — `description: Estimate work using story points, T-shirt sizing, or planning poker`
   - Process: Select estimation method (story points recommended), establish reference stories (1, 3, 5, 8 point examples), estimate each story relative to references, identify stories that need splitting (>13 points), calculate total backlog size
   - Writes: `## Estimation`

7. **sprint-planning/SKILL.md** — `description: Plan the sprint — select stories, define sprint goal, assign capacity`
   - Process: Calculate team capacity (available days x focus factor), select stories from top of backlog that fit capacity, define sprint goal (one sentence), create sprint backlog with task breakdown, identify risks and dependencies for the sprint
   - Writes: `## Sprint Planning`

**Commit:** `git commit -m "feat(pm): add Phase 1 Plan skills (7 skills)"`

---

### Task 5: Phase 2 — Sprint skills (5 skills)

**Files:** Create 5 directories, each with `SKILL.md`.

All Sprint skills check for `.project/$ARGUMENTS/00-initiate.md` prerequisite, write to `.project/$ARGUMENTS/02-sprint.md`.

**Skills to create:**

1. **standup/SKILL.md** — `description: Facilitate daily standup — progress, plans, blockers`
   - Process: For each team member: what did they complete yesterday, what will they work on today, what's blocking them. Identify patterns across the team, flag blockers for immediate resolution, check sprint burndown status, note if sprint goal is at risk
   - Writes: `## Standup: [Date]`

2. **sprint-goal/SKILL.md** — `description: Define or refine the sprint goal and commitment`
   - Process: Read sprint planning artifacts, craft a single clear sprint goal statement, define "what does success look like at sprint end", identify stretch goals vs. committed work, create a sprint goal poster (text format)
   - Writes: `## Sprint Goal`

3. **dependency-map/SKILL.md** — `description: Identify and visualize cross-team and cross-story dependencies`
   - Process: Read sprint backlog, identify story-to-story dependencies, identify cross-team dependencies (external teams, APIs, infrastructure), identify external dependencies (vendors, approvals), create dependency matrix, flag critical path and risk items
   - Writes: `## Dependency Map`

4. **blocker-resolution/SKILL.md** — `description: Analyze blockers, propose solutions, and escalation paths`
   - Process: List current blockers from standups or conversation, for each: root cause analysis, proposed solutions (2-3 options), escalation path if not resolved within 24 hours, impact on sprint goal, owner and deadline
   - Writes: `## Blocker Resolution`

5. **wip-review/SKILL.md** — `description: Review work-in-progress against sprint goal and capacity`
   - Process: Review current sprint state, count items by status (to-do, in-progress, done), check WIP limits, compare progress to burndown ideal line, identify bottlenecks and idle capacity, recommend adjustments
   - Writes: `## WIP Review`

**Commit:** `git commit -m "feat(pm): add Phase 2 Sprint skills (5 skills)"`

---

### Task 6: Phase 3 — Review skills (5 skills)

**Files:** Create 5 directories, each with `SKILL.md`.

All Review skills check for `.project/$ARGUMENTS/00-initiate.md` prerequisite, write to `.project/$ARGUMENTS/03-review.md`.

**Skills to create:**

1. **sprint-review/SKILL.md** — `description: Prepare sprint review — what was done, what wasn't, stakeholder demo plan`
   - Process: Read sprint backlog and goal, list completed stories with acceptance criteria met, list incomplete stories with reasons, compare to sprint goal, prepare demo agenda, list stakeholder questions to address, gather feedback themes
   - Writes: `## Sprint Review`

2. **demo-prep/SKILL.md** — `description: Create demo script, talking points, and audience-specific framing`
   - Process: Define demo audience and what they care about, create demo flow (which features in which order), write talking points for each feature, prepare for common questions, create fallback plan if live demo fails, time the demo (aim for 15-20 min)
   - Writes: `## Demo Prep`

3. **stakeholder-update/SKILL.md** — `description: Generate stakeholder status update with progress, risks, and asks`
   - Process: Read stakeholder map for audience, summarize sprint progress (% complete, key deliverables), RAG status (Red/Amber/Green), key risks and mitigations, decisions needed from stakeholders, upcoming milestones and timeline
   - Writes: `## Stakeholder Update`

4. **release-notes/SKILL.md** — `description: Draft release notes for shipped features`
   - Process: List all features shipped in the release, for each: user-facing description (not technical), screenshots or examples if applicable, any breaking changes or migration steps, known issues, group by category (New, Improved, Fixed)
   - Writes: `## Release Notes`

5. **sprint-metrics/SKILL.md** — `description: Calculate and analyze sprint metrics — velocity, burndown, cycle time`
   - Process: Calculate velocity (story points completed), compare to last 3 sprints, burndown analysis (actual vs. ideal), cycle time per story, identify outliers, commitment ratio (completed vs. committed), generate trends and recommendations
   - Writes: `## Sprint Metrics`

**Commit:** `git commit -m "feat(pm): add Phase 3 Review skills (5 skills)"`

---

### Task 7: Phase 4 — Improve skills (5 skills)

**Files:** Create 5 directories, each with `SKILL.md`.

All Improve skills check for `.project/$ARGUMENTS/00-initiate.md` prerequisite, write to `.project/$ARGUMENTS/04-improve.md`.

**Skills to create:**

1. **retrospective/SKILL.md** — `description: Facilitate sprint retrospective with structured format and action items`
   - Process: Read `plugins/project-management/shared/retrospective-formats.md`, select format based on team needs (or let user choose), facilitate the retro (brainstorm, discuss, vote), generate 1-3 specific action items with owners and deadlines, review action items from last retro
   - Writes: `## Retrospective: [Sprint/Date]`

2. **process-improvement/SKILL.md** — `description: Analyze process bottlenecks and propose improvements`
   - Process: Read retro action items and sprint metrics, identify recurring themes (same blockers, same delays), analyze flow bottlenecks (where does work pile up?), propose specific process changes, estimate impact of each change, prioritize by impact/effort
   - Writes: `## Process Improvement`

3. **team-health/SKILL.md** — `description: Assess team health across dimensions — morale, pace, collaboration, clarity`
   - Process: Assess 8 dimensions (rate 1-5): mission clarity, pace sustainability, collaboration quality, technical health, learning & growth, support from org, fun & engagement, delivery confidence. Identify top strength and top concern, recommend 1-2 interventions
   - Writes: `## Team Health Check`

4. **velocity-analysis/SKILL.md** — `description: Analyze velocity trends, predict capacity, and identify patterns`
   - Process: Chart velocity over last 5-10 sprints, calculate average and standard deviation, identify trends (improving, declining, stable), correlate with events (team changes, holidays, incidents), predict capacity for next 3 sprints, recommend sprint commitment range
   - Writes: `## Velocity Analysis`

5. **post-mortem/SKILL.md** — `description: Conduct incident or project post-mortem with root cause analysis`
   - Process: Define the incident/event and impact, build timeline of events, identify root causes using 5 Whys or fishbone, distinguish contributing factors from root causes, define corrective actions (immediate, short-term, long-term), identify systemic improvements, write blameless summary
   - Writes: `## Post-Mortem: [Incident/Event]`

**Commit:** `git commit -m "feat(pm): add Phase 4 Improve skills (5 skills)"`

---

### Task 8: Utility skills (5 skills)

**Files:** Create 5 directories, each with `SKILL.md`.

Utility skills have NO prerequisites.

**Skills to create:**

1. **risk-assessment/SKILL.md** — `description: Identify, score, and plan mitigations for project risks`
   - Prerequisites: None
   - Process: Brainstorm risks across categories (technical, people, schedule, scope, external), score each by likelihood (1-5) x impact (1-5), plot on risk matrix, define mitigation strategy (avoid, transfer, mitigate, accept) for top risks, assign risk owners, set review cadence
   - Writes: `.project/$ARGUMENTS/risk-assessment.md`

2. **decision-log/SKILL.md** — `description: Document decisions with context, alternatives considered, and rationale`
   - Prerequisites: None
   - Process: Capture the decision question, document context and constraints, list alternatives considered (2-3 minimum), evaluate each alternative (pros/cons), record the decision and rationale, note who decided and when, define review/revisit conditions
   - Writes: `.project/$ARGUMENTS/decision-log.md` (append)

3. **meeting-facilitator/SKILL.md** — `description: Plan and structure any meeting with agenda, roles, and follow-ups`
   - Prerequisites: None
   - Process: Define meeting purpose (one sentence), set agenda with time-boxes, assign roles (facilitator, note-taker, timekeeper), list required attendees vs. optional, define desired outcomes, after meeting: capture decisions, action items with owners and deadlines
   - Output: Present directly to user

4. **status-report/SKILL.md** — `description: Generate project status report for leadership in RAG format`
   - Prerequisites: None
   - Process: Read any existing `.project/$ARGUMENTS/` artifacts, overall RAG status with one-line summary, progress against milestones, key accomplishments this period, risks and issues (top 3), upcoming milestones, asks/decisions needed from leadership, team capacity and morale note
   - Writes: `.project/$ARGUMENTS/status-report.md`

5. **capacity-planning/SKILL.md** — `description: Plan team capacity across sprints accounting for holidays and availability`
   - Prerequisites: None
   - Process: List team members and their roles, calculate available days per sprint (total days minus holidays, PTO, meetings overhead), apply focus factor (typically 0.6-0.8), calculate team capacity in story points (using velocity), plan capacity across next 3-6 sprints, identify capacity risks (holidays, leaves, dependencies)
   - Writes: `.project/$ARGUMENTS/capacity-planning.md`

**Commit:** `git commit -m "feat(pm): add utility skills (5 skills)"`

---

### Task 9: Documentation — PM overview and phase pages

**Files:**
- Modify: `apps/docs/content/docs/project-management/index.mdx`
- Modify: `apps/docs/content/docs/project-management/meta.json`
- Create: `apps/docs/content/docs/project-management/initiate.mdx`
- Create: `apps/docs/content/docs/project-management/plan.mdx`
- Create: `apps/docs/content/docs/project-management/sprint.mdx`
- Create: `apps/docs/content/docs/project-management/review.mdx`
- Create: `apps/docs/content/docs/project-management/improve.mdx`
- Create: `apps/docs/content/docs/project-management/utilities.mdx`

Follow the exact same documentation pattern as marketing docs:
- `index.mdx`: Overview with phase table, Scrum methodology explanation, artifact flow, utility skills, quality gates
- `meta.json`: Navigation with phase separator and pages list
- Phase pages: Purpose section, then each skill with command, description, output, prerequisites
- Each phase links to the next phase at the bottom

**Commit:** `git commit -m "feat(pm): add documentation pages for all phases and utilities"`

---

### Task 10: Final verification

**Step 1:** Verify SKILL.md count: `find plugins/project-management/skills -name "SKILL.md" | wc -l` → Expected: 32

**Step 2:** Verify shared templates: `ls plugins/project-management/shared/` → Expected: 4 files

**Step 3:** Verify docs: `ls apps/docs/content/docs/project-management/` → Expected: 8 files

**Step 4:** Verify hooks executable: `test -x plugins/project-management/hooks/check-initiate-exists.sh`

**Step 5:** Verify marketplace: `grep project-management .claude-plugin/marketplace.json`
