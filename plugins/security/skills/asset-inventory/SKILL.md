---
description: Catalog hardware, software, data, and service assets with criticality
---

# Asset Inventory

Catalog hardware, software, data, and service assets with criticality ratings for "$ARGUMENTS". Create a comprehensive asset register that serves as the foundation for risk assessment and security controls.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security:security-policy <project>`), or use `--skip-checks` to bypass.

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

6. **Write the artifact** — append to `.metapowers/security/<project>/01-identify.md` under a `## Asset Inventory` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Asset Inventory` section already exists, replace only that section. The section contains:

   ### Asset Inventory

   Include sections:
   - **Asset Register** — complete table of all identified assets
   - **Criticality Summary** — count and list of assets by criticality level
   - **Dependency Map** — critical dependency chains and single points of failure
   - **Shadow IT Findings** — unsanctioned assets and recommended actions
   - **Gaps and Recommendations** — unowned assets, EOL systems, and next steps

## Output

The asset inventory appended to `.metapowers/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Total assets cataloged by category
- Distribution across criticality levels
- Critical dependency chains and single points of failure
- Shadow IT findings requiring attention
