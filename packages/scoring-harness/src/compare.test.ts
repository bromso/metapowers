import { describe, it, expect } from "vitest";
import { compareRevisions, type RevisionScore } from "./compare.js";

describe("compareRevisions", () => {
	it("identifies the better revision", () => {
		const a: RevisionScore = { sha: "abc123", score: 0.9, timestamp: Date.now() - 1000 };
		const b: RevisionScore = { sha: "def456", score: 0.7, timestamp: Date.now() };
		const result = compareRevisions(a, b);
		expect(result.winner).toBe("abc123");
		expect(result.delta).toBeCloseTo(0.2);
		expect(result.regression).toBe(true);
	});

	it("reports no regression when newer is better", () => {
		const a: RevisionScore = { sha: "abc123", score: 0.7, timestamp: Date.now() - 1000 };
		const b: RevisionScore = { sha: "def456", score: 0.9, timestamp: Date.now() };
		const result = compareRevisions(a, b);
		expect(result.winner).toBe("def456");
		expect(result.regression).toBe(false);
	});

	it("reports tie when scores are equal", () => {
		const a: RevisionScore = { sha: "abc123", score: 0.8, timestamp: Date.now() - 1000 };
		const b: RevisionScore = { sha: "def456", score: 0.8, timestamp: Date.now() };
		const result = compareRevisions(a, b);
		expect(result.winner).toBeNull();
		expect(result.regression).toBe(false);
	});
});
