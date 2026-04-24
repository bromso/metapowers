---
description: Secure container images, registries, runtime, and orchestration
---

# Container Security

Secure container images, registries, runtime, and orchestration for "$ARGUMENTS". Assess the full container lifecycle from image build to production runtime and define security controls at each stage.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Assess base image selection:**
   - Verify base images are minimal (Alpine, distroless, or slim variants preferred)
   - Confirm base images are from official, trusted sources
   - Check base image update frequency and vulnerability patching cadence
   - Identify custom base images and their maintenance process

2. **Review Dockerfile best practices:**
   - Run as non-root user (USER directive)
   - Use multi-stage builds to minimize final image size and attack surface
   - No secrets in image layers (no COPY of .env files, no ARG for passwords)
   - Pin dependency versions (no `latest` tags for base images or packages)
   - Minimize installed packages (no build tools in production images)
   - Use `.dockerignore` to prevent sensitive files from being included in build context

3. **Plan image scanning:**
   - Select scanning tools (Trivy, Snyk Container, Grype, Clair)
   - Integrate scanning into CI/CD pipeline (fail build on critical/high vulnerabilities)
   - Define scanning cadence for images already in production (catch newly discovered CVEs)
   - Set vulnerability thresholds (block critical, warn on high, track medium)

4. **Secure container registry:**
   - Use private registry with access controls (not public Docker Hub for proprietary images)
   - Enable image signing and verification (Docker Content Trust, cosign/Sigstore)
   - Implement image promotion workflow (dev -> staging -> production with gates)
   - Set image retention and cleanup policies
   - Enable vulnerability scanning at registry level

5. **Harden runtime security:**
   - Run containers with read-only root filesystem where possible
   - Set resource limits (CPU, memory) to prevent resource exhaustion attacks
   - Drop all Linux capabilities and add back only those required
   - Use seccomp and AppArmor/SELinux profiles to restrict system calls
   - Disable privilege escalation (no-new-privileges flag)

6. **Secure orchestration (Kubernetes):**
   - Implement Kubernetes RBAC with least-privilege service accounts
   - Enforce Pod Security Standards (restricted level for production workloads)
   - Define network policies to restrict pod-to-pod communication
   - Use namespaces for multi-tenant isolation
   - Secure the Kubernetes API server (authentication, audit logging, admission controllers)
   - Implement admission controllers (OPA/Gatekeeper, Kyverno) to enforce policies

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## Container Security

   Include sections:
   - **Base Image Assessment** — current base images, sources, and update practices
   - **Dockerfile Review** — findings on build best practices
   - **Image Scanning** — tool selection, CI/CD integration, and vulnerability thresholds
   - **Registry Security** — access controls, signing, and promotion workflow
   - **Runtime Hardening** — resource limits, capability restrictions, and filesystem policies
   - **Orchestration Security** — RBAC, pod security, network policies, and admission control
   - **Implementation Roadmap** — prioritized actions from quick wins to long-term hardening

## Output

The container security plan written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Current container security posture and key gaps
- Image scanning integration plan
- Runtime hardening priorities
- Orchestration security controls to implement
