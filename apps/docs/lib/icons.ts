import { icons } from "@iconify-json/line-md";
import { getIconData, iconToHTML, iconToSVG } from "@iconify/utils";

/**
 * Build-time only: imported by server components, so `@iconify-json/line-md` (the whole icon
 * set) never reaches the client bundle. Callers pass the resulting markup to `AnimatedIcon`.
 *
 * line-md icons draw themselves with SMIL (`<animate>`, `<animateTransform>`, `<set>`, all
 * `fill="freeze"`), which starts when the `<svg>` is inserted into the document. CSS
 * `animation-*` properties do not reach SMIL, so the resting frame cannot be frozen with CSS.
 * `renderLineMdIconStill` instead bakes each animation's final value onto its parent element
 * and drops the animation elements: a static SVG that already shows the finished drawing.
 */
const PREFIX = "line-md:";

function iconBody(name: string): { body: string; width?: number; height?: number } {
	const data = name.startsWith(PREFIX) ? getIconData(icons, name.slice(PREFIX.length)) : null;
	if (!data) throw new Error(`Unknown line-md icon: ${name}`);
	return data;
}

/**
 * Prefixes every `id` in `body` and its references (`url(#id)`, `href="#id"`, `begin="id.end"`).
 * The installed `@iconify/utils` `replaceIDs` ignores a prefix and numbers ids from a
 * module-wide counter, so the same icon rendered twice came out different. A prefix derived from
 * the icon name and the variant keeps builds reproducible and keeps the still and animated
 * renders' ids apart when both sit on the same page.
 */
function prefixIDs(body: string, prefix: string): string {
	let out = body;
	for (const [, id] of body.matchAll(/\sid="(\S+)"/g)) {
		const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		out = out.replace(new RegExp(`([#;"])(${escaped})(["')]|\\.[a-z])`, "g"), `$1${prefix}$2$3`);
	}
	return out;
}

function toMarkup(
	name: string,
	variant: "still" | "anim",
	body: string,
	width?: number,
	height?: number,
): string {
	const svg = iconToSVG({ body, width, height });
	const prefix = `${name.replace(/[^a-z0-9]/gi, "-")}-${variant}-`;
	return iconToHTML(prefixIDs(svg.body, prefix), svg.attributes);
}

/** The animated icon: its draw plays each time the `<svg>` is inserted. Throws with `name` when missing. */
export function renderLineMdIcon(name: string): string {
	const { body, width, height } = iconBody(name);
	return toMarkup(name, "anim", body, width, height);
}

const TAG = /<\/?[a-zA-Z][^>]*>/g;
const SMIL = /^<(animate|animateTransform|animateMotion|set)\b/;
const attr = (tag: string, key: string) => tag.match(new RegExp(`\\s${key}="([^"]*)"`))?.[1];

function setAttr(tag: string, key: string, value: string): string {
	const pattern = new RegExp(`\\s${key}="[^"]*"`);
	if (pattern.test(tag)) return tag.replace(pattern, ` ${key}="${value}"`);
	return tag.replace(/\s*(\/?)>$/, ` ${key}="${value}"$1>`);
}

/** Final value of a `fill="freeze"` SMIL element, as an attribute value; `null` if it ends at rest. */
function finalValue(tag: string): { key: string; value: string } | null {
	if (attr(tag, "fill") !== "freeze") return null;
	const key = attr(tag, "attributeName");
	const end = attr(tag, "to") ?? attr(tag, "values")?.split(";").at(-1)?.trim();
	if (!key || end === undefined) return null;
	if (tag.startsWith("<animateTransform")) {
		return { key, value: `${attr(tag, "type") ?? "translate"}(${end})` };
	}
	return { key, value: end };
}

/**
 * The same icon frozen at its last frame, with no animation elements: the resting render.
 * Each frozen SMIL value is written onto the element it animates (later animations win, as in
 * SMIL), and non-frozen animations are dropped (they end back on the base value).
 */
export function renderLineMdIconStill(name: string): string {
	const { body, width, height } = iconBody(name);
	const out: string[] = [];
	const open: number[] = [];
	let cursor = 0;
	for (const match of body.matchAll(TAG)) {
		const tag = match[0];
		out.push(body.slice(cursor, match.index));
		cursor = match.index + tag.length;
		if (SMIL.test(tag)) {
			const parent = open.at(-1);
			const frozen = finalValue(tag);
			if (parent !== undefined && parent >= 0 && frozen)
				out[parent] = setAttr(out[parent], frozen.key, frozen.value);
			if (!tag.endsWith("/>")) open.push(-1);
			continue;
		}
		if (tag.startsWith("</")) {
			const index = open.pop();
			if (index === -1) continue;
		} else if (!tag.endsWith("/>")) {
			open.push(out.length);
		}
		out.push(tag);
	}
	out.push(body.slice(cursor));
	return toMarkup(name, "still", out.join(""), width, height);
}
