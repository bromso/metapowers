#!/usr/bin/env bash
# Metapowers design gate (PreToolUse hook for the metapowers-figma tools that change a file).
#
# MCP tool input carries no project path, so the gate allows a Figma write once any
# component under .metapowers/design/ has a 02-define.md contract. Bypass with
# METAPOWERS_SKIP_CHECKS=1, or a design skip-log.md entry mentioning Figma.
set -u

[[ "${METAPOWERS_SKIP_CHECKS:-}" == "1" ]] && exit 0

compgen -G ".metapowers/design/*/02-define.md" >/dev/null && exit 0

for log in .metapowers/design/*/skip-log.md; do
	[[ -f "$log" ]] && grep -qi -- "figma" "$log" && exit 0
done

echo "Metapowers design gate: no .metapowers/design/<component>/02-define.md found. Run /design:define-component <component> first, or set METAPOWERS_SKIP_CHECKS=1." >&2
exit 2
