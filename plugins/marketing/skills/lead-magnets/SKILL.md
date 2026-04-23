---
description: Design lead magnets — guides, tools, templates, and gated content
---

# Lead Magnets

Design high-converting lead magnets for "$ARGUMENTS". Create valuable gated content that attracts qualified leads and demonstrates expertise.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience pain points and JTBD
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for content context)

2. **Identify lead magnet opportunities:**
   - Map audience pain points to solvable problems
   - What quick wins can you deliver? (saves time, money, or effort)
   - Use WebSearch to find what lead magnets competitors offer
   - What format best solves the problem? (template, checklist, guide, tool, quiz, calculator)

3. **Design lead magnet concepts:**
   - Create 3-5 lead magnet concepts with:
     - Title (specific and benefit-driven)
     - Format (PDF, spreadsheet, tool, email course, quiz)
     - Value proposition (what problem it solves)
     - Effort to create (low/medium/high)
     - Lead quality expectation (how qualified are leads this attracts?)

4. **Landing page and delivery:**
   - Recommended landing page structure for the lead magnet
   - Delivery mechanism (email, instant download, drip)
   - Follow-up sequence recommendation
   - Qualification: how does this lead magnet qualify leads for the next step?

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Lead Magnets` section:
   - **Lead Magnet Concepts** — 3-5 concepts with details
   - **Recommended First Magnet** — which to build first and why
   - **Landing Page Outline** — structure and copy direction
   - **Delivery & Follow-Up** — how to deliver and nurture
   - **Lead Qualification** — how this feeds the sales/conversion funnel

## Output

Lead magnet strategy appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Top lead magnet recommendation
- Expected lead quality
- Effort to create
