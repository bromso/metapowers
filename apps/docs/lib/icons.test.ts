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

test("renders are deterministic, and still and animated ids differ", () => {
	for (const d of domains) {
		expect(renderLineMdIcon(d.animatedIcon)).toBe(renderLineMdIcon(d.animatedIcon));
		expect(renderLineMdIconStill(d.animatedIcon)).toBe(renderLineMdIconStill(d.animatedIcon));
	}
	const ids = (markup: string) => [...markup.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
	const refs = (markup: string) => [...markup.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
	// compass draws through a <mask>, so both renders carry an id and a url(#…) reference.
	const anim = renderLineMdIcon("line-md:compass");
	const still = renderLineMdIconStill("line-md:compass");
	expect(ids(anim)).toEqual(["line-md-compass-anim-SVGvmIgmdVi"]);
	expect(ids(still)).toEqual(["line-md-compass-still-SVGvmIgmdVi"]);
	expect(refs(anim)).toEqual(ids(anim));
	expect(refs(still)).toEqual(ids(still));
});
