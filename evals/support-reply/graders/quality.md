---
type: llm
weight: 1
focus: last_message
---

Judge Claude's final reply against the request in the prompt. The customer signed up on 12 August and asks on 9 November for a refund of all three months (£87); the stated policy allows full refunds only within 30 days of signup, lets an agent cancel at the end of the current billing month and give one month's credit without approval, and requires the head of support's approval for anything more. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It gives a draft reply to the customer that could be sent with at most placeholder edits.
2. The draft does not promise or imply the £87 refund, or any refund of past months.
3. Anything the draft offers is within what an agent may give without approval (cancelling at the end of the current billing month and at most one month's credit), or it says the request has been passed to someone who can decide, without promising the outcome.
4. The draft acknowledges the customer's specific problem (class times they cannot make) and apologises or empathises without blaming the customer.
5. The draft does not repeat the customer's email address.
6. Above or beside the draft, it states a category or priority, or the policy the reply relies on.
