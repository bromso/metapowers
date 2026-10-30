# Stack profiles

A **profile** is one Markdown file per stack that tells the skills which build, test, lint, review, debug, ship or generate code how a project on that stack is run and laid out, and which house rules a reviewer enforces. A project points at a profile from the `Stack` section of its `AGENTS.md`; the project's own keys win where both speak.

## Profiles

| Profile | Stack | Written against |
| --- | --- | --- |
| `bun-react-ts.md` | Bun workspaces, TypeScript, Next.js App Router, React, Tailwind, Biome | `boilerplate-bun` (see the file's first lines) |
| `rust-gpui.md` | Rust workspace, `just` + `cargo nextest`, Axum, GPUI desktop app | `boilerplate-rust` (see the file's first lines) |

## Declare a stack

In the project's `AGENTS.md` (or `CLAUDE.md`, when that is the file the project keeps), under a `## Stack` heading, one fenced `yaml` block. Only `stack` is required; a key left out falls back to the profile's value.

```yaml
stack: TypeScript 5.9, Next.js 16, React 19, Bun 1.4   # free text: language, framework, runtime
profile: bun-react-ts          # a file in this folder, when one matches
install: bun install
build: bun run build
test: bun run test:services    # the command that proves the code works
lint: bun run check            # the command that must pass before a commit
format: bun run format:fix
typecheck: bun run typecheck
run: bun dev
layout: apps/* and packages/*; tests colocated as *.test.ts; e2e in apps/e2e/tests; docs in docs/guides
rules: Always Bun, never npm/pnpm/yarn. Frontend layers tokens → components → blocks → views → pages.
```

`/singular-init` writes this section from the project's own files and names a profile when one matches.

## How a skill uses it

Skills with `metadata.stack-aware: true` open their Prerequisites with a generated **Stack** step: read the section, use its commands exactly, read the named profile (bundled under the skill's own `references/stacks/`) for the rest, and run `singular-detect` when there is no section. They never assume a package manager, test runner or formatter the project did not declare.

## Add a profile

1. Copy the shape of an existing profile: a first line naming the repository and commit it was written against, then `## Declare it`, `## Commands`, `## Layout`, `## Rules`, `## For skills`.
2. Write it against a real repository, quoting its commands and rules; do not invent them.
3. Add it to the table above and run `gen-references` (from `packages/pack-tools`) so every stack-aware skill carries a copy.
