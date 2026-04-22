# Fumadocs Documentation App Design

**Date:** 2026-04-22
**Status:** Approved

## Goal

Add an `apps/docs` Fumadocs documentation site to the metapowers monorepo, deployed to GitHub Pages at `metapowers.github.io/metapowers`.

## Audience

End users who install and use metapowers plugins in Claude Code.

## Approach

Fumadocs with Next.js App Router, statically exported for GitHub Pages.

## Project Structure

```
apps/
  docs/
    app/
      layout.tsx
      page.tsx
      docs/[[...slug]]/page.tsx
    content/
      docs/
        index.mdx
        installation.mdx
        design/
          overview.mdx
          empathize.mdx
          define.mdx
          ideate.mdx
          prototype.mdx
          test.mdx
        architecture/
          overview.mdx
          artifacts.mdx
        reference/
          (skill pages)
    lib/
      source.ts
    public/
    next.config.mjs
    package.json
    tsconfig.json
```

## Monorepo Integration

- Add `"apps/*"` to root `package.json` workspaces
- Add docs build task to `turbo.json`
- Docs app is standalone (no dependency on other packages)

## Build & Deployment

**Next.js static export:**
- `output: 'export'` in `next.config.mjs`
- `basePath: '/metapowers'` for GitHub Pages
- `images: { unoptimized: true }`

**GitHub Actions workflow** (`.github/workflows/deploy-docs.yml`):
- Triggers on push to `main` when `apps/docs/**` changes
- Steps: install deps, `turbo build --filter=docs`, deploy `apps/docs/out/` via `actions/deploy-pages@v4`

## Content Plan

1. **Getting Started** — What is metapowers, installation, quick example
2. **Design Domain Guide** — 5 phases (empathize, define, ideate, prototype, test) with inputs, outputs, examples
3. **Architecture Overview** — Plugin system, quality gates, artifact flow, skill system
4. **Skill Reference** — One page per design skill, documenting triggers, props, output

**Tone:** Practical, concise, example-driven.

## Decisions

- Default GitHub Pages URL (no custom domain)
- MDX content in `content/docs/` with file-system routing
- Manual skill reference pages initially (auto-generation deferred)
- Fumadocs built-in search (Orama)
