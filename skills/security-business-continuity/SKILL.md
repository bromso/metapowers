---
name: security-business-continuity
description: Create a business continuity plan — critical functions and dependencies, RPO and RTO per function, continuity strategies, disruption scenarios, roles, communication and tabletop exercises. Use when the user asks how the business keeps serving customers while systems, suppliers or key people are unavailable. Not for an ISO 22301 readiness assessment; see /compliance-iso22301.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 5
  artifact: 05-recover.md
---

# Business Continuity

Create a business continuity plan for "$ARGUMENTS" with critical business function identification, RPO/RTO targets, continuity strategies, disruption scenarios, and tabletop exercise planning.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for continuity workflow reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and risk appetite

2. **Identify critical business functions and dependencies:**
   - List all business functions (revenue-generating, customer-facing, internal operations, compliance)
   - Rank by business impact: what is the cost per hour of downtime for each function?
   - Map technology dependencies for each function (applications, databases, third-party services, infrastructure)
   - Identify single points of failure in dependency chains
   - Map personnel dependencies (key person risk for critical functions)

3. **Set RPO and RTO per function:**
   - **RPO (Recovery Point Objective)** — maximum acceptable data loss per function
   - **RTO (Recovery Time Objective)** — maximum acceptable downtime per function
   - Align with business SLAs and contractual obligations
   - Consider regulatory requirements for availability (financial services, healthcare)
   - Document cost implications of different RPO/RTO levels to support investment decisions

4. **Define continuity strategies:**
   - **Active-active** — multiple live instances serving traffic simultaneously (lowest RTO, highest cost)
   - **Active-passive** — standby environment ready to activate on failure (moderate RTO, moderate cost)
   - **Cold standby** — infrastructure provisioned on demand during disaster (highest RTO, lowest cost)
   - **Manual workaround** — business process can continue without technology for limited period
   - Select strategy per function based on RPO/RTO requirements and budget constraints
   - Document decision rationale for each function

5. **Plan for disruption scenarios:**
   - **Data center / cloud region failure** — failover to secondary region, DNS-based routing, data replication lag impact
   - **Cloud provider outage** — multi-cloud strategy assessment, portable workload design, manual fallback
   - **Ransomware** — air-gapped backup restoration, clean environment rebuild, negotiation policy (pay/don't pay)
   - **Key person unavailable** — cross-training, documentation, deputy assignments, knowledge base
   - **Extended power/network outage** — remote work activation, communication alternatives, manual processes
   - For each scenario: trigger conditions, response actions, communication plan, recovery steps

6. **Define communication plan during disruption:**
   - Internal communication: who is notified, how, and at what cadence
   - Customer communication: status page, email, social media, support channels
   - Partner/vendor communication: SLA impact notifications, joint response coordination
   - Regulatory communication: if disruption affects compliance obligations

7. **Define roles and responsibilities:**
   - Business Continuity Manager: owns BCP activation and coordination
   - Function owners: responsible for their function's continuity procedures
   - IT/Engineering: responsible for technical failover and recovery
   - Communications: responsible for stakeholder updates
   - Define activation authority: who can declare a business continuity event

8. **Plan tabletop exercises:**
   - Conduct at minimum annually, more frequently for critical functions
   - Design realistic scenarios based on threat landscape and past incidents
   - Involve all key roles: business, technology, communications, legal
   - Document exercise findings: what worked, what failed, what was unclear
   - Update BCP based on exercise findings
   - Track improvement actions from exercises to completion

9. **Write the artifact** — append to `.singularskills/security/<project>/05-recover.md` under a `## Business Continuity` section. Create the file with a `# Recover — <project>` heading if it does not exist; if a `## Business Continuity` section already exists, replace only that section. The section contains:

   ### Business Continuity Plan

   Include sections:
   - **Critical Functions** — ranked list with dependencies and single points of failure
   - **RPO/RTO Targets** — per function with cost justification
   - **Continuity Strategies** — selected approach per function with rationale
   - **Disruption Scenarios** — response plans per scenario type
   - **Communication Plan** — stakeholder communication during disruption
   - **Roles and Responsibilities** — BCP team structure and activation authority
   - **Tabletop Exercise Plan** — schedule, scenarios, and improvement tracking

## Output

The business continuity plan appended to `.singularskills/security/<project>/05-recover.md`. Present a summary to the user highlighting:
- Critical business functions and their RPO/RTO targets
- Continuity strategy selected per function
- Key disruption scenarios planned for
- Tabletop exercise schedule and approach

**Record the run.** This artifact is shared by every skill of phase 5 (Recover). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Recover
workflow: security
phase: 5
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Business Continuity` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-business-continuity`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Business Continuity` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
