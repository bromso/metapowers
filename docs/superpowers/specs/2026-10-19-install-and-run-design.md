# Project A: Make Metapowers install and run

**Date:** 2026-10-19
**Status:** Reviewed by builder check; awaiting owner approval
**Scope:** Tiers 1–2 of the 2026-10-19 audit. Trigger descriptions, `name` fields, evals, skill-body quality (project B) and the docs-site redesign (project C) are explicitly out of scope.

## Intent

Metapowers is a Claude Code plugin marketplace with 16 plugins and 283 skills. It has never been battle-tested because, as shipped, it does not deliver working skills by any documented install path:

- all 16 `plugin.json` manifests fail `claude plugin validate` (156 errors) because component paths use `../`, which Claude Code rejects and does not load;
- 119 skills read their templates from `plugins/<domain>/shared/...` relative to the working directory, which after install is the user's project, so templates silently never load;
- 6 `.mcp.json` files point at MCP servers that either don't exist (5) or sit outside the plugin root and are unbuilt (figma);
- the documented Claude Code install command (`claude install bromso/metapowers`) installs Claude Code itself, not a plugin, and `create-metapowers` installs to `.metapowers/plugins/`, a directory Claude Code never reads;
- CI is red on `main`, which is how all of the above shipped unnoticed.

Even once installed, several conventions break on first real use: 72 skills overwrite each other's phase files, `--skip-checks` leaks into artifact directory names in 176 skills, project-management writes to `.project/` while every other domain uses `.metapowers/`, and the "quality gate" hooks the README promises are empty in 15 of 16 plugins and non-functional in the 16th.

The goal of this project is simple: **a fresh user can run `/plugin marketplace add bromso/metapowers`, install a plugin, run its skills in sequence, and every skill finds its templates, writes its artifacts without destroying earlier ones, and is gated the way the README says.** Nothing here changes what the skills say; it changes whether they run.

## Goals

1. `claude plugin validate . --strict` passes, and CI fails if it ever stops passing.
2. Every shared template/guide reference resolves inside an installed plugin.
3. Every `.mcp.json` points at a server that exists and starts from an installed plugin.
4. The README, docs and CLI describe install paths that actually produce working skills in Claude Code.
5. Running several skills of the same phase preserves all their output.
6. `--skip-checks` never appears in a path.
7. All domains use `.metapowers/<domain>/<project>/`, and the domain registry lists all of them.
8. Phase-order hooks either work or are not claimed. (Decision below: make them work, generically.)
9. CI is green on `main` and covers the things that broke.
10. Skill counts shown anywhere are correct.

## Non-goals

- Rewriting skill descriptions, adding `name`, `argument-hint`, `allowed-tools`, `disable-model-invocation` (project B).
- Adding evals or fixing the scoring-harness beyond keeping it building (project B).
- Changing skill process content, output formats, disclaimers, or fixing the finance/ratios formula errors (project B).
- Any docs-site visual work (project C).
- Writing the 5 missing MCP servers. They are deleted, not built.
- Multi-harness (Codex/Cursor/OpenCode) parity. Claude Code is the primary target; the other harnesses keep whatever the CLI copies for them, with corrected instructions.

## Anti-goals

- Making `claude plugin validate` pass by weakening the check (e.g. not using `--strict`, or suppressing warnings) rather than fixing manifests.
- Fixing shared-path references by copying template content into 119 skill bodies. Templates must stay shared.
- "Fixing" phase-file overwrites by giving each skill its own file in a way that breaks the downstream skills that read `0N-<phase>.md`.
- A hook that blocks writes the user intended, or that fires on unrelated `Write` calls in the user's project.

## Constraints

- Repo conventions: Bun + Turborepo, Biome, Vitest, conventional commits, changesets for npm packages (CLAUDE.md).
- Skills are plain Markdown; every fix to 100+ skills must be scriptable and idempotent, and re-runnable by a validator rule so it cannot regress.
- Claude Code plugin rules (plugins-reference): component paths relative to plugin root, start with `./`, no `..`; default directories (`skills/`, `hooks/hooks.json`, `.mcp.json`, `agents/`, `commands/`) are discovered automatically when the keys are omitted; installed plugins are copied to a cache, so `${CLAUDE_PLUGIN_ROOT}` is the only reliable way to reference plugin files from skills, hooks and MCP configs.
- Hooks: `PreToolUse` blocks only on exit code 2; exit 1 is a non-blocking error. Hook stdin is JSON containing `tool_name` and `tool_input` (for `Write`/`Edit`: `tool_input.file_path`).

## Design

### 1. Plugin manifests

For all 16 `plugins/*/.claude-plugin/plugin.json`:

- Remove the `skills`, `commands`, `agents`, `hooks` and `mcpServers` keys entirely. Claude Code discovers `skills/`, `hooks/hooks.json` and `.mcp.json` by convention. No plugin has `commands/` or `agents/`, so nothing is lost.
- Keep `name`, `version`, `description`, `author`, `repository`, `homepage`, `license`, `keywords`.
- Add `"$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json"` for editor validation.

Acceptance: `claude plugin validate . --strict` exits 0 with no errors. Warnings about `${CLAUDE_PLUGIN_ROOT}` quoting are fixed by quoting in hooks.json (`"\"${CLAUDE_PLUGIN_ROOT}/hooks/phase-gate.sh\""` is not valid JSON-in-JSON; the accepted form is to quote inside the command string: `"command": "\"${CLAUDE_PLUGIN_ROOT}\"/hooks/phase-gate.sh"`). Builder: verify the exact form the validator accepts and use that.

### 2. Shared file references

Rewrite every reference in `plugins/*/skills/*/SKILL.md`:

| Current form | Count (approx.) | Rewrite to |
|---|---|---|
| `plugins/<domain>/shared/<file>` | 167 | `${CLAUDE_PLUGIN_ROOT}/shared/<file>` |
| `shared/<file>` (bare) | 3 skills | `${CLAUDE_PLUGIN_ROOT}/shared/<file>` |
| `financial-model-template.md` (no path) | 3 skills | `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` (file is in finance/shared) |

Cross-plugin references (a skill in plugin X reading `plugins/Y/shared/...`) cannot use `${CLAUDE_PLUGIN_ROOT}`. Builder: grep for them; if any exist, copy the referenced file into plugin X's `shared/` and reference it locally. Do not leave cross-plugin paths.

The rewrite is a script (`scripts/fix-shared-refs.ts` or a one-off `sed`), and a new validator rule makes the old forms a hard error (see §9).

Hooks and `.mcp.json` already use `${CLAUDE_PLUGIN_ROOT}`; keep that.

### 3. MCP servers

- Delete `.mcp.json` from `compliance`, `legal`, `marketing`, `project-management`, `security`. The referenced packages do not exist and no skill in those plugins calls MCP tools. Builder: confirm with a grep for `mcp__` / tool names before deleting each.
- Design's `.mcp.json` must start from the plugin cache. The build-time path `${CLAUDE_PLUGIN_ROOT}/../../packages/figma-mcp/dist/index.js` cannot work after install. The server is distributed via npm and launched with `npx`:

  ```json
  {
    "mcpServers": {
      "metapowers-figma": {
        "command": "npx",
        "args": ["-y", "@metapowers/figma-mcp@<version>"],
        "env": { "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}" }
      }
    }
  }
  ```

  This requires `packages/figma-mcp` to drop `"private": true`, get a changeset, and be published by the existing `release.yml`. The package name/scope is an open question for the owner (see "Open questions"). Until it is published, design's MCP cannot work for installed users; the design plugin's README should say so.

  `FIGMA_ACCESS_TOKEN` stays an env var in this project; moving it to `userConfig` with `sensitive: true` is a project B improvement.

- Fix the hook matchers in `plugins/design/hooks/hooks.json` to the real tool names. MCP tool names are `mcp__<server>__<tool>`; with the server named `metapowers-figma`, the prefix is `mcp__metapowers-figma__`. Builder: list the tools `packages/figma-mcp` registers and use a matcher that covers the write/mutating ones (regex is accepted, e.g. `mcp__metapowers-figma__figma_(create|execute|update).*`).

### 4. Install paths

**README and `apps/docs/content/docs/overview/installation.mdx`:**

Replace `claude install bromso/metapowers` / `claude update` with the real flow:

```
/plugin marketplace add bromso/metapowers
/plugin install design@metapowers
```

(and `claude plugin install design@metapowers` from the shell). Mention `/plugin marketplace update metapowers` for updates. Keep the other-harness sections but correct them where wrong (see CLI below).

**`packages/create-metapowers`:** this CLI copies plugin folders into `.metapowers/plugins/`, which Claude Code does not read. Decision (owner's, see Open questions; default proposed here):

- For Claude Code, the CLI stops copying and instead prints the two `/plugin` commands above (and offers to run `claude plugin marketplace add bromso/metapowers` if `claude` is on PATH).
- For Codex / Cursor / OpenCode, it keeps copying, but into the location each harness actually reads, and the `DOMAINS` list is generated from `.claude-plugin/marketplace.json` at build time instead of being hand-maintained (fixes the 11-of-16 and stale-count problems permanently).
- Because §2 rewrites shared-file references to `${CLAUDE_PLUGIN_ROOT}/shared/...`, and none of those harnesses define that variable, the CLI **rewrites `${CLAUDE_PLUGIN_ROOT}` to the absolute path of the copied plugin directory at install time** (a string replace over the copied SKILL.md files). This keeps template references at least as resolvable as they are today for those harnesses. Covered by a CLI test. (Design call made after builder review; the alternative of leaving the literal variable would silently break every template for those users.)
- The shipped AGENTS.md / `.cursorrules` templates are corrected: skill path matches where files were actually copied, all 16 domains, `/design:define-component` not `/design:define`.
- `"version"` written to `.metapowers/config.json` comes from the package's own `package.json`.
- "Overwrite? y" actually removes the existing `.metapowers/plugins/` before copying.
- Add at least one Vitest test file so `vitest run` passes (see §9).

### 5. Phase-file overwrites

Current state: in security, legal, compliance, development, leadership, finance, accounting, bookkeeping (builder: confirm the exact set), multiple skills in the same phase say "Write the artifact to `0N-<phase>.md`". Marketing and project-management say "append to `0N-<phase>.md` under a `## <Skill Name>` section". Downstream skills read `0N-<phase>.md`, so the file name must not change.

Decision: adopt the marketing/PM convention everywhere. For every phase file targeted by more than one skill (25 files, 72 skills):

- Change "Write the artifact to `X`" to "Append to `X` under a `## <Skill Title>` section. Create the file with a `# <Phase> — <project>` heading if it does not exist. If a `## <Skill Title>` section already exists, replace that section only."
- The `## Output` section is adjusted to say "appended" where it said "written".

Phase files owned by exactly one skill keep "write" (overwriting your own previous run is the intended behaviour).

This is a scripted edit driven by a generated table of (phase file → skills), checked into `scripts/` so it can be re-run.

### 6. `--skip-checks` and `$ARGUMENTS`

176 skills say "If `--skip-checks` is present in $ARGUMENTS…" and then use `$ARGUMENTS` as the directory slug. Replace that block, in all 176, with a single standard paragraph (one wording, so it can be validated):

> **Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/<domain>/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

and replace `$ARGUMENTS` with `<project>` inside every path (`.metapowers/<domain>/$ARGUMENTS/...` → `.metapowers/<domain>/<project>/...`). The first-line sentence ("Audit API security for "$ARGUMENTS"…") keeps `$ARGUMENTS` so the skill still receives it.

The skip-log line names the artifact file. The phase-gate hook (§8) uses that to allow exactly that write, so one skip does not disable gating for the rest of the project. (Design call made after builder review: today ~40 of the 176 skills never write a skip-log, and a project-wide bypass would make the gate meaningless after the first skip.)

`coaching/code` and the other skills whose argument is a file path or free text (builder: identify them; the audit found coaching/code) use a sanitised slug: "derive `<project>` from the argument by taking the basename without extension" — stated explicitly in those skills.

### 7. Artifact root and domain registry

- All 32 project-management skills: `.project/` → `.metapowers/project-management/`. Scripted.
- `plugins/metapowers/shared/domain-registry.md`: add security, compliance, bookkeeping, accounting, finance rows with their phase-file ranges (read from the plugins' own READMEs/skills). Builder: also check that `metapowers/status` and `metapowers/report` iterate the registry rather than a hard-coded list; if hard-coded, point them at the registry.
- Fix the 6 broken `/plugin:skill` references: `/design:define` → `/design:define-component` (design/ideate, AGENTS.md template, `check-define-exists.sh`, 5 doc pages), `/marketing:strategy` → the real skill name (builder: check `plugins/marketing/skills/`), and the phase-as-skill references in `companion-tools.mdx`.

### 8. Phase-gate hooks

The README promises "quality gates that enforce phase ordering". Today that is one hook that can never fire and six orphaned scripts. Decision: implement it once, generically, in every plugin that has phases.

**Mechanism.** One script, `hooks/phase-gate.sh`, identical in every plugin (checked into each plugin's `hooks/`, generated from a single source in `scripts/` so they can't drift), registered as:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{ "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}\"/hooks/phase-gate.sh" }]
      }
    ]
  }
}
```

**What the gate requires is what the skills already say.** Domains are not uniformly sequential: security, legal and marketing are hub-shaped (every skill's Prerequisites ask only for the phase-0 file, e.g. `secure-coding` writes `02-protect.md` and requires only `00-govern.md`); accounting and research are chains (each phase requires the one before); compliance's phase-1 output is a directory, `01-assess/<regulation>.md`, not a file. A naive "NN requires NN-1" rule would block the README's own workflows and make compliance phase 2 unreachable. (Design call made after builder review.)

So the gate is table-driven. Each plugin with phases ships `hooks/phase-deps.json`, **generated** by a script in `scripts/` from the skills' own Prerequisites sections, and checked by a validator rule so it cannot drift from the skills:

```json
{
  "domain": "security",
  "artifacts": "\\.metapowers/security/([^/]+)/(\\d\\d)-[^/]+\\.md$",
  "requires": {
    "01": ["00-*.md"],
    "02": ["00-*.md"],
    "03": ["00-*.md"],
    "04": ["00-*.md"]
  }
}
```

For compliance, `artifacts` also matches `01-assess/[^/]+\.md`, and `"02": ["01-assess/*.md"]`. Values are globs relative to the project directory; a phase passes when *every* listed glob matches at least one file. Phases with no entry are unrestricted.

The script reads the hook JSON from stdin, extracts `tool_input.file_path`, loads the sibling `phase-deps.json`, and:

1. Exits 0 immediately unless the path matches `artifacts`. Captures `<project>` and `NN` from the match.
2. Exits 0 if `requires[NN]` is absent, or if `METAPOWERS_SKIP_CHECKS=1` is set in the environment.
3. Exits 0 if `.metapowers/<domain>/<project>/skip-log.md` exists and contains the basename of the file being written (the §6 skip-log line). This allows exactly the write the user asked to skip, not every later write in the project.
4. Otherwise checks every glob in `requires[NN]` against the project directory. If all match, exit 0.
5. If not, print a one-line reason to stderr naming the missing prerequisite and both bypass options, and **exit 2**.

It uses the project directory from the path being written, not `find … | head -1`. Parsing stdin and `phase-deps.json` needs `jq` or a `python3 -c` one-liner; builder picks whichever the repo already assumes (hooks in the ecosystem commonly use `jq`; if so, exit 0 when `jq` is missing rather than blocking). `phase-gate.sh` itself is identical in every plugin; only `phase-deps.json` differs.

Design's Figma gate (define must exist before writing to Figma) is kept as a second matcher in design's hooks.json, with the corrected tool-name matcher (§3), the same stdin-based project detection where possible, and exit 2.

The six orphaned `check-*-exists.sh` scripts are deleted.

Hooks are tested with a shell test (`tests/hooks/phase-gate.test.sh` or Vitest spawning the script) feeding synthetic stdin JSON against fixture `phase-deps.json` files: ignored path outside `.metapowers`; allowed phase with no `requires`; blocked when a required glob has no match; allowed once it does; hub shape (phase 3 allowed with only `00-*` present); chain shape (phase 3 blocked with only `01-*` present); compliance directory prerequisite (`01-assess/x.md` satisfies phase 2); skip-log naming the target file allows that write but not a different phase file; `METAPOWERS_SKIP_CHECKS=1` allows; missing `jq` exits 0.

**Domains without numbered phases** (coaching's `*-review.md`, metapowers): the script's step 1 never matches, so the hook is harmless; those plugins may omit hooks.json entirely.

### 9. Validation and CI

**skill-validator** gains rules that would have caught this project's defects (each a hard error):

- `shared-ref-resolvable`: any `plugins/<domain>/shared/`, bare `shared/`, or `${CLAUDE_PLUGIN_ROOT}/shared/<file>` reference must point at a file that exists in that plugin's `shared/`.
- `no-args-in-path`: `$ARGUMENTS` must not appear inside a `.metapowers/...` path.
- `artifact-root`: artifact paths must start with `.metapowers/<plugin-name>/`.
- `skill-ref-exists`: every `/<plugin>:<skill>` reference must name an existing skill directory.
- `phase-file-append`: a phase file targeted by more than one skill in the plugin must use the append wording (§5) in every one of them.
- `skip-checks-standard`: every skill that mentions `--skip-checks` contains the §6 standard paragraph verbatim (modulo `<domain>`).
- `phase-deps-current`: each plugin's `hooks/phase-deps.json` equals what the generator produces from the skills' Prerequisites sections (run the generator, diff).
- Add `use` (and any other verbs needed by project B's "Use when…" descriptions) to the verb list now, so the rule stops forbidding trigger-style descriptions. The verb rule itself stays for this project.

**CI:**

- `ci.yml`: fix the red test job (create-metapowers gets a real test, or its `test` script becomes `vitest run --passWithNoTests` — prefer a real test of the DOMAINS generation and overwrite behaviour). Bump `actions/checkout` to v5 (Node 20 deprecation annotation).
- `validate-skills.yml`: add a step that installs Claude Code (`npm i -g @anthropic-ai/claude-code`) and runs `claude plugin validate . --strict`. Also run a counts check (§10).
- Remove or wire `scoring-harness` from `turbo build` filters only if it blocks; otherwise leave for project B.

### 10. Counts and stale numbers

Add `scripts/counts.ts` that computes skills per plugin from disk and checks: `.claude-plugin/marketplace.json` descriptions, each `plugin.json` description, README table, CLAUDE.md, `apps/docs/app/layout.tsx` and the docs overview. Rather than check hard-coded strings, replace the hard-coded "275+"/"288"/"33 skills" with values read from a generated `counts.json` where the consumer is code (docs layout, CLI), and have the script fail CI when Markdown files disagree with disk. Current truth: 283 skills; marketing 37, compliance 51, metapowers 8.

### 11. Documentation of the change

- README: fix install command, counts, and the "Quality gates" paragraph to describe the actual mechanism (phase-gate hook, `--skip-checks`, `METAPOWERS_SKIP_CHECKS`).
- CHANGELOG: an entry per plugin is not needed; one "Unreleased" entry for the marketplace describing the install fixes. Bump every plugin and the marketplace from `0.1.0` to `0.2.0` so existing installs receive the fix (`version` pins marketplace users).
- CLAUDE.md: update the skill count and add `claude plugin validate . --strict` to the Commands section.

## What's left to the builder

- Exact validator-accepted quoting of `${CLAUDE_PLUGIN_ROOT}` in hooks.json.
- Exact list of mutating Figma MCP tools for the design matcher.
- Whether `jq` or `python3` is used in `phase-gate.sh`.
- The precise set of phase files with multiple writers (the audit says 25 files / 72 skills; derive from disk).
- The set of skills whose `$ARGUMENTS` is not a project slug.
- Order of commits. Suggested: (1) manifests + CI validate step (make CI red, then green), (2) shared refs + validator rule, (3) MCP, (4) `--skip-checks`/paths/PM root/registry + validator rules, (5) phase-file append + rule, (6) hooks + tests, (7) CLI + docs + counts, (8) version bumps + changelog.

## Decisions made by the owner (2026-10-19)

1. **figma-mcp distribution: publish to npm** and launch with `npx -y @metapowers/figma-mcp@<version>`. The existing `release.yml` (changesets + `NPM_TOKEN`, `access: public`) handles publishing once `"private": true` is removed and a changeset exists.
   **Prerequisite the owner must do by hand:** the `@metapowers` scope does not exist on npm yet (`create-metapowers` is published unscoped by user `jonasbroms`). Create the free `metapowers` org at npmjs.com before the first publish, or the release step will fail with 404/403. The `NPM_TOKEN` secret must belong to a user in that org with publish rights. If the owner prefers not to create an org, the fallback is to rename the package `@jonasbroms/figma-mcp`; the builder should not decide this silently.
2. **create-metapowers for Claude Code: hand off to the marketplace.** For Claude Code it prints (and, if `claude` is on PATH and the user agrees, runs) `claude plugin marketplace add bromso/metapowers` and `claude plugin install <domain>@metapowers`. It keeps file-copying only for Codex/Cursor/OpenCode, with corrected target paths and all 16 domains generated from `marketplace.json`.
3. **Phase gates: build the generic `PreToolUse` gate** described in §8, in every plugin with numbered phases.

## Acceptance (project done when)

- [ ] `claude plugin validate . --strict` → 0 errors, and CI runs it.
- [ ] `bun run lint:skills` passes with the five new rules enabled.
- [ ] CI green on `main`.
- [ ] Fresh checkout, `claude plugin marketplace add ./` (local), `claude plugin install security@metapowers`, run `/security:security-policy acme` then two Protect skills: `00-govern.md` exists, `02-protect.md` contains both skills' sections, no directory contains `--skip-checks`.
- [ ] In a chain-shaped domain (accounting or research), running a phase-2 skill with no phase-1 artifact is blocked with a clear message; `--skip-checks` writes `skip-log.md` naming the artifact and the write then succeeds; a later phase-3 skill is still gated.
- [ ] In a hub-shaped domain (security), a Protect skill runs with only `00-govern.md` present, as its Prerequisites say.
- [ ] Compliance phase 2 is allowed once any `01-assess/<regulation>.md` exists.
- [ ] Installing `design@metapowers` with `FIGMA_ACCESS_TOKEN` set starts the Figma MCP from the cache (requires the npm publish from Q1).
- [ ] README/docs install instructions reproduce the above.
