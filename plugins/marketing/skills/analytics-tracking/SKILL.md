---
description: Set up analytics, event tracking, and attribution
---

# Analytics Tracking

Plan analytics and event tracking for "$ARGUMENTS". Design measurement frameworks, event taxonomies, and attribution models.

## Prerequisites

None — this is a utility skill that works across all phases.

## Process

1. **Read context** (if available):
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for KPIs and success metrics
   - Read any existing phase artifacts for metrics mentioned

2. **Define measurement framework:**
   - What business questions need answering?
   - Map KPIs to RACE phases: Reach, Act, Convert, Engage
   - Identify leading vs. lagging indicators
   - Define the conversion funnel with measurable steps

3. **Design event taxonomy:**
   - Naming convention: `category_action_label` or `object.action`
   - Core events: page views, signups, activations, conversions, upgrades, churns
   - Engagement events: feature usage, content consumption, sharing
   - Campaign events: UTM tracking, ad clicks, email opens
   - Properties per event: what metadata to capture

4. **Attribution model:**
   - First-touch vs. last-touch vs. multi-touch attribution
   - UTM parameter strategy
   - Cross-device and cross-session tracking considerations
   - Privacy and consent requirements (GDPR, CCPA)

5. **Tool recommendations:**
   - Analytics platform (GA4, Mixpanel, Amplitude, PostHog)
   - Tag management (GTM)
   - Data layer design
   - Dashboard and reporting recommendations

6. **Write the artifact** — write to `.metapowers/marketing/$ARGUMENTS/analytics-tracking.md`:
   - **Measurement Framework** — KPIs per RACE phase
   - **Event Taxonomy** — full event list with properties
   - **Attribution Model** — recommended model with rationale
   - **Implementation Guide** — tool setup and tag management
   - **Dashboard Plan** — what dashboards to build

## Output

Analytics plan written to `.metapowers/marketing/$ARGUMENTS/analytics-tracking.md`. Present a summary highlighting:
- Core events to implement
- Recommended analytics stack
- Attribution model choice
