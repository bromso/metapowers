import {
	COMPUTE_WITH_CODE_PARAGRAPH,
	COMPUTE_WITH_CODE_PLUGINS,
	DISCLAIMER_GROUPS,
	DISCLAIMER_TEXT,
	DISCLAIMER_INSTRUCTION as VALIDATOR_INSTRUCTION,
	parseSkill,
	validatePluginSkill,
} from "@singularskills/skill-validator";
import { describe, expect, it } from "vitest";
import { ARGS_PARAGRAPH } from "./args.js";
import {
	COMPUTE_PARAGRAPH,
	COMPUTE_PLUGINS,
	DISCLAIMER,
	DISCLAIMER_INSTRUCTION,
	DISCLAIMER_PLUGINS,
	addCompute,
	addDisclaimer,
} from "./content-blocks.js";

const financeSkill = `---
name: ratios
description: Calculate ratios
argument-hint: "[project] [--skip-checks]"
---

# Ratios

Calculate financial ratios for "$ARGUMENTS".

${ARGS_PARAGRAPH("finance", "first-token")}

## Prerequisites

None.

## Process

1. **Write the artifact** to \`.metapowers/finance/<project>/ratios.md\`.

## Output

The ratio analysis written to \`.metapowers/finance/<project>/ratios.md\`. Present:
- Overall health
- Priority improvement areas
`;

const securitySkill = `# Threat Model

Model threats.

## Output

Present:
- Top threats
> **Note:** Some existing blockquote at the end.

## Appendix

Extra.
`;

const noOutputSkill = `# Status

Show status.

## Process

1. List things.
`;

describe("constants", () => {
	it("match the validator's copies", () => {
		expect(DISCLAIMER).toEqual(DISCLAIMER_TEXT);
		expect(DISCLAIMER_INSTRUCTION).toBe(VALIDATOR_INSTRUCTION);
		expect(DISCLAIMER_PLUGINS).toEqual(DISCLAIMER_GROUPS);
		expect(COMPUTE_PARAGRAPH).toBe(COMPUTE_WITH_CODE_PARAGRAPH);
		expect(COMPUTE_PLUGINS).toEqual(COMPUTE_WITH_CODE_PLUGINS);
	});
});

describe("addDisclaimer", () => {
	it("inserts the instruction and blockquote once at the end of ## Output", () => {
		const { content, skipped } = addDisclaimer(financeSkill, "finance");
		expect(skipped).toBeUndefined();
		expect(content).toBe(
			`${financeSkill.trimEnd()}\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER.money}\n`,
		);
		expect(content.split(DISCLAIMER.money)).toHaveLength(2);
	});

	it("is idempotent", () => {
		const once = addDisclaimer(financeSkill, "finance").content;
		expect(addDisclaimer(once, "finance").content).toBe(once);
		const sec = addDisclaimer(securitySkill, "security").content;
		expect(addDisclaimer(sec, "security").content).toBe(sec);
	});

	it("puts the disclaimer after an existing different blockquote, before the next section", () => {
		const { content } = addDisclaimer(securitySkill, "security");
		expect(content).toContain(
			`> **Note:** Some existing blockquote at the end.\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER.security}\n\n## Appendix`,
		);
	});

	it("skips a skill with no ## Output and leaves it unchanged", () => {
		expect(addDisclaimer(noOutputSkill, "compliance")).toEqual({
			content: noOutputSkill,
			skipped: "no-output-section",
		});
	});

	it("leaves other plugins unchanged", () => {
		expect(addDisclaimer(financeSkill, "legal")).toEqual({ content: financeSkill });
	});

	it("produces skills the validator accepts", () => {
		const content = addCompute(addDisclaimer(financeSkill, "finance").content, "finance");
		const parsed = parseSkill(content, "/repo/plugins/finance/skills/ratios/SKILL.md");
		const issues = validatePluginSkill(parsed, {
			pluginName: "finance",
			pluginDir: "/repo/plugins/finance",
			sharedFiles: [],
			skillNames: ["ratios"],
			allPluginNames: ["finance"],
			allSkillNames: { finance: ["ratios"] },
			multiWriterFiles: new Set(),
		});
		expect(issues).toEqual([]);
	});
});

describe("addCompute", () => {
	it("inserts the paragraph directly after the Arguments paragraph", () => {
		const out = addCompute(financeSkill, "finance");
		expect(out).toContain(
			`${ARGS_PARAGRAPH("finance", "first-token")}\n\n${COMPUTE_PARAGRAPH}\n\n## Prerequisites`,
		);
		expect(addCompute(out, "finance")).toBe(out);
	});

	it("falls back to before the first ## heading", () => {
		const skill = "# Close\n\nClose the books.\n\n## Process\n\n1. Close.\n";
		expect(addCompute(skill, "accounting")).toBe(
			`# Close\n\nClose the books.\n\n${COMPUTE_PARAGRAPH}\n\n## Process\n\n1. Close.\n`,
		);
	});

	it("leaves non-money plugins unchanged", () => {
		expect(addCompute(financeSkill, "security")).toBe(financeSkill);
	});
});
