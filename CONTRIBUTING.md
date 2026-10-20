# Contributing to Metapowers

Thank you for your interest in contributing to Metapowers! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/metapowers.git
   cd metapowers
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- [Node.js](https://nodejs.org) >= 20

### Running Tests

```bash
bun run test                  # All tests
bun run test --filter=docs    # Specific package
```

### Linting and Formatting

We use [Biome](https://biomejs.dev/) for linting and formatting:

```bash
bun run check      # Check for issues
bun run format     # Auto-format
```

### Building

```bash
bun run build      # Build all packages via Turborepo
```

### Evals

Each plugin has an eval suite under `plugins/<plugin>/evals/<skill>/`, run with [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals): a `prompt.md` (a plain-words request that never names the skill), `graders/` (`fired.md`: the skill fired; `artifact.md`: its file exists; `quality.md`: an LLM rubric from the skill's `## Output`), and — for skills that need input files — a `case.yaml` plus `scaffold.sh` that copies `fixtures/` into the run's workspace.

```bash
bun run evals --dry                         # List every case; exit 1 if a prompt names its skill or a /plugin: command
bun run evals --report                      # Reprint the table from existing evals-results/*.json (free)
bun run evals                               # Run every plugin's suite
bun run evals security legal                # Run only these plugins
EVALS_MAX_COST_USD=3 bun run evals design   # Lower the per-plugin spend ceiling (default 10 USD)
EVALS_CONCURRENCY=4 bun run evals           # Parallel runs per plugin (default 2, 1-8; runs share one rate limit)
EVALS_ALLOW_BASH=0 bun run evals            # Grant Write Edit only, no Bash (default 1)
```

A real run spends Claude credits from your own account and is not part of CI. Results land in `evals-results/<plugin>.json` (ignored by git) and the script prints a `plugin | case | with | without | delta | fired` table. When you add or change a case, run `bun run evals --dry` first. The CLI refuses to grant Bash when `~/.docker` contains symlinks, as Docker Desktop installs do; on such a machine run with `EVALS_ALLOW_BASH=0` (the money skills then can't show script computations). The script also points an unset `DOCKER_CONFIG` at an empty temp directory to keep Docker credentials out of the runs.

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): fix a bug
docs: update documentation
refactor(scope): restructure code
test(scope): add or update tests
ci: update CI configuration
```

**Scopes:** `docs`, `design`, `figma-mcp`, `evals`, `validator`

## Pull Requests

1. Ensure your branch is up to date with `main`
2. Run tests and linting before submitting
3. Write a clear PR title following the commit convention
4. Fill out the PR template
5. Request review from maintainers

## Reporting Issues

- Use [GitHub Issues](https://github.com/bromso/metapowers/issues)
- Use the bug report or feature request templates
- Search existing issues before creating a new one

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
