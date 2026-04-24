import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	// TechArticle JSON-LD — built from static MDX frontmatter (title, description), no user input
	const articleJsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: page.data.title,
		description: page.data.description,
		url: `https://bromso.github.io/metapowers/docs/${(params.slug ?? []).join("/")}`,
		author: {
			"@type": "Person",
			name: "Jonas Broms",
			url: "https://github.com/bromso",
		},
		publisher: {
			"@type": "Organization",
			name: "Metapowers",
			url: "https://bromso.github.io/metapowers",
		},
	});

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
			<DocsPage toc={page.data.toc} full={page.data.full}>
				<DocsTitle>{page.data.title}</DocsTitle>
				<DocsDescription>{page.data.description}</DocsDescription>
				<DocsBody>
					<MDX
						components={getMDXComponents({
							a: createRelativeLink(source as any, page),
						})}
					/>
				</DocsBody>
			</DocsPage>
		</>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
