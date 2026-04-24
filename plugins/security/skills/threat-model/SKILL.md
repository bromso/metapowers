---
description: Model threats using STRIDE, PASTA, or attack trees
---

# Threat Model

Model threats for "$ARGUMENTS" using structured threat modeling methodologies. Identify what can go wrong, assess each threat's severity, and propose mitigations.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/threat-model-template.md` for methodology reference and output structure
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and risk appetite

2. **Describe the system being modeled:**
   - Define the system or component scope (application, service, infrastructure, data flow)
   - Identify key actors: end users, administrators, external services, automated processes
   - List technologies and protocols in use
   - Document assumptions about the environment (network segmentation, authentication mechanisms, hosting model)

3. **Draw data flow diagram (text-based):**
   - Identify processes, data stores, external entities, and data flows
   - Use text-based notation to represent the diagram (e.g., `[User] --> (Web App) --> [Database]`)
   - Mark trust boundaries between different security zones (public internet, DMZ, internal network, database tier)
   - Label each flow with the data type and protocol

4. **Apply STRIDE to each component:**
   - For each element in the data flow, systematically evaluate:
     - **Spoofing** — can an attacker impersonate a legitimate user or system?
     - **Tampering** — can data be modified in transit or at rest without detection?
     - **Repudiation** — can an actor deny performing an action without proof?
     - **Information Disclosure** — can sensitive data be exposed to unauthorized parties?
     - **Denial of Service** — can the component be rendered unavailable?
     - **Elevation of Privilege** — can an attacker gain higher access than authorized?
   - Document each identified threat with ID, description, affected component, and STRIDE category

5. **Rate each threat by likelihood and impact:**
   - **Likelihood** (1-5): based on attack complexity, required access, and known exploitation
   - **Impact** (1-5): based on data sensitivity, business criticality, and blast radius
   - **Risk score** = likelihood x impact
   - Categorize: Critical (20-25), High (12-19), Medium (6-11), Low (1-5)
   - Prioritize threats by risk score for mitigation planning

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/01-identify.md` with heading:

   ## Threat Model

   Include sections:
   - **System Description** — scope, actors, technologies, and assumptions
   - **Data Flow Diagram** — text-based diagram with trust boundaries
   - **Threat Catalog** — all identified threats with STRIDE classification and risk score
   - **Threat Prioritization** — ranked list by risk score
   - **Proposed Mitigations** — recommended controls for each high and critical threat

## Output

The threat model written to `.metapowers/security/$ARGUMENTS/01-identify.md`. Present a summary to the user highlighting:
- System scope and trust boundaries identified
- Total threats found by STRIDE category
- Top critical and high-risk threats
- Recommended mitigations for the highest-priority threats
