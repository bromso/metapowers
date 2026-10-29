---
type: llm
weight: 1
focus: trace
---

Judge the whole run (the trace of messages and tool calls, in order). The workspace started empty and the user gave only the project name, `date-picker`, and asked to start the design thinking process. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. Claude asked the user at least one question in plain language about the date picker, its users or its context, addressed to the user and meant to be answered. A question asked only to approve a phase does not count here.
2. If a write to `.singularskills/design/date-picker/01-empathize.md` appears in the trace, that question came *before* the write: a turn ended on it, or the reply stated it as a question awaiting the user's answer before the write happened. FAIL when the file was written with no such question before the write, even if the run later asked a question.
3. No write to `.singularskills/design/date-picker/02-define.md` (or any later phase artifact) appears in the trace, and Claude does not claim that phase 2 (Define) or any later phase was run.
