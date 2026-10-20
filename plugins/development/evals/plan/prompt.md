---
max_turns: 25
runs: 2
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Next sprint I'm building password reset for our web app: a "forgot password" form that emails a one-time link, the link expires after 30 minutes, and the user sets a new password on a reset page. We use a Node/Express API with PostgreSQL and send email through an existing `mailer` module. Before I write anything, break this down into small steps I can do one at a time, with the files I'll touch, the tests to write and where to commit. Call it `password-reset` and save the breakdown. I won't be around to answer questions, so go with what's here and write down any assumptions you make.
