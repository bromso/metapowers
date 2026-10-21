import { Command } from "@/components/docs/Command";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Domain } from "@/lib/domains";

export type SkillKind = "phase" | "utility" | "overview";

export interface SkillHeaderProps {
	/** The page's domain; `undefined` renders a neutral accent band. */
	domain?: Domain;
	kind: SkillKind;
	title: string;
	description?: string;
	/** The skill's slash command, rendered as a copyable terminal block. */
	command?: string;
}

/**
 * Header band for every docs page: a soft wash of the domain colour fading into the page
 * ground, the "{Domain} · {kind}" eyebrow, the title, description and the skill command.
 */
export function SkillHeader({ domain, kind, title, description, command }: SkillHeaderProps) {
	const tint = domain ? `var(--domain-${domain.colour})` : "var(--mp-accent-soft)";
	return (
		<header
			className="not-prose flex flex-col gap-4 rounded-[20px] px-5 py-8 sm:px-8 sm:py-10"
			style={{
				background: `linear-gradient(160deg, color-mix(in srgb, ${tint} 40%, transparent) 0%, transparent 100%)`,
			}}
		>
			<Eyebrow>{domain ? `${domain.name} · ${kind}` : kind}</Eyebrow>
			<h1 className="mp-display text-[clamp(2rem,4.5vw,3.5rem)] text-mp-ink">{title}</h1>
			{description ? <p className="max-w-2xl text-lg text-mp-muted">{description}</p> : null}
			{command ? <Command command={command} className="mt-2" /> : null}
		</header>
	);
}
