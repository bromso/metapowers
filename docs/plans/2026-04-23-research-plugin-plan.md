# Research Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Research plugin implementing the Double Diamond methodology (Discover, Define, Design, Deliver) as Claude Code skills with web research integration and documentation.

**Architecture:** Mirrors the Design plugin pattern — one folder per skill with SKILL.md, sequential numbered artifacts in `.research/<topic>/`, hook-based quality gates, shared reference templates. Uses WebSearch/WebFetch for research phases.

**Tech Stack:** Claude Code plugin system (SKILL.md, hooks.json, plugin.json), Markdown

**Design doc:** `docs/plans/2026-04-23-research-plugin-design.md`

---

### Task 1: Scaffold plugin structure and shared resources

**Files:**
- Create: `plugins/research/.claude-plugin/plugin.json`
- Create: `plugins/research/shared/double-diamond-guide.md`
- Create: `plugins/research/shared/research-plan-template.md`

**Step 1: Create plugin manifest**

```json
// plugins/research/.claude-plugin/plugin.json
{
  "name": "research",
  "version": "0.1.0",
  "description": "Four-phase Double Diamond research methodology for structured discovery and validation",
  "author": {
    "name": "Jonas Broms"
  },
  "repository": "https://github.com/bromso/metapowers",
  "license": "MIT",
  "skills": "../skills/",
  "commands": "../commands/",
  "agents": "../agents/",
  "hooks": "../hooks/hooks.json"
}
```

**Step 2: Create Double Diamond guide**

```markdown
// plugins/research/shared/double-diamond-guide.md
# Double Diamond Methodology

The Double Diamond is a research and design framework developed by the UK Design Council. It describes two phases of divergent and convergent thinking.

## Diamond 1: Problem Space

### Discover (Diverge)
Cast a wide net. Gather data, insights, and observations without filtering. Talk to stakeholders, review existing research, explore the competitive landscape.

**Key activities:** desk research, user interviews, data analysis, competitive audit, trend scanning

### Define (Converge)
Synthesize findings into a clear problem statement. Narrow from broad observations to focused "How Might We" questions. Set success criteria.

**Key activities:** affinity mapping, problem framing, HMW questions, success criteria, scoping

## Diamond 2: Solution Space

### Design (Diverge)
Generate multiple solution concepts. Explore different approaches without committing. Evaluate feasibility, impact, and effort.

**Key activities:** ideation, concept development, feasibility analysis, prioritization

### Deliver (Converge)
Validate the top solution(s) with evidence. Test assumptions, gather feedback, refine recommendations. Produce actionable output.

**Key activities:** validation research, prototyping, stakeholder review, final recommendations
```

**Step 3: Create research plan template**

```markdown
// plugins/research/shared/research-plan-template.md
# Research Plan: [Topic]

## Problem Statement
[Clear, concise statement of the problem to solve]

## "How Might We" Questions
1. HMW ...
2. HMW ...
3. HMW ...

## Success Criteria
| Criterion | Metric | Target |
|-----------|--------|--------|
| | | |

## Scope
### In Scope
- ...

### Out of Scope
- ...

## Research Methods (for Design phase)
| Method | Purpose | Timeline |
|--------|---------|----------|
| | | |

## Stakeholders
| Name/Role | Interest | Input Needed |
|-----------|----------|--------------|
| | | |
```

**Step 4: Commit**

```bash
git add plugins/research/
git commit -m "feat(research): scaffold plugin structure with shared resources"
```

---

### Task 2: Create Discover skill (Phase 1)

**Files:**
- Create: `plugins/research/skills/discover/SKILL.md`

**Step 1: Create the skill**

```markdown
// plugins/research/skills/discover/SKILL.md
---
description: Explore the problem space through broad research and data gathering
---

# Discover

Cast a wide net on the research topic "$ARGUMENTS". Gather data, insights, existing research, competitive landscape, and stakeholder perspectives without filtering or narrowing.

## Prerequisites

None — this is the first phase.

## Process

1. **Web research** to gather broad context:
   - Use WebSearch to find recent articles, studies, reports, and discussions about "$ARGUMENTS"
   - Use WebFetch to read the most relevant sources in depth (aim for 5-8 quality sources)
   - Look for: academic research, industry reports, case studies, expert opinions, user forums

2. **Competitive and market analysis:**
   - Use WebSearch to find how others have approached this problem
   - Identify existing solutions, products, or methodologies
   - Note what works well and what gaps exist

3. **Stakeholder perspective mapping:**
   - Identify the key stakeholder groups affected by "$ARGUMENTS"
   - Document each group's likely needs, pain points, and motivations
   - Note conflicts or tensions between stakeholder groups

4. **Pattern identification:**
   - Group findings into themes
   - Identify recurring patterns across sources
   - Flag surprising or contradictory findings
   - Note data gaps — what's unknown or under-researched

5. **Write the artifact** to `.research/$ARGUMENTS/01-discover.md` with sections:
   - **Sources** — list of sources consulted with key takeaways
   - **User & Stakeholder Insights** — needs, pain points, motivations by group
   - **Market & Competitive Landscape** — existing solutions, gaps, trends
   - **Key Themes** — recurring patterns across all research
   - **Surprises & Contradictions** — unexpected findings
   - **Open Questions** — what remains unknown

## Output

The discovery brief written to `.research/$ARGUMENTS/01-discover.md`. Present a summary to the user highlighting:
- Top 3-5 key themes discovered
- Most surprising finding
- Biggest open questions for the Define phase
```

**Step 2: Commit**

```bash
git add plugins/research/skills/discover/
git commit -m "feat(research): add discover skill (phase 1)"
```

---

### Task 3: Create Define skill (Phase 2)

**Files:**
- Create: `plugins/research/skills/define/SKILL.md`

**Step 1: Create the skill**

```markdown
// plugins/research/skills/define/SKILL.md
---
description: Synthesize research findings into a clear problem statement and research plan
---

# Define

Converge the broad discovery findings on "$ARGUMENTS" into a focused problem statement, "How Might We" questions, and a research plan for the solution phase.

## Prerequisites

Read `.research/$ARGUMENTS/01-discover.md`. If this file does not exist, tell the user:

> Phase 1 (Discover) has not been completed for "$ARGUMENTS". Run `/research:discover $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.research/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `.research/$ARGUMENTS/01-discover.md` for discovery findings
   - Read `plugins/research/shared/double-diamond-guide.md` for methodology reference
   - Read `plugins/research/shared/research-plan-template.md` for output structure

2. **Synthesize findings:**
   - Review all themes from the Discover phase
   - Identify the core tension or unmet need
   - Distinguish root causes from symptoms
   - Map relationships between themes

3. **Formulate the problem statement:**
   - Write a clear, specific, actionable problem statement
   - Avoid solution-language (the problem, not the answer)
   - Ensure it's scoped enough to be solvable

4. **Generate "How Might We" questions:**
   - Create 3-5 HMW questions that reframe the problem as opportunities
   - Each HMW should open a different solution direction
   - Avoid HMW questions that are too broad or too narrow

5. **Define success criteria and scope:**
   - What does "solved" look like? Specify measurable criteria
   - What's in scope and out of scope for the Design phase?
   - Identify constraints and assumptions

6. **Write the artifact** to `.research/$ARGUMENTS/02-define.md` following the research plan template structure.

## Output

The problem definition written to `.research/$ARGUMENTS/02-define.md`. Present a summary to the user highlighting:
- The problem statement
- Top HMW questions
- Key scope decisions
- Recommended focus for the Design phase
```

**Step 2: Commit**

```bash
git add plugins/research/skills/define/
git commit -m "feat(research): add define skill (phase 2)"
```

---

### Task 4: Create Design skill (Phase 3)

**Files:**
- Create: `plugins/research/skills/design/SKILL.md`

**Step 1: Create the skill**

```markdown
// plugins/research/skills/design/SKILL.md
---
description: Generate and evaluate multiple solution concepts for the defined problem
---

# Design

Diverge on solutions for "$ARGUMENTS". Generate multiple solution concepts, evaluate feasibility, and prioritize the most promising approaches.

## Prerequisites

Read `.research/$ARGUMENTS/01-discover.md` and `.research/$ARGUMENTS/02-define.md`.

If `02-define.md` does not exist, tell the user:

> Phase 2 (Define) has not been completed for "$ARGUMENTS". Run `/research:define $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.research/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `.research/$ARGUMENTS/01-discover.md` for research findings
   - Read `.research/$ARGUMENTS/02-define.md` for problem statement, HMW questions, and success criteria
   - Read `plugins/research/shared/double-diamond-guide.md` for methodology reference

2. **Research existing solutions:**
   - Use WebSearch to find case studies, best practices, and proven approaches related to each HMW question
   - Use WebFetch to read detailed implementations or methodologies
   - Note what worked, what failed, and why

3. **Generate solution concepts:**
   - Create 3-5 distinct solution concepts, each addressing the problem statement from a different angle
   - For each concept: describe the approach, key components, and how it addresses the HMW questions
   - Include at least one unconventional or contrarian approach

4. **Evaluate each concept:**
   - **Feasibility:** How realistic is implementation? What resources are needed?
   - **Impact:** How well does it address the problem statement and success criteria?
   - **Effort:** What's the relative effort to implement?
   - **Risk:** What could go wrong? What assumptions are being made?

5. **Prioritize and recommend:**
   - Rank concepts by impact/feasibility balance
   - Recommend top 1-2 concepts for validation in the Deliver phase
   - Explain trade-offs between the top options

6. **Write the artifact** to `.research/$ARGUMENTS/03-design.md` with sections:
   - **Problem Recap** — one-paragraph summary from Define
   - **Solution Concepts** — each concept with description and rationale
   - **Evaluation Matrix** — feasibility, impact, effort, risk per concept
   - **Recommendations** — top concepts with reasoning
   - **Validation Plan** — what to test in the Deliver phase

## Output

The solution concepts written to `.research/$ARGUMENTS/03-design.md`. Present a summary to the user highlighting:
- Number of concepts generated
- Top recommendation and why
- Key trade-offs between top options
- What needs validation in the Deliver phase
```

**Step 2: Commit**

```bash
git add plugins/research/skills/design/
git commit -m "feat(research): add design skill (phase 3)"
```

---

### Task 5: Create Deliver skill (Phase 4)

**Files:**
- Create: `plugins/research/skills/deliver/SKILL.md`

**Step 1: Create the skill**

```markdown
// plugins/research/skills/deliver/SKILL.md
---
description: Validate the top solution and produce actionable recommendations with evidence
---

# Deliver

Converge on the final recommendation for "$ARGUMENTS". Validate the top solution concept(s) with evidence, refine the approach, and produce actionable recommendations.

## Prerequisites

Read `.research/$ARGUMENTS/01-discover.md`, `.research/$ARGUMENTS/02-define.md`, and `.research/$ARGUMENTS/03-design.md`.

If `03-design.md` does not exist, tell the user:

> Phase 3 (Design) has not been completed for "$ARGUMENTS". Run `/research:design $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.research/$ARGUMENTS/skip-log.md`.

## Process

1. **Read all prior artifacts:**
   - Read `.research/$ARGUMENTS/01-discover.md` for original research
   - Read `.research/$ARGUMENTS/02-define.md` for problem statement and success criteria
   - Read `.research/$ARGUMENTS/03-design.md` for recommended solutions and validation plan

2. **Validate the top solution(s):**
   - Use WebSearch to find evidence supporting or contradicting the recommended approach
   - Use WebFetch to read detailed case studies of similar implementations
   - Look for: success stories, failure modes, edge cases, unintended consequences
   - Test each assumption identified in the Design phase

3. **Assess against success criteria:**
   - Review each success criterion from the Define phase
   - For each criterion, document evidence that the solution meets it (or doesn't)
   - Flag any criteria that can't be validated with desk research alone

4. **Refine recommendations:**
   - Adjust the solution based on validation findings
   - Add implementation considerations discovered during validation
   - Identify quick wins vs. long-term investments
   - Note dependencies and prerequisites

5. **Write the artifact** to `.research/$ARGUMENTS/04-deliver.md` with sections:
   - **Executive Summary** — one-paragraph recommendation
   - **Validation Findings** — evidence for/against the solution, organized by assumption
   - **Success Criteria Assessment** — each criterion with evidence status
   - **Final Recommendation** — refined solution with implementation approach
   - **Action Items** — prioritized next steps with owners/timelines if applicable
   - **Risks & Mitigations** — remaining risks and how to handle them
   - **Research Journey** — brief timeline of what was discovered across all 4 phases

## Output

The final deliverable written to `.research/$ARGUMENTS/04-deliver.md`. Present a summary to the user highlighting:
- The final recommendation (1-2 sentences)
- Confidence level based on evidence strength
- Top 3 action items
- Key risks to watch
```

**Step 2: Commit**

```bash
git add plugins/research/skills/deliver/
git commit -m "feat(research): add deliver skill (phase 4)"
```

---

### Task 6: Create quality gate hooks

**Files:**
- Create: `plugins/research/hooks/hooks.json`
- Create: `plugins/research/hooks/check-define-exists.sh`

**Step 1: Create hooks.json**

The Research plugin doesn't use external MCP tools that need gating (WebSearch/WebFetch are built-in). The hard gate is enforced within the SKILL.md prompts as soft gates. However, for consistency with the Design plugin pattern, create the hooks structure.

```json
// plugins/research/hooks/hooks.json
{
  "hooks": {}
}
```

**Step 2: Create the check script (for potential future use)**

```bash
// plugins/research/hooks/check-define-exists.sh
#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${RESEARCH_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .research/<name>/ directories to infer current topic
TOPIC_DIR=$(find .research -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .research/ directory found. Run /research:discover and /research:define first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
DEFINE_FILE=".research/${TOPIC}/02-define.md"

if [[ ! -f "$DEFINE_FILE" ]]; then
  echo "BLOCKED: ${DEFINE_FILE} not found." >&2
  echo "" >&2
  echo "The problem must be defined before designing solutions." >&2
  echo "Run: /research:define ${TOPIC}" >&2
  echo "" >&2
  echo "To bypass: export RESEARCH_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
```

**Step 3: Make executable and commit**

```bash
chmod +x plugins/research/hooks/check-define-exists.sh
git add plugins/research/hooks/
git commit -m "feat(research): add quality gate hooks"
```

---

### Task 7: Register in marketplace

**Files:**
- Modify: `.claude-plugin/marketplace.json`

**Step 1: Add research plugin entry**

Add to the `plugins` array in `.claude-plugin/marketplace.json`:

```json
{
  "name": "research",
  "source": "./plugins/research",
  "description": "Four-phase Double Diamond research methodology for structured discovery and validation",
  "version": "0.1.0",
  "keywords": ["research", "double-diamond", "discovery", "validation", "methodology"],
  "category": "research"
}
```

**Step 2: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "feat(research): register plugin in marketplace"
```

---

### Task 8: Update documentation

**Files:**
- Modify: `apps/docs/content/docs/research/index.mdx`
- Modify: `apps/docs/content/docs/research/discover.mdx`
- Modify: `apps/docs/content/docs/research/define.mdx`
- Modify: `apps/docs/content/docs/research/design.mdx`
- Modify: `apps/docs/content/docs/research/deliver.mdx`

**Step 1: Replace index.mdx**

```mdx
// apps/docs/content/docs/research/index.mdx
---
title: Research Domain Overview
description: A four-phase Double Diamond methodology for structured discovery and validation.
---

The Research plugin implements the Double Diamond methodology with four phases. Each phase has a dedicated slash command that guides you through structured discovery, problem definition, solution design, and validation.

## The Four Phases

| Phase | Command | Purpose |
|-------|---------|---------|
| Discover | `/research:discover` | Explore the problem space through broad research |
| Define | `/research:define` | Synthesize findings into a problem statement |
| Design | `/research:design` | Generate and evaluate solution concepts |
| Deliver | `/research:deliver` | Validate and produce actionable recommendations |

## The Double Diamond

The methodology follows two "diamonds" of divergent and convergent thinking:

**Diamond 1 (Problem Space):** Discover casts a wide net, then Define narrows to a focused problem statement.

**Diamond 2 (Solution Space):** Design explores multiple solutions, then Deliver validates and converges on the best approach.

## Artifact Flow

Each phase reads from previous phases and writes to `.research/<topic>/`:

```
.research/user-onboarding-friction/
  01-discover.md    ← Phase 1 output
  02-define.md      ← Phase 2 output
  03-design.md      ← Phase 3 output
  04-deliver.md     ← Phase 4 output
```

## Quality Gates

The plugin enforces phase ordering through quality gates:

- **Soft gates** check that prerequisite artifacts exist and warn if missing
- **Hard gates** block phases that require prior work — e.g., you cannot design solutions until the problem is defined
- You can bypass soft gates with `--skip-checks` when needed
```

**Step 2: Replace discover.mdx**

```mdx
// apps/docs/content/docs/research/discover.mdx
---
title: "Phase 1: Discover"
description: Explore the problem space through broad research and data gathering.
---

## Purpose

The Discover phase casts a wide net across the problem space. It gathers data, insights, existing research, competitive landscape, and stakeholder perspectives without filtering or narrowing.

## Usage

```
/research:discover <topic>
```

**Example:**
```
/research:discover user onboarding friction
```

## What It Does

1. Searches the web for recent articles, studies, reports, and discussions
2. Reads key sources in depth (5-8 quality sources)
3. Maps stakeholder perspectives and pain points
4. Analyzes the competitive and market landscape
5. Identifies patterns, themes, and contradictions
6. Writes findings to `.research/<topic>/01-discover.md`

## Output

Creates `.research/<topic>/01-discover.md` containing:

- Sources consulted with key takeaways
- User and stakeholder insights
- Market and competitive landscape
- Key themes and patterns
- Surprises and contradictions
- Open questions for the Define phase

## Next Phase

After Discover, proceed to [Define](/docs/research/define) to synthesize findings into a problem statement.
```

**Step 3: Replace define.mdx**

```mdx
// apps/docs/content/docs/research/define.mdx
---
title: "Phase 2: Define"
description: Synthesize research findings into a clear problem statement and research plan.
---

## Purpose

The Define phase converges broad discovery findings into a focused problem statement, "How Might We" questions, and success criteria. This is the bridge between understanding the problem and designing solutions.

## Usage

```
/research:define <topic>
```

**Example:**
```
/research:define user onboarding friction
```

## Prerequisites

Requires `.research/<topic>/01-discover.md` from the Discover phase. Use `--skip-checks` to bypass.

## What It Does

1. Reads the Discover phase findings
2. Synthesizes themes into a core problem statement
3. Generates 3-5 "How Might We" questions
4. Defines measurable success criteria
5. Sets scope boundaries (in/out of scope)
6. Writes the problem definition to `.research/<topic>/02-define.md`

## Output

Creates `.research/<topic>/02-define.md` containing:

- Problem statement
- "How Might We" questions
- Success criteria with metrics
- Scope boundaries
- Research plan for the Design phase

## Next Phase

After Define, proceed to [Design](/docs/research/design) to generate solution concepts.
```

**Step 4: Replace design.mdx**

```mdx
// apps/docs/content/docs/research/design.mdx
---
title: "Phase 3: Design"
description: Generate and evaluate multiple solution concepts for the defined problem.
---

## Purpose

The Design phase diverges again — this time on solutions. It generates multiple concepts, evaluates feasibility and impact, and recommends the most promising approaches for validation.

## Usage

```
/research:design <topic>
```

**Example:**
```
/research:design user onboarding friction
```

## Prerequisites

Requires `.research/<topic>/02-define.md` from the Define phase. This is a hard gate — you cannot design solutions without a defined problem. Use `--skip-checks` to bypass.

## What It Does

1. Reads the problem statement and HMW questions from Define
2. Searches for existing solutions, case studies, and best practices
3. Generates 3-5 distinct solution concepts
4. Evaluates each on feasibility, impact, effort, and risk
5. Recommends top concepts for validation
6. Writes solution concepts to `.research/<topic>/03-design.md`

## Output

Creates `.research/<topic>/03-design.md` containing:

- Problem recap from Define
- Solution concepts with descriptions
- Evaluation matrix (feasibility, impact, effort, risk)
- Prioritized recommendations
- Validation plan for the Deliver phase

## Next Phase

After Design, proceed to [Deliver](/docs/research/deliver) to validate and finalize recommendations.
```

**Step 5: Replace deliver.mdx**

```mdx
// apps/docs/content/docs/research/deliver.mdx
---
title: "Phase 4: Deliver"
description: Validate the top solution and produce actionable recommendations with evidence.
---

## Purpose

The Deliver phase converges on the final recommendation. It validates the top solution concept(s) against evidence, refines the approach, and produces actionable output.

## Usage

```
/research:deliver <topic>
```

**Example:**
```
/research:deliver user onboarding friction
```

## Prerequisites

Requires all prior phase artifacts. Use `--skip-checks` to bypass.

## What It Does

1. Reads all prior phase artifacts (Discover, Define, Design)
2. Searches for evidence supporting or contradicting the recommended solution
3. Tests assumptions identified in the Design phase
4. Assesses the solution against success criteria from Define
5. Refines recommendations and identifies action items
6. Writes the final deliverable to `.research/<topic>/04-deliver.md`

## Output

Creates `.research/<topic>/04-deliver.md` containing:

- Executive summary
- Validation findings with evidence
- Success criteria assessment
- Final recommendation with implementation approach
- Prioritized action items
- Risks and mitigations
- Research journey summary across all 4 phases
```

**Step 6: Commit**

```bash
git add apps/docs/content/docs/research/
git commit -m "docs(research): replace stub pages with full Double Diamond documentation"
```

---

### Task 9: Verify and push

**Step 1: Verify plugin structure**

```bash
find plugins/research -type f | sort
```

Expected:
```
plugins/research/.claude-plugin/plugin.json
plugins/research/hooks/check-define-exists.sh
plugins/research/hooks/hooks.json
plugins/research/shared/double-diamond-guide.md
plugins/research/shared/research-plan-template.md
plugins/research/skills/define/SKILL.md
plugins/research/skills/deliver/SKILL.md
plugins/research/skills/design/SKILL.md
plugins/research/skills/discover/SKILL.md
```

**Step 2: Verify docs build**

```bash
cd apps/docs && npx next build 2>&1 | tail -10
```

Expected: Build succeeds, research pages generated.

**Step 3: Fix any issues and commit if needed**
