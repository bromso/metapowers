---
name: project-management-stakeholder-map
description: Map a project's stakeholders on a power and interest grid with a communication plan per group, RACI for key decisions and escalation paths. Use when the user needs to work out who to keep informed, who approves what and how often to talk to each group. Not for writing a specific update; see /project-management-stakeholder-update.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 0
  artifact: 00-initiate.md
---

# Stakeholder Map

Identify and map all stakeholders for "$ARGUMENTS". Classify them by power and interest, define communication plans per group, and map decision-making authority and escalation paths.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"project-management","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` if it exists (for project charter context)

2. **Identify all stakeholders:**
   - **Internal stakeholders:** project sponsor, product owner, development team, management, operations, support, finance
   - **External stakeholders:** customers, end users, partners, vendors, regulators, investors
   - For each stakeholder: name/role, organization, primary interest in the project
   - Ask: who is affected by this project? Who can affect this project?

3. **Classify using power/interest grid:**
   - **Manage Closely** (high power, high interest): key players who need active engagement — regular meetings, input on decisions, early reviews
   - **Keep Satisfied** (high power, low interest): senior stakeholders who need executive summaries — periodic updates, escalation path, no information overload
   - **Keep Informed** (low power, high interest): engaged supporters who want visibility — regular status updates, demos, feedback channels
   - **Monitor** (low power, low interest): peripheral stakeholders — minimal communication, available on request
   - Place each stakeholder in the appropriate quadrant with justification

4. **Define communication plan per group:**
   - For each quadrant, specify:
     - **Frequency:** daily, weekly, bi-weekly, monthly, as-needed
     - **Format:** standup, status report, email update, demo, 1:1 meeting, newsletter
     - **Channel:** Slack, email, meetings, dashboard, wiki
     - **Content:** what information they need and at what level of detail
   - Create a RACI-style mapping for key decisions (Responsible, Accountable, Consulted, Informed)

5. **Map decision-making authority and escalation paths:**
   - Who approves scope changes? Budget changes? Timeline changes?
   - Define escalation levels: team → Scrum Master → Product Owner → sponsor → steering committee
   - Document approval thresholds (e.g., scope changes under X hours → PO approval, over X hours → sponsor)
   - Identify single points of failure in decision-making

6. **Identify stakeholder risks:**
   - Disengaged sponsors or absent decision-makers
   - Conflicting stakeholder priorities
   - Stakeholders who may resist change
   - Missing stakeholders who should be involved

7. **Write the artifact** — append to `.singularskills/project-management/<project>/00-initiate.md` under a `## Stakeholder Map` section. Create the file with a `# Initiate — <project>` heading if it does not exist; if a `## Stakeholder Map` section already exists, replace only that section. The section contains:
   - **Stakeholder Register** — name/role, organization, interest, quadrant
   - **Power/Interest Grid** — visual grid with stakeholders placed
   - **Communication Plan** — per-quadrant frequency, format, channel, content
   - **Decision Authority** — RACI for key decisions, approval thresholds
   - **Escalation Path** — levels and triggers
   - **Stakeholder Risks** — identified risks and mitigation

## Output

Stakeholder map appended to `.singularskills/project-management/<project>/00-initiate.md`. Present a summary highlighting:
- Stakeholder count by quadrant
- Key decision-makers and their authority
- Communication cadence for each group

**Record the run.** This artifact is shared by every skill of phase 0 (Initiate). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Initiate
workflow: project-management
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Stakeholder Map` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-stakeholder-map`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
