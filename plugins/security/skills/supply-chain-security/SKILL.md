---
name: supply-chain-security
description: Assess the security of the vendors a business relies on — SaaS, cloud, contractors, open-source suppliers — rating each by criticality, data access and evidence such as SOC 2 into risk tiers. Use when the user asks which vendors could expose them or wants each supplier's security rated. Not for reviewing the vendor-risk process itself for an audit; see /compliance:vendor-tprm.
argument-hint: "[project] [--skip-checks]"
---

# Supply Chain Security

Assess and manage third-party and supply chain security risks for "$ARGUMENTS". Inventory vendors and dependencies, evaluate their security posture, and establish ongoing monitoring practices.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

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

6. **Write the artifact** — append to `.metapowers/security/<project>/00-govern.md` under a `## Supply Chain Security` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Supply Chain Security` section already exists, replace only that section. The section contains:

   ### Supply Chain Security Assessment

   Include sections:
   - **Vendor Inventory** — complete list with purpose, data access, and integration type
   - **Criticality Assessment** — criticality and data classification per vendor
   - **Security Posture Evaluation** — evidence reviewed and posture score per vendor
   - **Vendor Risk Tiers** — tier assignment with rationale
   - **Security Requirements** — minimum requirements by tier
   - **Monitoring Plan** — ongoing assessment schedule and triggers for re-evaluation

## Output

The supply chain security assessment appended to `.metapowers/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Total vendors inventoried and distribution across risk tiers
- Vendors with weak or unknown security posture requiring attention
- Critical vendors and their current compliance status
- Recommended immediate actions for highest-risk vendors
