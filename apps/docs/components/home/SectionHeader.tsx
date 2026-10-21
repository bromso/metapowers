import { Eyebrow } from "@/components/ui/Eyebrow";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
	/** Heading id; the section's `aria-labelledby` points at it. */
	id: string;
	eyebrow: ReactNode;
	title: ReactNode;
	className?: string;
}

/**
 * Eyebrow plus display-size section title, shared by the homepage sections. Renders no
 * wrapper element unless `className` is given.
 */
export function SectionHeader({ id, eyebrow, title, className }: SectionHeaderProps) {
	const content = (
		<>
			<Eyebrow>{eyebrow}</Eyebrow>
			<h2 id={id} className="mp-display mt-4 text-[clamp(2rem,5vw,4rem)]">
				{title}
			</h2>
		</>
	);
	return className ? <div className={className}>{content}</div> : content;
}
