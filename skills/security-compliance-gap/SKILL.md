---
name: security-compliance-gap
description: Assess how far current controls are from security frameworks such as ISO 27001, NIST CSF, SOC 2 or CIS — status per control, a score and maturity per framework, and a remediation roadmap. Use when the user asks how compliant they are with a security framework or what is missing to meet it. Not for merging gaps across regulation assessments; see /compliance-gap-analysis.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 1
  artifact: 01-identify.md
---

# Compliance Gap

Assess compliance gaps against security frameworks for "$ARGUMENTS". Evaluate current security posture against industry standards, identify critical gaps, and prioritize remediation efforts.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-compliance-gap","workflow":"security","phase":1,"project":"<project>","event":"skipped","artifact":"01-identify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Identify) of the NIST CSF workflow (`security`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-compliance-gap","workflow":"security","phase":1,"project":"<project>","event":"refused","artifact":"01-identify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-compliance-gap","workflow":"security","phase":1,"project":"<project>","event":"started","artifact":"01-identify.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Select applicable frameworks:**
   - Evaluate which frameworks apply based on industry, geography, and business requirements:
     - **ISO 27001** — international information security management standard
     - **NIST CSF** — cybersecurity framework for risk-based security program
     - **SOC 2** — service organization controls for trust service criteria
     - **CIS Benchmarks** — prescriptive configuration and hardening guidelines
     - **PCI DSS** — payment card industry data security standard (if processing payments)
     - **HIPAA** — health insurance portability and accountability (if handling health data)
   - Prioritize frameworks by: regulatory mandate, customer requirements, business strategy

2. **Read reference materials:**
   - Read `references/security-controls-matrix.md` for control mapping across frameworks
   - Cross-reference controls to identify overlapping requirements (implement once, comply with many)

3. **Assess current state against each control:**
   - For each control in the selected frameworks, evaluate:
     - **Implemented** — control is fully in place, documented, and evidenced
     - **Partially Implemented** — control exists but has gaps in scope, documentation, or enforcement
     - **Not Implemented** — control does not exist or is not operational
     - **N/A** — control is not applicable to the organization's environment
   - Document evidence for each assessment: policies, configurations, tool outputs, process documentation
   - Note where controls satisfy multiple frameworks simultaneously

4. **Score compliance posture:**
   - Calculate compliance percentage per framework: (Implemented + 0.5 x Partially) / Total Applicable
   - Identify the overall compliance maturity level:
     - >80%: Mature — focus on continuous improvement
     - 60-80%: Developing — targeted gap remediation needed
     - 40-60%: Basic — significant investment in controls required
     - <40%: Initial — foundational security program build-out needed
   - Compare across frameworks to identify which are closest to compliance

5. **Identify and prioritize critical gaps:**
   - Rank gaps by: risk severity, regulatory deadline, customer impact, implementation effort
   - Identify "quick wins" — gaps that can be closed with minimal effort but high compliance impact
   - Identify "foundational gaps" — missing capabilities that block multiple controls
   - Create a remediation roadmap with phases: immediate (0-30 days), short-term (1-3 months), medium-term (3-6 months), long-term (6-12 months)

6. **Write the artifact** — append to `.singularskills/security/<project>/01-identify.md` under a `## Compliance Gap` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Compliance Gap` section already exists, replace only that section. The section contains:

   ### Compliance Gap Assessment

   Include sections:
   - **Framework Selection** — applicable frameworks with rationale
   - **Control Assessment** — status of each control per framework
   - **Compliance Scorecard** — percentage scores and maturity level per framework
   - **Critical Gaps** — prioritized list of gaps with risk and effort ratings
   - **Remediation Roadmap** — phased plan to close gaps with timelines and owners

## Output

The compliance gap assessment appended to `.singularskills/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Frameworks assessed and compliance percentage for each
- Overall maturity level
- Top critical gaps requiring immediate attention
- Quick wins for rapid compliance improvement
- Recommended remediation roadmap

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-compliance-gap","workflow":"security","phase":1,"project":"<project>","event":"finished","artifact":"01-identify.md","note":""}`.

This artifact is shared by every skill of phase 1 (Identify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Identify
workflow: security
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Compliance Gap` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-compliance-gap`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Compliance Gap` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
