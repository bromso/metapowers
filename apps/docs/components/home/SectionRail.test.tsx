// @vitest-environment jsdom
import { RAIL_SECTIONS, SectionRail } from "@/components/home/SectionRail";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

test("the rail is a nav of real section links, hidden until the hero has scrolled away", () => {
	const { container } = render(<SectionRail />);
	// `hidden`: without an IntersectionObserver (jsdom) the wrapper stays aria-hidden.
	const nav = screen.getByRole("navigation", { name: "Page sections", hidden: true });
	const links = [...nav.querySelectorAll("a")];
	expect(links.map((a) => a.getAttribute("href"))).toEqual(RAIL_SECTIONS.map((s) => `#${s.id}`));
	expect(links.map((a) => a.textContent)).toEqual(
		RAIL_SECTIONS.map((s, i) => `${String(i + 1).padStart(2, "0")}${s.label}`),
	);
	// Without an IntersectionObserver (jsdom) the rail stays hidden and inert.
	const wrapper = container.firstElementChild as HTMLElement;
	expect(wrapper.className).toContain("opacity-0");
	expect(wrapper.className).toContain("pointer-events-none");
	expect(wrapper.getAttribute("aria-hidden")).toBe("true");
	expect(wrapper.className).toContain("right-5");
});

test("a click smooth-scrolls to the section instead of jumping, and marks it current", () => {
	const target = document.createElement("section");
	target.id = RAIL_SECTIONS[2].id;
	target.scrollIntoView = vi.fn();
	document.body.appendChild(target);
	try {
		render(<SectionRail />);
		const link = screen.getByRole("link", { name: /Domains/, hidden: true });
		const event = fireEvent.click(link);
		expect(event).toBe(false);
		expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
		expect(link.getAttribute("aria-current")).toBe("location");
	} finally {
		target.remove();
	}
});

test("server markup renders the links and nothing visible", () => {
	const html = renderToString(<SectionRail />);
	for (const s of RAIL_SECTIONS) expect(html).toContain(`href="#${s.id}"`);
	expect(html).toContain("opacity-0");
	// No per-item inline `--effect` value is set on the server; only the rAF loop writes it.
	expect(html).not.toContain("--effect:");
});
