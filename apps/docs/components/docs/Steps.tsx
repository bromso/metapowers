import { Children, type ReactElement, type ReactNode, cloneElement, isValidElement } from "react";

export interface StepProps {
	title?: string;
	children?: ReactNode;
	/** Injected by `Steps` based on position; falls back to "01" when used standalone. */
	numeral?: string;
}

/** One numbered card. Used directly inside `Steps`, which supplies `numeral`. */
export function Step({ title, children, numeral = "01" }: StepProps) {
	return (
		<div className="not-prose flex h-full flex-col gap-3 rounded-2xl border border-mp-ink/10 bg-mp-surface p-5 sm:p-6">
			<span aria-hidden="true" className="mp-display text-3xl text-mp-accent sm:text-4xl">
				{numeral}
			</span>
			{title ? <p className="font-medium text-mp-ink">{title}</p> : null}
			<div className="text-sm leading-relaxed text-mp-muted [&>p]:m-0">{children}</div>
		</div>
	);
}

export interface StepsProps {
	children?: ReactNode;
}

function pad(n: number): string {
	return String(n).padStart(2, "0");
}

function isElementOfType(
	node: unknown,
	type: string,
): node is ReactElement<{ children?: ReactNode }> {
	return isValidElement(node) && node.type === type;
}

/**
 * `Steps` accepts either explicit `<Step>` children (each keeps its own `title`) or a plain
 * MDX ordered list (`1. …`), which compiles to a single `<ol>` child — in that case each `<li>`
 * becomes a titleless `Step` body.
 */
function toStepElements(children: ReactNode): ReactElement<StepProps>[] {
	const nodes = Children.toArray(children).filter(isValidElement);
	if (nodes.length === 1 && isElementOfType(nodes[0], "ol")) {
		const items = Children.toArray(nodes[0].props.children).filter(isValidElement);
		return items.map((li, index) => (
			<Step key={li.key ?? index}>{(li.props as { children?: ReactNode }).children}</Step>
		));
	}
	return nodes as ReactElement<StepProps>[];
}

export function Steps({ children }: StepsProps) {
	const steps = toStepElements(children);
	return (
		<ol className="not-prose my-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
			{steps.map((step, index) => (
				<li key={step.key ?? index}>{cloneElement(step, { numeral: pad(index + 1) })}</li>
			))}
		</ol>
	);
}
