# Sidebar Restructure Design

## Goal

Restructure the apps/docs sidebar to use Fumadocs' multi-root dropdown navigation, matching the Fumadocs website pattern. Each domain (Overview, Research, Design, etc.) gets its own dropdown entry with a self-contained sidebar.

## Approach

Use Fumadocs' built-in `root: true` folder feature with `tabs={{}}` on `DocsLayout` to auto-generate a root toggle dropdown from the page tree structure. Single content directory, single loader — no multi-collection setup needed.

## Content Structure

```
content/docs/
├── meta.json                          (root: lists all domain folders)
├── overview/
│   ├── meta.json                      (root: true)
│   ├── index.mdx                      (Introduction)
│   ├── what-is-metapowers.mdx         (stub)
│   ├── comparisons.mdx                (stub)
│   ├── installation.mdx               (moved from top-level)
│   ├── guides.mdx                     (stub)
│   ├── prompting.mdx                  (stub)
│   └── reference/
│       └── index.mdx                  (moved from reference/)
├── research/
│   ├── meta.json                      (root: true)
│   ├── index.mdx
│   ├── discover.mdx                   (stub)
│   ├── define.mdx                     (stub)
│   ├── design.mdx                     (stub)
│   └── deliver.mdx                    (stub)
├── design/
│   ├── meta.json                      (root: true)
│   ├── index.mdx                      (existing)
│   ├── empathize.mdx                  (existing)
│   ├── define.mdx                     (existing)
│   ├── ideate.mdx                     (existing)
│   ├── prototype.mdx                  (existing)
│   └── test.mdx                       (existing)
├── development/
│   ├── meta.json                      (root: true)
│   ├── index.mdx
│   ├── architecture/                  (moved from top-level)
│   │   ├── meta.json
│   │   ├── index.mdx
│   │   └── artifacts.mdx
│   └── mcp-server/                    (moved from top-level)
│       ├── meta.json
│       ├── index.mdx
│       ├── setup.mdx
│       ├── tools.mdx
│       └── bridge-plugin.mdx
├── accessibility/
│   ├── meta.json                      (root: true)
│   └── index.mdx                      (stub)
├── marketing/
│   ├── meta.json                      (root: true)
│   └── index.mdx                      (stub)
├── project-management/
│   ├── meta.json                      (root: true)
│   └── index.mdx                      (stub)
└── coaching/
    ├── meta.json                      (root: true)
    └── index.mdx                      (stub)
```

## Configuration Changes

### Root meta.json

```json
{
  "title": "Documentation",
  "pages": [
    "...overview",
    "...research",
    "...design",
    "...development",
    "...accessibility",
    "...marketing",
    "...project-management",
    "...coaching"
  ]
}
```

### Domain meta.json pattern

Each domain folder uses `root: true`:

```json
{
  "title": "Overview",
  "root": true,
  "pages": ["index", "what-is-metapowers", "comparisons", "installation", "guides", "prompting", "...reference"]
}
```

### app/docs/layout.tsx

Add `tabs={{}}` to DocsLayout to auto-generate tabs from root folders:

```tsx
<DocsLayout
  tree={source.getPageTree()}
  tabs={{}}
  {...baseOptions()}
>
```

### No changes to

- `source.config.ts` (single defineDocs stays)
- `lib/source.ts` (single loader stays)
- `app/docs/[[...slug]]/page.tsx`
- `next.config.mjs`

## Content Migration

| Current Path | New Path |
|---|---|
| `content/docs/index.mdx` | `content/docs/overview/index.mdx` |
| `content/docs/installation.mdx` | `content/docs/overview/installation.mdx` |
| `content/docs/design/*` | `content/docs/design/*` (unchanged) |
| `content/docs/architecture/*` | `content/docs/development/architecture/*` |
| `content/docs/mcp-server/*` | `content/docs/development/mcp-server/*` |
| `content/docs/reference/*` | `content/docs/overview/reference/*` |

## Stub Pages

New placeholder pages with "Content coming soon" template:

- overview: what-is-metapowers, comparisons, guides, prompting
- research: index, discover, define, design, deliver
- development: index
- accessibility: index
- marketing: index
- project-management: index
- coaching: index

## Design Decisions

- **Context-oriented organization**: Domain-specific tools/MCP content lives within its domain, not in a separate technical section
- **Each domain owns its structure**: Design uses Empathize/Define/Ideate/Prototype/Test; Research uses Discover/Define/Design/Deliver; no forced uniformity
- **Stubs for all 8 categories**: Complete navigation structure from day one, content filled incrementally
- **Native Fumadocs pattern**: No custom components — uses built-in root toggle dropdown
