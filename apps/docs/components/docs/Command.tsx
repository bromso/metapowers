import { Terminal } from "@/components/ui/Terminal";
import { type ReactNode, isValidElement } from "react";

export interface CommandProps {
	/** The command text, as plain MDX text. */
	children?: ReactNode;
	/** Accepted alongside `children` for robustness when authored as a prop instead. */
	command?: string;
	note?: string;
	className?: string;
}

/**
 * A bare line of MDX text passed as a block-level child gets wrapped in a `<p>` by the
 * markdown parser, so recurse into element children too, not just strings/arrays.
 */
function toText(node: ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(toText).join("");
	if (isValidElement<{ children?: ReactNode }>(node)) return toText(node.props.children);
	return "";
}

/** Thin MDX wrapper: renders the skill's invocation command through `Terminal`. */
export function Command({ children, command, note, className }: CommandProps) {
	const text = (command ?? toText(children)).trim();
	return <Terminal command={text} note={note} className={className} />;
}
