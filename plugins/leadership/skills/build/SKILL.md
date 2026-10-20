---
name: build
description: Structure the team — roles, responsibilities, and delegation framework
argument-hint: "[project] [--skip-checks]"
---

# Build

Structure the team for "$ARGUMENTS". Define roles, responsibilities, ownership areas, and establish a delegation framework.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/leadership/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/leadership/<project>/01-assess.md` and `.metapowers/leadership/<project>/02-vision.md`. If `02-vision.md` does not exist, tell the user:

> Phase 2 (Vision) has not been completed for "<project>". Run `/leadership:vision <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/leadership/<project>/01-assess.md` for team assessment
   - Read `.metapowers/leadership/<project>/02-vision.md` for values and culture
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/decision-frameworks.md`

2. **Define team structure:**
   - Map each team member's role and primary responsibilities
   - Identify ownership areas — who owns what?
   - Clarify decision rights using the RAPID framework
   - Identify gaps: any roles or skills missing?

3. **Create delegation framework:**
   - For each team member: what can they own autonomously?
   - What needs consultation before deciding?
   - What do you retain as leader?
   - Match delegation level to team member maturity (from Assess)

4. **Define collaboration norms:**
   - How does work get assigned and tracked?
   - What's the escalation path for blockers?
   - How do team members collaborate across ownership areas?

5. **Write the artifact** to `.metapowers/leadership/<project>/03-build.md` with sections:
   - **Team Structure** — roles, responsibilities, ownership map
   - **Decision Rights** — RAPID matrix for key decision types
   - **Delegation Framework** — per-person autonomy levels
   - **Collaboration Norms** — assignment, tracking, escalation

## Output

The team structure written to `.metapowers/leadership/<project>/03-build.md`. Present a summary highlighting:
- Ownership map
- Key delegation decisions
- Any gaps identified
