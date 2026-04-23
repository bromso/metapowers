# Legal Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a 35-skill legal plugin implementing the Legal Lifecycle Framework, plus documentation in apps/docs.

**Architecture:** Claude Code plugin following the metapowers pattern — SKILL.md files with YAML frontmatter, shared templates, hooks for phase gating, MCP config for DocuSign/CLM. Documentation as MDX pages in Fumadocs.

**Tech Stack:** Markdown (SKILL.md), Bash (hooks), JSON (manifests), MDX (docs)

---

### Task 1: Plugin scaffold — manifest, hooks, MCP config

**Files:**
- Create: `plugins/legal/.claude-plugin/plugin.json`
- Create: `plugins/legal/.mcp.json`
- Create: `plugins/legal/hooks/hooks.json`
- Create: `plugins/legal/hooks/check-assess-exists.sh`
- Modify: `.claude-plugin/marketplace.json`

**Step 1: Create directories**

```bash
mkdir -p plugins/legal/.claude-plugin plugins/legal/hooks plugins/legal/shared plugins/legal/skills plugins/legal/commands plugins/legal/agents
```

**Step 2: Create plugin.json**

Write `plugins/legal/.claude-plugin/plugin.json`:
```json
{
  "name": "legal",
  "version": "0.1.0",
  "description": "Legal Lifecycle Framework — assess, draft, review, comply, govern with 35 skills",
  "author": {
    "name": "Jonas Broms"
  },
  "repository": "https://github.com/bromso/metapowers",
  "license": "MIT",
  "skills": "../skills/",
  "commands": "../commands/",
  "agents": "../agents/",
  "hooks": "../hooks/hooks.json",
  "mcpServers": "../.mcp.json"
}
```

**Step 3: Create .mcp.json**

Write `plugins/legal/.mcp.json`:
```json
{
  "mcpServers": {
    "metapowers-legal": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/../../packages/legal-mcp/dist/index.js"],
      "env": {
        "DOCUSIGN_API_KEY": "${DOCUSIGN_API_KEY}"
      }
    }
  }
}
```

**Step 4: Create hooks.json**

Write `plugins/legal/hooks/hooks.json`:
```json
{
  "hooks": {}
}
```

**Step 5: Create check-assess-exists.sh**

Write `plugins/legal/hooks/check-assess-exists.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

if [[ "${LEGAL_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

TOPIC_DIR=$(find .legal -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .legal/ directory found. Run /legal:legal-audit first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
ASSESS_FILE=".legal/${TOPIC}/00-assess.md"

if [[ ! -f "$ASSESS_FILE" ]]; then
  echo "BLOCKED: ${ASSESS_FILE} not found." >&2
  echo "" >&2
  echo "The Assess phase must be completed before running this skill." >&2
  echo "Run an Assess skill first (e.g., /legal:legal-audit ${TOPIC})" >&2
  echo "" >&2
  echo "To bypass: export LEGAL_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
```

Make executable: `chmod +x plugins/legal/hooks/check-assess-exists.sh`

**Step 6: Register in marketplace.json**

Add to the `plugins` array in `.claude-plugin/marketplace.json`:
```json
{
  "name": "legal",
  "source": "./plugins/legal",
  "description": "Legal Lifecycle Framework — assess, draft, review, comply, govern with 35 skills",
  "version": "0.1.0",
  "keywords": ["legal", "compliance", "contracts", "gdpr", "privacy", "legal-ops"],
  "category": "legal"
}
```

**Step 7: Commit**

```bash
git add plugins/legal/ .claude-plugin/marketplace.json
git commit -m "feat(legal): scaffold plugin with manifest, hooks, and MCP config"
```

---

### Task 2: Shared templates

**Files:**
- Create: `plugins/legal/shared/legal-lifecycle-guide.md`
- Create: `plugins/legal/shared/contract-template.md`
- Create: `plugins/legal/shared/compliance-checklist.md`
- Create: `plugins/legal/shared/risk-matrix-template.md`

**Content summaries:**

1. **legal-lifecycle-guide.md** — Legal Lifecycle Framework reference: 5 phases (Assess, Draft, Review, Comply, Govern) with purpose, key activities, deliverables, and how phases connect. Include disclaimer that AI-generated legal content requires attorney review.

2. **contract-template.md** — Standard contract structure: Recitals, Definitions, Scope of Services/Grant of Rights, Term and Termination (with cause/convenience/expiry), Payment Terms, Representations and Warranties, Indemnification, Limitation of Liability, Confidentiality, Intellectual Property, Governing Law and Dispute Resolution, General Provisions (force majeure, assignment, notices, severability, entire agreement, amendments, waiver).

3. **compliance-checklist.md** — Cross-regulation checklist with sections for: GDPR (lawful basis, consent, data mapping, DPIA, DPO, breach notification, cross-border transfers, data subject rights), CCPA/CPRA (notice at collection, opt-out, deletion, non-discrimination, service provider agreements), SOC 2 (security, availability, processing integrity, confidentiality, privacy), ADA/EAA (WCAG compliance, alternative formats, reasonable accommodation).

4. **risk-matrix-template.md** — Legal risk scoring: likelihood (1-5) x impact (1-5) = risk score, with jurisdiction modifier (1.0-1.5x), risk categories (regulatory, contractual, IP, employment, data privacy, litigation), mitigation strategies (avoid, transfer, mitigate, accept), risk register table.

**Commit:** `git commit -m "feat(legal): add shared templates — lifecycle guide, contract, compliance, risk matrix"`

---

### Task 3: Phase 0 — Assess skills (5 skills)

All Assess skills have NO prerequisites (Phase 0). Write to `.legal/$ARGUMENTS/00-assess.md`.

1. **legal-audit** — Audit current legal posture. Identify existing policies/contracts/compliance measures, gap analysis against industry standards, categorize gaps by severity and urgency, prioritize remediation.
2. **risk-assessment** — Legal risk identification and scoring. Brainstorm risks by category (regulatory, contractual, IP, employment, data, litigation), score likelihood x impact with jurisdiction modifier, plot on risk matrix, define mitigation for top risks.
3. **regulatory-map** — Map applicable regulations. Identify where the business operates (jurisdictions), what data it processes, what industry regulations apply, create regulation matrix (regulation x requirement x current status).
4. **jurisdiction-analysis** — Multi-jurisdiction analysis. Compare legal requirements across jurisdictions, identify conflicts, determine which jurisdiction's laws prevail, map registration/filing requirements.
5. **stakeholder-needs** — Legal needs per business unit. Interview/research each team's legal needs, map to contract types needed, compliance requirements, IP considerations, create legal service catalog.

**Commit:** `git commit -m "feat(legal): add Phase 0 Assess skills (5 skills)"`

---

### Task 4: Phase 1 — Draft skills (8 skills)

All Draft skills check for `.legal/$ARGUMENTS/00-assess.md` prerequisite, support `--skip-checks`, write to `.legal/$ARGUMENTS/01-draft.md`.

1. **terms-of-service** — Draft ToS for digital products. Read contract template, cover: acceptance, user rights, prohibited uses, intellectual property, disclaimers, limitation of liability, termination, governing law, dispute resolution, modifications. Reference jurisdiction requirements.
2. **privacy-policy** — Draft privacy policy. Cover: data controller identity, data collected (categories), purposes and legal basis, data sharing/third parties, retention periods, user rights (access, rectification, erasure, portability), cookie usage, international transfers, children's privacy, contact info. GDPR Article 13/14 compliant.
3. **nda** — Generate NDA. Type selection (mutual/one-way), define confidential information, exclusions, permitted disclosures, term and survival, return/destruction of information, remedies, governing law.
4. **saas-agreement** — Draft SaaS agreement. Cover: license grant, SLA and uptime, data processing, security obligations, payment and billing, auto-renewal, termination and data export, limitation of liability, IP ownership.
5. **employment-agreement** — Draft employment/contractor agreement. Cover: role and responsibilities, compensation and benefits, IP assignment, non-compete/non-solicitation, confidentiality, termination provisions, governing law. Flag employee vs. contractor classification.
6. **vendor-agreement** — Draft vendor agreement. Cover: scope of services, performance standards/SLAs, pricing and payment, confidentiality, data protection, indemnification, insurance requirements, termination, transition assistance.
7. **open-source-policy** — Create open-source policy. Cover: approved license categories (permissive, weak copyleft, strong copyleft), approval process for new dependencies, contribution policy (CLA requirements), compliance procedures, license compatibility matrix.
8. **cookie-policy** — Draft cookie policy. Cover: what cookies are used and why, categories (strictly necessary, functional, analytics, marketing), consent mechanism, how to manage/delete cookies, third-party cookies, policy updates. Include banner implementation guide.

**Commit:** `git commit -m "feat(legal): add Phase 1 Draft skills (8 skills)"`

---

### Task 5: Phase 2 — Review skills (6 skills)

All Review skills check for `.legal/$ARGUMENTS/00-assess.md` prerequisite, write to `.legal/$ARGUMENTS/02-review.md`.

1. **contract-review** — Review contract for risks. Read the contract, check each section against best practices, identify missing standard clauses, flag unfavorable terms, score overall risk (low/medium/high), provide section-by-section commentary.
2. **clause-analysis** — Deep-dive on specific clauses. Analyze the clause's legal effect, compare to market standard, identify hidden obligations, score risk (1-5), suggest alternative language, flag enforceability concerns.
3. **red-flag-detection** — Scan for high-risk terms. Check for: unlimited liability, broad indemnification, unilateral amendment rights, auto-renewal traps, non-compete overreach, IP assignment beyond scope, one-sided termination, audit rights, data ownership ambiguity. RAG score each.
4. **negotiation-prep** — Prepare negotiation strategy. Identify must-have vs. nice-to-have terms, define walk-away points, prepare fallback positions for each contentious clause, anticipate counterarguments, draft redline suggestions.
5. **ip-review** — Review IP provisions. Analyze IP ownership clauses, work-for-hire vs. assignment, license grants and scope, background IP protection, moral rights, open-source implications, freedom to operate.
6. **compliance-review** — Review document for regulatory compliance. Check against GDPR, CCPA, SOC2, accessibility requirements. Identify non-compliant sections, suggest compliant alternatives, score compliance level.

**Commit:** `git commit -m "feat(legal): add Phase 2 Review skills (6 skills)"`

---

### Task 6: Phase 3 — Comply skills (7 skills)

All Comply skills check for `.legal/$ARGUMENTS/00-assess.md` prerequisite, write to `.legal/$ARGUMENTS/03-comply.md`.

1. **gdpr-compliance** — GDPR implementation. Data mapping (what data, where stored, who accesses, retention), lawful basis assessment per processing activity, DPIA for high-risk processing, data subject rights procedures, breach notification process, DPO appointment assessment, international transfer mechanisms.
2. **ccpa-compliance** — CCPA/CPRA implementation. Consumer rights procedures (know, delete, opt-out, correct, limit), notice at collection requirements, service provider agreements, financial incentive disclosures, do-not-sell/share mechanisms, data retention schedules.
3. **data-processing-agreement** — Draft DPA. Controller/processor roles, processing instructions, sub-processor management, security measures (Article 32), breach notification obligations, data subject rights assistance, audit rights, data return/deletion on termination, international transfer provisions.
4. **cookie-consent** — Cookie consent implementation. Cookie audit (list all cookies, purposes, providers), categorization (necessary, functional, analytics, marketing), consent banner design (opt-in vs. opt-out by jurisdiction), consent storage and proof, re-consent triggers, implementation checklist.
5. **accessibility-compliance** — Legal accessibility requirements. Identify applicable laws (ADA, EAA, Section 508, local laws), WCAG level required (A, AA, AAA), audit scope, remediation priorities, accessibility statement template, ongoing monitoring plan.
6. **soc2-prep** — SOC 2 preparation. Trust services criteria mapping (security, availability, processing integrity, confidentiality, privacy), policy gap analysis, control design, evidence collection plan, readiness assessment, auditor selection criteria, timeline.
7. **incident-response-plan** — Data breach response plan. Detection and identification procedures, severity classification, containment steps, notification requirements by jurisdiction (GDPR 72hrs, state breach laws), communication templates (regulators, affected individuals, media), post-incident review process.

**Commit:** `git commit -m "feat(legal): add Phase 3 Comply skills (7 skills)"`

---

### Task 7: Phase 4 — Govern skills (5 skills)

All Govern skills check for `.legal/$ARGUMENTS/00-assess.md` prerequisite, write to `.legal/$ARGUMENTS/04-govern.md`.

1. **contract-tracker** — Contract management setup. Create contract register (parties, type, value, start date, end date, renewal date, auto-renewal terms, notice period), set renewal/expiration alerts, track obligations and deliverables, identify contracts needing renegotiation.
2. **compliance-monitor** — Ongoing compliance monitoring. Define monitoring scope per regulation, set review cadence (quarterly GDPR review, annual SOC2 audit), create compliance dashboard metrics, assign compliance owners, define escalation procedures.
3. **regulatory-updates** — Regulatory change tracking. Use WebSearch to find recent/upcoming regulatory changes, assess impact on current compliance, prioritize required changes, create implementation timeline, assign owners.
4. **legal-playbook** — Standardized legal playbook. Create decision trees for recurring scenarios (contract negotiation, data breach, employee termination, IP dispute), define approval thresholds, pre-approved templates and fallback positions, escalation criteria.
5. **training-plan** — Legal compliance training. Identify training needs by role (all employees, engineering, sales, HR), design training modules (data protection, confidentiality, IP, anti-bribery), set training cadence, define completion tracking, create assessment questions.

**Commit:** `git commit -m "feat(legal): add Phase 4 Govern skills (5 skills)"`

---

### Task 8: Utility skills (4 skills)

Utility skills have NO prerequisites.

1. **legal-research** — Research a legal question. Define the question and jurisdiction, use WebSearch/WebFetch to find relevant statutes, case law, and expert commentary, synthesize findings with applicability analysis, note confidence level and when to consult an attorney. Writes to `.legal/$ARGUMENTS/legal-research.md`.
2. **clause-library** — Build/extend approved clause library. Organize by clause type (indemnification, limitation of liability, confidentiality, termination, IP, data protection), include standard version, aggressive version, and minimum acceptable version per clause, note jurisdiction applicability. Writes to `.legal/$ARGUMENTS/clause-library.md`.
3. **decision-memo** — Document legal decision. State the question, context and constraints, options considered with pros/cons, decision made and rationale, risk accepted, review conditions, approver. Writes to `.legal/$ARGUMENTS/decision-log.md` (append).
4. **legal-glossary** — Generate legal glossary for non-lawyers. Define terms in plain language, group by area (contract, privacy, IP, employment, compliance), include examples, note when a term has different meanings in different jurisdictions. Output directly to user.

**Commit:** `git commit -m "feat(legal): add utility skills (4 skills)"`

---

### Task 9: Documentation — legal overview and phase pages

**Files:**
- Create: `apps/docs/content/docs/legal/index.mdx`
- Create: `apps/docs/content/docs/legal/meta.json`
- Create: `apps/docs/content/docs/legal/assess.mdx`
- Create: `apps/docs/content/docs/legal/draft.mdx`
- Create: `apps/docs/content/docs/legal/review.mdx`
- Create: `apps/docs/content/docs/legal/comply.mdx`
- Create: `apps/docs/content/docs/legal/govern.mdx`
- Create: `apps/docs/content/docs/legal/utilities.mdx`

Follow the exact same documentation pattern as marketing and PM docs. Each page includes phase purpose, all skills with command block, description, and output line, plus "Next Phase" navigation.

**meta.json:**
```json
{
  "title": "Legal",
  "description": "Legal Lifecycle Framework",
  "icon": "Scale",
  "root": true,
  "pages": [
    "index",
    "---Phases---",
    "assess",
    "draft",
    "review",
    "comply",
    "govern",
    "---Other---",
    "utilities"
  ]
}
```

**Commit:** `git commit -m "feat(legal): add documentation pages for all phases and utilities"`

---

### Task 10: Final verification

**Step 1:** `find plugins/legal/skills -name "SKILL.md" | wc -l` → Expected: 35
**Step 2:** `ls plugins/legal/shared/` → Expected: 4 files
**Step 3:** `ls apps/docs/content/docs/legal/` → Expected: 8 files
**Step 4:** `test -x plugins/legal/hooks/check-assess-exists.sh`
**Step 5:** `grep legal .claude-plugin/marketplace.json`
