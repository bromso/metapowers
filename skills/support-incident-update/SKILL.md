---
name: support-incident-update
description: Draft customer-facing updates for an outage or degradation — the first notice, updates at a stated cadence, the resolution notice and a follow-up — for a status page, email and in-app banner. Use when the product is down or degraded and the user must tell customers what is happening. Not for security incidents; see /security-incident-communication.
metadata:
  argument-hint: "<what is happening> [project]"
---

# Incident update

Draft the customer updates for the outage or degradation described in "$ARGUMENTS". Every update says what is known, what is not, and when the next update comes.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Take a token that names a folder in `.singularskills/support/` as `<project>`; with none and exactly one folder there, use it; with several, ask which; with none at all, ask for a project name.

Read `.singularskills/support/<project>/04-macros.md` for the voice and the `## Policies` section and `.singularskills/support/<project>/06-service-levels.md` for any published promises, if they exist.

Append this line to `.singularskills/log.jsonl` before you write the updates (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"support-incident-update","workflow":"support","phase":null,"project":"<project>","event":"started","artifact":"incidents/<date>-<slug>.md","note":""}`, where `<date>` is today as `YYYY-MM-DD` and `<slug>` is two to four words naming the incident, never a customer.

## Process

1. **Check it is not a security incident.** If what is happening involves unauthorised access, exposed data or a breach, stop and point the user to `/security-incident-communication`.

2. **Gather the facts** from the user: what customers see, which customers and regions are affected, when it started, what is known about the cause, whether there is a workaround, and who approves customer messages. Ask once, together; write `<unknown>` for anything not answered and never guess a cause or a time to fix.

3. **Set the cadence:** how often updates go out until resolution (suggest every 30 minutes for a full outage, every 60 for a degradation), and say it in every update.

4. **Draft the first notice** for each channel: status page (headline and body), email, and in-app banner (one sentence). State what customers see, who is affected, any workaround, that the team is working on it, and the time of the next update. No cause unless the user confirmed it; no time to fix unless the user gave one.

5. **Draft an update template** for the updates in between: what changed since the last one, what is still unknown, the next update's time.

6. **Draft the resolution notice and the follow-up:** what happened in plain words as far as the user confirms it, when it was fixed, what the team will do to prevent it, and any compensation only if the `## Policies` section of `04-macros.md` allows it; otherwise none is mentioned. Apply `references/service-recovery.md`.

7. **Write the updates** to `.singularskills/support/<project>/incidents/<date>-<slug>.md` with sections **Facts** (what is known, with every `<unknown>`), **Cadence**, **First notice**, **Update template**, **Resolution notice** and **Follow-up**.

## Output

The updates written to `.singularskills/support/<project>/incidents/<date>-<slug>.md`. Present the first notice for the status page in chat, ready to post, and list every `<unknown>` the user must fill or confirm before posting.

After you have written the updates, append the `started` line of Prerequisites to `.singularskills/log.jsonl` with `"event":"finished"`: `{"ts":"<ISO timestamp>","skill":"support-incident-update","workflow":"support","phase":null,"project":"<project>","event":"finished","artifact":"incidents/<date>-<slug>.md","note":""}`.

The updates open with this frontmatter (`agent` is the agent you run in, or `unknown`; this utility has no gate, so `phase` is `null` and `gate` is `none`):

```yaml
---
skill: support-incident-update
workflow: support
phase: null
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

The updates end with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what a reviewer must settle before posting>
```
