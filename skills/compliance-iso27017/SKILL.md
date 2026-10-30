---
name: compliance-iso27017
description: Assess ISO 27017 cloud security controls — the cloud service model, shared responsibility between provider and customer, and cloud-specific extensions to ISO 27001 controls. Use when a cloud or SaaS company with ISO 27001 wants to assess its own cloud controls for the 27017 extension or clarify what its cloud provider covers.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# ISO 27017 Assessment

Assess ISO/IEC 27017:2015 cloud security controls for "$ARGUMENTS". Identify the cloud service model, establish shared responsibility boundaries, and evaluate cloud-specific security controls that extend the ISO 27001 baseline.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-iso27017","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Assess) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-iso27017","workflow":"compliance","phase":1,"project":"<project>","event":"refused","artifact":"01-assess/","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-iso27017","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **Cloud service model identification:**
   - Determine cloud service model(s) in use: IaaS, PaaS, SaaS, or hybrid
   - Identify cloud service provider(s) and their certifications
   - Map cloud deployment models: public, private, hybrid, multi-cloud

3. **Shared responsibility boundaries:**
   - Define responsibility split between cloud service provider (CSP) and cloud service customer (CSC)
   - Map each ISO 27001 Annex A control to responsible party (CSP, CSC, or shared)
   - Document CSP compliance attestations and certifications relied upon
   - Identify controls where responsibility is ambiguous or undocumented

4. **Cloud-specific controls assessment:**
   - **Virtual machine hardening** — assess VM image management, secure configuration, hardening baselines
   - **Cloud service monitoring** — assess monitoring of cloud resources, tenant activity logging, anomaly detection
   - **Cloud network security** — assess virtual network segmentation, security groups, cloud firewalls, traffic encryption
   - **Multi-tenant isolation** — assess tenant separation, data isolation, compute isolation, resource boundaries
   - **Data location** — assess data residency awareness, geographic restrictions, data sovereignty compliance
   - **Cloud backup** — assess cloud-native backup strategies, cross-region replication, recovery testing
   - **Secure development in cloud** — assess cloud-native development practices, container security, serverless security, CI/CD pipeline security
   - Score each control: Implemented / Partially Implemented / Not Implemented / CSP Managed

5. **ISO 27001 base control extensions:**
   - For each ISO 27001 Annex A control, assess cloud-specific extensions defined in ISO 27017
   - Identify controls requiring additional cloud-specific implementation beyond ISO 27001 baseline
   - Document where ISO 27001 controls are sufficient vs. where cloud extensions are needed

6. **CSP compliance reliance:**
   - Assess which controls are fully delegated to CSP
   - Verify CSP certifications and audit reports (SOC 2, ISO 27001, ISO 27017)
   - Identify risks from CSP reliance (single provider dependency, audit gaps)

7. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/iso27017.md` following the assessment template structure with:
   - **Cloud Service Model** — service and deployment model identification
   - **Shared Responsibility Map** — control ownership by CSP/CSC/shared
   - **Cloud-Specific Controls Assessment** — all cloud controls scored
   - **ISO 27001 Extensions** — additional cloud requirements beyond base controls
   - **CSP Compliance Reliance** — provider certifications and dependency risks
   - **Overall Compliance Score** — score = (Implemented + 0.5 × Partially Implemented) ÷ assessed controls, as a percentage, counting CSP Managed as Implemented only where step 6 verified a current CSP certification covering it (otherwise as Partially Implemented); show it with a heatmap
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The ISO 27017 assessment written to `.singularskills/compliance/<project>/01-assess/iso27017.md`. Present a summary to the user highlighting:
- Cloud service model and provider(s) assessed
- Shared responsibility gaps (controls with unassigned or unclear CSP/CSC ownership)
- Top 3 cloud-specific control gaps
- CSP reliance risks

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-iso27017","workflow":"compliance","phase":1,"project":"<project>","event":"finished","artifact":"01-assess/","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-iso27017
workflow: compliance
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
