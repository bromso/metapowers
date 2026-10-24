// @vitest-environment jsdom
import { RAIL_SECTIONS, SectionRail } from "@/components/home/SectionRail";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
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
	expect(wrapper.hasAttribute("inert")).toBe(true);
	expect(wrapper.className).toContain("right-5");
});

/** A controllable IntersectionObserver: records targets and lets a test fire entries. */
function stubObserver() {
	const instances: {
		callback: IntersectionObserverCallback;
		targets: Element[];
		options?: IntersectionObserverInit;
	}[] = [];
	class FakeObserver {
		callback: IntersectionObserverCallback;
		targets: Element[] = [];
		constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
			this.callback = callback;
			instances.push({ callback, targets: this.targets, options });
		}
		observe(el: Element) {
			this.targets.push(el);
		}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
	}
	vi.stubGlobal("IntersectionObserver", FakeObserver);
	const fire = (index: number, entries: { target: Element; isIntersecting: boolean }[]) =>
		act(() => {
			instances[index].callback(
				entries as unknown as IntersectionObserverEntry[],
				instances[index] as unknown as IntersectionObserver,
			);
		});
	return { instances, fire };
}

test("the hero gate shows the rail once the hero leaves and hides it again; the hidden rail is inert", () => {
	const hero = document.createElement("section");
	hero.setAttribute("aria-labelledby", "hero-title");
	document.body.appendChild(hero);
	const { instances, fire } = stubObserver();
	try {
		const { container } = render(<SectionRail />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.hasAttribute("inert")).toBe(true);
		expect(instances).toHaveLength(2);
		expect(instances[1].targets).toEqual([hero]);
		fire(1, [{ target: hero, isIntersecting: false }]);
		expect(wrapper.className).toContain("opacity-100");
		expect(wrapper.hasAttribute("inert")).toBe(false);
		expect(wrapper.hasAttribute("aria-hidden")).toBe(false);
		fire(1, [{ target: hero, isIntersecting: true }]);
		expect(wrapper.className).toContain("opacity-0");
		expect(wrapper.hasAttribute("inert")).toBe(true);
	} finally {
		hero.remove();
	}
});

test("the lowest section in the band is current, whatever order the entries arrive in", () => {
	const sections = RAIL_SECTIONS.map((s) => {
		const el = document.createElement("section");
		el.id = s.id;
		document.body.appendChild(el);
		return el;
	});
	const { instances, fire } = stubObserver();
	try {
		const { container } = render(<SectionRail />);
		expect(instances[0].targets).toEqual(sections);
		expect(instances[0].options?.rootMargin).toBe("-35% 0px -60% 0px");
		const current = () => container.querySelector('a[aria-current="location"]')?.textContent;
		// Two sections cross in one batch, out of order: the later one in page order wins.
		fire(0, [
			{ target: sections[2], isIntersecting: true },
			{ target: sections[1], isIntersecting: true },
		]);
		expect(current()).toBe("03Domains");
		// Domains leaves the band; How it works is still in it.
		fire(0, [{ target: sections[2], isIntersecting: false }]);
		expect(current()).toBe("02How it works");
		// Everything leaves: the last current stays marked (the rail is hidden at the top anyway).
		fire(0, [{ target: sections[1], isIntersecting: false }]);
		expect(current()).toBe("02How it works");
	} finally {
		for (const el of sections) el.remove();
	}
});

test("a click smooth-scrolls to the section instead of jumping, updates the hash, and marks it current", () => {
	const target = document.createElement("section");
	target.id = RAIL_SECTIONS[2].id;
	target.scrollIntoView = vi.fn();
	document.body.appendChild(target);
	try {
		render(<SectionRail />);
		const link = screen.getByRole("link", { name: /Domains/, hidden: true });
		const replace = vi.spyOn(history, "replaceState");
		const event = fireEvent.click(link);
		expect(event).toBe(false);
		expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
		expect(replace).toHaveBeenCalledWith(null, "", `#${RAIL_SECTIONS[2].id}`);
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
