import { InstallTabs } from "@/components/home/InstallTabs";
import { SectionHeader } from "@/components/home/SectionHeader";

/**
 * Install section (spec §4.2): a visible header, then the agent tabs, whose tab list is the
 * supported-agents row and whose panels carry each agent's install command. The section id stays
 * `install`, which the nav and the hero/CTA buttons link to.
 */
export function InstallStrip() {
	return (
		<section
			id="install"
			aria-labelledby="install-title"
			className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader id="install-title" eyebrow="Install" title="One line, any agent." />
				<div className="mt-10">
					<InstallTabs />
				</div>
			</div>
		</section>
	);
}
