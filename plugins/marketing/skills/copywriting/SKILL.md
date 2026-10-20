---
name: copywriting
description: Write persuasive copy for any marketing surface
argument-hint: "[project] [--skip-checks]"
---

# Copywriting

Write persuasive, conversion-focused copy for "$ARGUMENTS". Apply proven copywriting frameworks to create compelling headlines, body copy, and calls to action.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience, messaging, and positioning
   - Read `.metapowers/marketing/<project>/01-reach.md` if it exists (for content context)

2. **Define the copy brief:**
   - What surface? (landing page, email, ad, social, product)
   - Who is reading? (map to persona from strategy)
   - What's the one action they should take?
   - What's their current state of awareness? (unaware, problem-aware, solution-aware, product-aware)

3. **Apply copywriting frameworks:**
   - **Headlines:** Use PAS (Problem-Agitate-Solve), AIDA (Attention-Interest-Desire-Action), or 4U (Useful-Urgent-Unique-Ultra-specific)
   - **Body:** Lead with the biggest benefit, use social proof, address objections, create urgency
   - **CTA:** Clear, specific, benefit-oriented action verbs
   - Generate 3-5 headline variants and recommend the strongest

4. **Voice and tone calibration:**
   - Match the brand voice from the messaging framework
   - Adjust formality for the channel (email vs. social vs. landing page)
   - Use the audience's own language (from customer research)

5. **Write the artifact** — append to `.metapowers/marketing/<project>/02-act.md` under a `## Copywriting` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Copywriting` section already exists, replace only that section. The section contains:
   - **Copy Brief** — surface, audience, action, awareness level
   - **Headlines** — 3-5 variants with framework used
   - **Body Copy** — complete draft
   - **CTA Options** — 2-3 call-to-action variants
   - **Copy Notes** — tone decisions and rationale

## Output

Copy appended to `.metapowers/marketing/<project>/02-act.md`. Present the copy directly to the user with headline options highlighted.
