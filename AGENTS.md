# Metapowers

Structured, repeatable workflows for digital production domains. This project provides skills that guide you through proven methodologies across 10 domains.

## Available Domains & Skills

### Design (`/design:*`)
Five-phase design thinking process for component design.
- `/design:empathize <component>` — Research user needs and existing patterns
- `/design:define <component>` — Create component contract with specs
- `/design:ideate <component>` — Explore multiple design approaches
- `/design:prototype <component>` — Build the component in Figma via MCP
- `/design:test <component>` — Validate against WCAG and component contract

### Research (`/research:*`)
Four-phase Double Diamond methodology for structured discovery.
- `/research:discover <topic>` — Broad research and data gathering
- `/research:define <topic>` — Synthesize into problem statement
- `/research:design <topic>` — Generate and evaluate solutions
- `/research:deliver <topic>` — Validate and produce recommendations

### Development (`/development:*`)
Process-oriented software development workflow.
- `/development:plan <feature>` — Break feature into implementation tasks
- `/development:build <feature>` — Execute plan with TDD discipline
- `/development:test <feature>` — Write tests and validate coverage
- `/development:debug <issue>` — Systematic root cause investigation
- `/development:review <feature>` — Pre-merge code review
- `/development:ship <feature>` — Finish branch (merge/PR/cleanup)

### Marketing (`/marketing:*`)
RACE Framework marketing process.
- Strategy phase: customer-research, competitor-profiling, pricing-strategy, product-marketing-context, launch-strategy
- Reach phase: content-strategy, seo-audit, programmatic-seo, ai-seo, social-content, site-architecture, directory-submissions, competitor-alternatives
- Act, Convert, Engage phases with additional skills

### Branding (`/branding:*`)
Five-phase brand creation with compliance auditing.
- `/branding:discover <brand>` — Research market and audience
- `/branding:strategy <brand>` — Define positioning and values
- `/branding:verbal <brand>` — Develop voice, tone, messaging
- `/branding:visual <brand>` — Define colors, typography, logo usage
- `/branding:guidelines <brand>` — Package into brand manual
- `/branding:audit <content>` — Score brand compliance (Kapferer Brand Prism)

### Accessibility (`/accessibility:*`)
WCAG-EM accessibility audit workflow.
- `/accessibility:scope <target>` — Define audit scope and WCAG level
- `/accessibility:evaluate <target>` — Run automated and manual checks
- `/accessibility:report <target>` — Generate findings report
- `/accessibility:remediate <target>` — Fix issues with guided changes
- `/accessibility:retest <target>` — Verify fixes, conformance statement
- `/accessibility:checklist <target>` — Quick WCAG AA checklist

### Project Management (`/pm:*`)
Scrum-based project management.
- Initiate, Plan, Sprint, Review, Improve phases with 32 skills

### Coaching (`/coaching:*`)
Domain-specific mentorship and feedback.
- `/coaching:ux <target>` — UX/UI expert feedback (UX laws, hierarchy, readability)
- `/coaching:code <target>` — Senior engineer feedback (SOLID, security, performance)
- `/coaching:copy <target>` — Content strategist feedback (readability, tone, brand)
- `/coaching:a11y <target>` — Accessibility specialist feedback (WCAG, inclusive design)
- `/coaching:strategy <target>` — Business strategist feedback (positioning, growth)

### Leadership (`/leadership:*`)
Leadership development and day-to-day management tools.
- Phases: assess, vision, build, develop, sustain
- Tools: one-on-one, feedback, decision, delegate, conflict, okrs, retro

### Legal (`/legal:*`)
Legal lifecycle framework.
- Phases: assess, draft, review, comply, govern with 35 skills

### Meta (`/metapowers:*`)
Cross-domain orchestration.
- `/metapowers:status` — View all active projects across domains
- `/metapowers:init` — Initialize .metapowers/ directory
- `/metapowers:report` — Generate cross-domain summary report

## Artifact Storage

All artifacts are stored under `.metapowers/<domain>/<project>/` with numbered phase files (01-, 02-, etc.).

## Skills

Skills are located in `plugins/<domain>/skills/<skill-name>/SKILL.md`. Each skill uses YAML frontmatter with `description` field and contains structured markdown instructions.
