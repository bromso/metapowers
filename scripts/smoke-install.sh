#!/usr/bin/env bash
# Install smoke test: installs the pack with the universal `skills` installer for each
# Tier 1 agent into a fresh temporary project, then checks the result.
#
# Usage: scripts/smoke-install.sh [--local] [--agent <id>]
#
#   --local        install from this checkout instead of GitHub (bromso/singularskills)
#   --agent <id>   test one agent instead of all seven Tier 1 agents
#
# Per agent it asserts that the agent's skills folder holds every SKILL.md in skills/,
# that design-define-component/scripts/gate.sh arrived executable, and that the gate
# fixture works the way the skill's gate step runs it (`sh <skill folder>/scripts/gate.sh
# <project> <project root>`, from an unrelated working directory): exit 1 without
# 01-empathize.md, exit 0 once it exists. Prints
# "<agent>: <n> skills, gate ok" per agent and exits non-zero on any failure.
#
# Needs network access for `npx skills` itself. Override the installer package with
# SKILLS_CLI (default skills@latest).

set -u

repo_root=$(cd "$(dirname "$0")/.." && pwd)
remote_source="bromso/singularskills"
skills_cli=${SKILLS_CLI:-skills@latest}
all_agents="claude-code codex opencode cursor github-copilot gemini-cli kimi-code-cli"

source=$remote_source
agents=$all_agents

while [ $# -gt 0 ]; do
	case $1 in
	--local)
		source=$repo_root
		shift
		;;
	--agent)
		if [ $# -lt 2 ]; then
			echo "smoke-install: --agent needs an id" >&2
			exit 2
		fi
		agents=$2
		shift 2
		;;
	*)
		echo "usage: smoke-install.sh [--local] [--agent <id>]" >&2
		exit 2
		;;
	esac
done

skills_dir_for() {
	case $1 in
	claude-code) echo ".claude/skills" ;;
	codex | opencode | cursor | github-copilot | gemini-cli | kimi-code-cli) echo ".agents/skills" ;;
	*) return 1 ;;
	esac
}

expected=$(find "$repo_root/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')

work=$(mktemp -d "${TMPDIR:-/tmp}/smoke-install.XXXXXX")
trap 'rm -rf "$work"' EXIT

failures=0

fail() {
	echo "$1: FAIL: $2" >&2
	failures=$((failures + 1))
}

for agent in $agents; do
	if ! rel=$(skills_dir_for "$agent"); then
		fail "$agent" "unknown agent (Tier 1: $all_agents)"
		continue
	fi

	project=$work/$agent
	mkdir -p "$project"
	log=$work/$agent.log

	if ! (cd "$project" && DISABLE_TELEMETRY=1 npx -y "$skills_cli" add "$source" --agent "$agent" -y </dev/null >"$log" 2>&1); then
		fail "$agent" "installer failed; last lines of its output:"
		tail -n 20 "$log" >&2
		continue
	fi

	dir=$project/$rel
	# -L: the installer may symlink skill folders to a canonical copy.
	count=$(find -L "$dir" -mindepth 2 -maxdepth 2 -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
	if [ "$count" != "$expected" ]; then
		fail "$agent" "$rel holds $count SKILL.md, expected $expected"
		continue
	fi

	gate=$dir/design-define-component/scripts/gate.sh
	if [ ! -f "$gate" ]; then
		fail "$agent" "$rel/design-define-component/scripts/gate.sh is missing"
		continue
	fi
	if [ ! -x "$gate" ]; then
		fail "$agent" "gate.sh lost its execute bit"
		continue
	fi

	# As the gate step says: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`,
	# from any working directory.
	(cd / && sh "$gate" date-picker "$project" 2>/dev/null)
	status=$?
	if [ "$status" != 1 ]; then
		fail "$agent" "gate exited $status without 01-empathize.md, expected 1"
		continue
	fi
	mkdir -p "$project/.singularskills/design/date-picker"
	echo "# Empathize" >"$project/.singularskills/design/date-picker/01-empathize.md"
	if ! (cd / && sh "$gate" date-picker "$project"); then
		fail "$agent" "gate failed with 01-empathize.md present"
		continue
	fi

	echo "$agent: $count skills, gate ok"
done

if [ "$failures" -gt 0 ]; then
	echo "smoke-install: $failures agent(s) failed" >&2
	exit 1
fi
