import { describe, expect, it } from "vitest";
import { parseSkill } from "./parse-skill.js";

describe("parseSkill", () => {
	it("parses valid SKILL.md with frontmatter", () => {
		const input = `---
description: Do something useful when the user asks
---

# Skill Title

Body content here.`;

		const result = parseSkill(input, "test/SKILL.md");
		expect(result.frontmatter.description).toBe("Do something useful when the user asks");
		expect(result.body).toContain("# Skill Title");
		expect(result.filePath).toBe("test/SKILL.md");
		expect(result.sections).toContain("# Skill Title");
	});

	it("extracts all markdown sections", () => {
		const input = `---
description: Test skill
---

# Title

## Section One

Content one.

## Section Two

Content two.`;

		const result = parseSkill(input, "test/SKILL.md");
		expect(result.sections).toEqual(["# Title", "## Section One", "## Section Two"]);
	});

	it("returns error for missing frontmatter", () => {
		const input = "# No frontmatter\n\nJust body.";
		const result = parseSkill(input, "test/SKILL.md");
		expect(result.errors).toContain("Missing frontmatter");
	});

	it("derives the skill name and domain from the directory", () => {
		const of = (dir: string) => parseSkill("---\nname: x\n---\n", `/r/skills/${dir}/SKILL.md`);
		expect(of("design-define-component")).toMatchObject({
			name: "design-define-component",
			domain: "design",
		});
		expect(of("project-management-retrospective").domain).toBe("project-management");
		expect(of("singular-init").domain).toBe("singular");
		expect(of("workflow").domain).toBe("singular");
	});
});
