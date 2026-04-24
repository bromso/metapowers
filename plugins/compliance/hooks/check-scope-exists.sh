#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${COMPLIANCE_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .metapowers/compliance/<name>/ directories to infer current topic
TOPIC_DIR=$(find .metapowers/compliance -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .metapowers/compliance/ directory found. Run /compliance:scope first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
SCOPE_FILE=".metapowers/compliance/${TOPIC}/00-scope.md"

if [[ ! -f "$SCOPE_FILE" ]]; then
  echo "BLOCKED: ${SCOPE_FILE} not found." >&2
  echo "" >&2
  echo "Scope must be established before proceeding." >&2
  echo "Run: /compliance:scope ${TOPIC}" >&2
  echo "" >&2
  echo "To bypass: export COMPLIANCE_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
