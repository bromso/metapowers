import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	rmdirSync,
	statSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { listSkills } from "./skills.js";

const INLINE_CODE = /`([^`\n]+)`/g;
const REFERENCE = /^references\/(.+)$/;
/** `references/workflows/<name>.yml` links the pack's `workflows/<name>.yml`, not a domain doc. */
const WORKFLOW = /^workflows\/[^/]+\.yml$/;

/**
 * The distinct paths (below `references/`, fragment dropped) that `content` links as
 * `` `references/<path>` `` inline code, in order of first appearance. Mirrors the validator's
 * `reference-resolvable` rule.
 */
export function referenceLinks(content: string): string[] {
	const links = new Set<string>();
	for (const match of content.matchAll(INLINE_CODE)) {
		const reference = REFERENCE.exec(match[1].trim());
		if (reference) links.add(reference[1].split("#")[0]);
	}
	return [...links];
}

/** Repo-relative canonical source of a skill's `references/<rel>` link. */
function canonical(domain: string, rel: string): string {
	return WORKFLOW.test(rel) ? rel : path.posix.join("references", domain, rel);
}

const isFile = (file: string) => existsSync(file) && statSync(file).isFile();

/** Files below `dir`, as posix paths relative to it; `[]` when `dir` does not exist. */
function filesBelow(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return globSync("**/*", { cwd: dir, nodir: true, dot: true, posix: true }).sort();
}

/** Removes every empty directory below and including `dir`, deepest first. */
function pruneEmpty(dir: string): void {
	if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
	for (const entry of readdirSync(dir)) pruneEmpty(path.join(dir, entry));
	if (readdirSync(dir).length === 0) rmdirSync(dir);
}

/** A `../…/references/…` path: a reference reached outside the skill's own folder. */
const PARENT_REFERENCE = /^\.\.\/.*references\//;

/**
 * The distinct inline-code paths in `content` that reach a `references/` file through `../`,
 * outside the skill's folder. An installed skill cannot rely on its siblings' layout, so such
 * a link must be bundled under the skill's own `references/` or described in words instead.
 */
export function parentReferenceLinks(content: string): string[] {
	const links = new Set<string>();
	for (const match of content.matchAll(INLINE_CODE)) {
		const span = match[1].trim();
		if (PARENT_REFERENCE.test(span)) links.add(span);
	}
	return [...links];
}

/**
 * Makes every skill under `repoRoot/skills` carry a copy of each canonical file it links as
 * `` `references/<path>` ``: `references/<domain>/<path>`, or `workflows/<name>.yml` for a
 * `references/workflows/<name>.yml` link. A link with no canonical file must name a file that
 * lives only inside the skill (single consumer), else this throws; so does a `../` link to
 * another folder's `references/` (see `parentReferenceLinks`). Copies that differ are
 * overwritten; unlinked copies of canonical files are deleted (skill-only files never are).
 * Returns the repo-relative paths that change (with `check`, that would change; nothing is
 * written).
 */
export function genReferences(repoRoot: string, { check }: { check: boolean }): string[] {
	const unresolved: string[] = [];
	const plans = listSkills(path.join(repoRoot, "skills")).map((skill) => {
		const skillDir = path.posix.join("skills", skill.name);
		const localDir = path.join(repoRoot, skillDir, "references");
		/** Repo-relative copy path -> repo-relative canonical source. */
		const copies = new Map<string, string>();
		for (const link of parentReferenceLinks(skill.content)) {
			unresolved.push(
				`${skill.name}: \`${link}\` reaches outside the skill; bundle it under references/ or describe it`,
			);
		}
		for (const link of referenceLinks(skill.content)) {
			const source = canonical(skill.domain, link);
			const sourcePath = path.join(repoRoot, source);
			if (isFile(sourcePath)) {
				copies.set(path.posix.join(skillDir, "references", link), source);
			} else if (existsSync(sourcePath)) {
				for (const file of filesBelow(sourcePath)) {
					copies.set(
						path.posix.join(skillDir, "references", link, file),
						path.posix.join(source, file),
					);
				}
			} else if (!existsSync(path.join(localDir, link))) {
				unresolved.push(
					`${skill.name}: \`references/${link}\` resolves to neither ${source} nor a file inside the skill`,
				);
			}
		}
		return { domain: skill.domain, skillDir, localDir, copies };
	});
	if (unresolved.length > 0) throw new Error(unresolved.join("\n"));

	const changed: string[] = [];
	for (const { domain, skillDir, localDir, copies } of plans) {
		for (const [copy, source] of copies) {
			const content = readFileSync(path.join(repoRoot, source), "utf-8");
			const target = path.join(repoRoot, copy);
			if (isFile(target) && readFileSync(target, "utf-8") === content) continue;
			changed.push(copy);
			if (check) continue;
			mkdirSync(path.dirname(target), { recursive: true });
			writeFileSync(target, content);
		}
		for (const file of filesBelow(localDir)) {
			const copy = path.posix.join(skillDir, "references", file);
			if (copies.has(copy)) continue;
			if (!isFile(path.join(repoRoot, canonical(domain, file)))) continue;
			changed.push(copy);
			if (!check) rmSync(path.join(repoRoot, copy));
		}
		if (!check) pruneEmpty(localDir);
	}
	return changed;
}
