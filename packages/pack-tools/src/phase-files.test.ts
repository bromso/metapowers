import { WRITE_LINE as VALIDATOR_WRITE_LINE } from "@singularskills/skill-validator";
import { describe, expect, it } from "vitest";
import {
	APPEND_TEMPLATE,
	WRITE_LINE,
	applyAppendWording,
	applyPhaseFiles,
	multiWriterFiles,
	phaseLabel,
	skillTitle,
	writeTargets,
} from "./phase-files.js";
import type { SkillFile } from "./skills.js";

const PROTECT = ".metapowers/security/<project>/02-protect.md";

const apiSecurity = `---
description: Audit API security
---

# API Security

Audit API security for "$ARGUMENTS".

## Process

1. **Inventory all APIs:**
   - Catalog internal APIs

7. **Write the artifact** to \`${PROTECT}\` with heading:

   ## API Security Audit

   Include sections:
   - **API Inventory** — all APIs with type
   - **Remediation Plan** — prioritized fixes by severity

## Output

The API security audit written to \`${PROTECT}\`. Present a summary to the user highlighting:
- Top priority remediations
`;

const encryption = apiSecurity
	.replace("# API Security", "# Encryption Strategy")
	.replace("## API Security Audit", "## Encryption Strategy");

const siem = apiSecurity
	.replace("# API Security", "# SIEM Setup")
	.replaceAll("02-protect.md", "03-detect.md");

const pageCro = `---
description: Optimize page conversion
---

# Page CRO

## Process

6. **Write the artifact** — append to \`.metapowers/marketing/<project>/02-act.md\` under a \`## Page CRO\` section:
   - **Current State Assessment** — strengths and weaknesses

## Output

Page CRO recommendations appended to \`.metapowers/marketing/<project>/02-act.md\`.
`;

const gdpr = `# GDPR

9. **Write the artifact** to \`.metapowers/compliance/<project>/01-assess/gdpr.md\` following the assessment template structure with:
   - **Lawful Basis Matrix** — mapping
`;

function skill(plugin: string, name: string, content: string): SkillFile {
	return { domain: plugin, name, path: `/x/skills/${plugin}-${name}/SKILL.md`, content };
}

describe("WRITE_LINE", () => {
	it("matches the validator's WRITE_LINE", () => {
		expect(WRITE_LINE.source).toBe(VALIDATOR_WRITE_LINE.source);
		expect(WRITE_LINE.flags).toBe(VALIDATOR_WRITE_LINE.flags);
	});
});

describe("phase files", () => {
	it("finds write targets including directory-style compliance paths", () => {
		const targets = writeTargets(gdpr);
		expect(targets).toHaveLength(1);
		expect(targets[0].file).toBe("01-assess/gdpr.md");
		expect(targets[0].line).toBe(3);
		expect(writeTargets(apiSecurity).map((t) => t.file)).toEqual(["02-protect.md"]);
		expect(writeTargets("Write to `.metapowers/legal/<project>/x.md`")[0].file).toBe("x.md");
		expect(
			writeTargets("5. **Write the plan** using the template from `${CLAUDE_PLUGIN_ROOT}/x.md`"),
		).toEqual([]);
	});

	it("groups multi-writer files per plugin and ignores single-writer files", () => {
		const map = multiWriterFiles([
			skill("security", "api-security", apiSecurity),
			skill("security", "encryption-strategy", encryption),
			skill("security", "siem-setup", siem),
			skill("compliance", "gdpr", gdpr),
		]);
		expect(map.get("security")?.get("02-protect.md")).toEqual([
			"api-security",
			"encryption-strategy",
		]);
		expect(map.get("security")?.has("03-detect.md")).toBe(false);
		expect(map.has("compliance")).toBe(false);
	});

	it("rewrites the write line to the append template and the Output wording", () => {
		expect(skillTitle(apiSecurity)).toBe("API Security");
		expect(phaseLabel("02-protect.md")).toBe("Protect");
		expect(phaseLabel("04-trial-balance.md")).toBe("Trial Balance");
		const out = applyAppendWording(apiSecurity, "02-protect.md", "API Security", "Protect");
		expect(out).toContain(
			`7. ${APPEND_TEMPLATE(PROTECT, "API Security", "Protect")} The section contains:\n`,
		);
		expect(out).not.toContain("with heading:");
		expect(out).toContain(`appended to \`${PROTECT}\``);
		expect(out).not.toContain(`written to \`${PROTECT}\``);
		// The block below the lead-in is kept; its own ## heading nests under the template's ## section.
		expect(out).toContain(
			"\n\n   ### API Security Audit\n\n   Include sections:\n   - **API Inventory** — all APIs with type\n",
		);
		expect(out).not.toContain("   ## API Security Audit");
		expect(out).toContain("\n## Output\n");
	});

	it("demotes ## headings only inside the write block", () => {
		const twoBlocks = apiSecurity.replace(
			"\n## Output",
			"8. **Present it:**\n\n   ## Not In The Write Block\n\n## Output",
		);
		const out = applyAppendWording(twoBlocks, "02-protect.md", "API Security", "Protect");
		expect(out).toContain("   ### API Security Audit");
		expect(out).toContain("   ## Not In The Write Block");
		expect(out).toContain("\n## Output\n");
	});

	it("drops a block heading equal to the section title instead of demoting it", () => {
		const sameTitle = apiSecurity.replace("## API Security Audit", "## API Security");
		const out = applyAppendWording(sameTitle, "02-protect.md", "API Security", "Protect");
		expect(out).not.toContain("### API Security");
		expect(out).toContain(" The section contains:\n\n   - **API Inventory**");
		expect(out).not.toContain("Include sections:");
		expect(applyAppendWording(out, "02-protect.md", "API Security", "Protect")).toBe(out);
	});

	it("removes a fenced frontmatter block from the write block", () => {
		const DRAFT = ".metapowers/legal/<project>/01-draft.md";
		const nda = `# Non-Disclosure Agreement

6. **Write the artifact** to \`${DRAFT}\` with frontmatter:

   \`\`\`
   ---
   description: Non-Disclosure Agreement draft for <project>
   ---
   \`\`\`

## Output

The NDA draft written to \`${DRAFT}\`.
`;
		const out = applyAppendWording(nda, "01-draft.md", "Non-Disclosure Agreement", "Draft");
		expect(out).toContain(
			`6. ${APPEND_TEMPLATE(DRAFT, "Non-Disclosure Agreement", "Draft")}\n\n## Output\n`,
		);
		expect(out).not.toContain("---");
		expect(out).not.toContain("```");
		expect(out).not.toContain("The section contains:");
		expect(applyAppendWording(out, "01-draft.md", "Non-Disclosure Agreement", "Draft")).toBe(out);

		const withSections = nda.replace(
			"   ```\n\n## Output",
			"   ```\n\n   Include sections:\n   - **Parties** — who signs\n\n## Output",
		);
		const out2 = applyAppendWording(
			withSections,
			"01-draft.md",
			"Non-Disclosure Agreement",
			"Draft",
		);
		expect(out2).toContain(" The section contains:\n\n   - **Parties** — who signs\n\n## Output\n");
		expect(out2).not.toContain("Include sections:");
		expect(out2).not.toContain("---");
		expect(applyAppendWording(out2, "01-draft.md", "Non-Disclosure Agreement", "Draft")).toBe(out2);
	});

	it("drops an Include sections: line right after The section contains:, at any indentation", () => {
		const done = `${APPEND_TEMPLATE(PROTECT, "API Security", "Protect")} The section contains:`;
		for (const indent of ["   ", "    ", "\t"]) {
			const input = `# API Security\n\n7. ${done}\n\n${indent}Include sections:\n${indent}- **A** — a\n\n## Output\n`;
			const out = applyAppendWording(input, "02-protect.md", "API Security", "Protect");
			expect(out).toBe(`# API Security\n\n7. ${done}\n\n${indent}- **A** — a\n\n## Output\n`);
		}
		// Only directly after the lead-in: a later "Include sections:" stays.
		const later = `# API Security\n\n7. ${done}\n   - **A** — a\n   Include sections:\n   - **B** — b\n`;
		expect(applyAppendWording(later, "02-protect.md", "API Security", "Protect")).toBe(later);
	});

	it("completes an append line that names a section but lacks the create/replace clause", () => {
		const ACT = ".metapowers/marketing/<project>/02-act.md";
		const out = applyAppendWording(pageCro, "02-act.md", "Page CRO", "Act");
		expect(out).toContain(`6. ${APPEND_TEMPLATE(ACT, "Page CRO", "Act")} The section contains:\n`);
		expect(out).toContain("replace only that section");

		// The existing section title is kept even when it differs from the skill title.
		const dated = pageCro.replace("`## Page CRO` section:", "`## Standup: [Date]` section:");
		expect(applyAppendWording(dated, "02-act.md", "Page CRO", "Act")).toContain(
			`6. ${APPEND_TEMPLATE(ACT, "Standup: [Date]", "Act")} The section contains:\n`,
		);

		// A trailing sentence after the section clause is kept.
		const extra = pageCro.replace(
			"`## Page CRO` section:",
			"`## Page CRO` section. Also compile a brief using the template structure:",
		);
		expect(applyAppendWording(extra, "02-act.md", "Page CRO", "Act")).toContain(
			`6. ${APPEND_TEMPLATE(ACT, "Page CRO", "Act")} Also compile a brief using the template structure:\n`,
		);
	});

	it("is idempotent and leaves already-appending skills intact", () => {
		const once = applyAppendWording(apiSecurity, "02-protect.md", "API Security", "Protect");
		expect(applyAppendWording(once, "02-protect.md", "API Security", "Protect")).toBe(once);
		const fullPageCro = applyAppendWording(pageCro, "02-act.md", "Page CRO", "Act");
		expect(applyAppendWording(fullPageCro, "02-act.md", "Page CRO", "Act")).toBe(fullPageCro);

		const missingSection = pageCro.replace(" under a `## Page CRO` section:", ":");
		const normalised = applyAppendWording(missingSection, "02-act.md", "Page CRO", "Act");
		expect(normalised).toContain(
			`${APPEND_TEMPLATE(".metapowers/marketing/<project>/02-act.md", "Page CRO", "Act")} The section contains:\n`,
		);
		expect(applyAppendWording(normalised, "02-act.md", "Page CRO", "Act")).toBe(normalised);

		const writeUnder = pageCro.replace("— append to", "— write to");
		const fixed = applyAppendWording(writeUnder, "02-act.md", "Page CRO", "Act");
		expect(fixed).toContain("— append to `.metapowers/marketing/<project>/02-act.md` under a");
		expect(fixed.match(/under a `## Page CRO` section/g)).toHaveLength(1);

		const writeUnderAn = pageCro.replace("— append to", "to").replace("under a", "under an");
		const fixedAn = applyAppendWording(writeUnderAn, "02-act.md", "Page CRO", "Act");
		expect(fixedAn).not.toContain("under an");
		expect(fixedAn.match(/`## Page CRO` section/g)).toHaveLength(2); // the template's two mentions only

		const parenthetical = apiSecurity.replace(
			"` with heading:",
			"` (append to existing) with heading:",
		);
		const cleaned = applyAppendWording(parenthetical, "02-protect.md", "API Security", "Protect");
		expect(cleaned).toContain(
			`${APPEND_TEMPLATE(PROTECT, "API Security", "Protect")} The section contains:`,
		);
		expect(cleaned).not.toContain("(append to existing)");

		const skills = [
			skill("security", "api-security", apiSecurity),
			skill("security", "encryption-strategy", encryption),
			skill("security", "siem-setup", siem),
		];
		const transform = applyPhaseFiles(skills);
		const rewritten = skills.map((s) => ({ ...s, content: transform(s) }));
		expect(rewritten[2].content).toBe(siem);
		const again = applyPhaseFiles(rewritten);
		for (const s of rewritten) expect(again(s)).toBe(s.content);
	});
});
