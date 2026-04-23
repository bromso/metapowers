# Artifacts & Storage Documentation Design

**Date:** 2026-04-24
**Status:** Approved

## Overview

Add a dedicated "Artifacts & Storage" documentation page (`storage.mdx`) to each of the 11 domain docs. Each page documents what artifacts the domain stores, directory structure, file formats, and domain-specific content types. Pages appear under a "Memory" sidebar heading.

## Changes Per Domain

### 1. Create `storage.mdx` per domain
Each page contains:
- Storage directory path
- Directory structure visualization
- Per-phase artifact files with content descriptions
- Utility artifact files
- Domain-specific stored artifact types
- File format notes

### 2. Update `meta.json` per domain
Add `"---Memory---"` separator and `"storage"` page entry before the `"---Other---"` separator.

## Domain-Specific Artifacts

| Domain | Directory | Key Stored Artifacts |
|--------|-----------|---------------------|
| Design | `.metapowers/design/<component>/` | Component contracts, variant matrices, token references, WCAG reports, Figma prototype references |
| Research | `.metapowers/research/<topic>/` | Source lists, stakeholder insights, problem statements, HMW questions, solution concepts, validation evidence |
| Marketing | `.metapowers/marketing/<topic>/` | Buyer personas, competitor profiles, pricing analyses, content calendars, email sequences, ad copy variants, campaign plans, analytics tracking plans |
| Branding | `.metapowers/branding/<brand>/` | Color palettes (hex, HSL, tokens), typography systems (font families, scales), logo variations (logomark, wordmark, favicon, brandmark), imagery style guidelines, brand voice/tone, visual identity system, `assets/` subdirectories |
| Project Mgmt | `.project/<project>/` | Project charters, stakeholder maps, sprint backlogs, user stories, velocity data, retro action items, risk registers, capacity plans |
| Legal | `.metapowers/legal/<topic>/` | Contract drafts, compliance checklists, risk matrices, clause libraries, DPAs, privacy policies, incident response plans, decision memos |
| Coaching | `.metapowers/coaching/<subject>/` | Scored reviews (1-10 per dimension), improvement suggestions, learning resource references |
| Leadership | `.metapowers/leadership/<team>/` | Team assessments, vision statements, delegation frameworks, OKRs, 1:1 prep notes, feedback logs, decision analyses |
| Accessibility | `.metapowers/accessibility/<target>/` | WCAG audit scopes, issue inventories with severity/WCAG criteria, remediation logs, conformance statements |
| Development | `.metapowers/development/<feature>/` | Implementation plans, build execution logs, test coverage reports, code review findings |

## Sidebar Structure

Each domain's `meta.json` gets a Memory section:
```json
{
  "pages": [
    "index",
    "---Phases---",
    ...,
    "---Memory---",
    "storage",
    "---Other---",
    "utilities"
  ]
}
```

Domains without a `"---Other---"` separator get one added.
