# Landing Page Design

**Date:** 2026-04-24
**Status:** Approved

## Overview

Redesign the docs site landing page (`app/(home)/page.tsx`) from a bare-bones hero to a polished, professional page with domain cards. Inspired by Fumadocs' clean aesthetic.

## Page Sections

### 1. Hero
- Headline: "Metapowers"
- Subheadline: "Structured workflows for every discipline — from design to legal. Claude Code plugins powered by proven methodologies."
- CTAs: "Get Started" (primary) + "GitHub" (secondary outline)
- Clean, centered, generous whitespace

### 2. Stats Bar
- "10 Domains" | "170+ Skills" | "10 Methodologies" | "Open Source"
- Horizontal row, muted text

### 3. Domain Cards Grid
- 3-col responsive grid (3 desktop, 2 tablet, 1 mobile)
- Each card: Lucide icon, domain name, methodology, skill count, description, link
- Subtle border, hover elevation

### 4. How It Works
- 3-step horizontal: Install → Run → Artifacts
- Code blocks with commands

### 5. Footer
- "Built by Jonas Broms" + GitHub + MIT

## Technical
- Single file: `app/(home)/page.tsx`
- Tailwind v4 + `fd-*` Fumadocs tokens
- Static content, works with `output: "export"`
- No new dependencies needed
