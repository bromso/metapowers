---
name: security-asset-inventory
description: Catalog every hardware, software, data store, API, cloud and SaaS asset with owner, location, criticality and data classification, dependencies and shadow IT. Use when the user has no complete list of their systems and tools, or suspects unmanaged services and unowned assets. Not for mapping what is exposed to attackers; see /security-attack-surface.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 1
  artifact: 01-identify.md
---

# Asset Inventory

Catalog hardware, software, data, and service assets with criticality ratings for "$ARGUMENTS". Create a comprehensive asset register that serves as the foundation for risk assessment and security controls.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Enumerate asset categories:**
   - **Hardware** — servers, workstations, laptops, mobile devices, network equipment, IoT devices
   - **Software** — operating systems, applications, databases, middleware, custom-built systems
   - **Data stores** — databases, file shares, object storage, backups, archives, data warehouses
   - **APIs** — internal APIs, external-facing APIs, third-party API integrations
   - **Cloud services** — IaaS, PaaS, SaaS, serverless functions, managed services
   - **SaaS tools** — productivity, communication, development, monitoring, analytics tools

2. **Document each asset:**
   - For every identified asset, record:
     - **Name and description** — what it is and what it does
     - **Owner** — person or team responsible for the asset
     - **Location** — physical location, cloud region, or URL
     - **Criticality** — Critical, High, Medium, or Low based on business impact if compromised or unavailable
     - **Data classification** — what sensitivity level of data it stores or processes (Public, Internal, Confidential, Restricted)
     - **Dependencies** — what other assets it depends on and what depends on it
     - **Lifecycle status** — active, deprecated, end-of-life, decommissioning

3. **Create asset register table:**
   - Build a structured table with columns: Asset ID, Name, Category, Owner, Location, Criticality, Data Classification, Dependencies, Status
   - Group assets by category for readability
   - Assign unique identifiers for cross-referencing in other security artifacts

4. **Identify shadow IT:**
   - Look for unsanctioned tools, services, or infrastructure not managed by IT
   - Common shadow IT categories: personal cloud storage, unauthorized SaaS, developer side-projects on production infrastructure, unmanaged devices
   - Assess risk of each shadow IT item and recommend: formalize, replace, or decommission
   - Define process for ongoing shadow IT discovery

5. **Map critical dependencies:**
   - Identify single points of failure in the asset dependency graph
   - Highlight assets where compromise would cascade to multiple systems
   - Note assets with no documented owner or unclear responsibility
   - Flag end-of-life assets still in production use

6. **Write the artifact** — append to `.singularskills/security/<project>/01-identify.md` under a `## Asset Inventory` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Asset Inventory` section already exists, replace only that section. The section contains:

   - **Asset Register** — complete table of all identified assets
   - **Criticality Summary** — count and list of assets by criticality level
   - **Dependency Map** — critical dependency chains and single points of failure
   - **Shadow IT Findings** — unsanctioned assets and recommended actions
   - **Gaps and Recommendations** — unowned assets, EOL systems, and next steps

## Output

The asset inventory appended to `.singularskills/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Total assets cataloged by category
- Distribution across criticality levels
- Critical dependency chains and single points of failure
- Shadow IT findings requiring attention

**Record the run.** This artifact is shared by every skill of phase 1 (Identify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Identify
workflow: security
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Asset Inventory` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-asset-inventory`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
