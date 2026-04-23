---
description: Edit and refine existing marketing copy for clarity and impact
---

# Copy Editing

Edit and refine marketing copy for "$ARGUMENTS". Improve clarity, persuasiveness, and brand consistency of existing content.

## Prerequisites

None — this is a utility skill. Provide the copy to edit as "$ARGUMENTS" or as content in the conversation.

## Process

1. **Read the copy:**
   - If a file path is provided, read the file
   - If a URL is provided, use WebFetch to read the page content
   - If copy is provided inline, work with that directly

2. **Read context** (if available):
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for brand voice and messaging guidelines
   - Check for tone, audience, and positioning context

3. **Edit for clarity:**
   - Remove jargon and unnecessary complexity
   - Shorten sentences (aim for 15-20 words average)
   - Use active voice
   - Eliminate weasel words and filler
   - Ensure logical flow between paragraphs

4. **Edit for persuasion:**
   - Is the value proposition clear in the first sentence?
   - Are benefits emphasized over features?
   - Is social proof present and specific?
   - Is the CTA clear and compelling?
   - Does the copy address the reader's objections?

5. **Edit for consistency:**
   - Consistent terminology throughout
   - Brand voice alignment
   - Formatting and style consistency
   - Grammar and punctuation

6. **Present the edit:**
   - Show the edited copy with changes highlighted
   - Explain the rationale for major changes
   - Flag any areas where the editor needs more context

## Output

Present the edited copy directly to the user with key changes explained. If context files exist, also save to `.metapowers/marketing/$ARGUMENTS/copy-edits.md`.
