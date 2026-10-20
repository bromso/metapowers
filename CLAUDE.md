# Metapowers

Structured, repeatable workflows for digital production domains. 283 skills across 16 plugins.

## Architecture

- **Monorepo**: Bun + Turborepo workspaces
- **Plugins** (`plugins/`): Each domain is a plugin with SKILL.md files, hooks, and shared resources
- **Packages** (`packages/`): CLI (`create-metapowers`), skill-validator, plugin-tools, figma-mcp
- **Evals** (`plugins/<domain>/evals/<skill>/`): `claude plugin eval` suites, run with `bun run evals` (`scripts/run-evals.sh`)
- **Docs** (`apps/docs/`): Fumadocs + Next.js static site deployed to GitHub Pages

## Plugin Structure

Every plugin follows this pattern:

```
plugins/<domain>/
├── .claude-plugin/plugin.json    # Plugin manifest
├── hooks/hooks.json              # Quality gate hooks
├── shared/                       # Templates and reference docs
└── skills/<skill-name>/SKILL.md  # One SKILL.md per skill
```

## SKILL.md Format

```markdown
---
name: <skill-name>   # must equal the directory name
description: <Verb-first sentence>. Use when <user's situation, ≥6 words>. Not for <x>; see /<plugin>:<skill>.   # 120–400 chars; "Not for" optional
argument-hint: "<arg>"   # when the skill takes an argument
---

# Skill Name

What the skill does with "$ARGUMENTS" placeholder.

## Prerequisites
What must exist before running (or "None").

## Process
Numbered steps with clear instructions.

## Output
Where the artifact is written and what to present.
```

## Conventions

- **Descriptions start with a verb**: "Create", "Analyze", "Review" — enforced by skill-validator
- **Artifacts**: All stored in `.metapowers/<domain>/<project>/` with numbered prefixes (01-, 02-, etc.)
- **Commits**: Conventional commits (`feat(domain):`, `fix(docs):`, `docs:`, `ci:`)
- **Formatting**: Biome for linting and formatting (`bun run check`, `bun run format`)
- **Testing**: Vitest for packages (`bun run test`)
- **Skill validation**: `bun run lint:skills` validates all 283 SKILL.md files

## Commands

```bash
bun run build          # Build all packages
bun run test           # Run tests
bun run lint:skills    # Validate all SKILL.md files
bun run check          # Biome lint check
bun run format         # Biome auto-format
bun run changeset      # Create a changeset for npm release
claude plugin validate . --strict   # Validate plugin manifests
bun run check:plugins               # phase-deps, hooks, counts (plugin-tools)
bun run evals --dry                 # List eval cases; fail if a prompt names its skill (free)
bun run evals [plugin…]             # Run claude plugin eval per plugin — spends Claude credits,
                                    # capped per plugin by EVALS_MAX_COST_USD (default 10)
```

## Adding a New Domain

1. Create `plugins/<domain>/` following the structure above
2. Add plugin.json with name, description, author
3. Create SKILL.md files in `skills/<name>/SKILL.md`
4. Add to `.claude-plugin/marketplace.json`
5. Create docs in `apps/docs/content/docs/<domain>/`
6. Add to `apps/docs/content/docs/meta.json` sidebar
7. Run `bun run lint:skills` to validate

## Adding a Skill to an Existing Domain

1. Create `plugins/<domain>/skills/<skill-name>/SKILL.md`
2. Frontmatter: `name` = directory name; description = verb-first sentence + `Use when <≥6 words>.` (optional `Not for …; see /x:y.`), 120–400 chars; `argument-hint` if it takes an argument
3. Run `bun run lint:skills` to validate
4. Add documentation page in `apps/docs/content/docs/<domain>/<skill>.mdx`
5. Update the domain's `meta.json` pages array

## Key Files

- `.claude-plugin/marketplace.json` — all registered plugins
- `apps/docs/content/docs/meta.json` — sidebar navigation
- `packages/skill-validator/src/rules.ts` — validation rules and recognized verbs
- `apps/docs/next.config.mjs` — basePath `/metapowers` for GitHub Pages
