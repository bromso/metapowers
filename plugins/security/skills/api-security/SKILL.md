---
description: Audit API security
---

# API Security

Audit API security for "$ARGUMENTS". Inventory all APIs, assess authentication and authorization mechanisms, and evaluate rate limiting, input validation, and error handling practices.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

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

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## API Security Audit

   Include sections:
   - **API Inventory** — all APIs with type, authentication method, and data sensitivity
   - **Authentication Assessment** — findings per API on auth mechanism strength
   - **Authorization Review** — object-level and function-level authorization coverage
   - **Rate Limiting** — current configuration and gaps
   - **Input Validation** — validation coverage and injection risks
   - **CORS and Transport** — configuration findings
   - **Remediation Plan** — prioritized fixes by severity

## Output

The API security audit written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Total APIs inventoried by type and sensitivity
- Authentication and authorization gaps found
- Rate limiting coverage
- Top priority remediations
