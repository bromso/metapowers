#!/usr/bin/env bash
set -euo pipefail

if [[ "${LEGAL_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

TOPIC_DIR=$(find .metapowers/legal -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .metapowers/legal/ directory found. Run /legal:legal-audit first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
ASSESS_FILE=".metapowers/legal/${TOPIC}/00-assess.md"

if [[ ! -f "$ASSESS_FILE" ]]; then
  echo "BLOCKED: ${ASSESS_FILE} not found." >&2
  echo "" >&2
  echo "The Assess phase must be completed before running this skill." >&2
  echo "Run an Assess skill first (e.g., /legal:legal-audit ${TOPIC})" >&2
  echo "" >&2
  echo "To bypass: export LEGAL_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
