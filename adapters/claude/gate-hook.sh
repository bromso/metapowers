#!/usr/bin/env bash
# singularskills gate (Claude Code PreToolUse hook for Write|Edit|MultiEdit).
#
# Copied to adapters/claude/gate-hook.sh by `pack-tools gen-adapters` from
# packages/pack-tools/hooks/gate-hook.sh; edit the canonical copy, then re-run gen-adapters.
#
# Blocks (exit 2) a write to a numbered phase artifact under
# <root>/.singularskills/<folder>/<project>/<NN>-... when an artifact that phase requires
# (gates.json, next to this script) is missing: a file must be non-empty, a folder artifact
# (ending in /) must hold at least one file. The write goes through when
# <root>/.singularskills/log.jsonl has a "skipped" event for this folder (its "workflow"),
# project and artifact, which a skill appends under --skip-checks; unparseable log lines are
# ignored. The path is normalised first (`/./` and `//` collapse to `/`). Every other case
# exits 0: paths outside the pattern, phases with no requirements, a missing jq or
# gates.json, unparseable input.
set -u

command -v jq >/dev/null 2>&1 || exit 0

gates="$(dirname "${BASH_SOURCE[0]}")/gates.json"
[[ -f "$gates" ]] || exit 0

input=$(cat) || exit 0
# Cheap pre-filter: most writes are nowhere near .singularskills/, so skip spawning jq.
[[ "$input" == *"/.singularskills/"* ]] || exit 0
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null) || exit 0
# Normalise `/./` and `//` so `<root>/./.singularskills//design/...` matches like the plain path.
while [[ "$file_path" == *"/./"* || "$file_path" == *"//"* ]]; do
	file_path=${file_path//\/.\//\/}
	file_path=${file_path//\/\//\/}
done
[[ "$file_path" == */.singularskills/* ]] || exit 0

# <root>/.singularskills/<folder>/<project>/<NN>-<name>[/<file in a folder artifact>]
pattern='^(.*)/\.singularskills/([^/]+)/([^/]+)/(([0-9]{2})-[^/]+)(/.+)?$'
[[ "$file_path" =~ $pattern ]] || exit 0
root="${BASH_REMATCH[1]}"
folder="${BASH_REMATCH[2]}"
project="${BASH_REMATCH[3]}"
target="${BASH_REMATCH[4]}"
phase="${BASH_REMATCH[5]}"
inner="${BASH_REMATCH[6]}"
project_dir="$root/.singularskills/$folder/$project"

required=()
while IFS= read -r artifact; do
	[[ -n "$artifact" ]] && required+=("$artifact")
done < <(jq -r --arg f "$folder" --arg nn "$phase" '.[$f][$nn] // [] | .[]' "$gates" 2>/dev/null)
((${#required[@]} > 0)) || exit 0

missing=()
for artifact in "${required[@]}"; do
	present="$project_dir/$artifact"
	if [[ "$artifact" == */ ]]; then
		[[ -d "$present" && -n "$(find "$present" -type f 2>/dev/null | head -n 1)" ]] && continue
	else
		[[ -f "$present" && -s "$present" ]] && continue
	fi
	missing+=("$artifact")
done
((${#missing[@]} > 0)) || exit 0

# A skipped event names the folder being written to (its "workflow") and the artifact: the
# file, or for a write inside a folder artifact the folder (with or without its trailing /) or
# the file written in it.
names=("$target")
if [[ -n "$inner" ]]; then
	names+=("$target/" "${file_path##*/}")
fi
log="$root/.singularskills/log.jsonl"
if [[ -f "$log" ]] &&
	jq -enR --arg p "$project" --arg f "$folder" --args \
		'$ARGS.positional as $names
		| any(inputs | fromjson? | objects;
			.event == "skipped" and .project == $p and .workflow == $f
			and (.artifact as $a | any($names[]; . == $a)))' \
		"${names[@]}" <"$log" >/dev/null 2>&1; then
	exit 0
fi

joined="${missing[0]}"
for artifact in "${missing[@]:1}"; do
	joined+=", $artifact"
done
echo "singularskills gate: $folder/$project phase $phase needs $joined first. Re-run with --skip-checks." >&2
exit 2
