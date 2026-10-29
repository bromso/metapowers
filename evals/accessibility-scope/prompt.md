---
max_turns: 25
runs: 2
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Our online shop's checkout keeps getting complaints from customers who use screen readers, and our biggest client in Germany now wants proof we meet the European accessibility rules. Before anyone starts testing, I want the boundaries of a proper audit nailed down: which pages of the checkout (cart, shipping address, payment, order confirmation, plus the guest sign-in step), which WCAG level we're aiming for, which standards matter for us, and how we'll test. Call the project `checkout-flow` and save it so the testers can pick it up. I won't be around to answer questions, so go with what's here and write down any assumptions you make.
