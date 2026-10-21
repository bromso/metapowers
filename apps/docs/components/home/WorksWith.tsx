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
								// Codex has no bundled mark (OpenAI restricts logo reuse), so the Miranda Sans
								// wordmark stands in for both the mark and the name (it is plain text, so it
								// needs no separate label). Sized so its cap height matches the marks' actual
								// rendered ink, not just the 20px icon box: measured in Chrome, the
								// Claude/OpenCode/Cursor <path> ink is ~20-22px tall inside the size-5 (20px)
								// box (SVG getBBox scaled to the rendered box size), while mirandaSans 600
								// "C" has a measured cap height of ~0.74em (canvas actualBoundingBoxAscent +
								// actualBoundingBoxDescent at a 100px reference, cross-checked with a
								// pixel-ink scan) — at text-base (16px) that is only ~12px, well short of the
								// marks. 1.7rem (27.2px) closes the gap: 0.74 * 27.2px ≈ 20px cap height,
								// matching the marks' ink height.
								<span className="text-[1.7rem] leading-none font-semibold">{agent.mark.text}</span>
							)}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
