import { Eyebrow } from "@/components/ui/Eyebrow";
import { agents } from "@/lib/agents";
import Link from "next/link";

/**
 * Supported-agent marks under the install command (spec §4.2): "Works with" eyebrow, then
 * four links — a bundled SVG mark plus the agent name, except Codex, which has no mark and
 * is shown as a Miranda Sans wordmark alone, at the same cap height as the icons. Ink at
 * 60% opacity at rest, full on hover/focus; wraps to two rows on phones.
 */
export function WorksWith() {
	return (
		<div className="mt-10">
			<Eyebrow as="p" className="text-center">
				Works with
			</Eyebrow>
			<ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
				{agents.map((agent) => (
					<li key={agent.slug}>
						<Link
							href={agent.href}
							className="flex items-center gap-2 rounded text-mp-ink opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent"
						>
							{agent.mark.kind === "svg" ? (
								<>
									<svg
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-5 shrink-0"
										aria-hidden="true"
									>
										<title>{agent.mark.title}</title>
										<path d={agent.mark.path} />
									</svg>
									<span className="text-sm font-medium">{agent.name}</span>
								</>
							) : (
								// Codex has no bundled mark (OpenAI restricts logo reuse), so the wordmark
								// itself — set in Miranda Sans at the icons' cap height — stands in for both
								// the mark and the name; it is plain text, so it needs no separate label.
								<span className="text-base leading-none font-semibold">{agent.mark.text}</span>
							)}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
