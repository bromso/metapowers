---
name: leadership-delegate
description: Delegate one task well — pick the right person by skill, growth and workload, then define the deliverable, their authority, support, check-ins and done criteria. Use when the user has a task to hand off and wants to decide who should own it and how to brief them.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Delegate

Structure delegation for "$ARGUMENTS". Match the task to the right person, define ownership, and set expectations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"leadership","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Understand the task:**
   - What needs to be done? What's the expected outcome?
   - What skills does it require?
   - What's the deadline and priority?

2. **Match to person:**
   - Who has the skills? Who would grow from this?
   - Consider maturity level (from Assess if available)
   - Balance workload across the team

3. **Define the delegation:**
   - **What:** Clear description of the deliverable
   - **Why:** Context on why it matters
   - **Authority:** What can they decide alone vs. check with you?
   - **Support:** What resources or help will you provide?
   - **Check-ins:** When and how to report progress
   - **Done criteria:** How will you both know it's complete?

4. **Write the artifact** to `.singularskills/leadership/<project>/delegation.md`

## Output

The delegation plan written to `.singularskills/leadership/<project>/delegation.md`. Present the plan to the user.
