import Link from "next/link";
import type { ReactNode } from "react";

export interface NextPhaseProps {
	href: string;
	title: string;
	children?: ReactNode;
}

/** Arrow card pointing at the next skill or phase in a sequence. */
export function NextPhase({ href, title, children }: NextPhaseProps) {
	return (
		<Link
			href={href}
			className="not-prose group my-6 flex items-center justify-between gap-6 rounded-2xl border border-mp-ink/10 bg-mp-surface px-5 py-4 transition hover:border-mp-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent sm:px-6 sm:py-5"
		>
			<span className="flex min-w-0 flex-col gap-1">
				<span className="mp-eyebrow text-mp-muted">Next</span>
				<span className="font-medium text-mp-ink">{title}</span>
				{children ? <span className="text-sm text-mp-muted">{children}</span> : null}
			</span>
			<span
				aria-hidden="true"
				className="shrink-0 text-2xl text-mp-accent transition-transform group-hover:translate-x-1"
			>
				→
			</span>
		</Link>
	);
}
