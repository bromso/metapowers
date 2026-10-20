---
max_turns: 25
runs: 2
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

We're launching a public REST API for our invoicing product next month, and a prospect's security questionnaire asked for our written rules on things like access, acceptable use, data handling and incident response — we have nothing on paper. We're 40 people, fully remote, on Google Workspace and AWS, and we handle customer invoices containing names, addresses and bank details. Put together the governing set of rules for the `invoicing-api` program, with owners and review dates, and save it so the rest of the security work can build on it. I won't be around to answer questions, so go with what's here and write down any assumptions you make.
