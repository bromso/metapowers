#!/usr/bin/env bash
# Run the plugin eval suites (plugins/<p>/evals/<skill>/) with `claude plugin eval`.
#
#   bash scripts/run-evals.sh [plugin…] [--dry]
#
#   --dry   List every case and check that no prompt.md names its own skill
#           (the case directory name, as a whole word) or a `/<plugin>:` command.
#           Exits 1 naming the offending file. Spends nothing.
#
# Without --dry each plugin is run in turn — this spends Claude credits, capped
# per plugin by EVALS_MAX_COST_USD (default 10). Results go to
# evals-results/<plugin>.json and a summary table is printed with jq.
#
# EVALS_PLUGINS_DIR overrides the plugins directory (used by the tests).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGINS_DIR="${EVALS_PLUGINS_DIR:-$REPO_ROOT/plugins}"
RESULTS_DIR="$REPO_ROOT/evals-results"

dry=0
plugins=()
for arg in "$@"; do
  case "$arg" in
    --dry) dry=1 ;;
    -h | --help)
      sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    -*)
      echo "run-evals: unknown flag $arg" >&2
      exit 2
      ;;
    *) plugins+=("$arg") ;;
  esac
done

if [ ${#plugins[@]} -eq 0 ]; then
  for dir in "$PLUGINS_DIR"/*/; do
    [ -d "$dir/evals" ] && plugins+=("$(basename "$dir")")
  done
fi

if [ ${#plugins[@]} -eq 0 ]; then
  echo "run-evals: no plugin has an evals/ directory under $PLUGINS_DIR" >&2
  exit 1
fi

for plugin in "${plugins[@]}"; do
  if [ ! -d "$PLUGINS_DIR/$plugin/evals" ]; then
    echo "run-evals: $PLUGINS_DIR/$plugin/evals does not exist" >&2
    exit 1
  fi
done

if [ "$dry" -eq 1 ]; then
  cases=0
  bad=0
  for plugin in "${plugins[@]}"; do
    for case_dir in "$PLUGINS_DIR/$plugin"/evals/*/; do
      prompt="$case_dir/prompt.md"
      [ -f "$prompt" ] || continue
      skill="$(basename "$case_dir")"
      rel="$plugin/evals/$skill/prompt.md"
      cases=$((cases + 1))
      graders="$(find "$case_dir/graders" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
      scaffold="-"
      [ -f "$case_dir/case.yaml" ] && scaffold="scaffold"
      printf '%-40s graders=%s %s\n' "$plugin/$skill" "$graders" "$scaffold"
      if grep -qF "/$plugin:" "$prompt"; then
        echo "run-evals: $rel names the /$plugin: command" >&2
        bad=1
      fi
      if grep -qiwF -- "$skill" "$prompt"; then
        echo "run-evals: $rel names its skill \"$skill\"" >&2
        bad=1
      fi
    done
  done
  echo "$cases case(s)"
  exit "$bad"
fi

command -v claude >/dev/null || { echo "run-evals: the claude CLI is not on PATH" >&2; exit 1; }
command -v jq >/dev/null || { echo "run-evals: jq is not on PATH" >&2; exit 1; }

mkdir -p "$RESULTS_DIR"
cd "$REPO_ROOT"
status=0
for plugin in "${plugins[@]}"; do
  echo "== $plugin"
  claude plugin eval "$PLUGINS_DIR/$plugin" \
    --trust-plugin \
    --scaffold \
    --allow-tools Write Edit Bash \
    --no-publish \
    --threshold 0.7 \
    --max-cost-usd "${EVALS_MAX_COST_USD:-10}" \
    --json "$RESULTS_DIR/$plugin.json" || status=1
done

rows="$(mktemp)"
trap 'rm -f "$rows"' EXIT
printf 'plugin\tcase\twith\twithout\tdelta\tfired\n' >"$rows"
for plugin in "${plugins[@]}"; do
  json="$RESULTS_DIR/$plugin.json"
  if [ ! -s "$json" ]; then
    printf '%s\t(no results)\t-\t-\t-\t-\n' "$plugin" >>"$rows"
    continue
  fi
  jq -r --arg p "$plugin" '
    def r: if . == null then "-" else (. * 100 | round / 100 | tostring) end;
    .cases[]
    | (.aggregates.score) as $s
    | (.aggregates.delta) as $d
    | ([.arms.with[]? | [(.graders // [])[] | select(.type == "tool_used")] | any(.passed)]) as $f
    | [$p, .name, ($s | r),
       (if $s == null or $d == null then "-" else ($s - $d | r) end),
       ($d | r),
       "\($f | map(select(.)) | length)/\($f | length)"]
    | @tsv' "$json" >>"$rows"
done
echo
column -t -s "$(printf '\t')" "$rows"
for plugin in "${plugins[@]}"; do
  json="$RESULTS_DIR/$plugin.json"
  [ -s "$json" ] && jq -r --arg p "$plugin" \
    '"\($p): cost $\(.costUsd // 0)\(if .partial then " (partial: cost ceiling or abort)" else "" end)"' "$json"
done
exit "$status"
