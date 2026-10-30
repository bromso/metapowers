---
name: singular-init
description: Initialize singularskills in a project — create the workspace directory, choose which domains to activate and record the project configuration. Use when the user is starting to use singularskills in a new project or wants to change which domains are active in it.
metadata:
  disable-model-invocation: true
---

# Init

Initialize the `.singularskills/` directory for the current project. Set up the project configuration and choose which domains to activate.

## Prerequisites

None — this is typically the first singularskills command you run in a new project.

## Process

1. **Check if `.singularskills/` already exists:**
   - If it exists, read `.singularskills/config.md` and show current configuration
   - Ask if the user wants to update the configuration, or only the `Stack` section of `AGENTS.md` (step 4b)
   - If it doesn't exist, proceed with initialization

2. **Ask the user:**
   - What is the project name?
   - Which domains will you use? Present the full list:
     - Design (component design with Figma integration)
     - Research (Double Diamond discovery and validation)
     - Development (plan, build, test, debug, review, ship)
     - Marketing (RACE Framework campaigns)
     - Branding (brand creation and compliance)
     - Accessibility (WCAG-EM audits)
     - Project Management (Scrum workflow)
     - Coaching (domain-specific mentorship)
     - Leadership (team development and management)
     - Legal (contracts, compliance, governance)

3. **Create the directory structure:**
   - Create `.singularskills/` root directory
   - Create subdirectories for each selected domain
   - Create `.singularskills/reports/` for cross-domain reports

4. **Write the project configuration:**
   - Write `.singularskills/config.md` with:
     - Project name
     - Active domains
     - Date initialized
     - Notes or goals (if the user provided any)

4b. **Write the Stack section** so the skills that build, test, lint, review or generate code know how this project is run. Take every value from the project's own files, never from a profile:
   - `stack`: from `package.json` (`packageManager`, and the versions of TypeScript, Next.js, React or other frameworks among its dependencies), `Cargo.toml` with `rust-toolchain.toml` (Rust toolchain and edition), `pyproject.toml`, `go.mod` or the equivalent
   - `install`, `build`, `test`, `lint`, `format`, `typecheck`, `run`: from `package.json` scripts, a `justfile` or a `Makefile`, taking a script only when its name matches the key (`test`, `test:services`, `check`, `lint`, …); leave out any key you cannot read, so the profile supplies it
   - `layout`: the top-level folders you see (for example `apps/*`, `packages/*`, `crates/*`, `src/`) and where tests live
   - `profile: bun-react-ts` when `package.json` has `packageManager` starting with `bun@` and both `next` and `react` among its dependencies; `profile: rust-gpui` when a Cargo workspace member depends on `gpui`; otherwise no `profile` key
   - Keep the shape flat: every key is one line of plain text (`stack`, `layout` and `rules` are free text, never nested mappings or lists), and only the keys named above (`stack`, `profile`, `install`, `build`, `test`, `lint`, `format`, `typecheck`, `run`, `layout`, `rules`) appear; put `stack` first
   - Write it as one fenced `yaml` block under a `## Stack` heading in `AGENTS.md`, creating the file with the one-line intro "This project uses singularskills; the Stack section below tells its skills how to build, test and lint it." when it does not exist, or in `CLAUDE.md` when only that file exists. Replace an existing `## Stack` section in place; never add a second one.

5. **Suggest next steps:**
   - Based on selected domains, recommend which to start with
   - Provide the first command to run

## Output

The project configuration written to `.singularskills/config.md` and the `## Stack` section written to `AGENTS.md` (or `CLAUDE.md`). Present the initialized structure and suggested next steps to the user.
