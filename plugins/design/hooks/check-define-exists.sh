#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${DESIGN_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .metapowers/design/<name>/ directories to infer current component
COMPONENT_DIR=$(find .metapowers/design -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$COMPONENT_DIR" ]]; then
  echo "BLOCKED: No .metapowers/design/ directory found. Run /design:empathize and /design:define first." >&2
  exit 1
fi

COMPONENT=$(basename "$COMPONENT_DIR")
DEFINE_FILE=".metapowers/design/${COMPONENT}/02-define.md"

if [[ ! -f "$DEFINE_FILE" ]]; then
  echo "BLOCKED: ${DEFINE_FILE} not found." >&2
  echo "" >&2
  echo "The component contract must be defined before writing to Figma." >&2
  echo "Run: /design:define ${COMPONENT}" >&2
  echo "" >&2
  echo "To bypass: export DESIGN_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
