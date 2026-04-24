import type { ParsedSkill } from "./parse-skill.js";

export interface ValidationIssue {
	rule: string;
	message: string;
	severity: "error" | "warning";
}

export interface ValidationResult {
	pass: boolean;
	errors: ValidationIssue[];
	warnings: ValidationIssue[];
}

const COMMON_VERBS = new Set([
	"add",
	"aggregate",
	"allocate",
	"analyze",
	"answer",
	"apply",
	"assign",
	"assess",
	"audit",
	"break",
	"build",
	"calculate",
	"capture",
	"catalog",
	"check",
	"classify",
	"clean",
	"close",
	"compare",
	"compile",
	"conduct",
	"configure",
	"consolidate",
	"convert",
	"craft",
	"create",
	"debug",
	"define",
	"delegate",
	"delete",
	"deploy",
	"describe",
	"design",
	"detect",
	"determine",
	"develop",
	"discover",
	"display",
	"do",
	"document",
	"draft",
	"edit",
	"enforce",
	"establish",
	"estimate",
	"evaluate",
	"execute",
	"explore",
	"export",
	"extract",
	"facilitate",
	"fetch",
	"find",
	"finish",
	"fix",
	"format",
	"gather",
	"generate",
	"get",
	"give",
	"greet",
	"guide",
	"handle",
	"identify",
	"implement",
	"import",
	"initialize",
	"inspect",
	"install",
	"investigate",
	"invoke",
	"launch",
	"lint",
	"list",
	"load",
	"log",
	"maintain",
	"make",
	"manage",
	"map",
	"match",
	"merge",
	"migrate",
	"model",
	"monitor",
	"move",
	"notify",
	"open",
	"optimize",
	"orchestrate",
	"organize",
	"output",
	"package",
	"parse",
	"perform",
	"plan",
	"post",
	"prepare",
	"present",
	"prioritize",
	"process",
	"produce",
	"project",
	"prototype",
	"provide",
	"publish",
	"query",
	"read",
	"reconcile",
	"record",
	"refactor",
	"remove",
	"render",
	"replace",
	"report",
	"request",
	"research",
	"resolve",
	"respond",
	"restore",
	"retrieve",
	"review",
	"run",
	"save",
	"scaffold",
	"scan",
	"schedule",
	"score",
	"search",
	"secure",
	"select",
	"send",
	"serve",
	"set",
	"show",
	"sort",
	"start",
	"stop",
	"store",
	"stream",
	"structure",
	"submit",
	"summarize",
	"sync",
	"synthesize",
	"test",
	"track",
	"transform",
	"translate",
	"trigger",
	"update",
	"upload",
	"validate",
	"verify",
	"view",
	"watch",
	"work",
	"write",
]);

export function validateSkill(parsed: ParsedSkill): ValidationResult {
	const errors: ValidationIssue[] = [];
	const warnings: ValidationIssue[] = [];

	for (const err of parsed.errors) {
		errors.push({ rule: "parse-error", message: err, severity: "error" });
	}

	const desc = parsed.frontmatter.description;
	if (!desc || typeof desc !== "string" || desc.trim().length === 0) {
		errors.push({
			rule: "description-required",
			message: "Frontmatter must include a non-empty 'description' field",
			severity: "error",
		});
	} else {
		if (desc.length > 200) {
			errors.push({
				rule: "description-max-length",
				message: `Description is ${desc.length} chars (max 200)`,
				severity: "error",
			});
		}

		const firstWord = desc.trim().split(/\s+/)[0].toLowerCase();
		if (!COMMON_VERBS.has(firstWord)) {
			errors.push({
				rule: "description-starts-with-verb",
				message: `Description should start with a verb. "${firstWord}" is not in the recognized verb list`,
				severity: "error",
			});
		}
	}

	const wordCount = parsed.body.trim().split(/\s+/).length;
	if (wordCount > 2000) {
		warnings.push({
			rule: "body-max-words",
			message: `Skill body is ${wordCount} words (recommended max 2000)`,
			severity: "warning",
		});
	}

	return {
		pass: errors.length === 0,
		errors,
		warnings,
	};
}
