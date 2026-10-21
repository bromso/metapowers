import { CopyButton } from "@/components/ui/CopyButton";
import type { ReactNode } from "react";

export interface TerminalProps {
	command: string;
	/** Optional muted line under the command. */
	note?: string;
	className?: string;
}

/**
 * The ink block's own classes. In the dark theme `--mp-ink` is light, so the block switches to
 * the surface token to stay a dark terminal. Exported so a consumer can keep one static shell
 * while swapping the lines inside it (the homepage install tabs).
 */
export const terminalShellClassName =
	"not-prose rounded-xl bg-mp-ink px-5 py-4 text-mp-ground [.dark_&]:border [.dark_&]:border-mp-ink/15 [.dark_&]:bg-mp-surface [.dark_&]:text-mp-ink";

/** The ink block without its lines; wraps `TerminalLines` or any children. */
export function TerminalShell({
	children,
	className,
}: { children: ReactNode; className?: string }) {
	return (
		<div className={[terminalShellClassName, className].filter(Boolean).join(" ")}>{children}</div>
	);
}

/** The prompt line (chevron, command, copy button) and the optional note, with no block. */
export function TerminalLines({ command, note }: { command: string; note?: string }) {
	return (
		<>
			<div className="flex items-center gap-3">
				<span
					aria-hidden="true"
					className="select-none text-mp-accent-soft [.dark_&]:text-mp-accent"
				>
					❯
				</span>
				<code className="min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap sm:text-base">
					{command}
				</code>
				<CopyButton text={command} />
			</div>
			{note ? <p className="mt-2 pl-6 text-xs opacity-70">{note}</p> : null}
		</>
	);
}

/** Ink command block: the shell with one command and an optional note. */
export function Terminal({ command, note, className }: TerminalProps) {
	return (
		<TerminalShell className={className}>
			<TerminalLines command={command} note={note} />
		</TerminalShell>
	);
}
