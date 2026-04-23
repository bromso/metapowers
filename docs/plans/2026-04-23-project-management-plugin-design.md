# Project Management Plugin Design

**Date:** 2026-04-23
**Status:** Approved
**Methodology:** Scrum Framework (Agile)

## Overview

A comprehensive project management plugin for Metapowers implementing the Scrum framework. Provides 32 skills organized across 5 phases (Initiate + 4 Scrum lifecycle phases) plus utilities, covering the full sprint cycle from project setup to continuous improvement.

## Methodology: Scrum Lifecycle

The plugin follows the Scrum framework's natural lifecycle with an added **Initiate** phase upfront — mirroring how Design starts with "Empathize" and Marketing starts with "Strategy."

```
Initiate → Plan → Sprint → Review → Improve
(Phase 0)  (Phase 1) (Phase 2) (Phase 3) (Phase 4)
```

- **Initiate (Phase 0):** Set up the project foundation — charter, stakeholders, team, DoD, ways of working.
- **Plan (Phase 1):** Define vision, build roadmap, create backlog, write stories, estimate, and plan the sprint.
- **Sprint (Phase 2):** Execute the sprint — standups, goal tracking, dependency management, blocker resolution.
- **Review (Phase 3):** Inspect the increment — sprint review, demos, stakeholder updates, release notes, metrics.
- **Improve (Phase 4):** Adapt the process — retrospectives, process improvements, team health, velocity analysis.

## Artifact Structure

All skills write markdown artifacts to `.project/$ARGUMENTS/`:

| File | Phase | Description |
|------|-------|-------------|
| `00-initiate.md` | Initiate | Project charter, stakeholders, team setup, DoD |
| `01-plan.md` | Plan | Vision, roadmap, backlog, stories, estimation, sprint plan |
| `02-sprint.md` | Sprint | Sprint goal, standups, blockers, dependencies, WIP |
| `03-review.md` | Review | Sprint review, demo, stakeholder updates, release notes, metrics |
| `04-improve.md` | Improve | Retrospective, process improvements, team health, velocity |
| `skip-log.md` | — | Log of skipped prerequisite checks |

## Skill Inventory (32 skills)

### Phase 0: Initiate (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `project-charter` | `/pm:project-charter <project>` | Define project purpose, scope, objectives, constraints, and success criteria |
| `stakeholder-map` | `/pm:stakeholder-map <project>` | Identify and map stakeholders by influence, interest, and communication needs |
| `team-setup` | `/pm:team-setup <project>` | Define team roles, responsibilities, skills matrix, and working agreements |
| `definition-of-done` | `/pm:definition-of-done <project>` | Establish shared DoD criteria for stories, sprints, and releases |
| `ways-of-working` | `/pm:ways-of-working <project>` | Define team ceremonies, tools, communication norms, and rituals |

### Phase 1: Plan (7 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `product-vision` | `/pm:product-vision <project>` | Craft product vision statement, goals, and success metrics |
| `roadmap` | `/pm:roadmap <project>` | Build a release roadmap with milestones, themes, and timeline |
| `backlog-creation` | `/pm:backlog-creation <project>` | Create and structure the initial product backlog from vision and roadmap |
| `user-stories` | `/pm:user-stories <project>` | Write user stories with acceptance criteria following INVEST principles |
| `story-mapping` | `/pm:story-mapping <project>` | Map user journey to stories, identify releases and MVP scope |
| `estimation` | `/pm:estimation <project>` | Estimate work using story points, T-shirt sizing, or planning poker |
| `sprint-planning` | `/pm:sprint-planning <project>` | Plan the sprint: select stories, define sprint goal, assign capacity |

### Phase 2: Sprint (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `standup` | `/pm:standup <project>` | Facilitate daily standup: progress, plans, blockers |
| `sprint-goal` | `/pm:sprint-goal <project>` | Define or refine the sprint goal and commitment |
| `dependency-map` | `/pm:dependency-map <project>` | Identify and visualize cross-team and cross-story dependencies |
| `blocker-resolution` | `/pm:blocker-resolution <project>` | Analyze blockers, propose solutions, escalation paths |
| `wip-review` | `/pm:wip-review <project>` | Review work-in-progress, check against sprint goal and capacity |

### Phase 3: Review (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `sprint-review` | `/pm:sprint-review <project>` | Prepare sprint review: what was done, what wasn't, stakeholder demo plan |
| `demo-prep` | `/pm:demo-prep <project>` | Create demo script, talking points, and audience-specific framing |
| `stakeholder-update` | `/pm:stakeholder-update <project>` | Generate stakeholder status update with progress, risks, and asks |
| `release-notes` | `/pm:release-notes <project>` | Draft release notes for shipped features |
| `sprint-metrics` | `/pm:sprint-metrics <project>` | Calculate and analyze sprint metrics: velocity, burndown, cycle time |

### Phase 4: Improve (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `retrospective` | `/pm:retrospective <project>` | Facilitate sprint retrospective with structured format and action items |
| `process-improvement` | `/pm:process-improvement <project>` | Analyze process bottlenecks and propose improvements |
| `team-health` | `/pm:team-health <project>` | Assess team health across dimensions: morale, pace, collaboration, clarity |
| `velocity-analysis` | `/pm:velocity-analysis <project>` | Analyze velocity trends, predict capacity, identify patterns |
| `post-mortem` | `/pm:post-mortem <project>` | Conduct incident or project post-mortem with root cause analysis |

### Utilities (5 skills — no phase gating)

| Skill | Command | Description |
|-------|---------|-------------|
| `risk-assessment` | `/pm:risk-assessment <project>` | Identify, score, and plan mitigations for project risks |
| `decision-log` | `/pm:decision-log <project>` | Document decisions with context, alternatives considered, and rationale |
| `meeting-facilitator` | `/pm:meeting-facilitator <project>` | Plan and structure any meeting with agenda, roles, and follow-ups |
| `status-report` | `/pm:status-report <project>` | Generate project status report for leadership (RAG format) |
| `capacity-planning` | `/pm:capacity-planning <project>` | Plan team capacity across sprints accounting for holidays and availability |

## Plugin Structure

```
plugins/project-management/
├── .claude-plugin/
│   └── plugin.json
├── .mcp.json
├── hooks/
│   ├── hooks.json
│   └── check-initiate-exists.sh
├── shared/
│   ├── scrum-guide.md
│   ├── project-charter-template.md
│   ├── user-story-template.md
│   └── retrospective-formats.md
├── skills/
│   ├── project-charter/SKILL.md
│   ├── stakeholder-map/SKILL.md
│   ├── team-setup/SKILL.md
│   ├── definition-of-done/SKILL.md
│   ├── ways-of-working/SKILL.md
│   ├── product-vision/SKILL.md
│   ├── roadmap/SKILL.md
│   ├── backlog-creation/SKILL.md
│   ├── user-stories/SKILL.md
│   ├── story-mapping/SKILL.md
│   ├── estimation/SKILL.md
│   ├── sprint-planning/SKILL.md
│   ├── standup/SKILL.md
│   ├── sprint-goal/SKILL.md
│   ├── dependency-map/SKILL.md
│   ├── blocker-resolution/SKILL.md
│   ├── wip-review/SKILL.md
│   ├── sprint-review/SKILL.md
│   ├── demo-prep/SKILL.md
│   ├── stakeholder-update/SKILL.md
│   ├── release-notes/SKILL.md
│   ├── sprint-metrics/SKILL.md
│   ├── retrospective/SKILL.md
│   ├── process-improvement/SKILL.md
│   ├── team-health/SKILL.md
│   ├── velocity-analysis/SKILL.md
│   ├── post-mortem/SKILL.md
│   ├── risk-assessment/SKILL.md
│   ├── decision-log/SKILL.md
│   ├── meeting-facilitator/SKILL.md
│   ├── status-report/SKILL.md
│   └── capacity-planning/SKILL.md
├── commands/
└── agents/
```

## Shared Templates

### scrum-guide.md
Reference guide explaining the Scrum framework — roles (Product Owner, Scrum Master, Dev Team), events (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective), artifacts (Product Backlog, Sprint Backlog, Increment), and values (Commitment, Focus, Openness, Respect, Courage).

### project-charter-template.md
Template for Initiate phase output:
- Purpose & Vision
- Objectives & Success Criteria
- Scope (In/Out)
- Stakeholders
- Constraints & Assumptions
- Timeline & Milestones
- Risks

### user-story-template.md
Template for writing user stories:
- As a [persona], I want to [action], so that [benefit]
- Acceptance Criteria (Given/When/Then)
- Definition of Done checklist
- Story Points / Estimate
- INVEST checklist (Independent, Negotiable, Valuable, Estimable, Small, Testable)

### retrospective-formats.md
Collection of retrospective formats:
- Start / Stop / Continue
- 4Ls (Liked, Learned, Lacked, Longed for)
- Sailboat (Wind, Anchor, Rocks, Island)
- Mad / Sad / Glad
- Timeline retrospective
- Each with facilitation instructions and time-boxing guidance.

## Hooks

### check-initiate-exists.sh
- Checks for `.project/$TOPIC/00-initiate.md`
- Blocks Phase 1+ skills if Initiate phase incomplete
- Bypass: `PM_SKIP_CHECKS=1`
- Logs bypass to `.project/$TOPIC/skip-log.md`

### hooks.json
Empty (same as research plugin). Phase gating handled in SKILL.md prerequisites.

## MCP Integration

### Linear / Jira
- Package: `packages/pm-mcp/`
- Provides issue tracker sync for backlog, stories, and sprint planning skills
- Configured via `.mcp.json` with `LINEAR_API_KEY` and `JIRA_API_TOKEN` env vars
- Skills work without MCP (graceful degradation) — MCP enables real-time sync

## Documentation (apps/docs)

### Structure
```
apps/docs/content/docs/project-management/
├── index.mdx              # Scrum overview, getting started
├── meta.json              # Navigation
├── initiate.mdx           # Phase 0: all 5 skills
├── plan.mdx               # Phase 1: all 7 skills
├── sprint.mdx             # Phase 2: all 5 skills
├── review.mdx             # Phase 3: all 5 skills
├── improve.mdx            # Phase 4: all 5 skills
└── utilities.mdx          # Utility skills: all 5
```

### Content per page
- Phase purpose and Scrum context
- All skills in that phase with: command, description, output, prerequisites
- How skills connect to adjacent phases

## Marketplace Registration

Add to `.claude-plugin/marketplace.json`:
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
