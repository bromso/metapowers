---
name: branding-guidelines
description: Compile brand strategy, voice and visual identity into one brand guidelines document with application examples, must and must-not rules, and an asset index. Use when the brand strategy, verbal and visual identity are done and the user wants a single brand book others can follow.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: branding
  phase: 5
  artifact: 05-guidelines.md
---

# Brand Guidelines

Compile all brand work for "$ARGUMENTS" into a comprehensive brand guidelines document — the single source of truth for anyone using the brand.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"branding","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Read all prior phase artifacts. If `04-visual.md` does not exist, tell the user:

> Phase 4 (Visual) has not been completed for "<project>". Run `/branding-visual <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read all prior artifacts:**
   - Read `.singularskills/branding/<project>/01-discover.md` for context
   - Read `.singularskills/branding/<project>/02-strategy.md` for brand platform
   - Read `.singularskills/branding/<project>/03-verbal.md` for voice, tone, messaging
   - Read `.singularskills/branding/<project>/04-visual.md` for visual identity
   - Read `references/brand-guidelines-template.md` for output structure

2. **Compile the brand guidelines** following the template, combining:
   - Brand overview (purpose, vision, mission, values from Strategy)
   - Logo usage rules and variations (from Visual)
   - Color palette with specifications (from Visual)
   - Typography system (from Visual)
   - Imagery and photography guidelines (from Visual)
   - Voice and tone guidelines (from Verbal)
   - Application examples — how the brand appears across key touchpoints

3. **Add compliance rules:**
   - What must always be done (mandatory elements)
   - What must never be done (prohibited uses)
   - Common mistakes to avoid
   - When to seek brand team approval

4. **Reference assets:**
   - Link to all files in `.singularskills/branding/<project>/assets/`
   - List available logo variants, fonts, and imagery

5. **Write the artifact** to `.singularskills/branding/<project>/05-guidelines.md`

## Output

The brand guidelines written to `.singularskills/branding/<project>/05-guidelines.md`. Present a summary to the user highlighting:
- Sections covered
- Number of compliance rules
- Asset inventory
- How other domains can use these guidelines (e.g., `/branding-audit`)

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: branding-guidelines
workflow: branding
phase: 5
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
