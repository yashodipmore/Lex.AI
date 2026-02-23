export function getMasterAnalysisPrompt(rawText: string, docType: string, language: string): string {
  return `You are LexAI, an expert Indian legal analyst AI. Analyze the following legal document thoroughly.

DOCUMENT TYPE: ${docType}
LANGUAGE PREFERENCE: ${language === "hi" ? "Hindi explanations" : "English explanations"}

DOCUMENT TEXT:
"""
${rawText}
"""

ANALYZE every clause and return a JSON object with this EXACT structure:

{
  "document": {
    "doc_type": "${docType}",
    "overall_risk": "HIGH" | "MEDIUM" | "LOW",
    "risk_score": <number 0-100>,
    "illegal_count": <number>,
    "sign_verdict": "DO_NOT_SIGN" | "CONDITIONAL" | "SAFE_TO_SIGN",
    "blocking_clauses": [<clause numbers that MUST change before signing>],
    "sign_verdict_reason": "<clear 1-2 sentence reason for the verdict>",
    "parties": ["<party names found>"],
    "key_dates": ["<important dates in YYYY-MM-DD or descriptive>"],
    "monthly_obligations": ["<recurring obligations like rent, payments>"],
    "summary_en": "<2-sentence plain English summary of what this document does>",
    "summary_hi": "<2-sentence Hindi summary>",
    "clause_count": <total clauses>,
    "high_risk_count": <high risk + illegal count>
  },
  "clauses": [
    {
      "clause_number": <sequential>,
      "clause_type": "indemnity" | "non-compete" | "termination" | "payment" | "data-rights" | "liability" | "ip" | "arbitration" | "notice-period" | "renewal" | "confidentiality" | "other",
      "original_text": "<exact text from document>",
      "risk_level": "HIGH" | "MEDIUM" | "LOW",
      "is_illegal": <boolean - ONLY true if it violates a specific Indian law>,
      "illegal_law": "<specific section, e.g. 'Indian Contract Act 1872 §27' or empty>",
      "risk_reason": "<10 word max reason>",
      "explanation_en": "<2-3 sentence plain English explanation of what this clause means and why it matters>",
      "explanation_hi": "<2-3 sentence Hindi explanation>",
      "counter_clause": "<if HIGH or ILLEGAL: legally sound alternative wording the user can propose. Empty for LOW/MEDIUM>",
      "action_advice": "<specific action: 'Remove this clause', 'Negotiate to X', 'Acceptable as-is', etc.>",
      "benchmark_label": "standard" | "above_market" | "below_market" | "unusual",
      "benchmark_note": "<one sentence market context for Indian market>",
      "is_blocking": <boolean - true if this clause must change before signing>,
      "timeline_month": <month number (1-based) in contract when this activates, 0 if immediate>,
      "timeline_event": "<what happens at that month, empty if not time-based>",
      "start_char": <approximate start character position in original text>,
      "end_char": <approximate end character position in original text>
    }
  ]
}

CRITICAL RULES:
1. ILLEGAL means it actually violates Indian law. Check against:
   - Indian Contract Act 1872 (§23 public policy, §27 non-compete, §28 restraint of legal proceedings)
   - Specific Relief Act 1963
   - IT Act 2000 §43/§72
   - Industrial Disputes Act 1947
   - Rent Control Acts (state-specific)
   - Consumer Protection Act 2019
   - Transfer of Property Act 1882
2. Be CONSERVATIVE with ILLEGAL — only flag with exact section citation
3. Uncertain cases → HIGH RISK, not ILLEGAL
4. counter_clause must be legally sound, practically usable text the user can send
5. sign_verdict: DO_NOT_SIGN only if illegal/severely unfair clauses exist that can't be waived
6. Every clause must have explanation in BOTH English and Hindi regardless of language preference
7. Return ONLY valid JSON, no markdown, no extra text`;
}

export function getCounterClausePrompt(clauseText: string, clauseType: string, docType: string): string {
  return `You are LexAI, an expert Indian legal clause drafter.

ORIGINAL CLAUSE:
"""
${clauseText}
"""

CLAUSE TYPE: ${clauseType}
DOCUMENT TYPE: ${docType}

Write a COUNTER-CLAUSE that:
1. Protects the non-drafting party (tenant/employee/freelancer)
2. Is legally sound under Indian law
3. Is balanced — a reasonable other party would accept it
4. Uses clear, professional language
5. Includes specific limits (caps, timeframes, conditions)

Return JSON:
{
  "counter_clause": "<the full alternative clause text>",
  "action_advice": "<2-sentence advice on how to present this to the other party>",
  "why_this_works": "<1-sentence explanation of why this is fair and standard>"
}

Return ONLY valid JSON.`;
}

export function getCompareContractsPrompt(oldText: string, newText: string, userRole: string): string {
  return `You are LexAI, comparing two versions of a legal document for the ${userRole}.

OLD VERSION:
"""
${oldText}
"""

NEW VERSION:
"""
${newText}
"""

Compare clause by clause. Return JSON:
{
  "verdict": "<overall assessment: 'New version is WORSE for you' | 'New version is BETTER for you' | 'Mostly unchanged with key differences'>",
  "summary": "<2-3 sentence summary of the most important changes>",
  "changes": [
    {
      "change_type": "ADDED" | "REMOVED" | "MODIFIED" | "SAME",
      "clause_area": "<what area this clause covers>",
      "old_text": "<text from old version, empty if ADDED>",
      "new_text": "<text from new version, empty if REMOVED>",
      "impact": "FAVORABLE" | "UNFAVORABLE" | "NEUTRAL",
      "explanation": "<1-2 sentence explanation of what changed and why it matters>"
    }
  ],
  "risk_delta": "<Overall risk went UP / DOWN / SAME>",
  "action_items": ["<specific actions the user should take>"]
}

Only include clauses that CHANGED (ADDED, REMOVED, MODIFIED). Skip SAME clauses unless they are critical.
Return ONLY valid JSON.`;
}

export function getNegotiationPrompt(
  clauseText: string,
  persona: string,
  exchangeNumber: number,
  userMessage: string,
  conversationHistory: string
): string {
  const personaDetails: Record<string, string> = {
    landlord: "You are a landlord in an Indian city. You want to protect your property investment. You are firm but not unreasonable. You've had bad tenant experiences. You prefer longer lock-in periods and security deposits.",
    employer: "You are an HR manager at an Indian company. You follow company policy but have some flexibility. You want to retain talent but protect company interests. You can negotiate on notice periods and non-competes.",
    client: "You are a client hiring a freelancer in India. You want maximum IP ownership and minimum liability. You're cost-conscious but value quality work. You can be flexible on payment terms.",
  };

  return `You are roleplaying as a ${persona} in a contract negotiation in India.

CHARACTER: ${personaDetails[persona] || personaDetails.landlord}

THE CLAUSE BEING NEGOTIATED:
"""
${clauseText}
"""

CONVERSATION SO FAR:
${conversationHistory}

USER'S LATEST MESSAGE: "${userMessage}"

EXCHANGE NUMBER: ${exchangeNumber}/3

RULES:
- Stay in character as the ${persona}
- Exchange 1-2: Push back reasonably, explain your concerns
- Exchange 3: You MUST offer a compromise or concession
- Be realistic — this should feel like a real Indian negotiation
- Keep responses to 2-4 sentences
- Use natural conversational tone (not legal jargon)
${exchangeNumber >= 3 ? "- THIS IS THE FINAL EXCHANGE: You must offer a compromise. Find middle ground." : ""}

Respond in character. No JSON — just the dialogue response.`;
}

export function getNegotiationDebriefPrompt(conversationHistory: string, clauseText: string): string {
  return `Analyze this negotiation practice session.

CLAUSE NEGOTIATED:
"""
${clauseText}
"""

FULL CONVERSATION:
${conversationHistory}

Return JSON:
{
  "outcome": "WIN" | "PARTIAL_WIN" | "STALEMATE" | "LOSS",
  "outcome_explanation": "<1 sentence what the user achieved>",
  "score": <1-10 negotiation skill score>,
  "what_worked": "<1-2 sentences on what the user did well>",
  "what_to_improve": "<1-2 sentences on what could be better>",
  "real_world_tip": "<1 practical tip for the actual real-world negotiation>",
  "probability_of_success": "<percentage chance this approach would work in real life>"
}

Return ONLY valid JSON.`;
}

export function getDisputeLetterPrompt(
  senderName: string,
  senderAddress: string,
  senderPhone: string,
  senderEmail: string,
  senderAdvocate: string,
  receiverName: string,
  receiverAddress: string,
  receiverDesignation: string,
  agreementDate: string,
  agreementType: string,
  clauseText: string,
  incidentDescription: string,
  incidentDate: string,
  reliefSought: string,
  documentType: string
): string {
  return `You are a senior Indian advocate with 20+ years experience, drafting a FORMAL LEGAL NOTICE under Section 80 of the Code of Civil Procedure, 1908 and other applicable provisions.

THIS MUST BE A PRODUCTION-READY LEGAL NOTICE — ready to print on advocate's letterhead, sign, notarize, and send via Registered A/D post.

══════════════════════════════════════
NOTICE DETAILS (SENDER / COMPLAINANT):
══════════════════════════════════════
Full Name: ${senderName}
Address: ${senderAddress}
Phone: ${senderPhone}
Email: ${senderEmail}
Through Advocate: ${senderAdvocate || "Self / In-Person"}

══════════════════════════════════════
NOTICEE (RECEIVER / OPPOSITE PARTY):
══════════════════════════════════════
Full Name / Entity: ${receiverName}
Address: ${receiverAddress}
Designation / Capacity: ${receiverDesignation || "N/A"}

══════════════════════════════════════
AGREEMENT / CONTRACT DETAILS:
══════════════════════════════════════
Type: ${agreementType} (${documentType})
Date of Agreement: ${agreementDate}

RELEVANT CLAUSE(S) VIOLATED:
"""
${clauseText}
"""

══════════════════════════════════════
INCIDENT / BREACH DETAILS:
══════════════════════════════════════
Date of Incident/Breach: ${incidentDate}
Description:
"""
${incidentDescription}
"""

══════════════════════════════════════
RELIEF / REMEDY SOUGHT:
══════════════════════════════════════
${reliefSought}

══════════════════════════════════════

DRAFT THE LEGAL NOTICE WITH THIS EXACT STRUCTURE:

1. **HEADER**: "LEGAL NOTICE" — centered, bold. Below it: "Under Section 80 CPC / Section 138 NI Act / applicable provision"

2. **DATE & REFERENCE**: Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} | Ref No: LN/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}

3. **TO (Noticee)**: Full name, address, designation — exactly as provided

4. **FROM (Through)**: Advocate name or "In-Person" with sender details

5. **SUBJECT Line**: "Legal Notice for [breach type] under [relevant Act]"

6. **BODY** with these MANDATORY paragraphs:
   a) **"AND WHEREAS"** — introduce the parties and the agreement (cite agreement date, type)
   b) **"AND WHEREAS"** — describe the specific clause(s) violated (quote clause verbatim)
   c) **"AND WHEREAS"** — describe the breach/incident in detail with date and facts
   d) **"AND WHEREAS"** — cite ALL applicable Indian laws with SPECIFIC SECTIONS:
      - Indian Contract Act, 1872 (relevant section)
      - Transfer of Property Act, 1882 (if applicable)
      - Consumer Protection Act, 2019 (if applicable)
      - Negotiable Instruments Act, 1881 (if cheque/payment related)
      - Indian Penal Code sections (if criminal breach of trust/cheating)
      - Any other relevant statute
   e) **"I/MY CLIENT HEREBY CALL UPON YOU"** — state the specific relief/remedy demanded
   f) **"PLEASE TAKE NOTICE"** — give 15-day deadline from receipt of notice
   g) **"FAILING WHICH"** — state that civil/criminal proceedings will be initiated before the appropriate court/forum/tribunal with full costs, damages, and compensation
   h) **"This notice is issued without prejudice to my client's rights"** — reserve all rights

7. **CLOSING**: 
   - "Yours faithfully,"
   - Advocate/Sender name
   - "Encl: Copy of Agreement / Supporting Documents"
   - "CC: Superintendent of Police / District Consumer Forum (if applicable)"

CRITICAL RULES:
- Use FORMAL legal English — "hereinafter", "whereas", "notwithstanding", "inter alia"
- Mention SPECIFIC section numbers of every law cited
- Make it INTIMIDATING but legally accurate
- Include "Sent via Registered Post A/D" at the top
- MINIMUM 800 words for the letter
- The notice should leave NO legal loophole
- This should be indistinguishable from a notice drafted by a practicing Indian advocate
- Use proper paragraph numbering (1, 2, 3...)

Return JSON:
{
  "letter": "<the complete formatted legal notice text — minimum 800 words>",
  "applicable_laws": ["Section 73, Indian Contract Act, 1872", "Section 74, Indian Contract Act, 1872", "<list ALL specific sections cited>"],
  "next_steps": "<detailed step-by-step advice: 1) Send via Registered A/D 2) Keep postal receipt 3) Wait 15 days 4) File suit if no response, mentioning which court/forum to approach>",
  "notice_ref": "LN/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}"
}

Return ONLY valid JSON. The letter MUST be complete and professional — not a template with blanks.`;
}

export function getBenchmarkPrompt(clauseType: string, clauseValue: string, docType: string): string {
  return `You are LexAI. Compare this clause against Indian market standards.

CLAUSE TYPE: ${clauseType}
CLAUSE VALUE/TERMS: "${clauseValue}"
DOCUMENT TYPE: ${docType}

Based on your knowledge of Indian contracts, return JSON:
{
  "your_value": "${clauseValue}",
  "market_standard": "<what's typical in Indian market for this clause type>",
  "percentile": <what percentage of Indian contracts have terms this favorable to the drafter, 0-100>,
  "verdict": "standard" | "above_market" | "below_market" | "unusual",
  "explanation": "<1-2 sentences explaining where this falls vs market>",
  "negotiation_script": "<exact words the user can say to negotiate this>"
}

Return ONLY valid JSON.`;
}
