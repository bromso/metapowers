---
description: Review and improve an existing skill based on usage feedback
---

# Improve Skill

Review and improve the skill specified in "$ARGUMENTS". Gather feedback, research updated best practices, and refine the skill.

## Prerequisites

The skill to improve must exist. "$ARGUMENTS" can be:
- A skill name (e.g., "design:empathize")
- A file path (e.g., "plugins/design/skills/empathize/SKILL.md")
- A custom skill path (e.g., ".metapowers/plugins/custom/skills/flutter-testing/SKILL.md")

## Process

1. **Read the current skill:**
   - Find and read the SKILL.md file
   - Understand its current process, prerequisites, and output

2. **Gather feedback:**
   - Ask the user: What didn't work well? What could be better?
   - If artifacts from this skill exist in `.metapowers/`, read the most recent one to understand what it produced
   - Identify gaps: missing steps, unclear instructions, wrong assumptions

3. **Research improvements:**
   - Use WebSearch to find updated best practices for the skill's domain
   - Look for new tools, patterns, or approaches since the skill was created
   - Check if the technology landscape has changed

4. **Rewrite the skill:**
   - Apply feedback and research findings
   - Keep the same structure (frontmatter, prerequisites, process, output)
   - Improve: clearer instructions, better process steps, updated references
   - Maintain backward compatibility with existing artifacts if possible

5. **Validate:**
   - Description starts with a verb, under 200 characters
   - Body under 2000 words
   - Show a summary of what changed (not a full diff — highlight the key improvements)

6. **Write the updated skill** back to its original location

## Output

Present the improvements to the user:
- What was changed and why
- Key improvements made
- Any breaking changes to be aware of
