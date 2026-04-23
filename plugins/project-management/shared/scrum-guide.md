# Scrum Reference Guide

A concise reference for teams practising Scrum, based on the Scrum Guide.

---

## Scrum Values

| Value          | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| **Commitment** | The team commits to achieving its goals and supporting each other.          |
| **Focus**      | Everyone focuses on the Sprint work and the goals of the Scrum Team.        |
| **Openness**   | The team and stakeholders are open about the work and the challenges.       |
| **Respect**    | Team members respect each other as capable, independent professionals.      |
| **Courage**    | Members have the courage to do the right thing and work on tough problems.  |

---

## Roles

### Product Owner

The single person accountable for maximising the value of the product and managing the Product Backlog.

**Responsibilities:**

- Clearly express and order Product Backlog items.
- Ensure the backlog is visible, transparent, and understood.
- Make trade-off decisions on scope and priority.
- Ensure the Development Team understands backlog items to the level needed.

### Scrum Master

A servant-leader who helps everyone understand and apply Scrum theory, practices, and rules.

**Responsibilities:**

- Coach the team in self-organisation and cross-functionality.
- Remove impediments to the Development Team's progress.
- Facilitate Scrum events as requested or needed.
- Shield the team from external interference during the Sprint.
- Help the organisation adopt Scrum and continuously improve.

### Development Team

A self-organising, cross-functional group of professionals who deliver a potentially releasable Increment each Sprint.

**Characteristics:**

- Typically 3 to 9 members.
- No sub-teams or hierarchies within the team.
- Collectively accountable for delivering the Increment.
- Members may have specialised skills, but accountability belongs to the team as a whole.

---

## Events

### Sprint

- **Duration:** 1 to 4 weeks (consistent length throughout the project).
- **Purpose:** Deliver a usable, potentially releasable Increment.
- **Rules:**
  - No changes that endanger the Sprint Goal.
  - Quality goals do not decrease.
  - Scope may be clarified and re-negotiated with the Product Owner as more is learned.
  - Only the Product Owner can cancel a Sprint.

### Sprint Planning

- **Time-box:** Up to 8 hours for a 4-week Sprint (proportionally shorter for shorter Sprints).
- **Attendees:** Entire Scrum Team.

| Aspect      | Details                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------- |
| **Inputs**  | Product Backlog, latest Increment, projected capacity, past performance.                  |
| **Outputs** | Sprint Goal, Sprint Backlog (selected items + plan for delivering them).                  |

**Key questions answered:**

1. What can be delivered in this Sprint?
2. How will the chosen work get done?

### Daily Scrum

- **Time-box:** 15 minutes.
- **Attendees:** Development Team (Scrum Master ensures it happens; others may attend but do not participate).

**Three questions each member answers:**

1. What did I do yesterday that helped the team meet the Sprint Goal?
2. What will I do today to help the team meet the Sprint Goal?
3. Do I see any impediment that prevents me or the team from meeting the Sprint Goal?

### Sprint Review

- **Time-box:** Up to 4 hours for a 4-week Sprint.
- **Attendees:** Scrum Team and key stakeholders invited by the Product Owner.

**Activities:**

- The Development Team demonstrates the work done and answers questions.
- The Product Owner identifies what has been done and what has not.
- The group discusses what to do next, providing input for Sprint Planning.
- Review of timeline, budget, and marketplace for the next anticipated release.
- The Product Backlog may be revised to reflect new opportunities.

### Sprint Retrospective

- **Time-box:** Up to 3 hours for a 4-week Sprint.
- **Attendees:** Scrum Team.

**Focus areas:**

1. **People** — Inspect how the last Sprint went with regard to people and relationships.
2. **Process** — Inspect the processes and tools used.
3. **Improvement** — Identify the most helpful changes and create a plan for implementing them.

**Output:** Actionable improvements the team commits to in the next Sprint.

---

## Artifacts

### Product Backlog

- An ordered, evolving list of everything that is known to be needed in the product.
- Owned and maintained by the Product Owner.
- Items at the top are refined — clearer, more detailed, and better estimated.
- Ongoing refinement typically consumes no more than 10 % of the Development Team's capacity.

### Sprint Backlog

- The set of Product Backlog items selected for the Sprint, plus a plan for delivering them and realising the Sprint Goal.
- Owned by the Development Team.
- Updated throughout the Sprint as work is completed or new tasks emerge.

### Increment

- The sum of all Product Backlog items completed during the Sprint and all previous Sprints.
- Must meet the Definition of Done.
- Must be in a usable condition regardless of whether the Product Owner decides to release it.

### Definition of Done

A shared, formal description of what it means for a backlog item to be complete. At a minimum it should include:

- [ ] Code is written and peer-reviewed.
- [ ] Unit tests are written and passing.
- [ ] Integration tests pass.
- [ ] Documentation is updated.
- [ ] The feature has been demonstrated and accepted by the Product Owner.
- [ ] The Increment is deployable.

> Teams should review and strengthen their Definition of Done over time as they mature.
