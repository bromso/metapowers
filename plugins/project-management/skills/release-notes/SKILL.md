---
description: Draft release notes for shipped features
---

# Release Notes

Draft release notes for "$ARGUMENTS". List all shipped features with user-facing descriptions, note breaking changes and migration steps, list known issues, and organize by category.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/project-management/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.metapowers/project-management/<project>/00-initiate.md` for project context and product vision
   - Read `.metapowers/project-management/<project>/03-review.md` if it exists (for sprint review and completed stories)
   - Read `.metapowers/project-management/<project>/02-sprint.md` if it exists (for sprint state and delivery details)
   - Read `.metapowers/project-management/<project>/01-plan.md` if it exists (for backlog, story descriptions, and acceptance criteria)

2. **List all features shipped in the release/sprint:**
   - Gather all completed stories from the sprint review or sprint backlog
   - Include bug fixes that were resolved in this release
   - Include improvements or enhancements to existing features
   - Exclude internal-only changes (refactoring, test improvements, CI changes) unless they affect users
   - Note the version number and release date

3. **Write user-facing descriptions for each feature:**
   - Write in benefit-focused language: what the user can now do, not how it was implemented
   - Use plain language — avoid internal jargon, code references, or ticket numbers
   - Keep each description to 1-2 sentences
   - Include examples or before/after comparisons where they clarify the change
   - For technical features, explain the user-visible impact ("Faster page loads" not "Optimized database queries")

4. **Note breaking changes and migration steps:**
   - List any changes that break existing behavior, APIs, or integrations
   - For each breaking change, explain: what changed, why it changed, and what users need to do
   - Provide step-by-step migration instructions if applicable
   - Note the deprecation timeline if old behavior is being phased out gradually
   - Mark breaking changes prominently so they are not missed

5. **List known issues and workarounds:**
   - List any known bugs or limitations in this release
   - For each known issue, provide a workaround if one exists
   - Note which issues are planned to be fixed in the next release
   - Be honest about known issues — users trust transparency more than perfection

6. **Group by category:**
   - Organize release notes into clear categories:
     - **New Features** — entirely new capabilities
     - **Improvements** — enhancements to existing features
     - **Bug Fixes** — resolved issues
     - **Breaking Changes** — changes requiring user action
     - **Known Issues** — current limitations with workarounds
   - Within each category, order by user impact (most impactful first)

7. **Add version number and date:**
   - Include the version number (e.g., v1.2.0) following semantic versioning if applicable
   - Include the release date
   - If this is a pre-release or beta, note the stability level
   - Reference the previous version for context ("Changes since v1.1.0")

8. **Write the artifact** — append to `.metapowers/project-management/<project>/03-review.md` under a `## Release Notes` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Release Notes` section already exists, replace only that section. The section contains:
   - **Version & Date** — version number, release date, previous version reference
   - **New Features** — user-facing descriptions of new capabilities
   - **Improvements** — enhancements to existing features
   - **Bug Fixes** — resolved issues with brief descriptions
   - **Breaking Changes** — changes requiring user action with migration steps
   - **Known Issues** — current limitations with workarounds

## Output

Release notes appended to `.metapowers/project-management/<project>/03-review.md`. Present a summary highlighting:
- Version number and release date
- Number of new features, improvements, and bug fixes
- Any breaking changes requiring user action
- Number of known issues
- Overall release theme (one sentence describing the release focus)
