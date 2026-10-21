import type { ElementType, ReactNode } from "react";

export interface EyebrowProps {
	children: ReactNode;
	/** Element to render; defaults to `p`. */
	as?: ElementType;
	className?: string;
}

export function Eyebrow({ children, as: Tag = "p", className }: EyebrowProps) {
	return <Tag className={["mp-eyebrow", className].filter(Boolean).join(" ")}>{children}</Tag>;
}
