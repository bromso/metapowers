---
description: Create a custom skill from scratch following Metapowers conventions
---

# Create Skill

Create a new custom skill for "$ARGUMENTS" following the Metapowers SKILL.md pattern. Research best practices and generate a structured skill.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Understand the skill:**
   - What does "$ARGUMENTS" need to accomplish?
   - Ask the user to clarify if ambiguous: Who uses it? What's the input? What's the output?

2. **Research best practices:**
   - Use WebSearch to find current best practices, patterns, and conventions for "$ARGUMENTS"
   - Look for: official documentation, community guides, expert recommendations
   - Identify the key steps a practitioner would follow

3. **Create the SKILL.md:**
   - **Frontmatter:** description starting with a verb, under 200 characters
   - **Title:** Clear skill name as H1
   - **Introduction:** One sentence explaining what the skill does with "$ARGUMENTS" placeholder
   - **Prerequisites:** What files or context are needed (or "None")
   - **Process:** Numbered steps with clear instructions
     - What to read
     - What to research (WebSearch if applicable)
     - What to produce
     - What to verify
   - **Output:** Where the artifact is written and what to present to the user

4. **Validate the skill:**
   - Description starts with a recognized verb
   - Description under 200 characters
   - Body under 2000 words
   - Artifact path uses `.metapowers/` convention

5. **Install the skill:**
   - Write to `.metapowers/plugins/custom/skills/<skill-name>/SKILL.md`
   - Report the skill name and invocation command

## Output

The new skill written to `.metapowers/plugins/custom/skills/<skill-name>/SKILL.md`. Present the skill summary and how to invoke it.
