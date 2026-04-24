# Incident Response Plan — {{ORGANIZATION}}

> **Version:** 1.0  
> **Last Updated:** {{DATE}}  
> **Plan Owner:** {{OWNER}}  
> **Next Review:** {{DATE + 6 months}}  
> **Status:** Draft | Approved | Active

---

## 1. Incident Classification

| Priority | Severity | Criteria | Response Time | Update Cadence |
|----------|----------|----------|---------------|----------------|
| **P1 — Critical** | Critical | Active data breach, ransomware, complete service outage, active exploitation of critical vulnerability | Immediate (< 15 min) | Every 30 minutes |
| **P2 — High** | High | Significant security event affecting production systems, partial data exposure, privilege escalation | < 1 hour | Every 2 hours |
| **P3 — Medium** | Medium | Contained security event, phishing with limited impact, vulnerability with no active exploitation | < 4 hours | Daily |
| **P4 — Low** | Low | Minor policy violation, failed attack attempt, security awareness issue | < 24 hours | As needed |

### Classification Decision Tree

1. Is there active unauthorized access to sensitive data? → **P1**
2. Are production systems impaired or at immediate risk? → **P1** or **P2**
3. Is the scope contained with no ongoing exploitation? → **P3**
4. Is this informational with no confirmed impact? → **P4**

---

## 2. Response Team Roles

### Incident Commander (IC)

- **Primary:** {{Name, contact}}
- **Backup:** {{Name, contact}}
- **Responsibilities:**
  - Owns overall incident response and decision-making authority
  - Declares incident severity and escalation level
  - Coordinates cross-functional response activities
  - Authorizes containment actions that impact production
  - Ensures post-incident review is completed

### Technical Lead

- **Primary:** {{Name, contact}}
- **Backup:** {{Name, contact}}
- **Responsibilities:**
  - Leads technical investigation and forensic analysis
  - Directs containment, eradication, and recovery actions
  - Provides technical situation reports to the IC
  - Preserves evidence and maintains chain of custody
  - Documents technical timeline and root cause

### Communications Lead

- **Primary:** {{Name, contact}}
- **Backup:** {{Name, contact}}
- **Responsibilities:**
  - Drafts internal and external communications
  - Manages stakeholder notifications (customers, partners, regulators)
  - Coordinates with PR/marketing for public statements
  - Maintains communication log
  - Ensures consistent messaging across all channels

### Legal Counsel

- **Primary:** {{Name, contact}}
- **Backup:** {{Name, contact}}
- **Responsibilities:**
  - Advises on regulatory notification requirements (GDPR, CCPA, etc.)
  - Guides evidence preservation and legal hold procedures
  - Assesses liability and contractual obligations
  - Coordinates with external legal counsel if needed
  - Reviews all external communications before release

### Executive Sponsor

- **Primary:** {{Name, contact}}
- **Backup:** {{Name, contact}}
- **Responsibilities:**
  - Authorizes budget and resource allocation for response
  - Serves as escalation point for business-critical decisions
  - Communicates with board, investors, and C-suite peers
  - Approves public-facing communications for P1 incidents

---

## 3. Response Phases

### Phase 1: Detection and Triage

**Objective:** Confirm the incident, assess initial scope, and classify severity.

- [ ] Alert received and acknowledged (record source, time, and initial details)
- [ ] Initial assessment: is this a true positive or false positive?
- [ ] Assign incident ID: `INC-{{YYYY}}-{{NNN}}`
- [ ] Classify severity (P1–P4) using the classification criteria above
- [ ] Activate response team based on severity level
- [ ] Open incident channel (e.g., dedicated Slack channel or war room)
- [ ] Begin incident timeline documentation
- [ ] Notify stakeholders per the escalation matrix

### Phase 2: Containment

**Objective:** Limit the blast radius and prevent further damage.

**Short-term containment:**
- [ ] Isolate affected systems (network segmentation, firewall rules)
- [ ] Disable compromised accounts and revoke tokens/sessions
- [ ] Block malicious IPs, domains, or hashes
- [ ] Preserve system state before changes (snapshots, memory dumps)

**Long-term containment:**
- [ ] Apply temporary patches or workarounds
- [ ] Increase monitoring on affected and adjacent systems
- [ ] Restrict access to affected environments
- [ ] Validate containment effectiveness (confirm no lateral movement)

### Phase 3: Eradication

**Objective:** Remove the threat actor, malware, or vulnerability from the environment.

- [ ] Identify and remove all persistence mechanisms (backdoors, scheduled tasks, implants)
- [ ] Patch or remediate the exploited vulnerability
- [ ] Reset all potentially compromised credentials
- [ ] Scan for indicators of compromise (IOCs) across the full environment
- [ ] Verify eradication with independent validation (different tool or team)
- [ ] Update detection signatures and rules based on findings

### Phase 4: Recovery

**Objective:** Restore systems to normal operations and verify integrity.

- [ ] Restore systems from known-good backups or rebuild from infrastructure-as-code
- [ ] Verify data integrity (checksums, audit logs, database consistency)
- [ ] Gradually restore network connectivity and access
- [ ] Monitor restored systems with heightened alerting for 72 hours minimum
- [ ] Confirm business operations are functioning normally
- [ ] Communicate recovery status to all stakeholders
- [ ] Stand down war room when stability is confirmed

### Phase 5: Post-Incident Review

**Objective:** Learn from the incident and improve defenses.

- [ ] Schedule post-incident review within 5 business days of resolution
- [ ] Complete the Post-Incident Review template (see Section 8)
- [ ] Identify root cause and contributing factors
- [ ] Document what went well and what needs improvement
- [ ] Create action items with owners and deadlines
- [ ] Update runbooks, playbooks, and detection rules
- [ ] Share anonymized lessons learned with the broader organization

---

## 4. Escalation Matrix

| Severity | Who to Notify | When | Method |
|----------|--------------|------|--------|
| **P1 — Critical** | IC, Technical Lead, Legal, Executive Sponsor, CISO | Immediately | Phone call + incident channel |
| **P2 — High** | IC, Technical Lead, Security Team Lead | Within 1 hour | Incident channel + page |
| **P3 — Medium** | Security Team Lead, On-call engineer | Within 4 hours | Incident channel |
| **P4 — Low** | Security team (next business day) | Within 24 hours | Ticket |

### External Escalation

| Condition | Contact | Timeline |
|-----------|---------|----------|
| Customer data breach (GDPR) | Data Protection Authority | Within 72 hours of awareness |
| Customer data breach (CCPA) | California AG + affected individuals | Without unreasonable delay |
| Critical infrastructure (CISA) | CISA | Within 72 hours |
| Law enforcement involvement | Legal Counsel first, then FBI/IC3 | As directed by Legal |
| Cyber insurance claim | Insurance broker | Within 24 hours |

---

## 5. Communication Templates

### Internal Alert

```
SECURITY INCIDENT — {{SEVERITY}}
Incident ID: INC-{{YYYY}}-{{NNN}}
Time Detected: {{TIMESTAMP UTC}}
Incident Commander: {{NAME}}

Summary: {{1-2 sentence description of what happened}}

Impact: {{Known scope — systems, data, users affected}}

Current Status: {{Detection / Containment / Eradication / Recovery}}

Actions Required: {{What team members should do or avoid}}

Next Update: {{TIME}}

Join the incident channel: #{{CHANNEL_NAME}}
```

### Customer Notice

```
Subject: Security Incident Notification — {{ORGANIZATION}}

Dear {{CUSTOMER}},

We are writing to inform you of a security incident that may affect
your data. We detected this issue on {{DATE}} and immediately began
our response.

What happened: {{Clear, non-technical description}}

What data was involved: {{Specific data types affected}}

What we are doing: {{Actions taken and ongoing measures}}

What you can do: {{Recommended actions — password reset, monitoring, etc.}}

For questions, contact our dedicated response team at:
{{EMAIL}} | {{PHONE}}

We sincerely apologize for any concern this may cause and are
committed to protecting your information.

{{SIGNATURE}}
```

### Regulatory Notification

```
NOTIFICATION OF PERSONAL DATA BREACH

Reporting Organization: {{ORGANIZATION}}
DPO Contact: {{NAME, EMAIL, PHONE}}
Date of Awareness: {{DATE}}
Date of Breach (if different): {{DATE}}

Nature of Breach:
☐ Confidentiality  ☐ Integrity  ☐ Availability

Categories of Data Subjects: {{e.g., customers, employees}}
Approximate Number of Data Subjects: {{NUMBER}}
Categories of Personal Data: {{e.g., name, email, financial}}
Approximate Number of Records: {{NUMBER}}

Likely Consequences: {{Description of potential impact}}

Measures Taken: {{Actions to address the breach and mitigate effects}}

Cross-Border: ☐ Yes  ☐ No
If yes, jurisdictions affected: {{LIST}}
```

### Media Statement

```
{{ORGANIZATION}} Statement Regarding Security Incident
{{DATE}}

{{ORGANIZATION}} recently identified a security incident affecting
{{SCOPE}}. Upon discovery, we immediately activated our incident
response procedures and engaged {{third-party forensic firm / law
enforcement / regulatory bodies as applicable}}.

We are committed to transparency and will provide updates as our
investigation progresses. The security of our {{customers / users /
partners}} remains our top priority.

For inquiries: {{MEDIA_CONTACT_EMAIL}}
```

---

## 6. Evidence Preservation Checklist

- [ ] **Do not reboot or power off affected systems** until evidence is captured
- [ ] Capture volatile data first: running processes, network connections, memory
- [ ] Take full disk images (forensic bit-for-bit copies)
- [ ] Preserve all relevant logs (application, system, network, authentication)
- [ ] Screenshot active sessions, error messages, and anomalous displays
- [ ] Export cloud audit trails (CloudTrail, Activity Log, Audit Log)
- [ ] Record chain of custody: who handled what evidence, when, and how
- [ ] Store evidence in write-protected, access-controlled location
- [ ] Hash all evidence files (SHA-256) and record hashes
- [ ] Maintain a separate evidence inventory log with:
  - Evidence ID
  - Description
  - Source system
  - Collection time (UTC)
  - Collected by
  - Hash value
  - Storage location

---

## 7. Contact Directory

| Role | Name | Phone | Email | Backup |
|------|------|-------|-------|--------|
| Incident Commander | | | | |
| Technical Lead | | | | |
| Communications Lead | | | | |
| Legal Counsel | | | | |
| Executive Sponsor | | | | |
| CISO | | | | |
| External Forensics Firm | | | | |
| Cyber Insurance Broker | | | | |
| Law Enforcement Contact | | | | |

---

## 8. Post-Incident Review Template

### Incident Summary

- **Incident ID:** INC-{{YYYY}}-{{NNN}}
- **Severity:** P1 / P2 / P3 / P4
- **Duration:** {{Detection time}} to {{Resolution time}} (total: {{HH:MM}})
- **Affected Systems:** {{List}}
- **Data Impact:** {{Describe any data exposure or loss}}

### Timeline

| Time (UTC) | Event | Actor |
|------------|-------|-------|
| {{TIME}} | {{What happened}} | {{Who or what}} |

### Root Cause Analysis

**Proximate cause:** {{The direct technical cause}}

**Contributing factors:**
1. {{Factor 1}}
2. {{Factor 2}}
3. {{Factor 3}}

**Root cause:** {{The underlying systemic issue}}

### What Went Well

1. {{Positive outcome or effective response action}}
2. {{Positive outcome}}

### What Needs Improvement

1. {{Gap or issue identified}}
2. {{Gap or issue identified}}

### Action Items

| # | Action | Owner | Priority | Due Date | Status |
|---|--------|-------|----------|----------|--------|
| 1 | {{Action description}} | {{Name}} | P1/P2/P3 | {{Date}} | Open |
| 2 | | | | | |

### Metrics

- **Time to detect (TTD):** {{Duration}}
- **Time to contain (TTC):** {{Duration}}
- **Time to eradicate (TTE):** {{Duration}}
- **Time to recover (TTR):** {{Duration}}
- **Total incident duration:** {{Duration}}
