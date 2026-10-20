---
name: copy
description: Review copy as a brand and content strategist — readability, clarity, tone against brand guidelines, scannability, CTAs, headlines and jargon — in a scored coaching report. Use when the user wants feedback on marketing text, UI strings or docs they wrote and how to strengthen them. Not for editing the copy line by line; see /marketing:copy-editing.
argument-hint: "<file-or-topic> [--skip-checks]"
---

# Copy Coaching

Review "$ARGUMENTS" through the lens of a brand and content strategist. Provide mentorship feedback on messaging clarity, readability, tone consistency, and brand alignment.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Derive `<project>` from the argument by taking its basename without extension and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/coaching/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a utility skill that can run anytime.

## Process

1. **Read the target:**
   - Read the content specified in "$ARGUMENTS" (copy, marketing text, UI strings, documentation)

2. **Check for brand guidelines:**
   - Look for `.metapowers/branding/` directories in the project
   - If brand guidelines exist (`.metapowers/branding/<brand>/05-guidelines.md`), read them
   - If verbal identity exists (`.metapowers/branding/<brand>/03-verbal.md`), read it
   - Use these as the benchmark for tone and voice evaluation

3. **Read reference material:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/feedback-format.md` for output structure

4. **Evaluate the copy:**
   - **Readability:** Assess Flesch-Kincaid level. Is it appropriate for the audience?
   - **Clarity:** Is the message immediately understandable? Any ambiguity?
   - **Tone consistency:** Does the voice match throughout? Does it match brand guidelines (if available)?
   - **Scannability:** Are headings, lists, and bold text used effectively?
   - **Call-to-action:** Are CTAs clear, compelling, and action-oriented?
   - **Headline strength:** Do headlines grab attention and convey value?
   - **Jargon:** Is technical language appropriate for the audience?
   - **Conciseness:** Can anything be cut without losing meaning?

5. **Write the coaching report** to `.metapowers/coaching/<project>/copy-review.md` following the feedback format.

## Output

The copy coaching report written to `.metapowers/coaching/<project>/copy-review.md`. Present the score and top 3 suggestions to the user.
