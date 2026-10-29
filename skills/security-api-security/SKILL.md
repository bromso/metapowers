---
name: security-api-security
description: Audit the security of a project's APIs — inventory, authentication, object- and function-level authorization, rate limiting, input validation, error leakage, CORS and transport. Use when the user asks to review API security, harden endpoints, or check a REST or GraphQL API for broken authorization. Not for infrastructure or container hardening; see /security-iac-security.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# API Security

Audit API security for "$ARGUMENTS". Inventory all APIs, assess authentication and authorization mechanisms, and evaluate rate limiting, input validation, and error handling practices.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-api-security","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Inventory all APIs:**
   - Catalog internal APIs (service-to-service), external APIs (public-facing), and partner APIs (B2B)
   - Document each API's purpose, data sensitivity, and consumer audience
   - Identify API specifications (OpenAPI/Swagger, GraphQL schema, gRPC protobuf)
   - Note API versioning strategy and deprecated endpoints still active

2. **Assess authentication methods:**
   - Review authentication mechanism per API (OAuth 2.0, API keys, JWT, mTLS, session tokens)
   - Verify token validation (signature verification, expiration checks, audience validation)
   - Check API key management (generation, rotation, revocation, scoping)
   - Identify unauthenticated endpoints and confirm they are intentionally public
   - Evaluate OAuth 2.0 flows used (authorization code with PKCE preferred over implicit)

3. **Review authorization checks:**
   - Verify authorization is enforced at every endpoint (not just at the gateway)
   - Check for object-level authorization (users can only access their own resources)
   - Review function-level authorization (admin endpoints restricted to admin roles)
   - Assess GraphQL-specific risks (nested query depth, introspection in production)
   - Look for mass assignment vulnerabilities (binding request body directly to data models)

4. **Evaluate rate limiting:**
   - Verify rate limiting is configured per API and per consumer
   - Check rate limit differentiation by endpoint sensitivity (login endpoints, data export)
   - Review rate limit response behavior (429 status code, Retry-After header)
   - Assess protection against distributed attacks (per-IP and per-account limits)

5. **Review input validation and error handling:**
   - Verify request body, query parameters, and headers are validated against schema
   - Check for injection risks in API parameters (SQL, NoSQL, command injection)
   - Confirm error responses do not leak internal details (stack traces, database errors, internal IPs)
   - Review pagination to prevent data enumeration and excessive data retrieval

6. **Assess CORS and transport security:**
   - Review CORS configuration (no wildcard origins for authenticated APIs)
   - Verify HTTPS-only enforcement with HSTS headers
   - Check for sensitive data in URL query parameters (should be in headers or body)
   - Review API gateway security configuration if applicable

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## API Security` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## API Security` section already exists, replace only that section. The section contains:

   ### API Security Audit

   Include sections:
   - **API Inventory** — all APIs with type, authentication method, and data sensitivity
   - **Authentication Assessment** — findings per API on auth mechanism strength
   - **Authorization Review** — object-level and function-level authorization coverage
   - **Rate Limiting** — current configuration and gaps
   - **Input Validation** — validation coverage and injection risks
   - **CORS and Transport** — configuration findings
   - **Remediation Plan** — prioritized fixes by severity

## Output

The API security audit appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Total APIs inventoried by type and sensitivity
- Authentication and authorization gaps found
- Rate limiting coverage
- Top priority remediations

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"security-api-security","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## API Security` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-api-security`).

End your section with `### Decisions` and `### Open questions` (one level under your `## API Security` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
