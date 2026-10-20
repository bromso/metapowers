const ROOT = "${CLAUDE_PLUGIN_ROOT}/shared/";

// `plugins/<any-plugin>/shared/<path>` — the plugin segment is dropped, so
// cross-plugin references become references to the plugin's local copy.
const REPO_RELATIVE = /`plugins\/[a-z-]+\/shared\/([^`]+)`/g;
// `shared/<path>` with no prefix (must start right after the backtick).
const BARE_SHARED = /`shared\/([^`]+)`/g;
// finance skills reference their template by bare filename.
const FINANCE_MODEL = /`financial-model-template\.md`/g;

export function rewriteSharedRefs(content: string, plugin: string): string {
	let out = content
		.replace(REPO_RELATIVE, (_m, rest: string) => `\`${ROOT}${rest}\``)
		.replace(BARE_SHARED, (_m, rest: string) => `\`${ROOT}${rest}\``);
	if (plugin === "finance") {
		out = out.replace(FINANCE_MODEL, `\`${ROOT}financial-model-template.md\``);
	}
	return out;
}
