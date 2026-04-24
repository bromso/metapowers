---
description: Design security training program by role
---

# Security Training

Design a security awareness and training program for "$ARGUMENTS" with role-based modules, training cadence, completion tracking, and assessment questions.

## Process

1. **Define training audiences:**
   - **All employees** — baseline security awareness for the entire organization
   - **Developers** — secure coding practices and application security
   - **Operations / DevOps** — infrastructure security and incident response
   - **Security team** — advanced security skills and certifications
   - **Leadership / executives** — risk governance, compliance, and security investment decisions
   - Identify audience-specific risk profiles and knowledge gaps

2. **Design modules per audience:**

   **All employees (baseline awareness):**
   - Phishing and social engineering recognition (email, phone, SMS, physical)
   - Password hygiene and authentication best practices (password managers, MFA)
   - Safe browsing and email handling (suspicious links, attachments, downloads)
   - Data handling and classification (what is sensitive, how to handle it)
   - Physical security awareness (badge access, clean desk, visitor policy)
   - Reporting security incidents (what to report, how to report, no-blame culture)
   - Remote work security (VPN, public Wi-Fi, device security)

   **Developers (secure development):**
   - OWASP Top 10 vulnerabilities with hands-on examples
   - Secure coding practices for the organization's technology stack
   - Input validation, output encoding, and parameterized queries
   - Authentication and session management implementation
   - Secrets management in code and configuration
   - Secure code review techniques and checklist
   - Dependency management and supply chain security
   - Security testing integration (SAST, DAST, SCA in CI/CD)

   **Operations / DevOps (infrastructure security):**
   - Infrastructure-as-code security and hardening
   - Cloud security posture management (IAM, network, storage, logging)
   - Container and Kubernetes security
   - Network security and segmentation
   - Monitoring, logging, and alerting for security events
   - Incident response procedures and on-call responsibilities
   - Backup and disaster recovery procedures

   **Security team (advanced skills):**
   - Threat intelligence analysis and application
   - Digital forensics and incident investigation
   - Penetration testing and red team exercises
   - Security architecture review and design
   - Emerging threats and attack techniques
   - Certification paths (CISSP, CEH, OSCP, SANS courses)

   **Leadership (risk governance):**
   - Cybersecurity risk landscape and business impact
   - Regulatory compliance obligations and liability
   - Security investment decision-making and ROI
   - Incident response governance and communication
   - Third-party and supply chain risk oversight
   - Board-level reporting on security posture

3. **Set training cadence:**
   - **All employees:** annual mandatory training + quarterly phishing simulations + monthly security tips
   - **Developers:** annual secure coding training + quarterly lunch-and-learn + on-demand for new technologies
   - **Operations:** annual infrastructure security training + quarterly tabletop exercises
   - **Security team:** continuous professional development + annual certification renewal
   - **Leadership:** semi-annual briefing + annual board-level security update
   - New hire onboarding: security training within first week

4. **Define completion tracking:**
   - Track training completion by employee, department, and role
   - Set compliance targets (e.g., 95% completion within 30 days of assignment)
   - Escalate non-completion to managers after 2 reminders
   - Report completion metrics to leadership monthly
   - Maintain training records for compliance audits (retain for 3+ years)

5. **Create assessment questions:**
   - Design knowledge checks per module (minimum 5 questions per module)
   - Include scenario-based questions testing practical application
   - Set passing threshold (80% minimum)
   - Require remediation training for failed assessments
   - Track assessment scores to identify knowledge gaps across the organization

6. **Plan training delivery:**
   - Mix of formats: e-learning modules, live workshops, hands-on labs, simulations
   - Phishing simulation program with graduated difficulty
   - Gamification elements where appropriate (leaderboards, badges, recognition)
   - Localization for distributed teams if applicable
   - Measure training effectiveness through phishing simulation click rates and incident reduction

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/security-training.md` with heading:

   ## Security Training Program

   Include sections:
   - **Training Audiences** — role definitions and risk profiles
   - **Module Catalog** — per-audience training modules with objectives
   - **Training Cadence** — schedule and frequency per audience
   - **Completion Tracking** — metrics, targets, and escalation procedures
   - **Assessment Framework** — question design, passing thresholds, and remediation
   - **Delivery Plan** — formats, tools, and effectiveness measurement

## Output

The security training program written to `.metapowers/security/$ARGUMENTS/security-training.md`. Present a summary to the user highlighting:
- Training audiences and their specific module focus
- Key modules per role with learning objectives
- Training cadence and compliance targets
- Assessment approach and effectiveness measurement
