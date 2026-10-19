#!/usr/bin/env bash
# Metapowers phase gate (PreToolUse hook for Write|Edit|MultiEdit).
#
# Generated from packages/plugin-tools/hooks/phase-gate.sh by `plugin-tools sync-hooks`;
# identical in every plugin. Edit the canonical copy, then re-run sync-hooks.
#
# Blocks (exit 2) a write to a numbered phase artifact under .metapowers/<domain>/<project>/
# when the files that phase requires (hooks/phase-deps.json, next to this script) are
# missing. Every other case exits 0: paths outside the artifact pattern, phases with no
# requirements, METAPOWERS_SKIP_CHECKS=1, a skip-log.md naming the target file, a missing
# jq, or unparseable input.
set -u

command -v jq >/dev/null 2>&1 || exit 0

deps="${BASH_SOURCE[0]%/*}/phase-deps.json"
[[ -f "$deps" ]] || exit 0

input=$(cat) || exit 0
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null) || exit 0
[[ -n "$file_path" ]] || exit 0

artifacts=$(jq -r '.artifacts // empty' "$deps" 2>/dev/null) || exit 0
domain=$(jq -r '.domain // empty' "$deps" 2>/dev/null) || exit 0
[[ -n "$artifacts" ]] || exit 0
# phase-deps.json uses JavaScript regex syntax; POSIX ERE (bash =~) has no \d.
artifacts="${artifacts//\\d/[0-9]}"

[[ "$file_path" =~ $artifacts ]] || exit 0
match="${BASH_REMATCH[0]}"
project="${BASH_REMATCH[1]:-${BASH_REMATCH[3]:-}}"
phase="${BASH_REMATCH[2]:-${BASH_REMATCH[4]:-}}"
[[ -n "$project" && -n "$phase" ]] || exit 0

[[ "${METAPOWERS_SKIP_CHECKS:-}" == "1" ]] && exit 0

# The match is `.metapowers/<domain>/<project>/<rest>` and ends the path; the project
# directory is the path with `/<rest>` removed.
rel="${match#*/}"
rel="${rel#*/}"
project_dir="${file_path%"${rel#"$project"}"}"

required=()
while IFS= read -r glob; do
	[[ -n "$glob" ]] && required+=("$glob")
done < <(jq -r --arg nn "$phase" '.requires[$nn] // [] | .[]' "$deps" 2>/dev/null)
((${#required[@]} > 0)) || exit 0

target="${file_path##*/}"
if [[ -f "$project_dir/skip-log.md" ]] && grep -qF -- "$target" "$project_dir/skip-log.md"; then
	exit 0
fi

missing=()
for glob in "${required[@]}"; do
	if ! (cd "$project_dir" 2>/dev/null && compgen -G "$glob" >/dev/null); then
		missing+=("$glob")
	fi
done
((${#missing[@]} > 0)) || exit 0

joined="${missing[0]}"
for glob in "${missing[@]:1}"; do
	joined+=", $glob"
done
echo "Metapowers phase gate: $domain/$project phase $phase needs $joined first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1." >&2
exit 2
