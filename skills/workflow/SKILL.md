---
name: workflow
description: Orchestrate a whole workflow for a project (design thinking, Double Diamond, RACE, Scrum, a product launch) phase by phase, asking before each phase writes and pausing for approval at every boundary. Use when the user asks to start, run, continue or resume a process, methodology or workflow for a project. Not for a single skill; invoke that skill by name.
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
- When the run ends: `{"ts":"<ISO timestamp>","skill":"workflow","workflow":"<workflow>","phase":null,"project":"<project>","event":"run-finished","artifact":null,"note":"<\"complete\", \"stopped before approving phase <phase>\" or \"refused at phase <phase>: <what the gate printed>\">"}`

`<phase>` is the phase's number from the workflow file, written as a JSON number. Never edit or delete earlier lines.

## Process

1. **Read the state.**
   - **Arguments.** Take the workflow from the first token of `$ARGUMENTS` and the project from the second. If `$ARGUMENTS` is empty (for example when you were invoked from the user's own words rather than a command), take the workflow and project from the user's request instead: match a workflow by its name or its title in the table above ("design thinking" is `design`), and the project by the thing being worked on ("for date-picker" is `date-picker`). Ask only if they cannot be found.
   - No workflow found: list the workflows in the table above and ask which one. A workflow name with no file in either place: say so, list the available workflows and stop.
   - No project found: ask for one (lowercase, hyphenated, e.g. `date-picker`) and wait.
   - Read the workflow file, then each phase's artifact folder, then `.singularskills/log.jsonl` if it exists. From the log keep the lines whose `project` matches and whose `workflow` is this workflow's name: `phase-approved` lines mark approved phases. Member skills write their own lines with `workflow` set to their artifact folder, so also keep the `refused` and `skipped` lines whose `project` matches and whose `workflow` is either this workflow's name or the folder of any of its phases (in a cross-domain run, every member's folder); these are gate events to report.
   - The **first unapproved phase** is the first phase, in file order, with no `phase-approved` line. A phase with no `artifact` (approval-only, such as a cross-domain report phase) produces nothing a later phase requires and is complete on approval alone.
   - **Written is decided per member, not by the file existing.** A cross-domain workflow can point at a file another run already wrote, so check each member of this phase (the member's `SKILL.md` says whether it writes the whole file or its own section of a shared one):
     - a single-writer artifact counts as written by the member when it exists and its frontmatter `skill` is that member;
     - a shared artifact counts as written by a member when it has that member's own `## <Skill title>` section (the title is the `#` heading of the member's `SKILL.md`, and the section opens with the member's italic line);
     - a folder artifact (such as `01-assess/`) counts as written by a member when the folder holds a file whose frontmatter `skill` is that member.
     - **Written before the run log.** An artifact that exists but has **no frontmatter** at all (a folder artifact: holds files, none with frontmatter), or, for a shared artifact, a member's `## <Skill title>` section without the italic opener, was written before the run log existed. It counts as written by that member (by every member, for a whole file with no frontmatter): never re-run the member for it.

     The phase is **written** when every member of this phase has written; it is **written-unlogged** when every member has written and at least one of them only before the run log; it is **partly written** when some have; otherwise it is not started.

2. **Report where the run stands**, briefly:
   - Each approved phase, with its artifact's **Decisions** section quoted in one or two lines (for a shared artifact, each member section's **Decisions**).
   - The first unapproved phase, its title and member skills, and which members have written (step 1); say so when the phase is written-unlogged.
   - Every `refused` or `skipped` line kept in step 1 (its `project` matches and its `workflow` is this workflow's name or any member's folder), with its skill, artifact and note.
   - If every phase is approved, go to step 5.

3. **Run the first unapproved phase.** Unless this conversation has an open run for this workflow and project (a `run-started` you appended with no `run-finished` after it), append `run-started` now.
   - **Written** (every member has written, from an earlier run that stopped before approval): do not re-run it; go to step 4 and ask whether to approve it as written or re-run named members.
   - **Written-unlogged** (its artifact was written before the run log existed, for example by an older version of these skills): do not re-run that member; report the phase as written-unlogged and go to step 4 to offer it for approval as it stands, or re-run named members if the user asks.
   - **Partly written** (resuming with some members' work present): do not assume the rest should run, since the user may have chosen a subset earlier. Name the members that have written and those that have not, and ask whether to run the remaining members or approve the phase as it stands. Then do what the user says.
   - **Not started, several member skills:** run all of them in the listed order by default, one after the other. If the user named a subset ("only seo-audit and copywriting"), run only those, in listed order. Ask which apply only when the user seems unsure; then list the members with a one-line summary each.
   - **Running a member:** follow that member's `SKILL.md` (the sibling folder `../<skill>/SKILL.md` of this skill, or invoke the skill by name) as if the user had invoked it with `<project>`. This holds for every member, one or several.
   - Each member runs its own Prerequisites, including the gate script its Prerequisites name. If a gate refuses, stop: tell the user what it printed and which earlier phase to run, and append `run-finished` with a note naming the refusal (`refused at phase <phase>: <what the gate printed>`). Do not bypass the gate yourself and do not write the missing artifact; the user decides. If the user then explicitly asks to bypass it, append a new `run-started` (the refusal finished the earlier run) and run that member again with `<project>` followed by its skip-checks flag (the bypass its Arguments paragraph names); the member logs the `skipped` event itself before writing.
   - Each member asks what it cannot infer before it writes: one question at a time, in plain language, offering a menu only when the user is stuck. Then it writes its artifact (or its own `## <Skill title>` section of a shared artifact) and appends its own run-log lines as its text says.

4. **Stop.** When the phase's members are done:
   - Play back the phase's **Decisions** and **Open questions** from what was written.
   - Say what the next phase will do (its title and member skills), or that this was the last phase.
   - Ask whether to approve this phase and continue. Nothing proceeds without an answer; end your turn here.
   - On "approve", "continue", "go on", "yes" and the like: append the `phase-approved` line, then go back to step 3 with the next unapproved phase.
   - On corrections ("redo copywriting with a warmer tone"): re-run only the named members with the correction, then stop again at this step.
   - On anything else (stop, later, a new topic): append `run-finished` with the note `stopped before approving phase <phase>` and end the run. The artifacts stay on disk; no approval is recorded.

5. **Finish.** When the last phase is approved, summarise the whole run from the artifacts (each phase's key decisions and the open questions still standing) and stop. Append `run-finished` with the note `complete` only if this conversation appended `run-started`; a workflow that was already complete when you read it gets no new lines.

Resuming is the same command: step 1 finds the first unapproved phase, so `/workflow <workflow> <project>` picks up where the run stopped, even in a new conversation; a written phase is offered for approval again, and a partly written one asks before running the rest.

## Output

Nothing of your own beyond the run-log lines; the member skills write the artifacts under `.singularskills/<folder>/<project>/`. Present the state report (step 2), each phase's playback and approval question (step 4), and the closing summary (step 5).
