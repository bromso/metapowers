/** Where a skill finds the reference files it uses: its own `references/` folder (spec §5). */
const ROOT = "references/";

// `${CLAUDE_PLUGIN_ROOT}/shared/<path>`, the per-plugin form the pack migrated from.
const PLUGIN_ROOT = /`\$\{CLAUDE_PLUGIN_ROOT\}\/shared\/([^`]+)`/g;
// `plugins/<any-plugin>/shared/<path>` — the plugin segment is dropped, so
// cross-plugin references become references to the skill's local copy.
const REPO_RELATIVE = /`plugins\/[a-z-]+\/shared\/([^`]+)`/g;
// `shared/<path>` with no prefix (must start right after the backtick).
const BARE_SHARED = /`shared\/([^`]+)`/g;
// finance skills reference their template by bare filename.
const FINANCE_MODEL = /`financial-model-template\.md`/g;

/** Point every reference to a former `shared/` file at `references/<path>`. Idempotent. */
export function rewriteSharedRefs(content: string, domain: string): string {
	const local = (_m: string, rest: string) => `\`${ROOT}${rest}\``;
	let out = content
		.replace(PLUGIN_ROOT, local)
		.replace(REPO_RELATIVE, local)
		.replace(BARE_SHARED, local);
	if (domain === "finance") {
		out = out.replace(FINANCE_MODEL, `\`${ROOT}financial-model-template.md\``);
	}
	return out;
}
