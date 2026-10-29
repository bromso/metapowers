import { STANDARD_ARGS_PARAGRAPH, standardArgsParagraph } from "@singularskills/skill-validator";
import { describe, expect, it } from "vitest";
import { ARGS_PARAGRAPH, standardizeArgs } from "./args.js";

const securityFixture = `---
description: Audit API security
---

# API Security

Audit API security for "$ARGUMENTS". Inventory all APIs.

## Prerequisites

Read \`.metapowers/security/$ARGUMENTS/00-govern.md\`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., \`/security:security-policy $ARGUMENTS\`), or use \`--skip-checks\` to bypass.

If \`--skip-checks\` is present in $ARGUMENTS, skip this check and log to \`.metapowers/security/$ARGUMENTS/skip-log.md\`.

## Process

1. **Write the artifact** to \`.metapowers/security/$ARGUMENTS/02-protect.md\` with heading:

   ## API Security Audit

## Output

The API security audit written to \`.metapowers/security/$ARGUMENTS/02-protect.md\`.
`;

const pmFixture = `---
description: Facilitate sprint retrospective with structured format and action items
---

# Retrospective

Facilitate a sprint retrospective for "$ARGUMENTS".

## Prerequisites

Check that \`.project/$ARGUMENTS/00-initiate.md\` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes \`--skip-checks\`, skip the prerequisite check and log the skip to \`.project/$ARGUMENTS/skip-log.md\` with a timestamp and reason.

## Process

1. Read \`.project/$ARGUMENTS/00-initiate.md\` for project context.
2. Append to \`.project/$ARGUMENTS/04-improve.md\`.
`;

const coachingFixture = `---
description: Review code through the lens of a senior engineer
---

# Code Coaching

Review "$ARGUMENTS" through the lens of a senior software engineer.

## Prerequisites

None — this is a utility skill that can run anytime.

## Process

1. Read the source code files specified in "$ARGUMENTS"
2. **Write the coaching report** to \`.metapowers/coaching/$ARGUMENTS/code-review.md\`.
`;

const noArgsFixture = `---
description: Show status
---

# Status

Show the status of every project.

## Process

1. List \`.metapowers/\`.
`;

const freeTextFixture = `---
description: Investigate a bug
---

# Debug

Investigate and fix the issue described in "$ARGUMENTS".

## Process

1. Reproduce "$ARGUMENTS".
`;

describe("ARGS_PARAGRAPH", () => {
	it("matches the validator's STANDARD_ARGS_PARAGRAPH", () => {
		expect(ARGS_PARAGRAPH("security", "first-token")).toBe(
			STANDARD_ARGS_PARAGRAPH.replace("<domain>", "security"),
		);
	});

	it.each(["first-token", "basename"] as const)(
		"matches the validator's standardArgsParagraph (%s)",
		(rule) => {
			expect(ARGS_PARAGRAPH("coaching", rule)).toBe(standardArgsParagraph("coaching", rule));
		},
	);
});

describe("standardizeArgs", () => {
	it("inserts the standard paragraph before the first H2 and keeps $ARGUMENTS in the intro", () => {
		const out = standardizeArgs(securityFixture, "security");
		expect(out).toContain('Audit API security for "$ARGUMENTS"');
		const para = out.indexOf(ARGS_PARAGRAPH("security", "first-token"));
		expect(para).toBeGreaterThan(-1);
		expect(para).toBeLessThan(out.indexOf("## Prerequisites"));
		expect(out).toContain(
			`Inventory all APIs.\n\n${ARGS_PARAGRAPH("security", "first-token")}\n\n## Prerequisites`,
		);
	});

	it("replaces $ARGUMENTS inside paths with <project>", () => {
		const out = standardizeArgs(securityFixture, "security");
		expect(out).toContain(".metapowers/security/<project>/00-govern.md");
		expect(out).toContain(".metapowers/security/<project>/02-protect.md");
		expect(out).not.toMatch(/\.metapowers\/[a-z-]+\/\$ARGUMENTS/);
	});

	it("removes legacy skip-checks sentences but keeps the quoted phase message", () => {
		const out = standardizeArgs(securityFixture, "security");
		expect(out).not.toContain("is present in $ARGUMENTS");
		expect(out).toContain("or use `--skip-checks` to bypass.");
		expect(out).toContain("to bypass.\n\n## Process");
		expect(standardizeArgs(pmFixture, "project-management")).not.toContain(
			"If the user passes `--skip-checks`",
		);
	});

	it("moves project-management artifacts to .metapowers/project-management", () => {
		const out = standardizeArgs(pmFixture, "project-management");
		expect(out).toContain(".metapowers/project-management/<project>/00-initiate.md");
		expect(out).toContain(".metapowers/project-management/<project>/04-improve.md");
		expect(out).not.toContain(".project/");
		expect(out).toContain(ARGS_PARAGRAPH("project-management", "first-token"));
	});

	it("uses the basename rule for coaching", () => {
		const out = standardizeArgs(coachingFixture, "coaching");
		expect(out).toContain("basename without extension");
		expect(out).toContain(ARGS_PARAGRAPH("coaching", "basename"));
		expect(out).toContain(".metapowers/coaching/<project>/code-review.md");
		// Prose still refers to the file path the user passed.
		expect(out).toContain('Read the source code files specified in "$ARGUMENTS"');
	});

	it("leaves skills without $ARGUMENTS unchanged and is idempotent", () => {
		expect(standardizeArgs(noArgsFixture, "metapowers")).toBe(noArgsFixture);
		expect(standardizeArgs(freeTextFixture, "development")).toBe(freeTextFixture);
		for (const [fixture, plugin] of [
			[securityFixture, "security"],
			[pmFixture, "project-management"],
			[coachingFixture, "coaching"],
		]) {
			const once = standardizeArgs(fixture, plugin);
			expect(once).not.toBe(fixture);
			expect(standardizeArgs(once, plugin)).toBe(once);
		}
	});
});
