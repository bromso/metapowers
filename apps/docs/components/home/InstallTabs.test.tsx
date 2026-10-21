// @vitest-environment jsdom
import { InstallTabs } from "@/components/home/InstallTabs";
import { agents } from "@/lib/agents";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

const tabs = () => screen.getAllByRole("tab");
const selected = () => tabs().find((t) => t.getAttribute("aria-selected") === "true");
const visibleCommand = () => screen.getByRole("tabpanel").querySelector("code")?.textContent;

test("renders four tabs with Claude Code selected and its command visible", () => {
	render(<InstallTabs />);
	expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Install for");
	expect(tabs()).toHaveLength(4);
	expect(tabs().map((t) => t.getAttribute("tabindex"))).toEqual(["0", "-1", "-1", "-1"]);
	expect(selected()?.id).toBe("install-tab-claude-code");
	expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
	expect(visibleCommand()).toBe("/plugin marketplace add bromso/metapowers");
});

test("ArrowRight selects and focuses the next tab and shows its command", () => {
	render(<InstallTabs />);
	tabs()[0].focus();
	fireEvent.keyDown(tabs()[0], { key: "ArrowRight" });
	expect(selected()?.id).toBe("install-tab-codex");
	expect(document.activeElement).toBe(selected());
	expect(visibleCommand()).toBe("npx create-metapowers --tool codex");
	expect(tabs().map((t) => t.getAttribute("tabindex"))).toEqual(["-1", "0", "-1", "-1"]);
});

test("End selects the last tab, Home the first, ArrowLeft wraps", () => {
	render(<InstallTabs />);
	fireEvent.keyDown(tabs()[0], { key: "End" });
	expect(selected()?.id).toBe("install-tab-cursor");
	expect(visibleCommand()).toBe("npx create-metapowers --tool cursor");
	fireEvent.keyDown(tabs()[3], { key: "Home" });
	expect(selected()?.id).toBe("install-tab-claude-code");
	fireEvent.keyDown(tabs()[0], { key: "ArrowLeft" });
	expect(selected()?.id).toBe("install-tab-cursor");
});

test("clicking a tab selects it", () => {
	render(<InstallTabs />);
	fireEvent.click(tabs()[2]);
	expect(selected()?.id).toBe("install-tab-opencode");
	expect(visibleCommand()).toBe("npx create-metapowers --tool opencode");
});

test("aria-controls and aria-labelledby pair up, and each panel links to its guide", () => {
	const { container } = render(<InstallTabs />);
	for (const [index, agent] of agents.entries()) {
		const tab = tabs()[index];
		const panel = container.querySelector(`#${tab.getAttribute("aria-controls")}`);
		expect(panel?.getAttribute("role")).toBe("tabpanel");
		expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id);
		expect(panel?.getAttribute("tabindex")).toBe("0");
		const link = panel?.querySelector("a");
		expect(link?.getAttribute("href")).toBe(agent.href);
		expect(link?.textContent).toBe(`Full guide for ${agent.name} →`);
	}
});

test("server markup shows the Claude Code panel and the highlight with nothing hidden", () => {
	const html = renderToString(<InstallTabs />);
	const doc = new DOMParser().parseFromString(html, "text/html");
	const panel = doc.getElementById("install-panel-claude-code");
	expect(panel?.hasAttribute("hidden")).toBe(false);
	expect(panel?.getAttribute("style") ?? "").not.toMatch(/opacity:\s*0|blur\(4px\)/);
	expect(panel?.textContent).toContain("/plugin marketplace add bromso/metapowers");
	// The pill is drawn inside the active tab in the server HTML, so first paint has no gap.
	const tab = doc.getElementById("install-tab-claude-code");
	expect(tab?.querySelector("span.bg-mp-surface")).not.toBeNull();
	expect(doc.querySelectorAll("span.bg-mp-surface")).toHaveLength(1);
	// The panels box is not clipped to a fixed height before the client measures it.
	expect(html).not.toMatch(/height:\s*0/);
	for (const id of ["codex", "opencode", "cursor"]) {
		expect(doc.getElementById(`install-panel-${id}`)?.hasAttribute("hidden")).toBe(true);
	}
});
