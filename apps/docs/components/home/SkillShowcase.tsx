import Reveal from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
		<section aria-labelledby="showcase-title" className="px-4 py-24 sm:px-6 sm:py-32">
			<div className="mx-auto max-w-7xl">
				<Eyebrow>What a skill looks like</Eyebrow>
				<h2 id="showcase-title" className="mp-display mt-4 text-[clamp(2rem,5vw,4rem)]">
					A brief in, a numbered artifact out.
				</h2>
				<div className="mt-12 grid gap-4 lg:grid-cols-2">
					<Reveal className="min-w-0">
						<figure className="h-full rounded-[20px] border border-mp-ink/10 bg-mp-surface p-5 sm:p-7">
							<figcaption className="mp-eyebrow mb-4">
								plugins/design/skills/empathize/SKILL.md
							</figcaption>
							<pre className="font-mono text-[0.8rem] leading-relaxed break-words whitespace-pre-wrap sm:text-sm">
								<code>{SKILL_EXCERPT}</code>
							</pre>
						</figure>
					</Reveal>
					<Reveal delay={0.04} className="min-w-0">
						<figure className="h-full rounded-xl bg-mp-ink p-5 text-mp-ground sm:p-7 [.dark_&]:border [.dark_&]:border-mp-ink/15 [.dark_&]:bg-mp-surface [.dark_&]:text-mp-ink">
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
								<code className="min-w-0 break-all">tree .metapowers/design/&lt;project&gt;/</code>
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
					</Reveal>
				</div>
			</div>
		</section>
	);
}
