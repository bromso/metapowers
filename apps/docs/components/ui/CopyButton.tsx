"use client";

import { useEffect, useRef, useState } from "react";

export interface CopyButtonProps {
	text: string;
	/** Accessible name for the button; defaults to "Copy command". */
	label?: string;
	className?: string;
}

const RESET_MS = 2000;

export function CopyButton({ text, label = "Copy command", className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			return;
		}
		setCopied(true);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), RESET_MS);
	}

	return (
		<>
			<button
				type="button"
				onClick={copy}
				aria-label={label}
				className={[
					"shrink-0 rounded-full border border-current/25 px-3 py-1 text-xs font-medium opacity-80 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent",
					className,
				]
					.filter(Boolean)
					.join(" ")}
			>
				<span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
			</button>
			<span className="sr-only" aria-live="polite">
				{copied ? "Copied" : ""}
			</span>
		</>
	);
}
