---
type: llm
weight: 1
focus: trace
---

Judge the whole run (the trace of messages and tool calls, in order). The user asked to start the design thinking process for `date-picker` and said nothing else, so nobody approved anything. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. The final reply ends with a question to the user and waits for the answer.
2. If `.singularskills/design/date-picker/01-empathize.md` was written in this run, the final reply plays back that phase's decisions or open questions, says what phase 2 (Define) will do, and its closing question asks whether to approve phase 1 and continue. Ending on any other question after the file was written is a FAIL.
3. If `01-empathize.md` was not written, the closing question is one the Empathize phase needs answered about the date picker (not a question about which workflow or project to use, which the request already gave).
4. No `phase-approved` line was appended to `.singularskills/log.jsonl`, no write to `.singularskills/design/date-picker/02-define.md` appears, and the reply does not state that any phase was approved.
