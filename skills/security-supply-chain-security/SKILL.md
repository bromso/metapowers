---
name: security-supply-chain-security
description: Assess the security of the vendors a business relies on — SaaS, cloud, contractors, open-source suppliers — rating each by criticality, data access and evidence such as SOC 2 into risk tiers. Use when the user asks which vendors could expose them or wants each supplier's security rated. Not for reviewing the vendor-risk process itself for an audit; see /compliance-vendor-tprm.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 0
  artifact: 00-govern.md
---

# Supply Chain Security

Assess and manage third-party and supply chain security risks for "$ARGUMENTS". Inventory vendors and dependencies, evaluate their security posture, and establish ongoing monitoring practices.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-supply-chain-security","workflow":"security","phase":0,"project":"<project>","event":"skipped","artifact":"00-govern.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Govern) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole NIST CSF workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After your section's italic line, add a `### Recalled` subsection of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-supply-chain-security","workflow":"security","phase":0,"project":"<project>","event":"started","artifact":"00-govern.md","note":""}`.

None — this is a Phase 0 Govern skill.

## Process

1. **Inventory third-party vendors and dependencies:**
   - Enumerate all third-party relationships: SaaS providers, cloud services, open-source libraries, contractors, managed service providers, payment processors
   - For each vendor/dependency, document: name, purpose, contract status, data shared, integration type (API, SDK, data feed, physical access)
   - Include both direct vendors and transitive dependencies (vendors of vendors where known)

2. **Assess each by criticality and data access:**
   - **Criticality rating** — what happens if this vendor is unavailable or compromised?
     - Critical: business stops, customer data exposed
     - High: significant operational impact, sensitive data at risk
     - Medium: degraded capability, internal data exposure
     - Low: minimal impact, no sensitive data
   - **Data access classification** — what data does the vendor access, process, or store?
   - **Integration depth** — how deeply embedded is the vendor in operations?

3. **Evaluate vendor security posture:**
   - Review available evidence per vendor:
     - **Certifications** — SOC 2 Type II, ISO 27001, PCI DSS, FedRAMP
     - **Security questionnaires** — SIG, CAIQ, or custom questionnaire responses
     - **Penetration test reports** — third-party test results and remediation status
     - **Incident history** — known breaches, response quality, disclosure transparency
     - **Security policies** — published security practices and commitments
   - Score each vendor's posture: Strong, Adequate, Weak, Unknown

4. **Define vendor security requirements:**
   - Establish minimum security requirements by vendor tier:
     - Critical vendors: SOC 2 Type II, annual pen test, incident notification SLA, right to audit
     - High vendors: SOC 2 or equivalent certification, security questionnaire, incident notification
     - Medium vendors: security questionnaire, data processing agreement
     - Low vendors: standard terms review, basic security assessment
   - Define contractual security clauses to include in vendor agreements

5. **Create vendor risk tiers:**
   - Combine criticality, data access, and security posture into an overall risk tier
   - Assign each vendor to a tier (Tier 1: highest risk, Tier 4: lowest risk)
   - Define management activities per tier (review frequency, monitoring depth, escalation procedures)
   - Identify vendors requiring immediate risk remediation

6. **Write the artifact** — append to `.singularskills/security/<project>/00-govern.md` under a `## Supply Chain Security` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Supply Chain Security` section already exists, replace only that section. The section contains:

   ### Supply Chain Security Assessment

   Include sections:
   - **Vendor Inventory** — complete list with purpose, data access, and integration type
   - **Criticality Assessment** — criticality and data classification per vendor
   - **Security Posture Evaluation** — evidence reviewed and posture score per vendor
   - **Vendor Risk Tiers** — tier assignment with rationale
   - **Security Requirements** — minimum requirements by tier
   - **Monitoring Plan** — ongoing assessment schedule and triggers for re-evaluation

## Output

The supply chain security assessment appended to `.singularskills/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Total vendors inventoried and distribution across risk tiers
- Vendors with weak or unknown security posture requiring attention
- Critical vendors and their current compliance status
- Recommended immediate actions for highest-risk vendors

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-supply-chain-security","workflow":"security","phase":0,"project":"<project>","event":"finished","artifact":"00-govern.md","note":""}`.

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

Open your `## Supply Chain Security` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `security-supply-chain-security`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Supply Chain Security` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
