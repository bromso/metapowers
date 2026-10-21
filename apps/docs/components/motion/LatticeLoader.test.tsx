// @vitest-environment jsdom
import LatticeLoader from "@/components/motion/LatticeLoader";
import { cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

test("the bare lattice has no label, timer or live region and is hidden from assistive tech", () => {
	const { container } = render(<LatticeLoader labelled={false} status="working" />);
	const root = container.firstElementChild as HTMLElement;
	expect(root.getAttribute("aria-hidden")).toBe("true");
	expect(root.hasAttribute("role")).toBe(false);
	expect(container.querySelector(".sr-only")).toBeNull();
	expect(container.querySelector(".ll-text")).toBeNull();
	// No visible or spoken text at all (the only text node is the component's own <style>).
	const text = [...root.querySelectorAll("span")].map((s) => s.textContent).join("");
	expect(text.trim()).toBe("");
	// Nine cells in each of the running and the mark grids; the orbit has one hole.
	expect(container.querySelectorAll(".ll-run > span")).toHaveLength(9);
	expect(container.querySelectorAll(".ll-run > span[data-hole]")).toHaveLength(1);
	expect(container.querySelectorAll(".ll-mark > span[data-on]")).toHaveLength(4);
});

test("the labelled loader keeps upstream's status line", () => {
	const { container } = render(<LatticeLoader status="done" doneLabel="Done in" />);
	const root = container.firstElementChild as HTMLElement;
	expect(root.getAttribute("role")).toBe("status");
	expect(root.getAttribute("data-status")).toBe("done");
	expect(container.querySelector(".sr-only")?.textContent).toContain("Done in");
});

test("server markup for a settled lattice carries the done status", () => {
	const html = renderToString(<LatticeLoader labelled={false} status="done" />);
	expect(html).toContain('data-status="done"');
	expect(html).not.toContain('role="status"');
});
