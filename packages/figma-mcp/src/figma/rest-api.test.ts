import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FigmaClient } from "./rest-api.js";

describe("FigmaClient", () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function mockOkResponse(body: unknown) {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(body),
		});
	}

	function mockErrorResponse(status: number, statusText: string) {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status,
			statusText,
		});
	}

	it("throws if no token provided", () => {
		expect(() => new FigmaClient("")).toThrow("FIGMA_ACCESS_TOKEN is required");
	});

	it("sends correct X-Figma-Token header on requests", async () => {
		const client = new FigmaClient("test-token-123");
		mockOkResponse({ name: "Test File" });

		await client.getFile("abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: { "X-Figma-Token": "test-token-123" },
			}),
		);
	});

	it("throws on non-ok API responses with status code and text", async () => {
		const client = new FigmaClient("test-token");
		mockErrorResponse(403, "Forbidden");

		await expect(client.getFile("abc123")).rejects.toThrow(
			"Figma API error: 403 Forbidden",
		);
	});

	describe("getFile", () => {
		it("calls /v1/files/:fileKey", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ name: "My File" });

			await client.getFile("file-key-1");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.figma.com/v1/files/file-key-1",
				expect.objectContaining({
					headers: { "X-Figma-Token": "tok" },
				}),
			);
		});

		it("passes optional query params (depth, ids)", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ name: "My File" });

			await client.getFile("file-key-1", { depth: 2, ids: "1:2,3:4" });

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain("/v1/files/file-key-1?");
			expect(url).toContain("depth=2");
			expect(url).toContain("ids=1%3A2%2C3%3A4");
		});
	});

	describe("getNodes", () => {
		it("calls /v1/files/:fileKey/nodes?ids=...", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ nodes: {} });

			await client.getNodes("file-key-1", ["1:2", "3:4"]);

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain("/v1/files/file-key-1/nodes?");
			expect(url).toContain("ids=1%3A2%2C3%3A4");
		});

		it("passes additional params", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ nodes: {} });

			await client.getNodes("file-key-1", ["1:2"], { depth: 1 });

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain("depth=1");
		});
	});

	describe("getImages", () => {
		it("calls /v1/images/:fileKey?ids=...&format=...&scale=...", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ err: null, images: {} });

			await client.getImages("file-key-1", ["1:2"], {
				format: "svg",
				scale: 2,
			});

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain("/v1/images/file-key-1?");
			expect(url).toContain("ids=1%3A2");
			expect(url).toContain("format=svg");
			expect(url).toContain("scale=2");
		});

		it("uses defaults when no options provided", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ err: null, images: {} });

			await client.getImages("file-key-1", ["1:2"]);

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain("/v1/images/file-key-1?");
			expect(url).toContain("ids=1%3A2");
		});
	});

	describe("getVariables", () => {
		it("calls /v1/files/:fileKey/variables/local", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ variables: {}, variableCollections: {} });

			await client.getVariables("file-key-1");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.figma.com/v1/files/file-key-1/variables/local",
				expect.objectContaining({
					headers: { "X-Figma-Token": "tok" },
				}),
			);
		});
	});

	describe("getStyles", () => {
		it("calls /v1/files/:fileKey/styles", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ styles: [] });

			await client.getStyles("file-key-1");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.figma.com/v1/files/file-key-1/styles",
				expect.objectContaining({
					headers: { "X-Figma-Token": "tok" },
				}),
			);
		});
	});

	describe("getComponents", () => {
		it("calls /v1/files/:fileKey/components", async () => {
			const client = new FigmaClient("tok");
			mockOkResponse({ components: [] });

			await client.getComponents("file-key-1");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.figma.com/v1/files/file-key-1/components",
				expect.objectContaining({
					headers: { "X-Figma-Token": "tok" },
				}),
			);
		});
	});
});
