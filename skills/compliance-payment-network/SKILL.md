---
name: compliance-payment-network
description: Assess payment network compliance — Nacha ACH rules, Visa and Mastercard rules and registrations, state money transmitter licenses and FinCEN MSB registration. Use when a fintech moves money or runs card programs and wants to assess its own licensing coverage and adherence to ACH and card network rules.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# Payment Network Compliance Assessment

Assess payment network compliance for "$ARGUMENTS". Evaluate Nacha ACH Operating Rules, card network requirements, and state money transmitter licensing obligations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"compliance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **Nacha ACH Operating Rules:**
   - Assess authorization requirements (consumer and corporate, written/electronic/oral)
   - Evaluate ACH processing procedures (origination, file formatting, settlement timelines)
   - Review return handling procedures (return reason codes, timeframes, re-initiation rules)
   - Assess risk management requirements (exposure limits, monitoring, ACH audit)
   - Evaluate Nacha Third-Party Sender (TPS) registration and obligations if applicable
   - Review WEB debit authorization and fraud detection requirements
   - Assess compliance with Supplementary Fraud Detection Standards for WEB debits

3. **Visa Core Rules and Product Rules:**
   - Assess compliance with Visa Core Rules and Visa Product and Service Rules for card programs
   - Evaluate BIN sponsorship arrangement and registered agent/third-party agent status
   - Review cardholder agreement and disclosure requirements
   - Assess dispute resolution and chargeback management procedures
   - Evaluate Visa Operating Regulations for program-specific requirements (prepaid, credit, debit)
   - Review PCI DSS compliance requirements as mandated by Visa

4. **Mastercard Standards and Rules:**
   - Assess compliance with Mastercard Standards (formerly Mastercard Rules)
   - Evaluate registration requirements (Service Provider, Payment Facilitator, Staged Digital Wallet Operator)
   - Review Mastercard Identity Check and Strong Customer Authentication requirements
   - Assess chargeback and dispute management compliance
   - Evaluate Mastercard program-specific requirements for applicable products

5. **State money transmitter licensing:**
   - Determine which states require money transmitter licenses (MTL) based on business model
   - Assess applicability of exemptions (bank exemption, agent of the payee, licensed entity agent)
   - Review current licensing status across all required states
   - Evaluate NMLS (Nationwide Multistate Licensing System) registration and filings
   - Assess bonding, net worth, and permissible investment requirements per state
   - Review state examination and reporting obligations (call reports, audited financials)
   - Evaluate Uniform Money Services Act adoption in applicable states

6. **Federal registration requirements:**
   - Assess Money Services Business (MSB) registration with FinCEN
   - Evaluate biennial renewal and update filing compliance
   - Review state-level MSB registration requirements where applicable
   - Assess compliance with MSB-specific BSA/AML program requirements

7. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/payment-network.md` following the assessment template structure with:
    - **ACH Compliance** — Nacha rule adherence, authorization, returns, and risk management
    - **Visa Compliance** — Core Rules adherence, registration, and program requirements
    - **Mastercard Compliance** — Standards adherence, registration, and program requirements
    - **State Licensing** — MTL coverage map, exemption analysis, and gap identification
    - **Federal Registration** — FinCEN MSB status and BSA/AML program
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The payment network assessment written to `.singularskills/compliance/<project>/01-assess/payment-network.md`. Present a summary to the user highlighting:
- ACH rule compliance status and key gaps
- Card network registration and compliance status
- State licensing coverage and gaps (number of states licensed vs. required)
- Top 3 gaps requiring remediation

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-payment-network
workflow: compliance
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
