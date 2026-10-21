import Link from "next/link";
import type { ReactNode } from "react";

export interface RequiresMcpTool {
	name: string;
	description?: string;
}

export interface RequiresProps {
	mcp?: RequiresMcpTool[];
	config?: string[];
	skills?: string[];
}

/** Matches `/plugin:skill` references so `Skills` badges can link to their docs page. */
function parseSkillRef(ref: string): { plugin: string; skill: string } | null {
	const match = /^\/([^/:\s]+):([^/:\s]+)$/.exec(ref.trim());
	return match ? { plugin: match[1], skill: match[2] } : null;
}

function Badge({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span
			className={[
				"inline-flex items-center rounded-full border border-mp-ink/15 bg-mp-ground px-3 py-1.5 text-xs font-medium text-mp-ink [.dark_&]:bg-mp-ink/10",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
		</span>
	);
}

function Row({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
			<p className="mp-eyebrow w-28 shrink-0 pt-1.5 text-mp-muted">{label}</p>
			<div className="flex flex-1 flex-wrap items-start gap-2">{children}</div>
		</div>
	);
}

/** Badge rows for a skill's MCP tools, user config, and related skills. */
export function Requires({ mcp, config, skills }: RequiresProps) {
	if (!mcp?.length && !config?.length && !skills?.length) return null;
	return (
		<div className="not-prose my-6 flex flex-col gap-4 rounded-2xl border border-mp-ink/10 bg-mp-surface p-5 sm:p-6">
			{mcp?.length ? (
				<Row label="MCP tools">
					{mcp.map((tool) => (
						<Badge key={tool.name} className="flex-col items-start gap-0.5 py-1.5 text-left">
							<span className="font-mono">{tool.name}</span>
							{tool.description ? (
								<span className="font-normal text-[0.7rem] text-mp-muted">{tool.description}</span>
							) : null}
						</Badge>
					))}
				</Row>
			) : null}
			{config?.length ? (
				<Row label="User config">
					{config.map((item) => (
						<Badge key={item} className="font-mono">
							{item}
						</Badge>
					))}
				</Row>
			) : null}
			{skills?.length ? (
				<Row label="Skills">
					{skills.map((item) => {
						const ref = parseSkillRef(item);
						if (!ref) {
							return (
								<Badge key={item} className="font-mono">
									{item}
								</Badge>
							);
						}
						return (
							<Link
								key={item}
								href={`/docs/${ref.plugin}/${ref.skill}`}
								className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent"
							>
								<Badge className="font-mono transition hover:border-mp-accent/40 hover:text-mp-accent">
									{item}
								</Badge>
							</Link>
						);
					})}
				</Row>
			) : null}
		</div>
	);
}
