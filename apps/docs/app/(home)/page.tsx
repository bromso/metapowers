import Link from "next/link";
import {
	Palette,
	Search,
	Megaphone,
	Sparkles,
	Kanban,
	Scale,
	GraduationCap,
	Crown,
	Eye,
	Code,
	Terminal,
	FolderOpen,
	Zap,
	ArrowRight,
	Shield,
	ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
		</svg>
	);
}

interface Domain {
	name: string;
	icon: LucideIcon;
	methodology: string;
	skills: number;
	description: string;
	href: string;
}

const domains: Domain[] = [
	{
		name: "Design",
		icon: Palette,
		methodology: "Design Thinking",
		skills: 9,
		description:
			"Five-phase design thinking process for component design, writing to Figma canvas via MCP.",
		href: "/docs/design",
	},
	{
		name: "Research",
		icon: Search,
		methodology: "Double Diamond",
		skills: 4,
		description:
			"Structured discovery and validation through divergent and convergent thinking.",
		href: "/docs/research",
	},
	{
		name: "Development",
		icon: Code,
		methodology: "Dev Workflow",
		skills: 6,
		description:
			"Plan, build, test, debug, review, and ship with structured development workflows.",
		href: "/docs/development",
	},
	{
		name: "Accessibility",
		icon: Eye,
		methodology: "WCAG-EM",
		skills: 6,
		description:
			"WCAG 2.1 audit methodology — scope, evaluate, report, remediate, and retest.",
		href: "/docs/accessibility",
	},
	{
		name: "Marketing",
		icon: Megaphone,
		methodology: "RACE Framework",
		skills: 37,
		description:
			"Full growth marketing lifecycle — strategy, reach, act, convert, and engage.",
		href: "/docs/marketing",
	},
	{
		name: "Branding",
		icon: Sparkles,
		methodology: "Brand Lifecycle",
		skills: 6,
		description:
			"Brand creation from discovery to guidelines — verbal identity, visual system, and assets.",
		href: "/docs/branding",
	},
	{
		name: "Project Management",
		icon: Kanban,
		methodology: "Scrum",
		skills: 32,
		description:
			"Sprint-based project management — initiate, plan, sprint, review, and improve.",
		href: "/docs/project-management",
	},
	{
		name: "Legal",
		icon: Scale,
		methodology: "Legal Lifecycle",
		skills: 35,
		description:
			"Full legal operations — assess, draft, review, comply, and govern.",
		href: "/docs/legal",
	},
	{
		name: "Coaching",
		icon: GraduationCap,
		methodology: "Domain Coaching",
		skills: 5,
		description:
			"Expert feedback across UX, code, copy, accessibility, and strategy disciplines.",
		href: "/docs/coaching",
	},
	{
		name: "Leadership",
		icon: Crown,
		methodology: "Leadership Dev",
		skills: 12,
		description:
			"Build and lead teams — assess, vision, build, develop, sustain, plus day-to-day tools.",
		href: "/docs/leadership",
	},
	{
		name: "Security",
		icon: Shield,
		methodology: "NIST CSF 2.0",
		skills: 39,
		description:
			"Full cybersecurity lifecycle — govern, identify, protect, detect, respond, and recover.",
		href: "/docs/security",
	},
	{
		name: "Compliance",
		icon: ClipboardCheck,
		methodology: "GRC Lifecycle",
		skills: 48,
		description:
			"Master compliance assessment across 30+ regulations — SOC 2, GDPR, HIPAA, PCI DSS, and more.",
		href: "/docs/compliance",
	},
];

const stats = [
	{ value: "12", label: "Domains" },
	{ value: "239+", label: "Skills" },
	{ value: "12", label: "Methodologies" },
	{ value: "MIT", label: "Licensed" },
];

const steps = [
	{
		number: "01",
		title: "Install",
		command: "claude install bromso/metapowers",
		description: "Add all domains to Claude Code in one command.",
	},
	{
		number: "02",
		title: "Run a skill",
		command: "/design:empathize DatePicker",
		description: "Each skill guides you through a proven methodology.",
	},
	{
		number: "03",
		title: "Get artifacts",
		command: ".metapowers/design/DatePicker/",
		description: "Structured outputs accumulate across phases.",
	},
];

function DomainCard({ domain }: { domain: Domain }) {
	const Icon = domain.icon;
	return (
		<Link
			href={domain.href}
			className="group relative flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 transition-all duration-200 hover:border-fd-primary/30 hover:shadow-lg hover:shadow-fd-primary/5"
		>
			<div className="mb-4 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fd-primary/10">
					<Icon className="h-5 w-5 text-fd-primary" />
				</div>
				<div>
					<h3 className="font-semibold text-fd-foreground">{domain.name}</h3>
					<p className="text-xs text-fd-muted-foreground">
						{domain.methodology}
					</p>
				</div>
			</div>
			<p className="mb-4 flex-1 text-sm leading-relaxed text-fd-muted-foreground">
				{domain.description}
			</p>
			<div className="flex items-center justify-between">
				<span className="rounded-md bg-fd-secondary px-2.5 py-1 text-xs font-medium text-fd-secondary-foreground">
					{domain.skills} skills
				</span>
				<ArrowRight className="h-4 w-4 text-fd-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-fd-primary" />
			</div>
		</Link>
	);
}

export default function HomePage() {
	return (
		<main className="flex flex-col">
			{/* Hero */}
			<section className="flex flex-col items-center px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-secondary/50 px-4 py-1.5 text-sm text-fd-muted-foreground">
					<Zap className="h-3.5 w-3.5" />
					<span>Claude Code plugins for structured workflows</span>
				</div>
				<h1 className="mb-6 max-w-3xl text-5xl font-bold tracking-tight text-fd-foreground md:text-6xl lg:text-7xl">
					Metapowers
				</h1>
				<p className="mb-10 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground md:text-xl">
					Structured workflows for every discipline — from design to legal.
					Claude Code plugins powered by proven methodologies.
				</p>
				<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
					<Link
						href="/docs/overview"
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-8 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
					>
						Get Started
						<ArrowRight className="h-4 w-4" />
					</Link>
					<a
						href="https://github.com/bromso/metapowers"
						className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border px-8 py-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GitHubIcon className="h-4 w-4" />
						GitHub
					</a>
				</div>
			</section>

			{/* Stats */}
			<section className="border-y border-fd-border bg-fd-card/50">
				<div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-fd-border md:grid-cols-4">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="flex flex-col items-center gap-1 px-6 py-8"
						>
							<span className="text-2xl font-bold text-fd-foreground md:text-3xl">
								{stat.value}
							</span>
							<span className="text-sm text-fd-muted-foreground">
								{stat.label}
							</span>
						</div>
					))}
				</div>
			</section>

			{/* Domain Cards */}
			<section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
				<div className="mb-12 text-center">
					<h2 className="mb-3 text-3xl font-bold text-fd-foreground md:text-4xl">
						Every discipline, one toolkit
					</h2>
					<p className="mx-auto max-w-2xl text-fd-muted-foreground">
						Each domain implements an industry-standard methodology as a set of
						slash commands. Run a skill, follow the process, get structured
						artifacts.
					</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{domains.map((domain) => (
						<DomainCard key={domain.name} domain={domain} />
					))}
				</div>
			</section>

			{/* How It Works */}
			<section className="border-y border-fd-border bg-fd-card/50">
				<div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
					<div className="mb-12 text-center">
						<h2 className="mb-3 text-3xl font-bold text-fd-foreground md:text-4xl">
							How it works
						</h2>
						<p className="mx-auto max-w-xl text-fd-muted-foreground">
							Install once, use everywhere. Each skill guides you through a
							proven methodology step by step.
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-3">
						{steps.map((step) => (
							<div key={step.number} className="flex flex-col">
								<div className="mb-4 flex items-center gap-3">
									<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fd-primary/10 text-sm font-bold text-fd-primary">
										{step.number}
									</span>
									<h3 className="font-semibold text-fd-foreground">
										{step.title}
									</h3>
								</div>
								<div className="mb-3 rounded-lg border border-fd-border bg-fd-background p-4">
									<div className="flex items-center gap-2 text-xs text-fd-muted-foreground">
										{step.number === "03" ? (
											<FolderOpen className="h-3.5 w-3.5" />
										) : (
											<Terminal className="h-3.5 w-3.5" />
										)}
										<span>
											{step.number === "03" ? "output" : "terminal"}
										</span>
									</div>
									<code className="mt-2 block text-sm text-fd-foreground">
										{step.number !== "03" && (
											<span className="text-fd-muted-foreground">$ </span>
										)}
										{step.command}
									</code>
								</div>
								<p className="text-sm text-fd-muted-foreground">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center text-sm text-fd-muted-foreground sm:flex-row sm:justify-between sm:text-left">
				<p>
					Built by{" "}
					<a
						href="https://github.com/bromso"
						className="font-medium text-fd-foreground hover:text-fd-primary"
						target="_blank"
						rel="noopener noreferrer"
					>
						Jonas Broms
					</a>
				</p>
				<div className="flex items-center gap-4">
					<span>MIT License</span>
					<a
						href="https://github.com/bromso/metapowers"
						className="inline-flex items-center gap-1.5 font-medium text-fd-foreground hover:text-fd-primary"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GitHubIcon className="h-4 w-4" />
						Source
					</a>
				</div>
			</footer>
		</main>
	);
}
