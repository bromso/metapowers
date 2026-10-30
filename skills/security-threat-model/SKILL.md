---
name: security-threat-model
description: Model threats to a system with STRIDE — scope, actors, a text data flow diagram with trust boundaries, threats rated by likelihood and impact, and mitigations. Use when the user is designing or changing a system or feature and asks what could go wrong or how an attacker might abuse it. Not for current CVEs and attacker groups in the wild; see /security-threat-intel.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 1
  artifact: 01-identify.md
---

# Threat Model

Model threats for "$ARGUMENTS" using structured threat modeling methodologies. Identify what can go wrong, assess each threat's severity, and propose mitigations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-threat-model","workflow":"security","phase":1,"project":"<project>","event":"skipped","artifact":"01-identify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Identify) of the NIST CSF workflow (`security`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-threat-model","workflow":"security","phase":1,"project":"<project>","event":"refused","artifact":"01-identify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-threat-model","workflow":"security","phase":1,"project":"<project>","event":"started","artifact":"01-identify.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/threat-model-template.md` for methodology reference and output structure
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and risk appetite

2. **Describe the system being modeled:**
   - Define the system or component scope (application, service, infrastructure, data flow)
   - Identify key actors: end users, administrators, external services, automated processes
   - List technologies and protocols in use
   - Document assumptions about the environment (network segmentation, authentication mechanisms, hosting model)

3. **Draw data flow diagram (text-based):**
   - Identify processes, data stores, external entities, and data flows
   - Use text-based notation to represent the diagram (e.g., `[User] --> (Web App) --> [Database]`)
   - Mark trust boundaries between different security zones (public internet, DMZ, internal network, database tier)
   - Label each flow with the data type and protocol

4. **Apply STRIDE to each component:**
   - For each element in the data flow, systematically evaluate:
     - **Spoofing** — can an attacker impersonate a legitimate user or system?
     - **Tampering** — can data be modified in transit or at rest without detection?
     - **Repudiation** — can an actor deny performing an action without proof?
     - **Information Disclosure** — can sensitive data be exposed to unauthorized parties?
     - **Denial of Service** — can the component be rendered unavailable?
     - **Elevation of Privilege** — can an attacker gain higher access than authorized?
   - Document each identified threat with ID, description, affected component, and STRIDE category

5. **Rate each threat by likelihood and impact:**
   - **Likelihood** (1-5): based on attack complexity, required access, and known exploitation
   - **Impact** (1-5): based on data sensitivity, business criticality, and blast radius
   - **Risk score** = likelihood x impact
   - Categorize: Critical (20-25), High (12-19), Medium (6-11), Low (1-5)
   - Prioritize threats by risk score for mitigation planning

6. **Write the artifact** — append to `.singularskills/security/<project>/01-identify.md` under a `## Threat Model` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Threat Model` section already exists, replace only that section. The section contains:

   - **System Description** — scope, actors, technologies, and assumptions
   - **Data Flow Diagram** — text-based diagram with trust boundaries
   - **Threat Catalog** — all identified threats with STRIDE classification and risk score
   - **Threat Prioritization** — ranked list by risk score
   - **Proposed Mitigations** — recommended controls for each high and critical threat

## Output

The threat model appended to `.singularskills/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- System scope and trust boundaries identified
- Total threats found by STRIDE category
- Top critical and high-risk threats
- Recommended mitigations for the highest-priority threats

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-threat-model","workflow":"security","phase":1,"project":"<project>","event":"finished","artifact":"01-identify.md","note":""}`.

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

Open your `## Threat Model` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-threat-model`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Threat Model` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
