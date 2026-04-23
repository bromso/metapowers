#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${MARKETING_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .metapowers/marketing/<name>/ directories to infer current topic
TOPIC_DIR=$(find .metapowers/marketing -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .metapowers/marketing/ directory found. Run /marketing:customer-research first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
STRATEGY_FILE=".metapowers/marketing/${TOPIC}/00-strategy.md"

if [[ ! -f "$STRATEGY_FILE" ]]; then
  echo "BLOCKED: ${STRATEGY_FILE} not found." >&2
  echo "" >&2
  echo "The Strategy phase must be completed before running this skill." >&2
  echo "Run a Strategy skill first (e.g., /marketing:customer-research ${TOPIC})" >&2
  echo "" >&2
  echo "To bypass: export MARKETING_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
