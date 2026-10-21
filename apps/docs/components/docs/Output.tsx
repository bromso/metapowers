import type { ReactNode } from "react";

export interface OutputProps {
	children?: ReactNode;
	className?: string;
}

/** Surface card with a 3 px accent left rule, for the "what you get back" sections. */
export function Output({ children, className }: OutputProps) {
	return (
		<div
			className={[
				"not-prose my-6 rounded-2xl border-l-[3px] border-mp-accent bg-mp-surface px-5 py-4 text-sm leading-relaxed text-mp-ink [&>:first-child]:mt-0 [&>:last-child]:mb-0",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
		</div>
	);
}
