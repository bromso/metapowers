---
name: support-journey-map
description: Map where and why customers contact support — channels, the moments in the customer journey that trigger contact, contact reasons and current volumes — into a support map. Use when the user is setting up or reworking customer support and first needs to see who contacts them, when and about what. Not for researching buyers for marketing; see /marketing-customer-research.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: support
  phase: 1
  artifact: 01-map.md
---

# Map

Map how customers reach support for "$ARGUMENTS": the channels they use, the moments in their journey that make them get in touch, and what they contact support about.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"support-journey-map","workflow":"support","phase":1,"project":"<project>","event":"skipped","artifact":"01-map.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Map) of the Support Operations Cycle workflow (`support`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `support` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Support Operations Cycle workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After the frontmatter and title, add a `## Recalled` section of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"support-journey-map","workflow":"support","phase":1,"project":"<project>","event":"started","artifact":"01-map.md","note":""}`.

None — this is the first phase.

## Process

1. **Gather what exists:**
   - Read any artifacts in `.singularskills/research/<project>/` and `.singularskills/marketing/<project>/` (personas, journeys, customer research) and note what they say about the customer's journey.
   - Ask the user, once and together with any other question, for a ticket export (a CSV or JSON file path) or a paste of recent conversations, and for the number of active customers in the period. Without either, continue from what the user describes and mark the volume sections `not measured`.

2. **Ask the user what you could not find:**
   - What does the product do, and who are its customers?
   - Which support channels exist today (email, chat, phone, in-app, community, social), and who answers each?
   - What hours is support staffed, and in which time zones are the customers?
   - Which contacts do they already know are painful or frequent?

3. **List the channels:** for each, who uses it, who answers it, its hours and what it is best and worst at.

4. **Map the journey moments** where customers contact support: before buying, signing up and onboarding, first use, everyday use, billing and payment, renewal or upgrade, and cancelling. Add or drop moments to fit the product.

5. **List contact reasons per moment:** what customers ask or report at each moment, in their words, with an example (paraphrased, never quoted with personal details).

6. **Measure current volumes** from the export, if one was given, as `references/support-metrics.md` describes: contact volume by channel and by moment or reason, and the contact rate when the user gave an active-customer count. Write the script to a file in the project folder and include it beside the results; label every number `computed` or `not measured`.

7. **Note the pain points:** moments with many contacts, slow answers, repeat contacts or visible frustration, and which of them look like product or documentation problems rather than support problems.

8. **Protect personal data:** quote from tickets only what a finding needs, and replace names, emails, phone numbers and account or order numbers with placeholders (`<customer>`, `<email>`, `<account-1>`).

9. **Write the artifact** to `.singularskills/support/<project>/01-map.md` with sections:
   - **Channels** — each channel, who uses and answers it, hours
   - **Journey moments** — the moments that trigger contact
   - **Contact reasons** — per moment, with examples
   - **Current volumes** — `computed` with the script, or `not measured`
   - **Pain points** — where contact hurts most, and why
   - **Key takeaways** — what the Taxonomy phase must account for

## Output

The support map written to `.singularskills/support/<project>/01-map.md`. Present a summary to the user highlighting:
- The busiest channel and journey moment
- The top three contact reasons
- The pain point that looks most like a product or documentation problem
- Which sections are `not measured`, and the data that would measure them

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"support-journey-map","workflow":"support","phase":1,"project":"<project>","event":"finished","artifact":"01-map.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: support-journey-map
workflow: support
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
