import { CopyButton } from "@/components/ui/CopyButton";

export interface TerminalProps {
	command: string;
	/** Optional muted line under the command. */
	note?: string;
	className?: string;
}

/**
 * Ink command block. In the dark theme `--mp-ink` is light, so the block switches to the
 * surface token to stay a dark terminal.
 */
export function Terminal({ command, note, className }: TerminalProps) {
	return (
		<div
			className={[
				"rounded-xl bg-mp-ink px-5 py-4 text-mp-ground [.dark_&]:border [.dark_&]:border-mp-ink/15 [.dark_&]:bg-mp-surface [.dark_&]:text-mp-ink",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
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
		</div>
	);
}
