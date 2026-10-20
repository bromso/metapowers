# Metapowers Domain Registry

All available domains and their artifact paths under `.metapowers/`.

| Domain | Artifact Path | Phase Files | Methodology |
|--------|--------------|-------------|-------------|
| Design | `.metapowers/design/<component>/` | 01-empathize through 05-test | Design Thinking |
| Research | `.metapowers/research/<topic>/` | 01-discover through 04-deliver | Double Diamond |
| Development | `.metapowers/development/<feature>/` | 01-plan through 04-review | Plan-Build-Test-Ship |
| Marketing | `.metapowers/marketing/<campaign>/` | 00-strategy through 04-engage | RACE Framework |
| Branding | `.metapowers/branding/<brand>/` | 01-discover through 05-guidelines | Brand Identity Process |
| Accessibility | `.metapowers/accessibility/<target>/` | 01-scope through 05-retest | WCAG-EM |
| Project Management | `.metapowers/project-management/<project>/` | 00-initiate through 04-improve | Scrum |
| Coaching | `.metapowers/coaching/<subject>/` | *-review.md (utility) | Domain Mentorship |
| Leadership | `.metapowers/leadership/<team>/` | 01-assess through 05-sustain | Leadership Development |
| Legal | `.metapowers/legal/<matter>/` | 00-assess through 04-govern | Legal Lifecycle |
| Security | `.metapowers/security/<program>/` | 00-govern through 05-recover | NIST CSF |
| Compliance | `.metapowers/compliance/<program>/` | 00-scope, 01-assess/<regulation>.md, 02-remediate through 04-monitor | GRC Lifecycle |
| Bookkeeping | `.metapowers/bookkeeping/<period>/` | 01-record through 04-report | Bookkeeping Cycle |
| Accounting | `.metapowers/accounting/<period>/` | 01-analyze through 08-close | Accounting Cycle |
| Finance | `.metapowers/finance/<plan>/` | 01-assess through 06-review | FP&A |

## Phase Completion Detection

A phase is complete when its numbered artifact file exists:
- `01-*.md` present = Phase 1 complete
- `02-*.md` present = Phase 2 complete
- etc.
- Compliance phase 1 is complete when any file exists under `01-assess/`.

## Cross-Domain References

Skills can read artifacts from any domain by navigating `.metapowers/<domain>/<project>/`.
