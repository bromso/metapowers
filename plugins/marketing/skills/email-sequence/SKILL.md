---
name: email-sequence
description: Design automated email sequences for subscribers and users — welcome, nurture, trial conversion — with triggers, timing, branches and copy. Use when the user wants a drip or lifecycle email flow that sends itself after someone signs up or acts. Not for cold outreach, the in-app trial flow or win-back; see /marketing:cold-email, /marketing:signup-flow-cro or /marketing:churn-prevention.
argument-hint: "[project] [--skip-checks]"
---

# Email Sequence

Design email drip sequences and automation flows for "$ARGUMENTS". Plan trigger-based campaigns that nurture leads through the funnel.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and messaging
   - Read `.metapowers/marketing/<project>/02-act.md` if it exists (for lead magnet and copy context)
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/campaign-plan-template.md` for structure

2. **Define sequence type:**
   - Welcome/onboarding sequence
   - Lead nurture sequence (post lead-magnet)
   - Trial-to-paid conversion sequence
   - Re-engagement/winback sequence
   - Post-purchase/retention sequence
   - Which type(s) are most needed for "<project>"?

3. **Design the sequence:**
   - Number of emails and timing (days between)
   - For each email: subject line, preview text, goal, key message, CTA
   - Trigger and entry conditions
   - Exit conditions (converted, unsubscribed, engaged)
   - Branch logic (if applicable): what happens based on engagement?

4. **Write email copy:**
   - Draft subject line variants for each email (2-3 per email)
   - Write full email body copy for each email
   - Apply messaging framework from strategy
   - Include personalization variables

5. **Write the artifact** — append to `.metapowers/marketing/<project>/03-convert.md` under a `## Email Sequence` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Email Sequence` section already exists, replace only that section. The section contains:
   - **Sequence Overview** — type, trigger, goal, timing
   - **Flow Diagram** — visual sequence with branches
   - **Email Details** — per email: subject, body, CTA, timing
   - **Personalization** — variables and segmentation
   - **Success Metrics** — open rate, click rate, conversion targets

## Output

Email sequence appended to `.metapowers/marketing/<project>/03-convert.md`. Present the full sequence with subject lines and email previews.
