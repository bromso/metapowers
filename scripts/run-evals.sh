#!/usr/bin/env bash
# Run the eval suites (evals/<skill>/) with `claude plugin eval`.
#
#   bash scripts/run-evals.sh [skill…] [--dry | --report]
#
#   --dry      List every case as `<skill>  graders=N  scaffold|-` and the total,
#              and check that no prompt.md names its own skill (the case
#              directory name, as a whole word, any case) or contains
#              `/<skill>`. Exits 1 naming the offending file. Spends nothing.
#   --report   Print the summary table from an existing results file without
#              running anything. Spends nothing.
#
# With neither flag the suite is run — this spends Claude credits, capped by
# EVALS_MAX_COST_USD (default 10). `claude plugin eval` runs once on a
# temporary plugin root that mirrors the repo root (top-level entries
# symlinked) and whose evals/ holds copies of the selected cases — all of them
# with no skill arguments. Results go to evals-results/singularskills.json
# (plus report.html) and a summary table is printed with jq.
#
# EVALS_CONCURRENCY (default 2, CLI range 1-8) sets how many runs go in
# parallel; all runs share one rate limit.
# EVALS_ALLOW_BASH (default 1) grants Bash to the runs; set it to 0 where the
# sandbox cannot grant Bash (e.g. Docker Desktop's symlinks in ~/.docker).
# EVALS_DIR (default <repo>/evals) and EVALS_RESULTS_DIR override the cases
# and results directories (used by the tests).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EVALS_DIR="${EVALS_DIR:-$REPO_ROOT/evals}"
RESULTS_DIR="${EVALS_RESULTS_DIR:-$REPO_ROOT/evals-results}"
RESULTS_JSON="$RESULTS_DIR/singularskills.json"

dry=0
report_only=0
skills=()
for arg in "$@"; do
  case "$arg" in
    --dry) dry=1 ;;
    --report) report_only=1 ;;
    -h | --help)
      sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    -*)
      echo "run-evals: unknown flag $arg" >&2
      exit 2
      ;;
    *) skills+=("$arg") ;;
  esac
done

selected=0
if [ ${#skills[@]} -gt 0 ]; then
  selected=1
else
  for dir in "$EVALS_DIR"/*/; do
    [ -f "$dir/prompt.md" ] && skills+=("$(basename "$dir")")
  done
fi

if [ ${#skills[@]} -eq 0 ]; then
  echo "run-evals: no case (a directory with prompt.md) under $EVALS_DIR" >&2
  exit 1
fi

for skill in "${skills[@]}"; do
  if [ ! -f "$EVALS_DIR/$skill/prompt.md" ]; then
    echo "run-evals: $EVALS_DIR/$skill/prompt.md does not exist" >&2
    exit 1
  fi
done

if [ "$dry" -eq 1 ]; then
  bad=0
  for skill in "${skills[@]}"; do
    case_dir="$EVALS_DIR/$skill"
    prompt="$case_dir/prompt.md"
    rel="evals/$skill/prompt.md"
    graders="$(find "$case_dir/graders" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
    scaffold="-"
    [ -f "$case_dir/case.yaml" ] && scaffold="scaffold"
    printf '%-40s graders=%-3s %s\n' "$skill" "$graders" "$scaffold"
    if grep -qF -- "/$skill" "$prompt"; then
      echo "run-evals: $rel contains \"/$skill\"" >&2
      bad=1
    fi
    if grep -qiwF -- "$skill" "$prompt"; then
      echo "run-evals: $rel names its skill \"$skill\"" >&2
      bad=1
    fi
  done
  echo "${#skills[@]} case(s)"
  exit "$bad"
fi

command -v jq >/dev/null || { echo "run-evals: jq is not on PATH" >&2; exit 1; }

# One TSV row per case. Per-run graders carry no `type` (only the case-level
# `graders[]` does), so the Skill-fired graders are resolved by name. With
# skill arguments, only those cases are kept.
TABLE_FILTER='
  def r: if . == null then "-" else (. * 100 | round / 100 | tostring) end;
  .cases[]
  | select(($keep | length) == 0 or (.name as $n | $keep | index($n)))
  | (.aggregates.score) as $s
  | (.aggregates.delta) as $d
  | (.aggregates.scoreWithout
     // (if $s == null or $d == null then null else $s - $d end)) as $w
  | ([.graders[]? | select(.type == "tool_used") | .name]) as $tu
  | (if ($tu | length) > 0 then $tu else ["fired"] end) as $fn
  | ([.arms.with[]? | [(.graders // [])[] | select(.name as $n | $fn | index($n))] | any(.passed)]) as $f
  | [.name, ($s | r), ($w | r), ($d | r),
     "\($f | map(select(.)) | length)/\($f | length)"]
  | @tsv'

print_report() {
  local rows keep
  rows="$(mktemp)"
  keep="[]"
  if [ "$selected" -eq 1 ]; then
    keep="$(printf '%s\n' "${skills[@]}" | jq -R . | jq -s -c .)"
  fi
  printf 'case\twith\twithout\tdelta\tfired\n' >"$rows"
  if [ ! -s "$RESULTS_JSON" ]; then
    printf '(no results)\t-\t-\t-\t-\n' >>"$rows"
  elif ! jq -r --argjson keep "$keep" "$TABLE_FILTER" "$RESULTS_JSON" >"$rows.part" 2>/dev/null; then
    printf '(unreadable)\t-\t-\t-\t-\n' >>"$rows"
  else
    cat "$rows.part" >>"$rows"
  fi
  echo
  column -t -s "$(printf '\t')" "$rows"
  if [ -s "$RESULTS_JSON" ]; then
    jq -r '"cost $\(.costUsd // 0)\(if .partial then " (partial: cost ceiling or abort)" else "" end)"' \
      "$RESULTS_JSON" 2>/dev/null || true
  fi
  rm -f "$rows" "$rows.part"
}

if [ "$report_only" -eq 1 ]; then
  print_report
  exit 0
fi

command -v claude >/dev/null || { echo "run-evals: the claude CLI is not on PATH" >&2; exit 1; }

# The plugin root is the directory that holds evals/ (the repo root by default).
# The suite always runs on a temporary plugin root: the real one's top-level
# entries symlinked, and evals/ holding copies of the selected cases (the CLI
# rejects a case directory that is a symlink). Running on the repo root itself
# fails with E2BIG — the CLI enumerates the whole tree under the target,
# node_modules included, into the child's argument list; it does not follow
# symlinks, so the staged root stays small.
real_root="$(cd "$EVALS_DIR/.." && pwd)"
stage="$(mktemp -d)"
for entry in "$real_root"/*; do
  name="$(basename "$entry")"
  [ "$name" = "evals" ] && continue
  [ "$name" = "evals-results" ] && continue
  [ -e "$entry" ] && ln -s "$entry" "$stage/$name"
done
# The manifest is copied, not linked: the CLI will not verify a plugin identity
# it reaches through a symlink that leaves the tree.
cp -R "$real_root/.claude-plugin" "$stage/.claude-plugin"
mkdir "$stage/evals"
for skill in "${skills[@]}"; do
  cp -R "$EVALS_DIR/$skill" "$stage/evals/$skill"
done
plugin_root="$stage"

mkdir -p "$RESULTS_DIR"
cd "$REPO_ROOT"
cleanup=()
[ -n "${stage:-}" ] && cleanup+=("$stage")
# Isolates Docker credentials from the runs (the evals never use Docker). It does not satisfy the CLI's own ~/.docker symlink check; use EVALS_ALLOW_BASH=0 for that.
if [ -z "${DOCKER_CONFIG:-}" ]; then
  DOCKER_CONFIG="$(mktemp -d)"
  cleanup+=("$DOCKER_CONFIG")
fi
export DOCKER_CONFIG
[ ${#cleanup[@]} -gt 0 ] && trap 'rm -rf "${cleanup[@]}"' EXIT
allow_tools=(Write Edit Bash)
if [ "${EVALS_ALLOW_BASH:-1}" = "0" ]; then
  allow_tools=(Write Edit)
  echo "run-evals: EVALS_ALLOW_BASH=0 — runs get Write Edit only (no Bash)"
else
  echo "run-evals: runs get Write Edit Bash (set EVALS_ALLOW_BASH=0 to drop Bash)"
fi
echo "== ${#skills[@]} case(s) from $plugin_root"
# A failed run must not leave the previous run's numbers in the table.
rm -f "$RESULTS_JSON"
status=0
claude plugin eval "$plugin_root" \
  --trust-plugin \
  --scaffold \
  --allow-tools "${allow_tools[@]}" \
  --no-publish \
  --threshold 0.7 \
  --max-cost-usd "${EVALS_MAX_COST_USD:-10}" \
  -j "${EVALS_CONCURRENCY:-2}" \
  --report "$RESULTS_DIR/report.html" \
  --json "$RESULTS_JSON" || status=1

print_report
exit "$status"
