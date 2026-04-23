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

**Scopes:** `docs`, `design`, `figma-mcp`, `scoring`, `validator`

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
