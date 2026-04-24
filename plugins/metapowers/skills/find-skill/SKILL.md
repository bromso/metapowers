---
description: Search skill marketplaces for relevant skills and install them
---

# Find Skill

Search for a skill matching "$ARGUMENTS" across skill marketplaces and open-source repositories. Evaluate compatibility and install if suitable.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Search for skills:**
   - Use WebSearch to find skills matching "$ARGUMENTS" on:
     - skills.sh marketplace
     - GitHub repositories with SKILL.md files
     - Claude Code plugin directories
     - Awesome lists for the relevant technology
   - Search terms: "$ARGUMENTS SKILL.md", "$ARGUMENTS LLM skill", "$ARGUMENTS AI coding skill"

2. **Evaluate found skills:**
   - Does it have YAML frontmatter with a `description` field?
   - Does the description start with a verb?
   - Does it follow a structured process (prerequisites, steps, output)?
   - Is it compatible with our SKILL.md format?

3. **Install or adapt:**
   - **If compatible:** Copy the SKILL.md to `.metapowers/plugins/custom/skills/<skill-name>/SKILL.md`
   - **If partially compatible:** Download it, rewrite to match Metapowers conventions (verb-first description, `.metapowers/` artifact paths, prerequisite pattern), then install
   - **If nothing found:** Tell the user and suggest `/metapowers:create-skill $ARGUMENTS`

4. **Report what was installed:**
   - Skill name and source
   - Any adaptations made
   - How to invoke it

## Output

Present the installed skill to the user. If installed, show the command to run it. If nothing found, suggest creating one.
