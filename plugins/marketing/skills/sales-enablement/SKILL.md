---
description: Create sales collateral, battle cards, and objection handling guides
---

# Sales Enablement

Create sales enablement materials for "$ARGUMENTS". Build battle cards, objection handling guides, and sales collateral that help close deals.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for positioning, competitors, and personas

2. **Build competitive battle cards:**
   - One battle card per major competitor
   - Our strengths vs. their weaknesses
   - Their strengths and how to handle them
   - Landmines: questions to ask prospects that highlight our advantages
   - Traps: questions competitors will ask, with prepared responses

3. **Create objection handling guide:**
   - Map common objections: price, features, timing, competition, inertia
   - For each: acknowledge, reframe, respond, evidence
   - Link objections to customer research insights

4. **Sales collateral recommendations:**
   - One-pager / product overview
   - Case study templates
   - ROI calculator or business case template
   - Demo script outline
   - Proposal template

5. **Write the artifact** — append to `.metapowers/marketing/<project>/03-convert.md` under a `## Sales Enablement` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Sales Enablement` section already exists, replace only that section. The section contains:
   - **Battle Cards** — per competitor
   - **Objection Handling** — common objections with responses
   - **Collateral List** — recommended materials with priority
   - **Key Proof Points** — stats, quotes, case studies to reference
   - **Demo Talking Points** — key moments in the demo to highlight

## Output

Sales enablement materials appended to `.metapowers/marketing/<project>/03-convert.md`. Present battle cards and top objection responses to the user.
