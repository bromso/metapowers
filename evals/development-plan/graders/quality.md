---
type: llm
weight: 1
focus:
  source: file
  path: .singularskills/development/password-reset/01-plan.md
---

Judge the file `.singularskills/development/password-reset/01-plan.md` against the request in the prompt. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It breaks the feature into small, ordered tasks, each naming the files to create or modify.
2. Tasks cover the reset-token storage (with expiry), the forgot-password endpoint that emails a link via the mailer module, and the reset endpoint/page.
3. The 30-minute expiry and single use of the link are handled explicitly.
4. It has a test strategy naming specific tests (for example expired token, reused token, unknown email).
5. It marks commit points.
6. It notes at least one security consideration (for example not revealing whether an email exists, hashing the token, or rate limiting).
