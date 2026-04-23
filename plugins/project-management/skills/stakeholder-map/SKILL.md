---
description: Identify and map stakeholders by influence, interest, and communication needs
---

# Stakeholder Map

Identify and map all stakeholders for "$ARGUMENTS". Classify them by power and interest, define communication plans per group, and map decision-making authority and escalation paths.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` if it exists (for project charter context)

2. **Identify all stakeholders:**
   - **Internal stakeholders:** project sponsor, product owner, development team, management, operations, support, finance
   - **External stakeholders:** customers, end users, partners, vendors, regulators, investors
   - For each stakeholder: name/role, organization, primary interest in the project
   - Ask: who is affected by this project? Who can affect this project?

3. **Classify using power/interest grid:**
   - **Manage Closely** (high power, high interest): key players who need active engagement — regular meetings, input on decisions, early reviews
   - **Keep Satisfied** (high power, low interest): senior stakeholders who need executive summaries — periodic updates, escalation path, no information overload
   - **Keep Informed** (low power, high interest): engaged supporters who want visibility — regular status updates, demos, feedback channels
   - **Monitor** (low power, low interest): peripheral stakeholders — minimal communication, available on request
   - Place each stakeholder in the appropriate quadrant with justification

4. **Define communication plan per group:**
   - For each quadrant, specify:
     - **Frequency:** daily, weekly, bi-weekly, monthly, as-needed
     - **Format:** standup, status report, email update, demo, 1:1 meeting, newsletter
     - **Channel:** Slack, email, meetings, dashboard, wiki
     - **Content:** what information they need and at what level of detail
   - Create a RACI-style mapping for key decisions (Responsible, Accountable, Consulted, Informed)

5. **Map decision-making authority and escalation paths:**
   - Who approves scope changes? Budget changes? Timeline changes?
   - Define escalation levels: team → Scrum Master → Product Owner → sponsor → steering committee
   - Document approval thresholds (e.g., scope changes under X hours → PO approval, over X hours → sponsor)
   - Identify single points of failure in decision-making

6. **Identify stakeholder risks:**
   - Disengaged sponsors or absent decision-makers
   - Conflicting stakeholder priorities
   - Stakeholders who may resist change
   - Missing stakeholders who should be involved

7. **Write the artifact** — append to `.project/$ARGUMENTS/00-initiate.md` under a `## Stakeholder Map` section:
   - **Stakeholder Register** — name/role, organization, interest, quadrant
   - **Power/Interest Grid** — visual grid with stakeholders placed
   - **Communication Plan** — per-quadrant frequency, format, channel, content
   - **Decision Authority** — RACI for key decisions, approval thresholds
   - **Escalation Path** — levels and triggers
   - **Stakeholder Risks** — identified risks and mitigation

## Output

Stakeholder map appended to `.project/$ARGUMENTS/00-initiate.md`. Present a summary highlighting:
- Stakeholder count by quadrant
- Key decision-makers and their authority
- Communication cadence for each group
