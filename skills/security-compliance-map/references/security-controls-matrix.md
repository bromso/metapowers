# Security Controls Matrix

> Cross-framework control mapping for compliance and audit readiness.  
> Use checkboxes to track implementation status per control.

---

## 1. Access Control

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| AC-1 | Access control policy and procedures | PR.AA | A.5.15 | CC6.1 | 5.1 | - [ ] |
| AC-2 | Least privilege enforcement | PR.AA | A.8.2 | CC6.3 | 5.4 | - [ ] |
| AC-3 | Multi-factor authentication | PR.AA | A.8.5 | CC6.1 | 6.3 | - [ ] |
| AC-4 | Account lifecycle management (provisioning, deprovisioning) | PR.AA | A.5.18 | CC6.2 | 5.3 | - [ ] |
| AC-5 | Privileged access management | PR.AA | A.8.2 | CC6.1 | 5.5 | - [ ] |
| AC-6 | Remote access controls | PR.AA | A.6.7 | CC6.1 | 12.7 | - [ ] |
| AC-7 | Session management and timeout | PR.AA | A.8.1 | CC6.1 | 5.6 | - [ ] |

---

## 2. Asset Management

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| AM-1 | Hardware asset inventory | ID.AM | A.5.9 | CC6.1 | 1.1 | - [ ] |
| AM-2 | Software asset inventory | ID.AM | A.5.9 | CC6.1 | 2.1 | - [ ] |
| AM-3 | Data asset classification | ID.AM | A.5.12 | CC6.1 | 3.1 | - [ ] |
| AM-4 | External information system inventory | ID.AM | A.5.19 | CC6.1 | 2.3 | - [ ] |
| AM-5 | Asset ownership assignment | ID.AM | A.5.9 | CC6.1 | 1.2 | - [ ] |
| AM-6 | Unauthorized asset detection | ID.AM | A.5.9 | CC6.1 | 1.3 | - [ ] |

---

## 3. Audit and Accountability

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| AU-1 | Audit logging policy and procedures | DE.CM | A.8.15 | CC7.2 | 8.1 | - [ ] |
| AU-2 | Auditable event definition | DE.CM | A.8.15 | CC7.2 | 8.2 | - [ ] |
| AU-3 | Audit log content requirements | DE.CM | A.8.15 | CC7.2 | 8.5 | - [ ] |
| AU-4 | Audit log storage and retention | DE.CM | A.8.15 | CC7.2 | 8.3 | - [ ] |
| AU-5 | Audit log integrity protection | DE.CM | A.8.15 | CC7.2 | 8.6 | - [ ] |
| AU-6 | Audit log review and analysis | DE.AE | A.8.15 | CC7.2 | 8.11 | - [ ] |

---

## 4. Configuration Management

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| CM-1 | Baseline configuration standards | PR.PS | A.8.9 | CC6.1 | 4.1 | - [ ] |
| CM-2 | Configuration change control | PR.PS | A.8.32 | CC8.1 | 4.2 | - [ ] |
| CM-3 | Least functionality (disable unnecessary services) | PR.PS | A.8.9 | CC6.1 | 4.8 | - [ ] |
| CM-4 | Software installation restrictions | PR.PS | A.8.19 | CC6.1 | 2.5 | - [ ] |
| CM-5 | Infrastructure-as-code enforcement | PR.PS | A.8.9 | CC8.1 | 4.3 | - [ ] |
| CM-6 | Secure default configurations | PR.PS | A.8.9 | CC6.1 | 4.1 | - [ ] |

---

## 5. Incident Response

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| IR-1 | Incident response plan | RS.MA | A.5.24 | CC7.3 | 17.1 | - [ ] |
| IR-2 | Incident detection and reporting procedures | DE.AE | A.6.8 | CC7.2 | 17.2 | - [ ] |
| IR-3 | Incident response training and exercises | RS.MA | A.5.24 | CC7.3 | 17.6 | - [ ] |
| IR-4 | Incident containment procedures | RS.MI | A.5.26 | CC7.3 | 17.3 | - [ ] |
| IR-5 | Evidence collection and handling | RS.AN | A.5.28 | CC7.3 | 17.4 | - [ ] |
| IR-6 | Post-incident review | RS.AN | A.5.27 | CC7.3 | 17.8 | - [ ] |

---

## 6. Risk Assessment

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| RA-1 | Risk assessment policy and procedures | ID.RA | A.5.7 | CC3.2 | — | - [ ] |
| RA-2 | Threat identification and analysis | ID.RA | A.5.7 | CC3.2 | 7.1 | - [ ] |
| RA-3 | Vulnerability identification and analysis | ID.RA | A.8.8 | CC3.2 | 7.5 | - [ ] |
| RA-4 | Risk determination (likelihood x impact) | ID.RA | A.5.7 | CC3.2 | — | - [ ] |
| RA-5 | Risk response planning | ID.RA | A.5.7 | CC3.2 | — | - [ ] |
| RA-6 | Risk monitoring and review | GV.OV | A.5.7 | CC4.1 | — | - [ ] |

---

## 7. System Security

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| SS-1 | Boundary protection (firewalls, WAF) | PR.IR | A.8.20 | CC6.6 | 13.1 | - [ ] |
| SS-2 | Network segmentation | PR.IR | A.8.22 | CC6.6 | 12.2 | - [ ] |
| SS-3 | Intrusion detection/prevention systems | DE.CM | A.8.16 | CC7.2 | 13.3 | - [ ] |
| SS-4 | Malware protection | PR.PS | A.8.7 | CC6.8 | 10.1 | - [ ] |
| SS-5 | Endpoint detection and response | DE.CM | A.8.7 | CC7.2 | 10.7 | - [ ] |
| SS-6 | Secure development lifecycle (SDLC) | PR.PS | A.8.25 | CC8.1 | 16.1 | - [ ] |

---

## 8. Data Protection

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| DP-1 | Data-at-rest encryption | PR.DS | A.8.24 | CC6.1 | 3.11 | - [ ] |
| DP-2 | Data-in-transit encryption (TLS) | PR.DS | A.8.24 | CC6.1 | 3.10 | - [ ] |
| DP-3 | Data loss prevention (DLP) | PR.DS | A.8.12 | CC6.1 | 3.13 | - [ ] |
| DP-4 | Data retention and disposal | PR.DS | A.8.10 | CC6.5 | 3.4 | - [ ] |
| DP-5 | Backup and recovery | RC.RP | A.8.13 | A1.2 | 11.1 | - [ ] |
| DP-6 | Privacy and PII handling | PR.DS | A.5.34 | P1.1 | — | - [ ] |

---

## 9. Vulnerability Management

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| VM-1 | Vulnerability scanning (infrastructure) | ID.RA | A.8.8 | CC7.1 | 7.1 | - [ ] |
| VM-2 | Vulnerability scanning (application/DAST) | ID.RA | A.8.8 | CC7.1 | 7.2 | - [ ] |
| VM-3 | Dependency and SCA scanning | ID.RA | A.8.8 | CC7.1 | 7.4 | - [ ] |
| VM-4 | Patch management process | PR.PS | A.8.8 | CC7.1 | 7.3 | - [ ] |
| VM-5 | Penetration testing | ID.RA | A.8.8 | CC4.1 | 18.1 | - [ ] |
| VM-6 | Vulnerability remediation SLAs | ID.RA | A.8.8 | CC7.1 | 7.6 | - [ ] |

---

## 10. Security Training

| # | Control | NIST CSF | ISO 27001 | SOC 2 | CIS | Status |
|---|---------|----------|-----------|-------|-----|--------|
| ST-1 | Security awareness training (all staff) | PR.AT | A.6.3 | CC1.4 | 14.1 | - [ ] |
| ST-2 | Role-based security training | PR.AT | A.6.3 | CC1.4 | 14.2 | - [ ] |
| ST-3 | Phishing simulation and testing | PR.AT | A.6.3 | CC1.4 | 14.4 | - [ ] |
| ST-4 | Secure coding training (developers) | PR.AT | A.6.3 | CC1.4 | 16.9 | - [ ] |
| ST-5 | Incident response training | PR.AT | A.6.3 | CC1.4 | 17.6 | - [ ] |
| ST-6 | Training effectiveness measurement | PR.AT | A.6.3 | CC1.4 | 14.9 | - [ ] |

---

## Legend

- **NIST CSF:** NIST Cybersecurity Framework 2.0 category
- **ISO 27001:** ISO/IEC 27001:2022 Annex A control reference
- **SOC 2:** AICPA SOC 2 Trust Services Criteria
- **CIS:** CIS Controls v8 safeguard number
- **Status:** `- [ ]` = Not implemented, `- [x]` = Implemented
