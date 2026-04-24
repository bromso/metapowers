---
description: Map and minimize the attack surface
---

# Attack Surface

Map and minimize the attack surface for "$ARGUMENTS". Enumerate all entry points an attacker could target, assess their exposure, and recommend reduction strategies.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

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

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/01-identify.md` with heading:

   ## Attack Surface Analysis

   Include sections:
   - **Entry Point Inventory** — all entry points with authentication, exposure, and data access details
   - **Exposure Assessment** — current state of each entry point's security posture
   - **Unnecessary Exposure** — identified items that should be reduced or eliminated
   - **Reduction Recommendations** — prioritized actions grouped by effort level
   - **Implementation Roadmap** — timeline for attack surface reduction

## Output

The attack surface analysis written to `.metapowers/security/$ARGUMENTS/01-identify.md`. Present a summary to the user highlighting:
- Total entry points mapped by category
- Highest-risk entry points requiring immediate attention
- Quick-win reduction opportunities
- Recommended implementation roadmap
