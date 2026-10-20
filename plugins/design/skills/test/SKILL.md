---
description: Validate the prototype against WCAG criteria and the component contract
---

# Test

Validate the "$ARGUMENTS" prototype against the component contract and WCAG accessibility criteria.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/design/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/design/<project>/04-prototype.md`. If this file does not exist, tell the user:

> Phase 4 (Prototype) has not been completed for "<project>". Run `/design:prototype <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.metapowers/design/<project>/02-define.md` for the component contract
   - Read `.metapowers/design/<project>/04-prototype.md` for prototype notes and component node ID
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md` for accessibility criteria

2. **Run accessibility checks** via MCP tools:
   - Call `figma_a11y_lint` with the component's node ID to check text size, touch targets, image alt text
   - Call `figma_a11y_scorecard` with the component's node ID for an overall scorecard
   - Call `figma_a11y_focus_order` with the component's node ID to validate tab order

3. **Check color contrast:**
   - Call `figma_a11y_contrast_check` for each foreground/background color pair used in the component
   - Call `figma_a11y_color_blind_sim` for primary color pairs across protanopia, deuteranopia, tritanopia

4. **Verify contract compliance.** For each requirement in the component contract:
   - Props: Are all specified props represented in the component?
   - Variants: Does the component have all variant combinations?
   - States: Are all states (hover, focus, active, disabled, error, loading) represented?
   - Tokens: Are all visual values using design system tokens?

5. **Generate the test report** with:
   - Contract compliance checklist (pass/fail per requirement)
   - WCAG validation results (from lint and contrast checks)
   - Color blindness simulation results
   - Issues found with remediation suggestions
   - Overall pass/fail status

6. **Write the artifact** to `.metapowers/design/<project>/05-test.md`

## Output

The test report written to `.metapowers/design/<project>/05-test.md`. Present to the user:
- Overall pass/fail status
- Number of issues found by category (contract, WCAG, color blindness)
- Critical issues requiring immediate attention
- Remediation suggestions for failed checks
