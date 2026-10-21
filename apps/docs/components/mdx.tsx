import { Command } from "@/components/docs/Command";
import { DomainGrid } from "@/components/docs/DomainGrid";
import { NextPhase } from "@/components/docs/NextPhase";
import { Output } from "@/components/docs/Output";
import { Requires } from "@/components/docs/Requires";
import { Step, Steps } from "@/components/docs/Steps";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		Command,
		Steps,
		Step,
		Output,
		Requires,
		NextPhase,
		DomainGrid,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
