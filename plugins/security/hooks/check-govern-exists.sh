#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${SECURITY_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .metapowers/security/<name>/ directories to infer current topic
TOPIC_DIR=$(find .metapowers/security -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .metapowers/security/ directory found. Run /security:govern first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
GOVERN_FILE=".metapowers/security/${TOPIC}/00-govern.md"

if [[ ! -f "$GOVERN_FILE" ]]; then
  echo "BLOCKED: ${GOVERN_FILE} not found." >&2
  echo "" >&2
  echo "Governance must be established before proceeding." >&2
  echo "Run: /security:govern ${TOPIC}" >&2
  echo "" >&2
  echo "To bypass: export SECURITY_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
