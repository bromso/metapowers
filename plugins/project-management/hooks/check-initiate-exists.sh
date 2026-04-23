#!/usr/bin/env bash
set -euo pipefail

if [[ "${PM_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

PROJECT_DIR=$(find .project -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$PROJECT_DIR" ]]; then
  echo "BLOCKED: No .project/ directory found. Run /pm:project-charter first." >&2
  exit 1
fi

PROJECT=$(basename "$PROJECT_DIR")
INITIATE_FILE=".project/${PROJECT}/00-initiate.md"

if [[ ! -f "$INITIATE_FILE" ]]; then
  echo "BLOCKED: ${INITIATE_FILE} not found." >&2
  echo "" >&2
  echo "The Initiate phase must be completed before running this skill." >&2
  echo "Run an Initiate skill first (e.g., /pm:project-charter ${PROJECT})" >&2
  echo "" >&2
  echo "To bypass: export PM_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
