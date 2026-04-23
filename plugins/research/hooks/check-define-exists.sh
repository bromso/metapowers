#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${RESEARCH_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .metapowers/research/<name>/ directories to infer current topic
TOPIC_DIR=$(find .metapowers/research -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .metapowers/research/ directory found. Run /research:discover and /research:define first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
DEFINE_FILE=".metapowers/research/${TOPIC}/02-define.md"

if [[ ! -f "$DEFINE_FILE" ]]; then
  echo "BLOCKED: ${DEFINE_FILE} not found." >&2
  echo "" >&2
  echo "The problem must be defined before designing solutions." >&2
  echo "Run: /research:define ${TOPIC}" >&2
  echo "" >&2
  echo "To bypass: export RESEARCH_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
