---
name: security-container-security
description: Secure the container lifecycle — base images, Dockerfile practice, image scanning, registry signing and promotion, runtime hardening, and Kubernetes RBAC, pod security and network policies. Use when the user runs Docker or Kubernetes and asks how to harden their images, clusters or workloads.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# Container Security

Secure container images, registries, runtime, and orchestration for "$ARGUMENTS". Assess the full container lifecycle from image build to production runtime and define security controls at each stage.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-container-security","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

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

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## Container Security` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Container Security` section already exists, replace only that section. The section contains:

   - **Base Image Assessment** — current base images, sources, and update practices
   - **Dockerfile Review** — findings on build best practices
   - **Image Scanning** — tool selection, CI/CD integration, and vulnerability thresholds
   - **Registry Security** — access controls, signing, and promotion workflow
   - **Runtime Hardening** — resource limits, capability restrictions, and filesystem policies
   - **Orchestration Security** — RBAC, pod security, network policies, and admission control
   - **Implementation Roadmap** — prioritized actions from quick wins to long-term hardening

## Output

The container security plan appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Current container security posture and key gaps
- Image scanning integration plan
- Runtime hardening priorities
- Orchestration security controls to implement

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"security-container-security","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`
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

Open your `## Container Security` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-container-security`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Container Security` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
