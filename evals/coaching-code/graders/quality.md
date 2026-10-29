---
type: llm
weight: 1
focus:
  source: file
  path: .singularskills/coaching/sample/code-review.md
---

Judge the file `.singularskills/coaching/sample/code-review.md` against the request in the prompt. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It gives an overall score from 1 to 10 with a short justification.
2. It has Strengths, Issues (by severity), Suggestions and Learn More sections (headings may differ slightly in wording).
3. Issues identify the SQL injection from building the query with string interpolation.
4. Issues identify the hard-coded payment API key.
5. Issues identify the empty catch block that swallows the refund error.
6. Suggestions show a concrete fix (for example a parameterised query or reading the key from the environment).
