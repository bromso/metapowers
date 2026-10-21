import { SkillFlipCard } from "@/components/home/SkillFlipCard";
import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";

const html = () => renderToString(<SkillFlipCard front={<p>FRONT</p>} back={<p>BACK</p>} />);

test("server markup carries both faces and both labels", () => {
	const out = html();
	expect(out).toContain("FRONT");
	expect(out).toContain("BACK");
	expect(out).toContain("Flip to see what it writes");
	expect(out).toContain("Flip back to the skill");
});

test("no face is hidden in the server markup", () => {
	// First paint must show both faces even if the FlipCard chunk never loads, so no class may
	// hide anything unconditionally or behind a media query; only the post-mount `:has(...)`
	// swap variant may.
	const tokens = [...html().matchAll(/class="([^"]*)"/g)].flatMap((m) =>
		m[1].replaceAll("&amp;", "&").replaceAll("&gt;", ">").split(/\s+/),
	);
	const hiding = /(^|:)(invisible|hidden|opacity-0|sr-only)$|visibility/;
	const offenders = tokens.filter(
		(t) => hiding.test(t) && !t.startsWith("[&:has([aria-pressed])>[data-faces]"),
	);
	expect(offenders).toEqual([]);
	expect(html()).not.toMatch(/style="[^"]*(visibility|opacity)/);
});
