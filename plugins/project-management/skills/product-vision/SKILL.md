---
name: product-vision
description: Craft a product vision statement, 3-5 measurable product goals, a North Star metric and success criteria at 30, 60 and 90 days. Use when the user needs to say what the product is for and how they will know it is working before building a roadmap. Not for a team's purpose and values; see /leadership:vision.
argument-hint: "[project] [--skip-checks]"
---

# Product Vision

Craft the product vision for "$ARGUMENTS". Define a clear vision statement, set measurable product goals, establish a North Star metric, and define success criteria at 30/60/90 days.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/project-management/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.metapowers/project-management/<project>/00-initiate.md` for charter, stakeholder, and scope context
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/scrum-guide.md` for Scrum alignment

2. **Craft the vision statement:**
   - Use the format: "For [target customers], who [statement of need], [product name] is a [product category] that [key benefit]. Unlike [primary alternative], our product [primary differentiator]."
   - Ensure the vision is aspirational yet achievable
   - Validate that the vision aligns with the project charter objectives
   - Keep it to 1-2 sentences that the entire team can memorize

3. **Define product goals:**
   - Define 3-5 product goals that ladder up to the vision
   - For each goal: description, measurable success metric, target value, target date
   - Categorize goals: user acquisition, engagement, retention, revenue, quality
   - Ensure goals are outcome-oriented (not output-oriented)

4. **Establish the North Star metric:**
   - Identify the single metric that best captures the core value the product delivers to customers
   - Explain why this metric matters and how it connects to the vision
   - Define how it will be measured and at what frequency
   - Set a baseline (current state) and target (desired state)

5. **Define success at 30/60/90 days:**
   - **30 days:** early signals — what must be true to confirm the project is on track? (e.g., team onboarded, first sprint complete, key risks validated)
   - **60 days:** momentum indicators — what demonstrates meaningful progress? (e.g., MVP feature-complete, early user feedback collected, key integrations working)
   - **90 days:** outcome validation — what proves the product is delivering value? (e.g., North Star metric trending upward, user adoption targets hit, stakeholder satisfaction confirmed)
   - For each checkpoint: specific metrics, thresholds, and who evaluates

6. **Write the artifact** — append to `.metapowers/project-management/<project>/01-plan.md` under a `## Product Vision` section. Create the file with a `# Plan — <project>` heading if it does not exist; if a `## Product Vision` section already exists, replace only that section. The section contains:
   - **Vision Statement** — the crafted vision using the template format
   - **Product Goals** — table with goal, metric, target, date, category
   - **North Star Metric** — metric definition, measurement approach, baseline, target
   - **30/60/90-Day Success Criteria** — checkpoints with metrics and thresholds

## Output

Product vision appended to `.metapowers/project-management/<project>/01-plan.md`. Present a summary highlighting:
- The vision statement
- North Star metric with baseline and target
- Top 3 product goals
- First 30-day success criteria
