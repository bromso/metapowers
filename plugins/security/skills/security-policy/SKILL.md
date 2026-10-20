---
name: security-policy
description: Draft an organization's core security policies — information security, acceptable use, data protection, access, incident response, continuity — with owners, NIST CSF mapping and review dates. Use when the user needs written security policies or is starting a security program with nothing on paper. Not for which policies an audit requires; see /compliance:policy-gaps.
argument-hint: "[project] [--skip-checks]"
---

# Security Policy

Define organizational security policies, standards, and procedures for "$ARGUMENTS". Establish the foundational policy framework that governs all security activities across the organization.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

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
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/nist-csf-guide.md` for framework alignment
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

6. **Write the artifact** — append to `.metapowers/security/<project>/00-govern.md` under a `## Security Policy` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Security Policy` section already exists, replace only that section. The section contains:

   ### Security Policy Framework

   Include sections:
   - **Policy Inventory** — list of all policies with owner and review date
   - **Individual Policies** — full text of each drafted policy
   - **Framework Alignment** — NIST CSF mapping for each policy
   - **Review Schedule** — cadence and next review dates
   - **Exception Process** — how deviations are requested and approved

## Output

The security policy framework appended to `.metapowers/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Number of policies drafted and their scope
- Key requirements per policy area
- Framework alignment coverage
- Review schedule and governance structure

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
