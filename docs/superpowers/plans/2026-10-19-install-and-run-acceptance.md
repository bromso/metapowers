# Install-and-run — acceptance results

Date: 2026-10-20 · Branch: `install-and-run` · Claude Code CLI `2.1.283`

This records the evidence for the checklist in
[`docs/superpowers/specs/2026-10-19-install-and-run-design.md`](../specs/2026-10-19-install-and-run-design.md) (`## Acceptance`).

**Scope.** Nothing here ran `claude plugin marketplace add`, `claude plugin install`, or a skill inside Claude Code. Those commands change the owner's user-level Claude Code configuration and use model tokens, and the owner has not authorised that. Each item below has the strongest mechanical evidence we could get from the repo and local tooling. The live parts are in [Live-run instructions](#live-run-instructions-for-the-owner), and you can run those steps as written.

Legend: ✅ mechanical evidence recorded · ⏳ needs a live run (see step L*n*) · ⛔ blocked

## Checklist

| # | Acceptance item | Status | Evidence |
|---|---|---|---|
| 1 | `claude plugin validate . --strict` → 0 errors, and CI runs it | ✅ | [E1](#e1-plugin-validate), [E2](#e2-repo-checks) (CI step) |
| 2 | `bun run lint:skills` passes with the five new rules enabled | ✅ | [E2](#e2-repo-checks) |
| 3 | CI green on `main` | ⏳ L0 | The branch isn't merged or pushed yet. Every CI command passes locally ([E2](#e2-repo-checks)) |
| 4 | Local marketplace install of `security@metapowers`; `/security:security-policy acme` then two Protect skills → `00-govern.md` exists, `02-protect.md` contains both sections, no directory contains `--skip-checks` | ✅ mechanical / ⏳ L1–L3 | [E3](#e3-security-protect-append-semantics), [E5](#e5-phase-gate--hub-shape-security) |
| 5 | Chain domain (accounting): phase 2 with no phase-1 artifact is blocked with a clear message; `--skip-checks` writes `skip-log.md` naming the artifact and the write succeeds; phase 3 is still gated | ✅ hook / ⏳ L4 | [E4](#e4-phase-gate--chain-shape-accounting) |
| 6 | Hub domain (security): a Protect skill runs with only `00-govern.md` present | ✅ hook / ⏳ L2 | [E5](#e5-phase-gate--hub-shape-security) |
| 7 | Compliance phase 2 is allowed once any `01-assess/<regulation>.md` exists | ✅ | [E6](#e6-compliance) |
| 8 | Installing `design@metapowers` with `FIGMA_ACCESS_TOKEN` set starts the Figma MCP from the cache | ⛔ | [E9](#e9-figma-mcp). Blocked until the `@metapowers` npm org exists and `release.yml` publishes `@metapowers/figma-mcp@0.2.0`. The local design gate works ([E7](#e7-design-figma-gate)) |
| 9 | README/docs install instructions reproduce the above | ✅ mechanical / ⏳ L1 | [E10](#e10-cli-hand-off), [E11](#e11-docs) |
| — | (brief) Shared templates load from the plugin cache, not the project | ✅ mechanical / ⏳ L5 | [E8](#e8-shared-template-paths) |

No mechanical check failed.

---

## Evidence

### E1. Plugin validate

```
$ claude plugin validate . --strict
Validating marketplace manifest: /Users/jonasbroms/Sites/metapowers/.claude/worktrees/install-and-run/.claude-plugin/marketplace.json

✔ Validation passed
EXIT=0
```

### E2. Repo checks

The repo was built first with `bun turbo build` (exit 0).

```
$ bun run lint:skills
... (333 PASS lines, 0 FAIL)
 Tasks:    1 successful, 1 total
EXIT=0

$ bun run check:plugins
@metapowers/plugin-tools:check: $ node dist/cli.js gen-phase-deps ../../plugins --check && node dist/cli.js sync-hooks ../../plugins --check && node dist/cli.js fix-shared-refs ../../plugins --check && node dist/cli.js fix-args ../../plugins --check && node dist/cli.js fix-phase-files ../../plugins --check && node dist/cli.js check-counts ../..
 Tasks:    7 successful, 7 total
EXIT=0

$ bun run test
@metapowers/scoring-harness:test:  Test Files  3 passed (3)   Tests  8 passed (8)
create-metapowers:test:            Test Files  1 passed (1)   Tests  5 passed (5)
@metapowers/skill-validator:test:  Test Files  4 passed (4)   Tests 40 passed (40)
@metapowers/figma-mcp:test:        Test Files 11 passed (11)  Tests 30 passed (30)
@metapowers/plugin-tools:test:     Test Files  7 passed (7)   Tests 96 passed (96)
 Tasks:    11 successful, 11 total
EXIT=0

$ bun run check
$ biome check .
Checked 196 files in 36ms. No fixes applied.
EXIT=0
```

CI wiring in `.github/workflows/validate-skills.yml`: `bun run lint:skills` (line 43), `claude plugin validate . --strict` (line 48, after `npm install -g @anthropic-ai/claude-code`), and `bun run check:plugins` (line 54). `.github/workflows/ci.yml` runs `bun run check` (line 22) and `bun run test` (line 40).

### E3. Security Protect append semantics

Two Protect skills write to the same file. Each one writes its own `## <Title>` section:

```
$ grep -n '02-protect\|Write the artifact' plugins/security/skills/{api-security,secure-coding}/SKILL.md
api-security:57:  7. **Write the artifact** — append to `.metapowers/security/<project>/02-protect.md` under a `## API Security` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## API Security` section already exists, replace only that section. The section contains:
secure-coding:58: 7. **Write the artifact** — append to `.metapowers/security/<project>/02-protect.md` under a `## Secure Coding` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Secure Coding` section already exists, replace only that section. The section contains:
```

The Arguments paragraph (api-security line 9) keeps `--skip-checks` out of every path:

> **Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

`security-policy` also uses append semantics. It writes to `00-govern.md` under `## Security Policy` (line 48).

### E4. Phase gate — chain shape (accounting)

The hook was run the way Claude Code runs it, with the PreToolUse JSON piped to stdin, in `/tmp/mp-gate`:

```
$ mkdir -p .metapowers/accounting/books
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/accounting/books/02-journal.md"}}' | bash plugins/accounting/hooks/phase-gate.sh
Metapowers phase gate: accounting/books phase 02 needs 01-analyze.md first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.
exit=2
$ append skip-log line to .metapowers/accounting/books/skip-log.md
- 2026-10-20T00:00:00Z — Journal skipped prerequisite check for 02-journal.md — reason: test
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/accounting/books/02-journal.md"}}' | bash plugins/accounting/hooks/phase-gate.sh
exit=0
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/accounting/books/03-ledger.md"}}' | bash plugins/accounting/hooks/phase-gate.sh
Metapowers phase gate: accounting/books phase 03 needs 02-journal.md first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.
exit=2
$ touch .metapowers/accounting/books/01-analyze.md && rm .metapowers/accounting/books/skip-log.md
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/accounting/books/02-journal.md"}}' | bash plugins/accounting/hooks/phase-gate.sh
exit=0
```

What this shows: the gate blocks the write with a clear message. A skip-log line naming `02-journal.md` unblocks only that file, and `03-ledger.md` stays blocked. Once the real prerequisite exists, the gate passes.

### E5. Phase gate — hub shape (security)

```
$ ls .metapowers/security/acme
00-govern.md
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/security/acme/02-protect.md"}}' | bash plugins/security/hooks/phase-gate.sh
exit=0
```

`plugins/security/hooks/phase-deps.json` requires only `00-govern.md` for phases 01–05. That matches the Protect skills' Prerequisites.

### E6. Compliance

```
$ mkdir -p .metapowers/compliance/acme          # no 00-scope.md yet
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/compliance/acme/01-assess/gdpr.md"}}' | bash plugins/compliance/hooks/phase-gate.sh
Metapowers phase gate: compliance/acme phase 01 needs 00-scope.md first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.
exit=2
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/compliance/acme/02-remediate.md"}}' | bash plugins/compliance/hooks/phase-gate.sh
Metapowers phase gate: compliance/acme phase 02 needs 00-scope.md first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.
exit=2
$ touch .metapowers/compliance/acme/00-scope.md
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/compliance/acme/01-assess/gdpr.md"}}' | bash plugins/compliance/hooks/phase-gate.sh
exit=0
$ echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/mp-gate/.metapowers/compliance/acme/02-remediate.md"}}' | bash plugins/compliance/hooks/phase-gate.sh
exit=0
```

The directory alternative in the `artifacts` regex matches `01-assess/gdpr.md`: it is gated as phase 01. Phase 02 (`gap-analysis`, `control-mapping`, `evidence-plan`) requires only `00-scope.md`, which is also what those skills' Prerequisites check. It doesn't require a literal `01-assess.md` file that no skill writes. So phase 2 is never blocked after a regulation assessment exists, because any `01-assess/<regulation>.md` can only have been written once `00-scope.md` existed, or under `--skip-checks`.

### E7. Design Figma gate

```
$ cd /tmp/mp-design        # empty
$ bash plugins/design/hooks/check-define-exists.sh
Metapowers design gate: no .metapowers/design/<component>/02-define.md found. Run /design:define-component <component> first, or set METAPOWERS_SKIP_CHECKS=1.
exit=2
$ mkdir -p .metapowers/design/btn && touch .metapowers/design/btn/02-define.md
$ bash plugins/design/hooks/check-define-exists.sh
exit=0
```

The matcher fires for the plugin-scoped tool name a marketplace install exposes (`mcp__plugin_design_metapowers-figma__…`), for a user-level server name, and not for read-only tools:

```
$ node -e 'const m=require("./plugins/design/hooks/hooks.json").hooks.PreToolUse[1].matcher;const re=new RegExp(`^(?:${m})$`);for(const t of ["mcp__plugin_design_metapowers-figma__figma_create_component","mcp__metapowers-figma__figma_create_component","mcp__plugin_design_metapowers-figma__figma_get_node"])console.log(t,re.test(t))'
mcp__plugin_design_metapowers-figma__figma_create_component true
mcp__metapowers-figma__figma_create_component true
mcp__plugin_design_metapowers-figma__figma_get_node false
```

### E8. Shared template paths

```
$ grep -rc 'plugins/[a-z-]*/shared/' plugins/*/skills/*/SKILL.md | grep -v ':0' | wc -l
       0
$ grep -rl 'CLAUDE_PLUGIN_ROOT' plugins/*/skills/*/SKILL.md | wc -l
     126
```

No skill points at a repo-relative `plugins/<domain>/shared/` path. 126 skills read templates through `${CLAUDE_PLUGIN_ROOT}`, for example `plugins/development/skills/plan/SKILL.md:39` uses `${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md`. The validator's `shared-ref-resolvable` rule checks that every referenced file exists, and it passes inside `bun run lint:skills` (EXIT=0, [E2](#e2-repo-checks)). `fix-shared-refs --check` passes inside `check:plugins`.

Related count (plan Task 5 Step 5, corrected): `grep -l "skip-checks" plugins/*/skills/*/SKILL.md | wc -l` → `269`.

### E9. Figma MCP

Status: **pending.** The owner needs to create the `@metapowers` npm org and let `release.yml` publish `@metapowers/figma-mcp@0.2.0`. Until that happens, `npx` cannot resolve the package.

```
$ cat plugins/design/.mcp.json
{
	"mcpServers": {
		"metapowers-figma": {
			"command": "npx",
			"args": ["-y", "@metapowers/figma-mcp@0.2.0"],
			"env": { "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}" }
		}
	}
}
```

### E10. CLI hand-off

```
$ cd packages/create-metapowers && bun run build
  index.js  10.11 KB  (entry point)
$ node dist/index.js --tool claude --all /tmp/mp-accept < /dev/null
  Installing all 16 domains...

  Claude Code installs Metapowers from the plugin marketplace. Run:

    /plugin marketplace add bromso/metapowers
    /plugin install design@metapowers
    /plugin install research@metapowers
    /plugin install development@metapowers
    /plugin install marketing@metapowers
    /plugin install branding@metapowers
    /plugin install accessibility@metapowers
    /plugin install project-management@metapowers
    /plugin install coaching@metapowers
    /plugin install legal@metapowers
    /plugin install leadership@metapowers
    /plugin install metapowers@metapowers
    /plugin install security@metapowers
    /plugin install compliance@metapowers
    /plugin install bookkeeping@metapowers
    /plugin install accounting@metapowers
    /plugin install finance@metapowers

  Next steps:
    Claude Code: use the /plugin commands above
    Then try: /design:define-component button
exit=0
$ ls -la /tmp/mp-accept
ls: /tmp/mp-accept: No such file or directory          # nothing created

$ node dist/index.js --tool codex --all /tmp/mp-accept2 < /dev/null
  ...
  ✓ Installed accounting
  ✓ Installed finance
  ✓ Created artifact directories in .metapowers/
  ✓ Created AGENTS.md
  ✓ Created .metapowers/config.json

  Done!

  Installed 16 domains with 283 skills into /tmp/mp-accept2/.metapowers/plugins
exit=0
$ ls /tmp/mp-accept2/.metapowers/plugins | wc -l
      16
$ find /tmp/mp-accept2/.metapowers/plugins -name SKILL.md | wc -l
     283                                                 # = ls plugins/*/skills/*/SKILL.md | wc -l
$ grep -rl 'CLAUDE_PLUGIN_ROOT' /tmp/mp-accept2/.metapowers | wc -l
       0
```

The only remaining mention of `CLAUDE_PLUGIN_ROOT` under `/tmp/mp-accept2` is the sentence in `AGENTS.md` that explains the rewrite. Both temp dirs were removed afterwards.

### E11. Docs

```
$ grep -rn "claude install\|claude update\|\.project/" README.md CLAUDE.md apps/docs/content | wc -l
       0
```

The Claude Code row of the README (line 87) now gives `/plugin marketplace add bromso/metapowers` followed by `/plugin install <domain>@metapowers`.

---

## Live-run instructions for the owner

These steps change your user-level Claude Code plugin config. Step L6 removes everything again. Replace `/path/to/metapowers` with your checkout of this branch. Once the branch is merged, you can use `bromso/metapowers` instead.

**L0. CI on `main`.** Merge the branch. Then confirm that `CI` and `Validate Skills` are green:

```bash
gh run list --branch main --limit 5
```

**L1. Install from the local marketplace.**

```bash
claude plugin marketplace add /path/to/metapowers     # or: claude plugin marketplace add bromso/metapowers
claude plugin install security@metapowers
claude plugin install accounting@metapowers
claude plugin list                                     # expect security@metapowers and accounting@metapowers, enabled
mkdir -p /tmp/mp-live && cd /tmp/mp-live && git init -q && claude
```

Every step below runs inside that `claude` session, started in `/tmp/mp-live`.

**L2. Govern, then Protect (hub shape).**

```
/security:security-policy acme
```

Check that `.metapowers/security/acme/00-govern.md` exists and has a `## Security Policy` section. There should be no gate message.

**L3. Two Protect skills append to one file.**

```
/security:api-security acme
/security:secure-coding acme
```

Check that both writes are allowed (only `00-govern.md` was needed). Then, in a shell:

```bash
grep -n '^## ' .metapowers/security/acme/02-protect.md   # expect both "## API Security" and "## Secure Coding"
find .metapowers -name '*--skip-checks*'                  # expect no output
```

**L4. Chain gate (accounting).** Don't run `/accounting:analyze` first.

```
/accounting:journal books
```

Expect the Write of `.metapowers/accounting/books/02-journal.md` to be blocked, with this message:
`Metapowers phase gate: accounting/books phase 02 needs 01-analyze.md first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.`

```
/accounting:journal books --skip-checks
```

Expect `.metapowers/accounting/books/skip-log.md` to contain a line like `- <ISO timestamp> — Journal skipped prerequisite check for 02-journal.md — reason: …`. Expect `02-journal.md` to be written. Expect no directory called `books --skip-checks` or similar.

```
/accounting:ledger books
```

Expect this write to still be blocked, with `… phase 03 needs 02-journal.md first …`. The block comes from the skill's own Prerequisites check or from the hook. The skip was scoped to `02-journal.md` only, so if the skill writes anyway, the hook blocks the write.

**L5. Shared templates come from the plugin cache.** Install the development plugin and run a skill that reads a template:

```bash
claude plugin install development@metapowers
```

```
/development:plan x
```

In the transcript, check that the Read of `plan-template.md` targets a path under the plugin cache (`~/.claude/plugins/…/development/shared/plan-template.md`). It should not target `/tmp/mp-live/plugins/…`, and it should not fail.

**L6. Figma (only after `@metapowers/figma-mcp@0.2.0` is on npm).**

```bash
npm view @metapowers/figma-mcp@0.2.0 version              # must print 0.2.0
export FIGMA_ACCESS_TOKEN=<token>
claude plugin install design@metapowers
claude                                                     # then: /mcp
```

Check that `/mcp` lists `metapowers-figma` as connected.

**L7. Clean up.**

```bash
for p in security accounting development design; do claude plugin uninstall "$p@metapowers"; done
claude plugin marketplace remove metapowers
rm -rf /tmp/mp-live
```

Record the results by replacing ⏳ with ✅ (or ❌ plus the output) in the checklist above.
