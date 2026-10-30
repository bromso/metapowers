---
name: security-security-roles
description: Define who owns security work — roles such as CISO, engineers, champions and responders, a RACI matrix, staffing gaps and a proposed team structure. Use when the user asks who should be responsible for security, is building a security team, or has security tasks nobody clearly owns. Not for user permissions inside systems; see /security-access-control.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 0
  artifact: 00-govern.md
---

# Security Roles

Define security roles, responsibilities, and RACI matrix for "$ARGUMENTS". Establish clear ownership of security activities and identify gaps in current organizational coverage.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-security-roles","workflow":"security","phase":0,"project":"<project>","event":"skipped","artifact":"00-govern.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Govern) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole NIST CSF workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches this repository or past work (a memory or repo-map server such as `repo_map`, `entities` or a search tool), query it for `<project>` and this phase's subject and read what it returns; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. Open your section with a `### Recalled` section of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-security-roles","workflow":"security","phase":0,"project":"<project>","event":"started","artifact":"00-govern.md","note":""}`.

None — this is a Phase 0 Govern skill.

## Process

1. **Identify security roles:**
   - **CISO / Security Lead** — overall security strategy, risk management, executive reporting
   - **Security Engineers** — security tooling, architecture review, vulnerability management
   - **Security Champions** — embedded security advocates within development teams
   - **Incident Responders** — detection, triage, containment, and recovery operations
   - **Compliance / GRC Analysts** — regulatory compliance, audit preparation, policy management
   - **Security Architects** — secure design patterns, threat modeling, technology evaluation
   - **SOC Analysts** — monitoring, alert triage, threat hunting (if applicable)
   - Identify any organization-specific roles beyond the standard set

2. **Define responsibilities per role:**
   - For each role, document:
     - **Primary responsibilities** — core duties the role owns
     - **Secondary responsibilities** — supporting activities
     - **Key deliverables** — artifacts and outcomes expected
     - **Required skills** — technical and soft skills needed
     - **Reporting line** — who the role reports to
   - Ensure no critical activities are unassigned

3. **Create RACI matrix for key security activities:**
   - Map roles against security activities using RACI (Responsible, Accountable, Consulted, Informed):
     - Security policy creation and maintenance
     - Risk assessment and management
     - Vulnerability scanning and remediation
     - Incident detection and response
     - Security architecture review
     - Compliance monitoring and audit
     - Security awareness training
     - Third-party risk assessment
     - Access control management
     - Security tool administration
   - Ensure every activity has exactly one Accountable party

4. **Identify gaps in current staffing:**
   - Compare defined roles against current team composition
   - Highlight roles that are unfilled or understaffed
   - Identify single points of failure (critical activities with only one person)
   - Note roles being covered by individuals with conflicting responsibilities

5. **Recommend organizational structure:**
   - Propose reporting hierarchy for security function
   - Recommend team size based on organization scale and risk profile
   - Suggest phased hiring plan if gaps exist
   - Define security champion program structure (ratio to dev teams, responsibilities, incentives)

6. **Write the artifact** — append to `.singularskills/security/<project>/00-govern.md` under a `## Security Roles` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Security Roles` section already exists, replace only that section. The section contains:

   ### Security Roles & Responsibilities

   Include sections:
   - **Role Definitions** — each role with responsibilities, skills, and reporting line
   - **RACI Matrix** — activities vs. roles matrix
   - **Staffing Gaps** — identified gaps and single points of failure
   - **Organizational Recommendations** — proposed structure and hiring priorities
   - **Security Champions Program** — structure and implementation plan

## Output

The security roles and RACI matrix appended to `.singularskills/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Roles defined and their primary responsibilities
- Critical staffing gaps identified
- Key RACI assignments for high-priority activities
- Top organizational recommendations

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-security-roles","workflow":"security","phase":0,"project":"<project>","event":"finished","artifact":"00-govern.md","note":""}`.

This artifact is shared by every skill of phase 0 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Govern
workflow: security
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Security Roles` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `security-security-roles`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Security Roles` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
