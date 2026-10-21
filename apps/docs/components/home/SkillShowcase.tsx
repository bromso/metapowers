import { SectionHeader } from "@/components/home/SectionHeader";
import { SkillFlipCard } from "@/components/home/SkillFlipCard";
import Reveal from "@/components/motion/Reveal";

/**
 * Hand-copied from plugins/design/skills/empathize/SKILL.md: the frontmatter (description
 * shortened) and the headings of the first three process steps. Update by hand if the skill
 * changes.
 */
const SKILL_EXCERPT = `---
name: empathize
description: Research a UI component before designing it — user needs, related components in the Figma design system and applicable WCAG requirements — into a research brief. …
argument-hint: "[project] [--skip-checks]"
---

## Process

1. **Read the design system** via MCP tools
2. **Inspect existing components** (if found)
3. **Review accessibility requirements:**
…`;

/** The design plugin's numbered artifacts, one per Design Thinking phase. */
const ARTIFACTS = [
	{ file: "01-empathize.md", note: "research brief" },
	{ file: "02-define.md", note: "component contract" },
	{ file: "03-ideate.md", note: "ideation" },
	{ file: "04-prototype.md", note: "prototype notes" },
	{ file: "05-test.md", note: "test report" },
];

export function SkillShowcase() {
	return (
		<section
			id="showcase"
			aria-labelledby="showcase-title"
			className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					id="showcase-title"
					eyebrow="What a skill looks like"
					title="A brief in, a numbered artifact out."
				/>
				<Reveal className="mt-12">
					<SkillFlipCard
						front={
							<figure>
								<figcaption className="mp-eyebrow mb-4">
									plugins/design/skills/empathize/SKILL.md
								</figcaption>
								<pre className="font-mono text-[0.8rem] leading-relaxed break-words whitespace-pre-wrap sm:text-sm">
									<code>{SKILL_EXCERPT}</code>
								</pre>
							</figure>
						}
						back={
							<figure>
								<figcaption className="sr-only">
									Artifacts the design plugin writes for one project
								</figcaption>
								<div className="flex items-center gap-3 font-mono text-sm">
									<span
										aria-hidden="true"
										className="select-none text-mp-accent-soft [.dark_&]:text-mp-accent"
									>
										❯
									</span>
									<code className="min-w-0 break-all">
										tree .metapowers/design/&lt;project&gt;/
									</code>
								</div>
								<ul className="mt-4 font-mono text-[0.8rem] leading-relaxed sm:text-sm">
									<li>.metapowers/design/&lt;project&gt;/</li>
									{ARTIFACTS.map((artifact, index) => (
										<li key={artifact.file} className="flex flex-wrap gap-x-3">
											<span>
												<span aria-hidden="true" className="opacity-50">
													{index === ARTIFACTS.length - 1 ? "└── " : "├── "}
												</span>
												{artifact.file}
											</span>
											<span className="opacity-60"># {artifact.note}</span>
										</li>
									))}
								</ul>
							</figure>
						}
					/>
				</Reveal>
			</div>
		</section>
	);
}
