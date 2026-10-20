#!/usr/bin/env bash
# Metapowers design gate (PreToolUse hook for the metapowers-figma tools that change a file).
#
# MCP tool input carries no project path, so the gate allows a Figma write once any
# component under .metapowers/design/ has a 02-define.md contract. The only bypass is
# METAPOWERS_SKIP_CHECKS=1.
set -u

[[ "${METAPOWERS_SKIP_CHECKS:-}" == "1" ]] && exit 0

compgen -G ".metapowers/design/*/02-define.md" >/dev/null && exit 0

echo "Metapowers design gate: no .metapowers/design/<component>/02-define.md found. Run /design:define-component <component> first, or set METAPOWERS_SKIP_CHECKS=1." >&2
exit 2
