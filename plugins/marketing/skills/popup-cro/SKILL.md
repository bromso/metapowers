---
name: popup-cro
description: Design popups and modals — purpose, trigger, frequency, targeting, copy and mobile behavior — that capture leads without annoying visitors. Use when the user wants an exit-intent, email-capture or announcement overlay, or their current popup converts poorly or irritates people.
argument-hint: "[project] [--skip-checks]"
---

# Popup CRO

Design effective popups and modals for "$ARGUMENTS". Create non-intrusive, high-converting overlays for lead capture, upgrades, and engagement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and messaging
   - Read `.metapowers/marketing/<project>/02-act.md` and `.metapowers/marketing/<project>/04-engage.md` if they exist

2. **Define popup purpose:**
   - Lead capture (email signup, lead magnet delivery)
   - Exit intent (save abandoning visitors)
   - Upgrade prompt (free-to-paid conversion)
   - Announcement (new feature, promotion)
   - Feedback collection (survey, NPS)

3. **Design popup experience:**
   - Trigger: time-based, scroll-based, exit-intent, click-triggered, page-count
   - Frequency: how often does a user see it?
   - Targeting: which pages, which segments, new vs. returning
   - Mobile experience: slide-up vs. full-screen vs. banner
   - Dismiss behavior: easy close, remember preference

4. **Create popup content:**
   - Headline (benefit-focused, under 10 words)
   - Body copy (1-2 sentences max)
   - CTA (specific action, not "Submit")
   - Visual direction
   - A/B test variants

5. **Write the artifact** — append to `.metapowers/marketing/<project>/04-engage.md` under a `## Popup CRO` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Popup CRO` section already exists, replace only that section. The section contains:
   - **Popup Strategy** — purpose, trigger, targeting
   - **Content** — headline, body, CTA per popup
   - **UX Rules** — frequency, dismissal, mobile behavior
   - **A/B Test Plan** — what to test first
   - **Anti-Annoyance Checklist** — ensuring popups help, not hurt

## Output

Popup strategy appended to `.metapowers/marketing/<project>/04-engage.md`. Present popup designs with copy for review.
