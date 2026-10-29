---
name: singular-improve-skill
description: Review and rewrite an existing skill using the user's feedback, its recent output and current best practice, then summarize what changed. Use when a skill produced weak or outdated results and the user wants that skill revised, whether from a plugin or custom-made. Not for a brand-new skill; see /singular-create-skill.
metadata:
  argument-hint: "<skill-name>"
  disable-model-invocation: true
---

# Improve Skill

Review and improve the skill specified in "$ARGUMENTS". Gather feedback, research updated best practices, and refine the skill.

## Prerequisites

The skill to improve must exist. "$ARGUMENTS" can be:
- A skill name (e.g., "design-empathize")
- A file path (e.g., "skills/design-empathize/SKILL.md")
- A custom skill path (e.g., ".claude/skills/flutter-testing/SKILL.md")

## Process

1. **Read the current skill:**
   - Find and read the SKILL.md file
   - Understand its current process, prerequisites, and output

2. **Gather feedback:**
   - Ask the user: What didn't work well? What could be better?
   - If artifacts from this skill exist in `.singularskills/`, read the most recent one to understand what it produced
   - Identify gaps: missing steps, unclear instructions, wrong assumptions

3. **Research improvements:**
   - Use WebSearch to find updated best practices for the skill's domain
   - Look for new tools, patterns, or approaches since the skill was created
   - Check if the technology landscape has changed

4. **Rewrite the skill:**
   - Apply feedback and research findings
   - Keep the same structure (frontmatter, prerequisites, process, output)
   - Improve: clearer instructions, better process steps, updated references
   - Strengthen the description's "Use when" clause with the situations where the skill should have fired — never trade it away to shorten the description
   - Maintain backward compatibility with existing artifacts if possible

5. **Validate:**
   - `name` matches the directory name
   - Description is `<Verb-first sentence saying what it does>. Use when <the user's situation, at least six words>.` optionally followed by `Not for <adjacent thing>; see /<plugin>:<skill>.`, 120–400 characters — keep or sharpen the "Use when" clause (add the phrasings users actually type); never shorten or drop it
   - `argument-hint` is present if the skill takes an argument
   - Body under 2000 words
   - Show a summary of what changed (not a full diff — highlight the key improvements)

6. **Write the updated skill** back to its original location

## Output

Present the improvements to the user:
- What was changed and why
- Key improvements made
- Any breaking changes to be aware of

The skill is available as `/<name>` in the next Claude Code session.
