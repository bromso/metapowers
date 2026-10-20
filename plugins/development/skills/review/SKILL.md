---
name: review
description: Review a feature's code changes before merge for bugs, security issues, quality and test coverage, ending in an approve or request-changes verdict. Use when a branch or feature is finished and the user wants it checked before merging or opening a pull request. Not for mentoring feedback on code to learn from; see /coaching:code.
argument-hint: "[project] [--skip-checks]"
---

# Review

Review the code changes for "$ARGUMENTS" before merging. Check for bugs, security issues, code quality, and test coverage.

See also `/coaching:code` for a scored coaching report with mentoring feedback to learn from, rather than a merge verdict.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/development/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/development/<project>/02-build.md` if it exists, to understand what was built. If not available, review the current branch diff against main.

## Process

1. **Gather the changes:**
   - Read the git diff of all changed files (staged + unstaged, or branch diff vs. main)
   - Understand the scope and intent of the changes

2. **Check for bugs:**
   - Logic errors, off-by-one, null/undefined handling
   - Race conditions or state management issues
   - Missing error handling at system boundaries

3. **Check for security issues:**
   - Input validation at system boundaries (user input, external APIs)
   - No secrets, tokens, or credentials in code
   - No injection vulnerabilities (SQL, XSS, command injection)

4. **Check code quality:**
   - Naming clarity — do names describe what things do?
   - Unnecessary complexity — can anything be simplified?
   - Consistency with existing codebase patterns
   - No dead code, commented-out code, or TODO placeholders

5. **Check tests:**
   - Do tests exist for new functionality?
   - Do tests verify behavior, not implementation?
   - Are edge cases covered?

6. **Write the artifact** to `.metapowers/development/<project>/04-review.md` with sections:
   - **Summary** — what was reviewed and overall assessment
   - **Issues** — categorized by severity (critical, important, minor)
   - **Strengths** — what's well done
   - **Recommendations** — suggested improvements

## Output

The review report written to `.metapowers/development/<project>/04-review.md`. Present a summary to the user highlighting:
- Overall assessment (approve / request changes)
- Critical issues (if any)
- Key recommendations
