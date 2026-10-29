---
name: branding-verbal
description: Develop a brand's verbal identity — voice, tone per context, messaging pillars, taglines and style rules. Use when the user wants to define how their brand sounds, settle on a tagline, or align tone across channels. Not for positioning and personality, or product messaging per audience; see /branding-strategy or /marketing-product-marketing-context.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: branding
  phase: 3
  artifact: 03-verbal.md
---

# Verbal Identity

Develop the verbal identity for "$ARGUMENTS". Create the voice, tone, messaging framework, and language guidelines that bring the brand personality to life in words.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"branding","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/branding/<project>/01-discover.md` and `.singularskills/branding/<project>/02-strategy.md`. If `02-strategy.md` does not exist, tell the user:

> Phase 2 (Strategy) has not been completed for "<project>". Run `/branding-strategy <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/branding/<project>/01-discover.md` for audience insights
   - Read `.singularskills/branding/<project>/02-strategy.md` for personality, values, and positioning

2. **Define brand voice:**
   - Voice is consistent — it's WHO the brand is
   - Describe the voice using the personality traits from Strategy
   - Provide "We are / We are not" examples
   - Example: "We are confident but not arrogant. We are friendly but not casual."

3. **Define tone variations:**
   - Tone adapts to context — it's HOW the brand speaks in different situations
   - Define tone for: marketing, support, social media, formal communications, error messages
   - For each context: tone description + example copy

4. **Create messaging pillars:**
   - 3-5 key messages the brand consistently communicates
   - For each pillar: headline, supporting statement, proof point

5. **Develop tagline/endline options:**
   - Generate 3-5 tagline candidates
   - Evaluate each against the positioning and personality
   - Recommend the strongest option

6. **Language guidelines:**
   - Preferred vocabulary and phrases
   - Words and phrases to avoid
   - Grammar and style preferences (e.g., Oxford comma, contractions, capitalization)

7. **Write the artifact** to `.singularskills/branding/<project>/03-verbal.md`

## Output

The verbal identity written to `.singularskills/branding/<project>/03-verbal.md`. Present a summary to the user highlighting:
- Voice description in one sentence
- Top tagline recommendation
- Messaging pillars overview

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: branding-verbal
workflow: branding
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
