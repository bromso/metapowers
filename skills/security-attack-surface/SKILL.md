---
name: security-attack-surface
description: Map every entry point an attacker could reach — web apps, APIs, mobile, email, network, cloud, CI/CD, physical — rate each by exposure and protection, and plan how to shrink it. Use when the user asks what is exposed to the internet, worries about forgotten endpoints or open admin panels, or wants to reduce exposure.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 1
  artifact: 01-identify.md
---

# Attack Surface

Map and minimize the attack surface for "$ARGUMENTS". Enumerate all entry points an attacker could target, assess their exposure, and recommend reduction strategies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-attack-surface","workflow":"security","phase":1,"project":"<project>","event":"skipped","artifact":"01-identify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-attack-surface","workflow":"security","phase":1,"project":"<project>","event":"refused","artifact":"01-identify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-attack-surface","workflow":"security","phase":1,"project":"<project>","event":"started","artifact":"01-identify.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Enumerate all entry points:**
   - **Web applications** — public-facing sites, admin panels, customer portals
   - **APIs** — REST, GraphQL, gRPC, SOAP endpoints (internal and external)
   - **Mobile applications** — iOS, Android apps and their backend services
   - **Email** — inbound email processing, mail servers, phishing vectors
   - **Physical** — office access, server rooms, USB ports, visitor access
   - **Network** — open ports, VPN endpoints, remote access services, Wi-Fi
   - **Cloud services** — public storage buckets, serverless functions, container registries, management consoles
   - **CI/CD pipelines** — build systems, artifact repositories, deployment credentials

2. **Assess each entry point:**
   - For every identified entry point, document:
     - **Authentication method** — none, API key, OAuth, MFA, certificate-based, IP allowlist
     - **Exposure level** — public internet, partner network, internal network, localhost only
     - **Data accessed** — what data can be reached through this entry point and its classification
     - **Protection mechanisms** — WAF, rate limiting, input validation, encryption in transit
     - **Monitoring** — is access logged, alerted on, and reviewed?

3. **Identify unnecessary exposure:**
   - Services or ports that are open but not required for business operations
   - Legacy or deprecated APIs still accessible
   - Admin interfaces exposed to public internet
   - Default credentials or configurations still in place
   - Overly permissive CORS, firewall rules, or security group configurations
   - Debug endpoints or development tools accessible in production

4. **Recommend attack surface reduction:**
   - **Close unnecessary ports and services** — disable or firewall unused network services
   - **Deprecate unused APIs** — remove or restrict legacy endpoints with migration plan
   - **Network segmentation** — isolate critical systems, implement zero-trust zones
   - **Web Application Firewall (WAF)** — deploy or tune WAF rules for exposed web services
   - **API gateway** — centralize API access with authentication, rate limiting, and monitoring
   - **Principle of least exposure** — move admin interfaces behind VPN, restrict management ports

5. **Prioritize reduction actions:**
   - Score each recommendation by: risk reduction impact, implementation effort, business disruption
   - Group into: quick wins (high impact, low effort), planned improvements, strategic initiatives
   - Create implementation timeline with dependencies
   - Define success criteria for each reduction action

6. **Write the artifact** — append to `.singularskills/security/<project>/01-identify.md` under a `## Attack Surface` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Attack Surface` section already exists, replace only that section. The section contains:

   ### Attack Surface Analysis

   Include sections:
   - **Entry Point Inventory** — all entry points with authentication, exposure, and data access details
   - **Exposure Assessment** — current state of each entry point's security posture
   - **Unnecessary Exposure** — identified items that should be reduced or eliminated
   - **Reduction Recommendations** — prioritized actions grouped by effort level
   - **Implementation Roadmap** — timeline for attack surface reduction

## Output

The attack surface analysis appended to `.singularskills/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Total entry points mapped by category
- Highest-risk entry points requiring immediate attention
- Quick-win reduction opportunities
- Recommended implementation roadmap

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-attack-surface","workflow":"security","phase":1,"project":"<project>","event":"finished","artifact":"01-identify.md","note":""}`.

This artifact is shared by every skill of phase 1 (Identify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Identify
workflow: security
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Attack Surface` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-attack-surface`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Attack Surface` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
