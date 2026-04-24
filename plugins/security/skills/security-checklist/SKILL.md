---
description: Generate security checklist for a specific context
---

# Security Checklist

Generate a context-specific security checklist for "$ARGUMENTS" covering applicable security areas, scoring each item, identifying blockers, and prioritizing by risk.

## Process

1. **Determine context from $ARGUMENTS:**
   - Identify the checklist context: new service deployment, API launch, cloud migration, pre-release, vendor onboarding, infrastructure change, or other
   - If context is unclear, ask the user to specify the scenario

2. **Generate context-specific checklist:**

   **Authentication and authorization:**
   - [ ] Authentication mechanism implemented and tested (OAuth 2.0, OIDC, SAML)
   - [ ] MFA enforced for privileged accounts
   - [ ] RBAC/ABAC configured with least-privilege principles
   - [ ] Session management secure (timeouts, token rotation, secure cookies)
   - [ ] Service-to-service authentication in place (mTLS, API keys, JWT)

   **Data protection:**
   - [ ] Data classification applied to all data types
   - [ ] Encryption at rest enabled for sensitive data
   - [ ] Encryption in transit enforced (TLS 1.2+ minimum)
   - [ ] PII handling compliant with applicable regulations
   - [ ] Data retention and deletion policies defined

   **Logging and monitoring:**
   - [ ] Security events logged (auth, access, changes, errors)
   - [ ] Log aggregation and centralized storage configured
   - [ ] Alerting rules configured for security-critical events
   - [ ] Log retention meets compliance requirements
   - [ ] Audit trail tamper-resistant

   **Dependencies and supply chain:**
   - [ ] Dependencies scanned for known vulnerabilities
   - [ ] Dependency lock files committed and reviewed
   - [ ] License compliance verified
   - [ ] Container base images from trusted registries
   - [ ] SBOM generated and maintained

   **Secrets management:**
   - [ ] No secrets in source code or configuration files
   - [ ] Secrets stored in vault/KMS with access controls
   - [ ] Secret rotation schedule defined
   - [ ] Service account credentials scoped to minimum required permissions

   **Infrastructure:**
   - [ ] Infrastructure defined as code and version-controlled
   - [ ] Network segmentation and firewall rules configured
   - [ ] Unused ports and services disabled
   - [ ] Cloud security posture validated (security groups, IAM policies, public access)
   - [ ] Backup and disaster recovery tested

   **Compliance:**
   - [ ] Applicable regulatory requirements identified
   - [ ] Privacy impact assessment completed (if applicable)
   - [ ] Security review or pen test completed
   - [ ] Incident response plan covers new component
   - [ ] Third-party risk assessment completed (if vendor involved)

3. **Score each item:**
   - Mark each item as: Done, Not Done, N/A, or Partial
   - Calculate completion percentage overall and per category
   - Identify items that are blockers for go-live vs. items that can be addressed post-launch with accepted risk

4. **Prioritize by risk:**
   - Rank not-done items by risk impact (what is the worst-case scenario if this is missing?)
   - Identify must-fix items before proceeding vs. acceptable-risk items
   - Provide remediation guidance for each not-done item

5. **Write the artifact** to `.metapowers/security/$ARGUMENTS/security-checklist.md` with heading:

   ## Security Checklist

   Include sections:
   - **Context** — scenario and scope of checklist
   - **Checklist** — all items with status (Done/Not Done/N/A/Partial)
   - **Score Summary** — completion percentage per category and overall
   - **Blockers** — must-fix items before proceeding
   - **Risk-Accepted Items** — items deferred with documented risk acceptance
   - **Remediation Guidance** — how to address each not-done item

   Alternatively, present the checklist directly to the user if no output file is appropriate.

## Output

The security checklist written to `.metapowers/security/$ARGUMENTS/security-checklist.md` or presented directly. Present a summary to the user highlighting:
- Overall completion score
- Critical blockers that must be addressed
- Items deferred with risk acceptance
- Top priority remediation actions
