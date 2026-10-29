---
name: security-secure-coding
description: Review an application's code against the OWASP Top 10 — input validation, output encoding, auth and sessions, error handling, security headers — with a prioritized fix plan. Use when the user wants their application's code reviewed for security flaws or asks whether it follows secure coding practice. Not for a pre-merge review of one feature; see /development-review.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# Secure Coding

Review code for OWASP Top 10 vulnerabilities and secure coding practices for "$ARGUMENTS". Identify security weaknesses in application code and recommend remediations aligned with industry standards.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-secure-coding","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-secure-coding","workflow":"security","phase":2,"project":"<project>","event":"refused","artifact":"02-protect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-secure-coding","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Identify code to review:**
   - Determine the application language(s), framework(s), and entry points
   - Prioritize security-sensitive areas: authentication, authorization, data handling, API endpoints, file operations
   - Identify third-party integrations and trust boundaries

2. **Check against OWASP Top 10:**
   - **Injection** — SQL, NoSQL, OS command, LDAP injection via unsanitized input
   - **Broken Authentication** — weak password policies, credential stuffing exposure, session fixation
   - **Sensitive Data Exposure** — plaintext secrets, weak cryptography, missing encryption at rest or in transit
   - **XML External Entities (XXE)** — unsafe XML parsing, external entity processing enabled
   - **Broken Access Control** — missing authorization checks, IDOR, privilege escalation paths
   - **Security Misconfiguration** — default credentials, verbose error messages, unnecessary features enabled
   - **Cross-Site Scripting (XSS)** — reflected, stored, and DOM-based XSS via unescaped output
   - **Insecure Deserialization** — untrusted data deserialized without validation
   - **Using Components with Known Vulnerabilities** — outdated libraries with published CVEs
   - **Insufficient Logging and Monitoring** — missing audit trails for security events

3. **Review input validation and output encoding:**
   - Verify all user input is validated (allowlists preferred over denylists)
   - Check output encoding appropriate to context (HTML, URL, JavaScript, SQL)
   - Confirm parameterized queries or ORM usage for all database interactions
   - Review file upload handling (type validation, size limits, storage isolation)

4. **Review authentication and session management:**
   - Password hashing algorithm (bcrypt, scrypt, argon2 — not MD5/SHA1)
   - Session token generation (cryptographically random, sufficient entropy)
   - Session expiration and invalidation on logout
   - Multi-factor authentication implementation if applicable

5. **Review error handling:**
   - Confirm no stack traces, internal paths, or database details leaked in responses
   - Verify generic error messages for end users with detailed logging server-side
   - Check exception handling covers all code paths (no unhandled exceptions exposing internals)

6. **Review secure headers and transport security:**
   - Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security
   - CORS configuration (no wildcard origins for authenticated endpoints)
   - Cookie flags (Secure, HttpOnly, SameSite)

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## Secure Coding` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Secure Coding` section already exists, replace only that section. The section contains:

   ### Secure Coding Review

   Include sections:
   - **Scope** — code areas reviewed, languages, and frameworks
   - **OWASP Top 10 Findings** — each vulnerability category with status (pass/fail/n/a) and details
   - **Input Validation Assessment** — validation coverage and gaps
   - **Authentication Review** — findings on auth and session management
   - **Error Handling Review** — information leakage risks
   - **Remediation Plan** — prioritized fixes with severity and effort estimate

## Output

The secure coding review appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Total findings by severity (critical, high, medium, low)
- OWASP Top 10 categories with identified issues
- Top priority remediations with effort estimates
- Secure coding practices already in place

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-secure-coding","workflow":"security","phase":2,"project":"<project>","event":"finished","artifact":"02-protect.md","note":""}`.

This artifact is shared by every skill of phase 2 (Protect). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Protect
workflow: security
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Secure Coding` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-secure-coding`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Secure Coding` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
