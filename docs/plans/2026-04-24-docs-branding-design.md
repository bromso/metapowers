# Docs Site Branding Design

**Date:** 2026-04-24
**Status:** Approved

## Goal

Brand the Fumadocs docs site with Miranda Sans font, an indigo-based color palette, improved navigation, footer fix, and sidebar icon links.

## Changes

### 1. Font — Miranda Sans

- Load via Google Fonts `@import` in `global.css` (not in next/font — too new for bundled metadata)
- Weights: 400, 500, 600, 700
- Override `--font-fd-sans` CSS variable to apply globally

### 2. Color Palette (Indigo/Slate)

Map Tweakcn-sourced palette to Fumadocs `fd-*` CSS variables.

**Light mode:**
- Background: `rgb(248, 250, 252)` (slate-50)
- Foreground: `rgb(30, 41, 59)` (slate-800)
- Primary: `rgb(99, 102, 241)` (indigo-500)
- Accent: `rgb(224, 231, 255)` (indigo-100)
- Border: `rgb(209, 213, 219)` (gray-300)
- Muted: `rgb(243, 244, 246)` / foreground `rgb(107, 114, 128)`

**Dark mode:**
- Background: `rgb(15, 23, 42)` (slate-900)
- Foreground: `rgb(226, 232, 240)` (slate-200)
- Primary: `rgb(129, 140, 248)` (indigo-400)
- Accent: `rgb(55, 65, 81)` (gray-700)
- Border: `rgb(75, 85, 99)` (gray-600)
- Muted: `rgb(21, 32, 50)` / foreground `rgb(156, 163, 175)`

### 3. Header Navigation

Update `lib/layout.shared.tsx` links to: Docs, Domains, Getting Started, GitHub (external).

### 4. Footer Fix

Change "Jonas Broms" → "Jonas Bröms" in `app/(home)/page.tsx`.

### 5. Sidebar Icon Links

Add `sidebar.footer` to `DocsLayout` in `app/docs/layout.tsx` with GitHub and npm icon buttons. Use lucide-react for GitHub icon, inline SVG for npm icon.

## Files to Modify

- `apps/docs/app/global.css` — font import + color variables
- `apps/docs/lib/layout.shared.tsx` — header nav links
- `apps/docs/app/(home)/page.tsx` — footer name fix
- `apps/docs/app/docs/layout.tsx` — sidebar footer with icon links

## Out of Scope

- Tweakcn variables without Fumadocs equivalents (sidebar-*, chart-*, shadow-*, popover-*)
- Custom components or UI changes beyond theming
- Logo/favicon changes
