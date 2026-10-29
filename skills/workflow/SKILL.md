---
name: workflow
description: Run a workflow phase by phase for a project, asking before each phase writes and pausing for approval at every boundary. Use when the user wants to start, continue or resume a structured workflow such as design, research, development or launch-product. Not for a single skill; invoke that skill by name.
metadata:
  argument-hint: "<workflow> <project>"
---

# Workflow

Conduct the workflow named by the first token of "$ARGUMENTS" for the project named by the second token, one phase at a time. You are the conductor: you read the state, run the phase's member skills, stop at the phase boundary and record the person's approval, following the rules below.

## Rules

- A phase is complete only when the run log holds a `phase-approved` line for its `{workflow, project, phase}`. An artifact on disk without that line is **written**, not complete.
- The conductor never writes an artifact itself; the phase's member skills do. Your own writes are the three run-log lines below.
- The conductor never skips a gate. If a member's gate refuses, stop and tell the user what it printed; only the user can ask that member to bypass it.
- **Stop** at every phase boundary. Nothing proceeds without an answer.

## Prerequisites

None. A missing project name or an unknown workflow is handled in step 1.

## Files

- **The workflow file.** Read `workflows/<workflow>.yml` from the `workflows/` folder next to the `skills/` folder of this pack; if it is not there, the `workflows/<name>.yml` file bundled in this skill's `references/` (listed below). It has `name`, `title`, `folder` and a list of `phases`; each phase has `phase` (its number), `title`, `artifact` (a file such as `01-empathize.md`, a folder such as `01-assess/`, or absent), `requires`, `skills` (its member skills, in order) and, in cross-domain workflows, its own `folder`.
- **The artifact folder** of a phase is `.singularskills/<folder>/<project>/`, where `<folder>` is the phase's own `folder` if it has one, else the workflow's `folder`.
- **The run log** is `.singularskills/log.jsonl`, one JSON object per line, append-only. `references/run-log.md` describes every event and the artifact format.

The bundled workflow files:

| Workflow | Title | File |
| --- | --- | --- |
| accessibility | WCAG-EM | `references/workflows/accessibility.yml` |
| accounting | Accounting Cycle | `references/workflows/accounting.yml` |
| bookkeeping | Bookkeeping Cycle | `references/workflows/bookkeeping.yml` |
| branding | Brand Identity Process | `references/workflows/branding.yml` |
| build-feature | Build a Feature | `references/workflows/build-feature.yml` |
| compliance | GRC Lifecycle | `references/workflows/compliance.yml` |
| compliance-audit | Compliance Audit | `references/workflows/compliance-audit.yml` |
| design | Design Thinking | `references/workflows/design.yml` |
| development | Plan-Build-Test-Ship | `references/workflows/development.yml` |
| finance | FP&A | `references/workflows/finance.yml` |
| launch-product | Launch a Product | `references/workflows/launch-product.yml` |
| leadership | Leadership Development | `references/workflows/leadership.yml` |
| legal | Legal Lifecycle | `references/workflows/legal.yml` |
| marketing | RACE Framework | `references/workflows/marketing.yml` |
| new-team | Set Up a New Team | `references/workflows/new-team.yml` |
| project-management | Scrum | `references/workflows/project-management.yml` |
| rebrand | Rebrand | `references/workflows/rebrand.yml` |
| research | Double Diamond | `references/workflows/research.yml` |
| security | NIST CSF | `references/workflows/security.yml` |

## Run-log lines you write

Append exactly one line per event to `.singularskills/log.jsonl` (create the folder and file if missing), with `"skill":"workflow"`:

- When you start running phases: `{"ts":"<ISO timestamp>","skill":"workflow","workflow":"<workflow>","phase":null,"project":"<project>","event":"run-started","artifact":null,"note":"from phase <first unapproved phase>"}`
- When the user approves a phase: `{"ts":"<ISO timestamp>","skill":"workflow","workflow":"<workflow>","phase":<phase>,"project":"<project>","event":"phase-approved","artifact":"<the phase's artifact, or null when it has none>","note":"<the user's words, briefly>"}`
- When the run ends: `{"ts":"<ISO timestamp>","skill":"workflow","workflow":"<workflow>","phase":null,"project":"<project>","event":"run-finished","artifact":null,"note":"<\"complete\" or \"stopped before approving phase <phase>\">"}`

`<phase>` is the phase's number from the workflow file, written as a JSON number. Never edit or delete earlier lines.

## Process

1. **Read the state.**
   - No workflow name: list the workflows in the table above and ask which one. A workflow name with no file in either place: say so, list the available workflows and stop.
   - No project name: ask for one (lowercase, hyphenated, e.g. `date-picker`) and wait.
   - Read the workflow file, then each phase's artifact folder, then `.singularskills/log.jsonl` if it exists. From the log keep the lines whose `workflow` and `project` match: `phase-approved` lines mark approved phases; `refused` and `skipped` lines are gate events to report.
   - The **first unapproved phase** is the first phase, in file order, with no `phase-approved` line. A phase with no `artifact` (approval-only, such as a cross-domain report phase) produces nothing a later phase requires and is complete on approval alone.

2. **Report where the run stands**, briefly:
   - Each approved phase, with its artifact's **Decisions** section quoted in one or two lines (for a shared artifact, each member section's **Decisions**).
   - The first unapproved phase, its title and member skills, and whether its artifact is already written (on disk but not approved).
   - Every `refused` or `skipped` line for this project, with its skill, artifact and note.
   - If every phase is approved, go to step 5.

3. **Run the first unapproved phase.** If you have not yet appended `run-started` in this conversation for this workflow and project, append it now.
   - If the phase's artifact is already written (from an earlier run that stopped before approval), do not re-run it: go to step 4 and ask whether to approve it as written or re-run its members. For a shared artifact, run only the members whose `## <Skill title>` section is missing, then go to step 4.
   - **One member skill:** follow that skill's `SKILL.md` (the sibling folder `../<skill>/SKILL.md` of this skill, or invoke it by name) as if the user had invoked it with `<project>`.
   - **Several member skills:** run all of them in the listed order by default, one after the other. If the user named a subset ("only seo-audit and copywriting"), run only those, in listed order. Ask which apply only when the user seems unsure; then list the members with a one-line summary each.
   - Each member runs its own Prerequisites, including the gate script its Prerequisites name. If a gate refuses, stop: tell the user what it printed and which earlier phase to run. Do not bypass the gate yourself and do not write the missing artifact; the user decides.
   - Each member asks what it cannot infer before it writes: one question at a time, in plain language, offering a menu only when the user is stuck. Then it writes its artifact (or its own `## <Skill title>` section of a shared artifact) and appends its own run-log lines as its text says.

4. **Stop.** When the phase's members are done:
   - Play back the phase's **Decisions** and **Open questions** from what was written.
   - Say what the next phase will do (its title and member skills), or that this was the last phase.
   - Ask whether to approve this phase and continue. Nothing proceeds without an answer; end your turn here.
   - On "approve", "continue", "go on", "yes" and the like: append the `phase-approved` line, then go back to step 3 with the next unapproved phase.
   - On corrections ("redo copywriting with a warmer tone"): re-run only the named members with the correction, then stop again at this step.
   - On anything else (stop, later, a new topic): append `run-finished` with the note `stopped before approving phase <phase>` and end the run. The artifacts stay on disk; no approval is recorded.

5. **Finish.** When the last phase is approved, append `run-finished` with the note `complete`, summarise the whole run from the artifacts (each phase's key decisions and the open questions still standing), and stop.

Resuming is the same command: step 1 finds the first unapproved phase, so `/workflow <workflow> <project>` picks up where the run stopped, even in a new conversation; a written but unapproved phase is offered for approval again.

## Output

Nothing of your own beyond the run-log lines; the member skills write the artifacts under `.singularskills/<folder>/<project>/`. Present the state report (step 2), each phase's playback and approval question (step 4), and the closing summary (step 5).
