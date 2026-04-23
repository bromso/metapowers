---
description: Document decisions with context, alternatives considered, and rationale
---

# Decision Log

Document a decision for "$ARGUMENTS" with full context, alternatives considered, and rationale. Capture the decision question, constraints, options evaluated, final choice, and conditions for revisiting.

## Prerequisites

None — this is a utility skill. It can be run at any time, with or without existing project artifacts.

If `.project/$ARGUMENTS/` exists, read any available artifacts for context. If it does not exist, proceed based on information the user provides.

## Process

1. **Gather context:**
   - If `.project/$ARGUMENTS/decision-log.md` exists, read it for previous decisions and established patterns
   - If `.project/$ARGUMENTS/` exists, read available artifacts for project scope and constraints
   - Understand what decision needs to be made — ask the user if not clear

2. **Capture the decision question clearly:**
   - Frame the decision as a specific question: "Should we X or Y?" or "How should we approach Z?"
   - A vague decision question leads to a vague decision — sharpen it until it is precise
   - Note the urgency: is this blocking work? can it wait for more information?
   - Identify who needs to be involved in making this decision

3. **Document context and constraints:**
   - **Why is this decision needed now?** — what triggered it (new requirement, technical discovery, timeline pressure, team feedback)
   - **What constraints apply?** — budget, timeline, technical limitations, team skills, organizational policies, compliance requirements
   - **What assumptions are we making?** — state them explicitly so they can be challenged
   - **What do we already know?** — relevant data, prior experience, industry standards, previous decisions that constrain this one
   - **What don't we know?** — gaps in information, uncertainties that affect the decision

4. **List alternatives considered (minimum 2-3):**
   - Always include at least 2-3 genuine alternatives — if there is only one option, the decision is already made
   - Include "do nothing" or "defer" as an explicit option when applicable
   - For each alternative, provide a brief description of what it entails
   - Ensure alternatives are meaningfully different, not just minor variations

5. **Evaluate each alternative with pros and cons:**
   - For each alternative, list:
     - **Pros** — benefits, advantages, what it enables
     - **Cons** — drawbacks, risks, what it costs or constrains
     - **Effort** — rough estimate of implementation cost (time, money, complexity)
     - **Reversibility** — how easy is it to change course later? (one-way door vs. two-way door)
   - Use consistent evaluation criteria across all alternatives for fair comparison
   - Note any strong opinions or preferences from team members or stakeholders

6. **Record the final decision and rationale:**
   - State the decision clearly in one sentence
   - Explain why this option was chosen over the others — what tipped the balance?
   - Acknowledge trade-offs: what are we giving up with this choice?
   - If the decision was contentious, note dissenting views respectfully
   - Record the decision-making method used (consensus, leader decides, majority vote, delegation)

7. **Note who made or approved the decision and when:**
   - **Decision maker(s)** — who had the final say
   - **Consulted** — who provided input
   - **Informed** — who needs to know about this decision
   - **Date** — when the decision was made
   - **Effective date** — when the decision takes effect (if different from decision date)

8. **Define review and revisit conditions:**
   - Under what circumstances should this decision be reconsidered?
   - Examples: "If X assumption proves wrong," "If costs exceed Y," "After Z months of experience," "If the team grows beyond N people"
   - Set a review date if applicable (e.g., "Revisit in 3 months")
   - Note any one-way-door aspects: after what point is this decision effectively irreversible?

9. **Tag with relevant area:**
   - Categorize the decision: architecture, process, product, team, tooling, vendor, security, compliance, or other relevant area
   - Tags help when searching for related decisions later

10. **Write the artifact** — append to `.project/$ARGUMENTS/decision-log.md`:
    - Use a numbered decision format: `## Decision [N]: [Decision Title]`
    - **Date** — when the decision was made
    - **Status** — decided, superseded, or under review
    - **Area** — category tag
    - **Question** — the decision question
    - **Context** — constraints and background
    - **Alternatives Considered** — each option with pros, cons, effort, and reversibility
    - **Decision** — the chosen option and rationale
    - **Decision Makers** — who decided, consulted, and informed
    - **Revisit Conditions** — when to reconsider

## Output

Decision appended to `.project/$ARGUMENTS/decision-log.md`. Present a summary highlighting:
- Decision question and chosen option
- Key rationale (why this over alternatives)
- Main trade-off acknowledged
- Revisit conditions
