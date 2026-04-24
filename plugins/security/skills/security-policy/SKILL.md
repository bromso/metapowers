---
description: Define organizational security policies, standards, and procedures
---

# Security Policy

Define organizational security policies, standards, and procedures for "$ARGUMENTS". Establish the foundational policy framework that governs all security activities across the organization.

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
   - Read `plugins/security/shared/nist-csf-guide.md` for framework alignment
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

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/00-govern.md` with heading:

   ## Security Policy Framework

   Include sections:
   - **Policy Inventory** — list of all policies with owner and review date
   - **Individual Policies** — full text of each drafted policy
   - **Framework Alignment** — NIST CSF mapping for each policy
   - **Review Schedule** — cadence and next review dates
   - **Exception Process** — how deviations are requested and approved

## Output

The security policy framework written to `.metapowers/security/$ARGUMENTS/00-govern.md`. Present a summary to the user highlighting:
- Number of policies drafted and their scope
- Key requirements per policy area
- Framework alignment coverage
- Review schedule and governance structure
