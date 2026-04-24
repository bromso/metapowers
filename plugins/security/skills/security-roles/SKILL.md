---
description: Define security roles, responsibilities, and RACI matrix
---

# Security Roles

Define security roles, responsibilities, and RACI matrix for "$ARGUMENTS". Establish clear ownership of security activities and identify gaps in current organizational coverage.

## Prerequisites

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

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/00-govern.md` with heading:

   ## Security Roles & Responsibilities

   Include sections:
   - **Role Definitions** — each role with responsibilities, skills, and reporting line
   - **RACI Matrix** — activities vs. roles matrix
   - **Staffing Gaps** — identified gaps and single points of failure
   - **Organizational Recommendations** — proposed structure and hiring priorities
   - **Security Champions Program** — structure and implementation plan

## Output

The security roles and RACI matrix written to `.metapowers/security/$ARGUMENTS/00-govern.md`. Present a summary to the user highlighting:
- Roles defined and their primary responsibilities
- Critical staffing gaps identified
- Key RACI assignments for high-priority activities
- Top organizational recommendations
