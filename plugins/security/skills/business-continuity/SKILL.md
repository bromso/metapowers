---
name: business-continuity
description: Create a business continuity plan — critical functions and dependencies, RPO and RTO per function, continuity strategies, disruption scenarios, roles, communication and tabletop exercises. Use when the user asks how the business keeps serving customers while systems, suppliers or key people are unavailable. Not for an ISO 22301 readiness assessment; see /compliance:iso22301.
argument-hint: "[project] [--skip-checks]"
---

# Business Continuity

Create a business continuity plan for "$ARGUMENTS" with critical business function identification, RPO/RTO targets, continuity strategies, disruption scenarios, and tabletop exercise planning.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security:security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/incident-response-template.md` for continuity workflow reference
   - Read `.metapowers/security/<project>/00-govern.md` for organizational context and risk appetite

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

9. **Write the artifact** — append to `.metapowers/security/<project>/05-recover.md` under a `## Business Continuity` section. Create the file with a `# Recover — <project>` heading if it does not exist; if a `## Business Continuity` section already exists, replace only that section. The section contains:

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

The business continuity plan appended to `.metapowers/security/<project>/05-recover.md`. Present a summary to the user highlighting:
- Critical business functions and their RPO/RTO targets
- Continuity strategy selected per function
- Key disruption scenarios planned for
- Tabletop exercise schedule and approach
