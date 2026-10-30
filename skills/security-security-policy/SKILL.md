---
name: security-security-policy
description: Draft an organization's core security policies — information security, acceptable use, data protection, access, incident response, continuity — with owners, NIST CSF mapping and review dates. Use when the user needs written security policies or is starting a security program with nothing on paper. Not for which policies an audit requires; see /compliance-policy-gaps.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 0
  artifact: 00-govern.md
---

# Security Policy

Define organizational security policies, standards, and procedures for "$ARGUMENTS". Establish the foundational policy framework that governs all security activities across the organization.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-security-policy","workflow":"security","phase":0,"project":"<project>","event":"skipped","artifact":"00-govern.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Govern) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole NIST CSF workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches this repository or past work (a memory or repo-map server such as `repo_map`, `entities` or a search tool), query it for `<project>` and this phase's subject and read what it returns; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. Open your section with a `### Recalled` section of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-security-policy","workflow":"security","phase":0,"project":"<project>","event":"started","artifact":"00-govern.md","note":""}`.

None — this is a Phase 0 Govern skill.

## Process

1. **Identify policy areas needed:**
   - **Information security policy** — overarching security commitments and principles
   - **Acceptable use policy** — permitted and prohibited use of organizational assets
   - **Data protection policy** — data handling, storage, transmission, and disposal rules
   - **Access control policy** — authentication, authorization, and least-privilege requirements
   - **Incident response policy** — breach notification obligations and response procedures
   - **Business continuity policy** — disaster recovery and continuity requirements

2. **Read reference materials:**
   - Read `references/nist-csf-guide.md` for framework alignment
   - Map each policy area to relevant NIST CSF functions (Govern, Identify, Protect, Detect, Respond, Recover)

3. **Draft each policy with required sections:**
   - **Purpose** — why the policy exists and what it aims to achieve
   - **Scope** — who and what the policy applies to (employees, contractors, systems, data)
   - **Requirements** — specific, actionable mandates (use "must", "shall", "must not")
   - **Roles and responsibilities** — who is responsible for implementation and oversight
   - **Enforcement** — consequences of non-compliance (disciplinary actions, access revocation)
   - **Exceptions process** — how to request and document policy exceptions

4. **Align policies with business objectives:**
   - Map each policy to business goals it supports (revenue protection, customer trust, regulatory compliance)
   - Ensure policies are proportionate to organizational risk and maturity
   - Identify conflicts between security requirements and business operations; propose balanced solutions

5. **Set review cadence and governance:**
   - Define review frequency per policy (annual minimum, triggered by major changes)
   - Assign policy owners responsible for maintenance
   - Establish approval workflow (draft, review, legal sign-off, executive approval, communication)
   - Define version control and change tracking requirements

6. **Write the artifact** — append to `.singularskills/security/<project>/00-govern.md` under a `## Security Policy` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Security Policy` section already exists, replace only that section. The section contains:

   ### Security Policy Framework

   Include sections:
   - **Policy Inventory** — list of all policies with owner and review date
   - **Individual Policies** — full text of each drafted policy
   - **Framework Alignment** — NIST CSF mapping for each policy
   - **Review Schedule** — cadence and next review dates
   - **Exception Process** — how deviations are requested and approved

## Output

The security policy framework appended to `.singularskills/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Number of policies drafted and their scope
- Key requirements per policy area
- Framework alignment coverage
- Review schedule and governance structure

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-security-policy","workflow":"security","phase":0,"project":"<project>","event":"finished","artifact":"00-govern.md","note":""}`.

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

Open your `## Security Policy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `security-security-policy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Security Policy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
