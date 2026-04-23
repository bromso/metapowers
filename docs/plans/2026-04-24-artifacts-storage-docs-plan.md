# Artifacts & Storage Documentation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `storage.mdx` page to each of the 11 domain docs documenting artifact storage, under a "Memory" sidebar heading.

**Architecture:** Create 11 MDX files, update 11 meta.json files. Pure content — no code, no tests.

**Tech Stack:** MDX (Fumadocs), JSON (sidebar config)

---

### Task 1: Design, Research, Marketing storage pages + meta.json updates

Create `storage.mdx` and update `meta.json` for Design, Research, and Marketing.

**Design meta.json** — add Memory section before end:
```json
{
  "title": "Design",
  "description": "Design thinking methodology and tools",
  "icon": "Palette",
  "root": true,
  "pages": ["index", "---Phases---", "empathize", "define", "ideate", "prototype", "test", "---Memory---", "storage"]
}
```

**Research meta.json:**
```json
{
  "title": "Research",
  "description": "Double Diamond methodology",
  "icon": "Search",
  "root": true,
  "pages": ["index", "---Phases---", "discover", "define", "design", "deliver", "---Memory---", "storage"]
}
```

**Marketing meta.json:**
```json
{
  "title": "Marketing",
  "description": "RACE Framework marketing process",
  "icon": "Megaphone",
  "root": true,
  "pages": ["index", "---Phases---", "strategy", "reach", "act", "convert", "engage", "---Memory---", "storage", "---Other---", "utilities"]
}
```

**Design storage.mdx** content:
- Title: "Artifacts & Storage"
- Description: How Design stores artifacts
- Directory: `.metapowers/design/<component>/`
- Structure tree showing all 5 phase files + skip-log
- Artifacts stored: Component contracts (props, variants, slots, token references), WCAG audit results, Figma prototype references, design option evaluations, empathy research findings
- File format: All Markdown

**Research storage.mdx:**
- Directory: `.metapowers/research/<topic>/`
- Structure tree with 4 phase files
- Artifacts: Source bibliographies, stakeholder insight maps, problem statements, HMW questions, solution concept evaluations, validation evidence, feasibility analyses

**Marketing storage.mdx:**
- Directory: `.metapowers/marketing/<topic>/`
- Structure tree with 5 phase files + 4 utility files
- Artifacts: Buyer personas (demographics, JTBD, pain points), competitor profiles and positioning matrices, pricing analyses and tier structures, content calendars and pillar strategies, SEO audit results and keyword opportunities, email sequences with full copy, ad copy variants and creative briefs, campaign plans, analytics tracking plans (event taxonomies, attribution models), revenue operations (funnel stages, lead scoring)

**Commit:** `feat(docs): add storage pages for design, research, and marketing`

---

### Task 2: Branding, Project Management, Legal storage pages + meta.json updates

**Branding meta.json:**
```json
{
  "title": "Branding",
  "description": "Brand creation and compliance auditing",
  "icon": "Sparkles",
  "root": true,
  "pages": ["index", "---Phases---", "discover", "strategy", "verbal", "visual", "guidelines", "---Memory---", "storage", "---Utilities---", "audit"]
}
```

**Project Management meta.json:**
```json
{
  "title": "Project Management",
  "description": "Scrum-based project management",
  "icon": "Kanban",
  "root": true,
  "pages": ["index", "---Phases---", "initiate", "plan", "sprint", "review", "improve", "---Memory---", "storage", "---Other---", "utilities"]
}
```

**Legal meta.json:**
```json
{
  "title": "Legal",
  "description": "Legal Lifecycle Framework",
  "icon": "Scale",
  "root": true,
  "pages": ["index", "---Phases---", "assess", "draft", "review", "comply", "govern", "---Memory---", "storage", "---Other---", "utilities"]
}
```

**Branding storage.mdx:**
- Directory: `.metapowers/branding/<brand>/`
- Structure tree with 5 phase files + `assets/` subdirectories
- Artifacts: **Color palette** (primary, secondary, accent, neutral — hex, HSL, CSS custom properties), **Typography system** (font families, type scale, line heights, font weights), **Logo variations** (logomark, wordmark, brandmark, favicon, app icon, social avatar — with usage rules per variation), **Imagery** (photography style, illustration style, iconography guidelines), **Brand voice** (tone attributes, vocabulary, do/don't examples), **Brand elements** (patterns, textures, motion guidelines), **Brand guidelines document** (complete usage manual)
- Special: `assets/` subdirectory for binary brand files (`logo/`, `fonts/`, `imagery/`)

**Project Management storage.mdx:**
- Directory: `.project/<project>/`
- Structure tree with 5 phase files + 4 utility files
- Artifacts: Project charters (purpose, scope, objectives), stakeholder maps (power/interest grid), team composition and skills matrices, definition of done criteria, sprint backlogs with story breakdowns, user stories (As a/I want/So that + acceptance criteria), story maps (activities → tasks → stories), estimation data (story points, velocity), sprint metrics (velocity trends, burndown, cycle time), retrospective action items, risk registers (scored and mitigated), capacity plans, decision logs

**Legal storage.mdx:**
- Directory: `.metapowers/legal/<topic>/`
- Structure tree with 5 phase files + 4 utility files
- Artifacts: Legal audit findings (gap analysis, severity scoring), risk matrices (likelihood × impact × jurisdiction), regulatory maps (regulation × requirement × compliance status), contract drafts (ToS, privacy policies, NDAs, SaaS agreements, employment contracts, vendor agreements), contract review findings (section-by-section commentary, red flags), compliance assessments (GDPR, CCPA, SOC2 checklists), data processing agreements, incident response plans, clause libraries (standard/protective/minimum versions), legal decision memos

**Commit:** `feat(docs): add storage pages for branding, project-management, and legal`

---

### Task 3: Coaching, Leadership, Accessibility storage pages + meta.json updates

**Coaching meta.json:**
```json
{
  "title": "Coaching",
  "description": "Domain-specific mentorship and feedback",
  "icon": "GraduationCap",
  "root": true,
  "pages": ["index", "---Coaching Skills---", "ux", "code", "copy", "a11y", "strategy", "---Memory---", "storage"]
}
```

**Leadership meta.json:**
```json
{
  "title": "Leadership",
  "description": "Leadership development and team management",
  "icon": "Crown",
  "root": true,
  "pages": ["index", "---Phases---", "assess", "vision", "build", "develop", "sustain", "---Memory---", "storage", "---Day-to-Day Tools---", "one-on-one", "feedback", "decision", "delegate", "conflict", "okrs", "retro"]
}
```

**Accessibility meta.json:**
```json
{
  "title": "Accessibility",
  "description": "WCAG-EM accessibility audit workflow",
  "icon": "Eye",
  "root": true,
  "pages": ["index", "---Phases---", "scope", "evaluate", "report", "remediate", "retest", "---Memory---", "storage", "---Utilities---", "checklist"]
}
```

**Coaching storage.mdx:**
- Directory: `.metapowers/coaching/<subject>/`
- No sequential phases — each coaching skill writes its own file
- Artifacts: Scored reviews (1-10 scale per quality dimension), strengths analysis, issue lists with severity (critical/major/minor), actionable improvement suggestions with code/design examples, learning resource references (docs, articles, tools), review history over time

**Leadership storage.mdx:**
- Directory: `.metapowers/leadership/<team>/`
- Structure tree with 5 phase files + 6 utility files
- Artifacts: Leadership style assessments, team dynamics analysis, vision and purpose statements, culture definition, role/responsibility matrices (RACI), delegation frameworks, growth plans and skill development roadmaps, OKR definitions (objectives + key results + alignment), 1:1 preparation notes (per person over time), structured feedback records, decision analyses (options, stakeholders, trade-offs), conflict resolution records, retrospective notes and action items

**Accessibility storage.mdx:**
- Directory: `.metapowers/accessibility/<target>/`
- Structure tree with 5 phase files
- Artifacts: Audit scope definitions (pages, components, WCAG level targeted), WCAG issue inventories (issue, criterion, severity, location, affected users), conformance status per criterion (Pass/Fail/N/A), remediation logs (issue → fix → verification), code fix examples and ARIA patterns, conformance statements (for publication), test methodology records, ongoing monitoring plans

**Commit:** `feat(docs): add storage pages for coaching, leadership, and accessibility`

---

### Task 4: Development storage page + meta.json update

**Development meta.json:**
```json
{
  "title": "Development",
  "description": "Architecture, tooling, and developer resources",
  "icon": "Code",
  "root": true,
  "pages": ["index", "---Workflow---", "plan", "build", "test", "---Memory---", "storage", "---Utilities---", "debug", "review", "ship", "---Technical---", "...architecture", "...mcp-server"]
}
```

**Development storage.mdx:**
- Directory: `.metapowers/development/<feature>/`
- Structure tree with 3 phase files (plan, build, test) + utility outputs
- Artifacts: Implementation plans (task breakdowns, file lists, dependencies), build execution logs (commit references, progress tracking, decisions made during implementation), test coverage reports (test cases, test results, coverage metrics), code review findings (quality assessment, approval status, addressed feedback), debug session logs, deployment records

**Commit:** `feat(docs): add storage page for development`

---

### Task 5: Final verification

- `find apps/docs/content/docs -name "storage.mdx" | wc -l` → Expected: 11 (one per domain, but check if there might be 10 as development might not have had one planned)
- Verify each meta.json has `"---Memory---"` and `"storage"` in its pages array
- Commit design doc and plan

**Commit:** `docs: add artifacts storage design and plan docs`
