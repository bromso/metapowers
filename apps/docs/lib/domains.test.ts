import { expect, test } from "vitest";
import { domainForDocsUrl } from "./domains";

test("domainForDocsUrl matches a domain root exactly", () => {
	expect(domainForDocsUrl("/docs/design")?.slug).toBe("design");
});

test("domainForDocsUrl matches nested pages", () => {
	expect(domainForDocsUrl("/docs/design/ideate")?.slug).toBe("design");
	expect(domainForDocsUrl("/docs/project-management/sprint")?.slug).toBe("project-management");
});

test("domainForDocsUrl maps /docs/overview to metapowers", () => {
	expect(domainForDocsUrl("/docs/overview")?.slug).toBe("metapowers");
	expect(domainForDocsUrl("/docs/overview/status")?.slug).toBe("metapowers");
});

test("domainForDocsUrl returns undefined when nothing matches", () => {
	expect(domainForDocsUrl("/docs/guides")).toBeUndefined();
	expect(domainForDocsUrl("/docs/designer")).toBeUndefined();
	expect(domainForDocsUrl("/docs")).toBeUndefined();
	expect(domainForDocsUrl(undefined)).toBeUndefined();
});
