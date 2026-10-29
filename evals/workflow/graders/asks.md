---
type: llm
weight: 1
focus: last_message
---

Judge Claude's final reply. The workspace started empty and the user gave only the project name, `date-picker`, and asked to start the design thinking process. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. The reply asks the user at least one question in plain language (about the date picker, its users or its context, or whether to approve the phase), rather than only announcing finished work.
2. If the reply says the phase 1 artifact (`.singularskills/design/date-picker/01-empathize.md`) was written, it also shows that a question was put to the user before that file was written, or that an assumption was stated in place of an answer.
3. It does not claim that phase 2 (Define) or any later phase was run.
