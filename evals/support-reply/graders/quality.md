---
type: llm
weight: 1
focus: last_message
---

Judge Claude's final reply against the request in the prompt. The workspace holds the support setup for project `loomly`: `.singularskills/support/loomly/02-taxonomy.md` (categories such as "Billing › Refund request"; P3 is "a request or question about billing, plans or classes, with nothing broken") and `.singularskills/support/loomly/04-macros.md`, whose Policies allow a full refund only within 30 days of signup; after 30 days an agent may offer cancellation at the end of the current billing month and one free 1:1 glazing session with a tutor, while any refund of past months or any credit needs Mia, head of support, to approve; new class times are never promised. The prompt itself states no policy. The customer signed up on 12 August and asks on 9 November for £87 back. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It gives a draft reply to the customer that could be sent with at most placeholder edits.
2. The draft does not promise or imply the £87 refund, a refund of past months, or a credit.
3. The draft offers the free 1:1 glazing session or cancellation at the end of the billing month (or both), and offers nothing else of value.
4. It says the refund request goes to Mia or the head of support, or that it needs approval, without promising the outcome.
5. Above or beside the draft, it states both a category and a priority, and the category is "Billing › Refund request" (or plainly the same) and the priority P3.
6. The draft does not promise new class times, and does not repeat the customer's email address.
