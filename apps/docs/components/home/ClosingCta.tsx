import { CtaBackdrop } from "@/components/home/CtaBackdrop";
import GradualBlur from "@/components/motion/GradualBlur";
import { GitHubIcon } from "@/components/ui/Icons";
import { Pill } from "@/components/ui/Pill";

/** Cream outline pill on ink; reverts to the default outline where the section turns dark-surface. */
const creamOutline =
	"border-mp-ground! text-mp-ground! hover:bg-mp-ground/10! focus-visible:outline-mp-accent-soft! [.dark_&]:border-mp-ink! [.dark_&]:text-mp-ink! [.dark_&]:hover:bg-mp-ink/5! [.dark_&]:focus-visible:outline-mp-accent!";

/**
 * Ink section. In the dark theme `--mp-ink` is light, so (like Terminal) it switches to the
 * surface token to stay dark. `--cta-bg` names whichever token the section is painted with, so
 * the bottom blur's tint follows the theme.
 *
 * Layers: the topography backdrop (z-0), the bottom blur band (z-1; `clamp(180px, 42%, 300px)`
 * of the section's height, tall enough that the contour lines visibly soften and fade toward the
 * bottom edge), and the content (z-10). The band sits under the content, so it blurs only the
 * backdrop and never the pills or text even where it reaches above the bottom padding; the site
 * footer is outside the section.
 */
export function ClosingCta() {
	return (
		<section
			aria-labelledby="cta-title"
			className="relative isolate bg-(--cta-bg) px-4 py-28 text-mp-ground [--cta-bg:var(--mp-ink)] sm:px-6 sm:py-36 [.dark_&]:text-mp-ink [.dark_&]:[--cta-bg:var(--mp-surface)]"
		>
			<CtaBackdrop />
			<GradualBlur
				position="bottom"
				target="parent"
				height="clamp(180px, 42%, 300px)"
				strength={2.5}
				layers={6}
				curve="bezier"
				tint="var(--cta-bg)"
				zIndex={1}
			/>
			<div className="relative z-10 mx-auto max-w-7xl">
				<h2 id="cta-title" className="mp-display max-w-3xl text-[clamp(2.5rem,6vw,5rem)]">
					Give your agent a studio.
				</h2>
				<div className="mt-10 flex flex-wrap gap-3">
					<Pill href="#install" variant="primary" star starTheme="dark">
						Add the marketplace
					</Pill>
					<Pill
						href="https://github.com/bromso/metapowers"
						variant="outline"
						external
						className={creamOutline}
					>
						<GitHubIcon className="size-4" />
						Star on GitHub
					</Pill>
				</div>
			</div>
		</section>
	);
}
