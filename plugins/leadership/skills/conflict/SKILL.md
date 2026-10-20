---
description: Resolve team conflicts constructively
---

# Conflict Resolution

Work through a team conflict for "$ARGUMENTS". Understand perspectives, find common ground, and reach a constructive resolution.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/leadership/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Understand the conflict:**
   - Ask: Who is involved? What happened? How long has this been going on?
   - What's the surface disagreement vs. the underlying issue?
   - What has already been tried?

2. **Map perspectives:**
   - What does each party want? What are their concerns?
   - What are the shared interests?
   - Where is there genuine disagreement vs. miscommunication?

3. **Identify the root cause:**
   - Is this about: roles/ownership, priorities, communication style, values, or resources?
   - Is there a structural issue that enables this conflict?

4. **Develop resolution options:**
   - Find solutions that address both parties' core concerns
   - Identify compromises and trade-offs
   - Determine if structural changes are needed (clearer ownership, process changes)

5. **Plan the conversation:**
   - How to facilitate a constructive discussion
   - Ground rules (listen first, focus on behavior not character, seek solutions)
   - Expected outcome and follow-up

6. **Write the artifact** to `.metapowers/leadership/<project>/conflict-resolution.md`

## Output

The resolution plan written to `.metapowers/leadership/<project>/conflict-resolution.md`. Present the approach to the user.
