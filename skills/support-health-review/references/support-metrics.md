# Support metrics

How the support skills measure a support operation: what each metric is, how to compute it from a ticket export, how to read it, and what to write when the data is not there. Every number a support artifact reports carries one of three labels:

- `computed`: calculated with a script from data the user supplied; the script goes in the artifact beside the result.
- `not measured`: the data needed is missing; say which column or period is missing.
- `target`: a value the user chose (a goal, a promise), not an observation.

Never report a baseline, a benchmark or an industry average as if it described this operation.

## Definitions

Times are in business hours unless the service levels (`06-service-levels.md`) say the clock runs around the day. Report times as the median and the 90th percentile, never the mean alone: a few very old tickets pull a mean far from what most customers saw.

| Metric | Formula |
| --- | --- |
| Contact volume | Tickets created in the period, by channel and by category |
| Contact rate | Contacts in the period ÷ active customers in the period |
| First-response time | First agent reply − ticket created, per ticket; median and p90 |
| Resolution time | Resolved − created, per resolved ticket; median and p90 |
| First-contact resolution | Tickets resolved with one agent reply and never reopened ÷ resolved tickets |
| Reopen rate | Tickets reopened at least once ÷ resolved tickets |
| Backlog age | For tickets open at the period's end: now − created; median, p90 and the count older than the resolution target |
| SLA attainment | Tickets meeting their priority's target ÷ tickets with that priority, separately for first response and resolution |
| CSAT | Share of ratings in the top two boxes (4–5 of 5) ÷ all ratings; also the mean; always with the response count |
| CES | Mean of "the company made it easy to handle my issue" (1–7), with the response count |
| NPS | % promoters (9–10) − % detractors (0–6), with the response count |

A rate or share computed from fewer than 30 responses or tickets is reported with its count and the words "small sample".

## Reading them

No single feedback metric reliably predicts whether customers stay. Across 93 firms in 18 industries, top-2-box satisfaction predicted retention best, focusing on the extremes of a scale beat using its full range, and combining metrics predicted better than any one alone (de Haan, Verhoef and Wiesel, 2015, *International Journal of Research in Marketing*). Metrics built on the intention to recommend had little or no value in predicting business performance, while average satisfaction had the most (Morgan and Rego, 2006, *Marketing Science*), and a longitudinal replication failed to find Net Promoter's claimed superiority over other measures (Keiningham et al., 2007, *Journal of Marketing*).

So the support skills report CSAT top-2-box first, read it beside effort, reopen rate and repeat contacts, and never report NPS alone or treat it as the health of the operation.

Read volume as a signal about the product, not only about support: a category whose contact rate rises while customers stay flat is a product or documentation problem.

## Account identifiers

Artifacts never hold a customer's name, email, phone number or account number. Where a skill must point at an account (the at-risk list of `07-health.md`), it uses `acct-` followed by the first 8 hex digits of the SHA-256 of the export's account or customer ID column. The identifier is the same in every run, so two periods can be compared, and the user maps it back by running the same script over their own export. It is pseudonymous, not anonymous: anyone holding the list of account IDs can recompute it, so treat `07-health.md` as internal. The script prints identifier and raw ID side by side for the user's own terminal; never write its output to a file:

```python
import csv, hashlib, sys
for row in csv.DictReader(open(sys.argv[1], newline="")):
    acct = row[sys.argv[2]].strip()
    print(f"acct-{hashlib.sha256(acct.encode()).hexdigest()[:8]}", acct)
```

Run it as `python3 acct.py export.csv account_id`. If the export has no account or customer ID column, or the column's values look like emails, phone numbers or names, write `not measured: no account ID in the export` where the list would be, and never hash names or emails instead: a hash of an email address is still personal data.

## Inputs

| Metric | Export columns needed | When a column is missing |
| --- | --- | --- |
| Contact volume | created, channel, category or subject | Volume by channel or category is `not measured`; total volume still counts rows |
| Contact rate | as above, plus active customers for the period (from the user) | `not measured: no active-customer count` |
| First-response time | created, first response | `not measured: no first-response timestamp` |
| Resolution time, backlog age | created, resolved, status | `not measured: no resolved timestamp` |
| First-contact resolution, reopen rate | reply count or reopen flag | `not measured: no reply count or reopen flag` |
| SLA attainment | priority, the timestamps above, `06-service-levels.md` | `not measured` per missing input |
| CSAT, CES, NPS | the survey score column | `not measured: no survey scores` |
| At-risk accounts | account or customer ID | `not measured: no account ID in the export` |
