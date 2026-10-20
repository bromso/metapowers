---
name: test
description: Write missing tests for existing code and report what was covered, what was added and which gaps remain. Use when code already works but has thin or no tests and the user wants coverage raised or checked. Not for test-first work while building a planned feature; see /development:build.
argument-hint: "[project] [--skip-checks]"
---

# Test

Analyze and improve test coverage for "$ARGUMENTS". Write tests for untested code paths, edge cases, and critical functionality.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/development/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a utility skill that can run anytime.

## Process

1. **Analyze existing code:**
   - Read the source code related to "<project>"
   - Identify all public functions, methods, and components
   - Map code paths: happy paths, error paths, edge cases

2. **Assess current test coverage:**
   - Read existing tests for "<project>"
   - Identify what's tested and what's not
   - Note tests that are shallow (only happy path) or brittle (testing implementation, not behavior)

3. **Write missing tests:**
   - Prioritize: critical paths first, then edge cases, then error handling
   - Each test should verify behavior, not implementation
   - Use descriptive test names that explain what's being verified
   - Follow the project's existing test patterns and framework

4. **Run the full test suite:**
   - Verify all new tests pass
   - Verify no existing tests broke
   - Note any flaky or slow tests discovered

5. **Write the artifact** to `.metapowers/development/<project>/03-test.md` with sections:
   - **Coverage Assessment** — what was already tested, what wasn't
   - **Tests Added** — list of new tests with what they verify
   - **Remaining Gaps** — what still needs testing (if any)
   - **Test Health** — any flaky, slow, or problematic tests found

## Output

The test report written to `.metapowers/development/<project>/03-test.md`. Present a summary to the user highlighting:
- Number of tests added
- Key coverage gaps filled
- Any remaining concerns
