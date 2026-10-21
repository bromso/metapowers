import {
	Calculator,
	ClipboardCheck,
	Code,
	Crown,
	Eye,
	GraduationCap,
	Kanban,
	LineChart,
	Megaphone,
	Palette,
	Receipt,
	Scale,
	Search,
	Shield,
	Sparkles,
	Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Domain = {
	slug: string;
	name: string;
	methodology: string;
	colour: string;
	icon: LucideIcon;
	blurb: string;
	docsPath: string;
};

export const domains: Domain[] = [
	{
		slug: "accessibility",
		name: "Accessibility",
		methodology: "WCAG-EM",
		colour: "sand",
		icon: Eye,
		blurb: "WCAG 2.1 audit methodology — scope, evaluate, report, remediate, and retest.",
		docsPath: "/docs/accessibility",
	},
	{
		slug: "accounting",
		name: "Accounting",
		methodology: "Accounting Cycle",
		colour: "coral",
		icon: Calculator,
		blurb:
			"Eight-phase accounting cycle — analyze, journal, ledger, trial balance, adjust, and close.",
		docsPath: "/docs/accounting",
	},
	{
		slug: "bookkeeping",
		name: "Bookkeeping",
		methodology: "Bookkeeping Cycle",
		colour: "amber",
		icon: Receipt,
		blurb: "Four-phase bookkeeping cycle — record, categorize, reconcile, and report.",
		docsPath: "/docs/bookkeeping",
	},
	{
		slug: "branding",
		name: "Branding",
		methodology: "Brand Lifecycle",
		colour: "sage",
		icon: Sparkles,
		blurb:
			"Brand creation from discovery to guidelines — verbal identity, visual system, and assets.",
		docsPath: "/docs/branding",
	},
	{
		slug: "coaching",
		name: "Coaching",
		methodology: "Domain Coaching",
		colour: "lilac",
		icon: GraduationCap,
		blurb: "Expert feedback across UX, code, copy, accessibility, and strategy disciplines.",
		docsPath: "/docs/coaching",
	},
	{
		slug: "compliance",
		name: "Compliance",
		methodology: "GRC Lifecycle",
		colour: "sky",
		icon: ClipboardCheck,
		blurb:
			"Master compliance assessment across 30+ regulations — SOC 2, GDPR, HIPAA, PCI DSS, and more.",
		docsPath: "/docs/compliance",
	},
	{
		slug: "design",
		name: "Design",
		methodology: "Design Thinking",
		colour: "sand",
		icon: Palette,
		blurb:
			"Five-phase design thinking process for component design, writing to Figma canvas via MCP.",
		docsPath: "/docs/design",
	},
	{
		slug: "development",
		name: "Development",
		methodology: "Dev Workflow",
		colour: "coral",
		icon: Code,
		blurb: "Plan, build, test, debug, review, and ship with structured development workflows.",
		docsPath: "/docs/development",
	},
	{
		slug: "finance",
		name: "Finance",
		methodology: "FP&A",
		colour: "amber",
		icon: LineChart,
		blurb: "Six-phase FP&A process — assess, plan, forecast, budget, model, and review.",
		docsPath: "/docs/finance",
	},
	{
		slug: "leadership",
		name: "Leadership",
		methodology: "Leadership Dev",
		colour: "sage",
		icon: Crown,
		blurb: "Build and lead teams — assess, vision, build, develop, sustain, plus day-to-day tools.",
		docsPath: "/docs/leadership",
	},
	{
		slug: "legal",
		name: "Legal",
		methodology: "Legal Lifecycle",
		colour: "lilac",
		icon: Scale,
		blurb: "Full legal operations — assess, draft, review, comply, and govern.",
		docsPath: "/docs/legal",
	},
	{
		slug: "marketing",
		name: "Marketing",
		methodology: "RACE Framework",
		colour: "sky",
		icon: Megaphone,
		blurb: "Full growth marketing lifecycle — strategy, reach, act, convert, and engage.",
		docsPath: "/docs/marketing",
	},
	{
		slug: "metapowers",
		name: "Metapowers",
		methodology: "Meta skills",
		colour: "sand",
		icon: Wand2,
		blurb: "Detect gaps, find, create and improve skills; init and report on any project.",
		docsPath: "/docs/overview",
	},
	{
		slug: "project-management",
		name: "Project Management",
		methodology: "Scrum",
		colour: "coral",
		icon: Kanban,
		blurb: "Sprint-based project management — initiate, plan, sprint, review, and improve.",
		docsPath: "/docs/project-management",
	},
	{
		slug: "research",
		name: "Research",
		methodology: "Double Diamond",
		colour: "amber",
		icon: Search,
		blurb: "Structured discovery and validation through divergent and convergent thinking.",
		docsPath: "/docs/research",
	},
	{
		slug: "security",
		name: "Security",
		methodology: "NIST CSF 2.0",
		colour: "sage",
		icon: Shield,
		blurb:
			"Full cybersecurity lifecycle — govern, identify, protect, detect, respond, and recover.",
		docsPath: "/docs/security",
	},
];
