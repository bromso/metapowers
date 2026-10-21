import { expect, test } from "vitest";
import { domains } from "./domains";
import { renderLineMdIcon, renderLineMdIconStill } from "./icons";

test("renders every domain's animated icon to inline SVG", () => {
	for (const d of domains) expect(renderLineMdIcon(d.animatedIcon)).toMatch(/^<svg[^>]+viewBox/);
});

test("throws with the icon name when it does not exist", () => {
	expect(() => renderLineMdIcon("line-md:does-not-exist")).toThrow("line-md:does-not-exist");
});

test("the still render carries no SMIL and shows each icon's final frame", () => {
	for (const d of domains) {
		const still = renderLineMdIconStill(d.animatedIcon);
		expect(still).toMatch(/^<svg[^>]+viewBox/);
		expect(still).not.toMatch(/<(animate|animateTransform|set)\b/);
	}
	// paint-drop draws a 28-long dash from offset 28 to 0.
	expect(renderLineMdIconStill("line-md:paint-drop")).toContain('stroke-dashoffset="0"');
	// gauge's needle starts at opacity 0 and is revealed by <set opacity to="1">.
	expect(renderLineMdIconStill("line-md:gauge")).not.toContain('opacity="0"');
});
