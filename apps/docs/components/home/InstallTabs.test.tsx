// @vitest-environment jsdom
import { InstallTabs, restingOpacity, setSwap } from "@/components/home/InstallTabs";
import { agents } from "@/lib/agents";
import { act, cleanup, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

const tabs = () => screen.getAllByRole("tab");
const selected = () => tabs().find((t) => t.getAttribute("aria-selected") === "true");
const visibleCommand = () => screen.getByRole("tabpanel").querySelector("code")?.textContent;

test("renders seven tabs with Claude Code selected and its command visible", () => {
	render(<InstallTabs />);
	expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Install for");
	expect(tabs()).toHaveLength(7);
	expect(tabs().map((t) => t.getAttribute("tabindex"))).toEqual([
		"0",
		"-1",
		"-1",
		"-1",
		"-1",
		"-1",
		"-1",
	]);
	expect(selected()?.id).toBe("install-tab-claude-code");
	expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
	expect(visibleCommand()).toBe("/plugin marketplace add bromso/singularskills");
});

test("ArrowRight selects and focuses the next tab and shows its command", () => {
	render(<InstallTabs />);
	tabs()[0].focus();
	fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
	expect(selected()?.id).toBe("install-tab-codex");
	expect(document.activeElement).toBe(selected());
	expect(visibleCommand()).toBe("codex plugin marketplace add bromso/singularskills");
	expect(tabs().map((t) => t.getAttribute("tabindex"))).toEqual([
		"-1",
		"0",
		"-1",
		"-1",
		"-1",
		"-1",
		"-1",
	]);
});

test("End selects the last tab, Home the first, ArrowLeft wraps", () => {
	render(<InstallTabs />);
	fireEvent.keyDown(tabs()[0], { key: "End" });
	expect(selected()?.id).toBe("install-tab-kimi-code-cli");
	expect(document.activeElement).toBe(selected());
	expect(visibleCommand()).toBe("npx skills add bromso/singularskills --agent kimi-code-cli");
	fireEvent.keyDown(tabs()[6], { key: "Home" });
	expect(selected()?.id).toBe("install-tab-claude-code");
	expect(document.activeElement).toBe(selected());
	fireEvent.keyDown(tabs()[0], { key: "ArrowLeft" });
	expect(selected()?.id).toBe("install-tab-kimi-code-cli");
	expect(document.activeElement).toBe(selected());
});

test("unhandled keys and modified arrows are left alone", () => {
	render(<InstallTabs />);
	for (const init of [
		{ key: "Tab" },
		{ key: "a" },
		{ key: "ArrowRight", altKey: true },
		{ key: "ArrowLeft", metaKey: true },
		{ key: "End", ctrlKey: true },
	]) {
		const event = createEvent.keyDown(tabs()[0], init);
		fireEvent(tabs()[0], event);
		expect(event.defaultPrevented).toBe(false);
		expect(selected()?.id).toBe("install-tab-claude-code");
	}
});

test("reduced motion switches with no inline opacity, filter or height", () => {
	vi.stubGlobal("matchMedia", (query: string) => ({
		matches: query.includes("reduce"),
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
	}));
	const { container } = render(<InstallTabs />);
	fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
	expect(selected()?.id).toBe("install-tab-codex");
	const panel = screen.getByRole("tabpanel");
	for (const el of [...panel.children, screen.getByRole("link", { name: /Full guide/ })]) {
		const line = el as HTMLElement;
		expect(line.style.opacity).toBe("");
		expect(line.style.filter).toBe("");
		expect(line.style.transform).toBe("");
	}
	const box = panel.parentElement?.parentElement as HTMLElement;
	expect(box.style.height).toBe("");
	// (The pill's own placement uses translateX/translateY, so only the blur is a global check.)
	expect(container.innerHTML).not.toMatch(/blur\(/);
});

test("hydrates the server markup without warnings", async () => {
	const errors = vi.spyOn(console, "error").mockImplementation(() => {});
	const host = document.createElement("div");
	host.innerHTML = renderToString(<InstallTabs />);
	document.body.append(host);
	let root: ReturnType<typeof hydrateRoot> | undefined;
	await act(async () => {
		root = hydrateRoot(host, <InstallTabs />, {
			onRecoverableError: (error) => console.error(error),
		});
	});
	expect(errors).not.toHaveBeenCalled();
	// After hydration the moving pill replaces the in-tab one: still exactly one.
	expect(host.querySelectorAll("span.bg-mp-surface")).toHaveLength(1);
	expect(host.querySelector("[role=tab] span.bg-mp-surface")).toBeNull();
	act(() => root?.unmount());
	host.remove();
});

test("the swap is directional: lines enter from the side the user moved toward", () => {
	const { container } = render(<InstallTabs />);
	const firstLine = () => screen.getByRole("tabpanel").firstElementChild as HTMLElement;

	// ArrowRight: the new lines start 40px to the right, heavily blurred, and a clone of the old
	// panel is laid over the box for its exit.
	fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
	expect(firstLine().style.transform).toBe("translateX(40px)");
	expect(firstLine().style.filter).toBe("blur(16px)");
	expect(firstLine().style.opacity).toBe("0");
	const ghost = container.querySelector('[aria-hidden="true"][style*="position: absolute"]');
	expect(ghost).not.toBeNull();
	expect(ghost?.hasAttribute("id")).toBe(false);
	expect(ghost?.hasAttribute("role")).toBe(false);
	expect(ghost?.querySelector("[id], [aria-live]")).toBeNull();
	expect(ghost?.textContent).toContain("/plugin marketplace add bromso/singularskills");

	// ArrowLeft from the first tab wraps to the last, and still comes in from the left.
	fireEvent.keyDown(tabs()[1], { key: "Home" });
	expect(firstLine().style.transform).toBe("translateX(-40px)");
	fireEvent.keyDown(tabs()[0], { key: "ArrowLeft" });
	expect(selected()?.id).toBe("install-tab-kimi-code-cli");
	expect(firstLine().style.transform).toBe("translateX(-40px)");

	// A click on a tab to the left of the active one comes from the left.
	fireEvent.click(tabs()[1]);
	expect(firstLine().style.transform).toBe("translateX(-40px)");
	fireEvent.click(tabs()[3]);
	expect(firstLine().style.transform).toBe("translateX(40px)");
});

test("a line fades up to its own resting opacity, never past it", () => {
	// The note rests at 70% through a class; the fade must end there, not pass through 100%.
	const style = document.createElement("style");
	style.textContent = ".opacity-70 { opacity: 0.7 }";
	document.head.appendChild(style);
	try {
		const note = document.createElement("p");
		note.className = "opacity-70";
		document.body.appendChild(note);
		// The resting value comes from the stylesheet, with any inline value cleared first.
		note.style.opacity = "0.2";
		expect(restingOpacity(note)).toBeCloseTo(0.7);
		expect(note.style.opacity).toBe("");
		// The curve is rest × t: 0.63 at t = 0.9, never 0.9, and cleared (class rules again) at 1.
		setSwap(note, 0.9, 1, 0.7);
		expect(Number(note.style.opacity)).toBeCloseTo(0.63);
		const px = (value: string) => Number.parseFloat(value.replace(/^[a-zA-Z]+\(/, ""));
		expect(px(note.style.filter)).toBeCloseTo(1.6);
		expect(px(note.style.transform)).toBeCloseTo(4);
		setSwap(note, 0.999, 1, 0.7);
		expect(Number(note.style.opacity)).toBeLessThan(0.7);
		setSwap(note, 1, 1, 0.7);
		expect(note.style.opacity).toBe("");
		expect(getComputedStyle(note).opacity).toBe("0.7");
		// A line with no class rule rests at 1 and fades the full way.
		const plain = document.createElement("div");
		document.body.appendChild(plain);
		expect(restingOpacity(plain)).toBe(1);
		setSwap(plain, 0.5, -1);
		expect(plain.style.opacity).toBe("0.5");
		expect(plain.style.transform).toBe("translateX(-20px)");
		note.remove();
		plain.remove();
		// In the component, the note starts the swap at 0 (rest × 0), not at full opacity.
		render(<InstallTabs />);
		fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
		const live = screen.getByRole("tabpanel").querySelector("p.opacity-70") as HTMLElement;
		expect(live.style.opacity).toBe("0");
	} finally {
		style.remove();
	}
});

test("clicking a tab selects it", () => {
	render(<InstallTabs />);
	fireEvent.click(tabs()[2]);
	expect(selected()?.id).toBe("install-tab-opencode");
	expect(visibleCommand()).toBe("npx skills add bromso/singularskills --agent opencode");
});

test("aria-controls and aria-labelledby pair up, and the guide link follows the active tab", () => {
	const { container } = render(<InstallTabs />);
	for (const [index, agent] of agents.entries()) {
		const tab = tabs()[index];
		const panel = container.querySelector(`#${tab.getAttribute("aria-controls")}`);
		expect(panel?.getAttribute("role")).toBe("tabpanel");
		expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id);
		expect(panel?.getAttribute("tabindex")).toBe("0");
		expect(panel?.textContent).toContain(agent.install.command);
		fireEvent.click(tab);
		const link = screen.getByRole("link", { name: `Full guide for ${agent.name}` });
		expect(link.getAttribute("href")).toBe(agent.href);
	}
	// One ink shell holds every panel, so the block never swaps with the tab.
	const shells = container.querySelectorAll(".bg-mp-ink.rounded-xl");
	expect(shells).toHaveLength(1);
	expect(shells[0].querySelectorAll('[role="tabpanel"]')).toHaveLength(agents.length);
	expect(shells[0].querySelectorAll('[role="tabpanel"]:not([hidden])')).toHaveLength(1);
});

test("server markup shows the Claude Code panel and the highlight with nothing hidden", () => {
	const html = renderToString(<InstallTabs />);
	const doc = new DOMParser().parseFromString(html, "text/html");
	const panel = doc.getElementById("install-panel-claude-code");
	expect(panel?.hasAttribute("hidden")).toBe(false);
	expect(panel?.getAttribute("style") ?? "").not.toMatch(/opacity:\s*0|blur\(|translateY\(/);
	expect(panel?.textContent).toContain("/plugin marketplace add bromso/singularskills");
	// The pill is drawn inside the active tab in the server HTML, so first paint has no gap.
	const tab = doc.getElementById("install-tab-claude-code");
	expect(tab?.querySelector("span.bg-mp-surface")).not.toBeNull();
	expect(doc.querySelectorAll("span.bg-mp-surface")).toHaveLength(1);
	// The panels box is not clipped to a fixed height before the client measures it.
	expect(html).not.toMatch(/height:\s*0/);
	for (const id of agents.slice(1).map((a) => a.slug)) {
		expect(doc.getElementById(`install-panel-${id}`)?.hasAttribute("hidden")).toBe(true);
	}
});
