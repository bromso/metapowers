#!/usr/bin/env bash
# Fail when any file outside the history allowlist still names the old project.
#
# Usage: scripts/check-rename.sh
#
# Builds @singularskills/pack-tools if its CLI is missing, then runs
# `pack-tools check-rename <repoRoot>`: prints one `path:line` per hit and exits 1
# if there is any. The allowlist (changelogs, docs/plans, docs/superpowers, the
# README migration note, build output) lives in packages/pack-tools/src/rename-check.ts.
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cli="$repo_root/packages/pack-tools/dist/cli.js"

if [ ! -f "$cli" ]; then
  (cd "$repo_root/packages/pack-tools" && bun run build >/dev/null)
fi

if node "$cli" check-rename "$repo_root"; then
  echo "check-rename: no occurrences outside the allowlist"
else
  echo "check-rename: the paths above still name the old project" >&2
  exit 1
fi
