# Metapowers

Structured, repeatable workflows for digital production domains, installed by `npx skills add bromso/singularskills` for Codex CLI and OpenCode.

## Where the skills are

Each skill is a markdown file at `.metapowers/plugins/<domain>/skills/<skill>/SKILL.md`. When asked to run `/<domain>:<skill> <args>` (for example `/design:define-component button`), read that file and follow its Process, substituting the arguments for `$ARGUMENTS`.

Skills reference shared templates and hooks by absolute path. The `${CLAUDE_PLUGIN_ROOT}` variable used in the source plugins was rewritten to `.metapowers/plugins/<domain>` (as an absolute path) at install time, so follow those paths as written.

## Domains

- `design` — Five-phase design thinking process for component design, writing to Figma canvas via MCP
- `research` — Four-phase Double Diamond research methodology for structured discovery and validation
- `development` — Process-oriented software development workflow: plan, build, test, debug, review, and ship
- `marketing` — RACE Framework marketing process: strategy, reach, act, convert, engage
- `branding` — Five-phase brand creation process with compliance auditing: discover, strategy, verbal, visual, guidelines
- `accessibility` — WCAG-EM accessibility audit workflow: scope, evaluate, report, remediate, retest with conformance scoring
- `project-management` — Scrum-based project management: initiate, plan, sprint, review, improve
- `coaching` — Domain-specific mentorship and feedback: UX, code, copy, accessibility, and strategy coaching
- `legal` — Legal Lifecycle Framework: assess, draft, review, comply, govern
- `leadership` — Leadership development process and day-to-day management tools: assess, vision, build, develop, sustain
- `metapowers` — Cross-domain meta-skills: project status, initialization, and reporting across all Metapowers domains
- `security` — NIST CSF 2.0 cybersecurity framework: govern, identify, protect, detect, respond, recover
- `compliance` — GRC Compliance Lifecycle: scope, assess, remediate, certify, monitor across 30+ regulations
- `bookkeeping` — Four-phase bookkeeping cycle: record, categorize, reconcile, report
- `accounting` — Eight-phase accounting cycle: analyze, journal, ledger, trial balance, adjust, statements, close
- `finance` — Six-phase FP&A process: assess, plan, forecast, budget, model, review

Only the domains selected at install are present; list `.metapowers/plugins/` to see them.

## Artifacts

All outputs are stored in `.metapowers/<domain>/<project>/` as numbered markdown files (`01-`, `02-`, ...). Check a skill's Prerequisites before running it: later phases read earlier phases' files.
