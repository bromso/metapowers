---
description: Answer customer security/compliance questionnaires
---

# Compliance Questionnaire

Answer customer security and compliance questionnaires for "$ARGUMENTS" by leveraging existing compliance artifacts, evidence, and organizational knowledge to provide accurate, evidence-backed responses.

## Prerequisites

None — this is a utility skill.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read any existing compliance artifacts in `.metapowers/compliance/$ARGUMENTS/` for context (if they exist)

2. **Understand the questionnaire:**
   - Identify questionnaire type — SIG (Standardized Information Gathering), CAIQ (Consensus Assessments Initiative Questionnaire), VSAQ, or custom
   - Parse questionnaire structure and question categories
   - Identify total number of questions and sections
   - Note any specific format requirements for responses

3. **Answer each question:**
   - For each question: determine the most accurate response based on current compliance posture
   - Cite existing evidence where available (SOC 2 report, ISO certificate, policies)
   - Use standard compliance language appropriate to the questionnaire type
   - For yes/no questions: answer honestly, provide brief justification
   - For descriptive questions: provide concise, factual responses with evidence references

4. **Flag and annotate:**
   - Flag questions that require internal verification before submission
   - Identify answers that might concern the customer — provide mitigation context
   - Note questions where the organization is non-compliant — suggest compensating controls or roadmap items
   - Mark questions as N/A where genuinely not applicable (with justification)

5. **Quality assurance:**
   - Verify consistency across answers (no contradictions)
   - Ensure all questions are addressed (no blanks)
   - Check that evidence references are accurate and current
   - Review tone — professional, confident, but honest about gaps

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/questionnaire-responses.md` with sections:
   - **Questionnaire Summary** — type, customer, date, total questions
   - **Responses** — per-section answers in the customer's requested format
   - **Items Requiring Verification** — flagged questions needing internal review
   - **Customer Concern Areas** — potential concerns with mitigation context
   - **Evidence References** — index of all evidence cited in responses

## Output

The questionnaire responses written to `.metapowers/compliance/$ARGUMENTS/questionnaire-responses.md`. Present a summary to the user highlighting:
- Total questions answered
- Number of items flagged for verification
- Potential customer concern areas
- Overall questionnaire completion status
