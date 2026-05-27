import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#FAF7F2", card: "#F2EDE6", sidebar: "#EDE6DC", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830", textLight: "#7A7060",
  accent: "#3D6B21", accentDark: "#2D5016", dark: "#141410", gold: "#B8935A",
  white: "#FFFFFF", red: "#C0392B", amber: "#D4830A",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";

const GS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=EB+Garamond:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; } button { cursor: pointer; } textarea { outline: none; } textarea:focus { border-color: " + C.accent + " !important; } input:focus { outline: none; border-color: " + C.accent + " !important; } @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } } @keyframes spin { to { transform: rotate(360deg); } } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: " + C.border + "; border-radius: 3px; }";

// ─── TOOL CATEGORIES ──────────────────────────────────────────────────────────
const TOOL_CATEGORIES = [
  { id: "abm", label: "Account-Based Marketing (ABM)", tools: ["6sense", "Demandbase", "Terminus", "Rollworks", "HubSpot (ABM)"] },
  { id: "sales_engagement", label: "Sales Engagement", tools: ["Outreach", "Salesloft", "Apollo", "Groove"] },
  { id: "revenue_intelligence", label: "Revenue Intelligence", tools: ["Gong", "Chorus", "Clari", "Mediafly"] },
  { id: "data_enrichment", label: "Data & Enrichment", tools: ["ZoomInfo", "Clearbit", "Cognism", "Lusha"] },
  { id: "marketing_automation", label: "Marketing Automation", tools: ["Marketo", "HubSpot Marketing", "Pardot", "Eloqua"] },
  { id: "crm", label: "CRM", tools: ["Salesforce", "HubSpot CRM", "Microsoft Dynamics", "Pipedrive"] },
];

// ─── TRACK 1: STRATEGIC CORE QUESTIONS ────────────────────────────────────────
const CORE_QUESTIONS = [
  {
    id: "problem", layer: 1,
    text: "What problem are you trying to solve, and why now?",
    hint: "Include your team size, go-to-market motion, and what's breaking or missing today.",
    type: "text",
  },
  {
    id: "maturity", layer: 1,
    text: "Has your team used tools in this category before?",
    hint: "Be honest — what happened last time tells us more than what you're hoping for this time.",
    type: "choice",
    options: ["First time evaluating this category", "Tried it, never got traction", "Done it before, migrating platforms", "We have a mature program we're expanding"],
    branch: {
      trigger: ["Tried it, never got traction", "Done it before, migrating platforms"],
      id: "maturity_detail",
      text: "What happened? What broke, what didn't work, or why are you switching?",
      hint: "This is one of the most predictive inputs in your report.",
      type: "text",
    },
  },
  {
    id: "ops_support", layer: 1,
    text: "Who will own this tool once it's live?",
    hint: "The person who buys it and the person who runs it are rarely the same. Who's the operator?",
    type: "choice",
    options: ["Dedicated marketing or revenue ops person", "Shared ops resource, part time", "Whoever buys it will figure it out", "We're planning to hire for this"],
    branch: {
      trigger: ["Whoever buys it will figure it out", "We're planning to hire for this"],
      id: "ops_detail",
      text: "Who is the most likely internal owner, and what is their current capacity?",
      hint: "Tools without a named operator fail within 90 days.",
      type: "text",
    },
  },
  {
    id: "stack", layer: 1,
    text: "List your current stack — CRM, MAP, data provider, engagement tools. For each, be honest about whether it's healthy and actually being used as intended.",
    hint: "Don't just list tools. Tell us if the data is clean, if people use it, and if it's integrated.",
    type: "text",
  },
  {
    id: "data_quality", layer: 2,
    text: "How would you describe your CRM data quality right now?",
    hint: "This single factor predicts implementation success more than anything else.",
    type: "choice",
    options: ["Clean and well-governed", "Decent with some gaps", "Messy but functional", "It's a disaster and we know it"],
    branch: {
      trigger: ["Messy but functional", "It's a disaster and we know it"],
      id: "data_detail",
      text: "What's the primary cause — bad input, no ownership, data decay, or something else? Is there a plan to fix it?",
      hint: "The plan matters as much as the problem.",
      type: "text",
    },
  },
  {
    id: "change_readiness", layer: 2,
    text: "How would you describe your organization's appetite for change right now?",
    hint: "The tool is rarely the problem. Organizational readiness is.",
    type: "choice",
    options: ["High — leadership is aligned and pushing", "Medium — willing but cautious", "Low — people are change-fatigued", "Unknown — we haven't tested it"],
    branch: {
      trigger: ["Low — people are change-fatigued", "Unknown — we haven't tested it"],
      id: "change_detail",
      text: "What's driving the fatigue or uncertainty? Recent reorg, too many tools, prior failed implementations?",
      hint: "Pattern recognition here prevents the same failure from happening again.",
      type: "text",
    },
  },
  {
    id: "budget", layer: 2,
    text: "What is your total budget — license plus implementation combined?",
    hint: "Implementation, integrations, admin, and training can easily match the license cost in year one.",
    type: "choice",
    options: ["Under $30K total", "$30K to $75K", "$75K to $150K", "$150K or more", "Not sure yet"],
    branch: {
      trigger: ["Not sure yet"],
      id: "budget_detail",
      text: "What's driving the uncertainty — no budget allocated, waiting for approval, or still scoping?",
      hint: "This affects which tools are even worth evaluating.",
      type: "text",
    },
  },
  {
    id: "timeline", layer: 2,
    text: "Is there a hard deadline driving this decision?",
    hint: "Timeline pressure is one of the biggest predictors of a rough implementation.",
    type: "choice",
    options: ["Hard deadline, under 60 days", "3 to 6 months, some flexibility", "No pressure, doing this right", "Still in internal alignment"],
    branch: {
      trigger: ["Hard deadline, under 60 days"],
      id: "timeline_detail",
      text: "What's driving the deadline — board pressure, a campaign, a new hire, a contract expiration?",
      hint: "Artificial deadlines are negotiable. Real ones change the recommendation.",
      type: "text",
    },
  },
];

// ─── TRACK 2: DEEP INFRASTRUCTURE STACK QUESTIONS ──────────────────────────────
const STACK_CORE_QUESTIONS = [
  {
    id: "data_flow_direction", layer: 1,
    text: "How do you expect data to flow between the new tool and your CRM?",
    hint: "Are you looking for a 1-way read, a 1-way write-back, or a fully automated bi-directional sync? Be specific about what system must be the 'source of truth'.",
    type: "text"
  },
  {
    id: "custom_objects", layer: 1,
    text: "Does your current CRM rely heavily on custom objects or non-standard fields for your sales motions?",
    hint: "Standard field mapping is easy. If your pipeline or account routing runs on heavily customized architecture, outline it here.",
    type: "text"
  },
  {
    id: "api_governance", layer: 1,
    text: "Who manages your API limits, authentication protocols, and integration middleware?",
    hint: "Do you use tools like Zapier, Make, or Workato, or do you rely entirely on native plug-and-play marketplace packages?",
    type: "choice",
    options: ["Native marketplace connectors only", "Middleware platforms (Zapier/Make/Workato)", "Custom internal APIs / Developer team required", "We don't have a structured approach to APIs yet"]
  },
  {
    id: "identity_resolution", layer: 2,
    text: "How do you currently deduplicate and resolve account or contact conflicts?",
    hint: "If two systems have conflicting data for the same person (e.g., different phone numbers), which system is hardcoded to win?",
    type: "choice",
    options: ["CRM settings strictly govern overwrite rules", "We use a dedicated data hygiene tool (e.g., LeanData/Insycle)", "Reps manually clean duplicates as they find them", "We have no automated duplication governance right now"]
  },
  {
    id: "historical_backfill", layer: 2,
    text: "Do you need to migrate or backfill historical activity metrics into the new tool?",
    hint: "Moving live pipelines is standard. Backfilling 3 years of email histories and call logs adds massive infrastructure complexity.",
    type: "choice",
    options: ["No historical data — starting fresh from day one", "Open opportunities and active accounts only", "Full historical log backfill (activities, closed deals, metrics)", "Not sure what our historical data requirement is yet"]
  }
];

// ─── CATEGORY-SPECIFIC PATH QUESTIONS ─────────────────────────────────────────
const CATEGORY_QUESTIONS = {
  abm: [
    {
      id: "abm_account_list", layer: 1,
      text: "How many target accounts are you working with?",
      hint: "200 tightly defined accounts and 10,000 loosely defined ones require very different tools.",
      type: "choice",
      options: ["Fewer than 250 — tightly defined", "250 to 1,000", "1,000 to 5,000", "More than 5,000 — broadly defined"],
    },
    {
      id: "abm_sales_sponsor", layer: 1,
      text: "Is there a named sales leader sponsoring this initiative who has committed to changing how their team works accounts?",
      hint: "Right tool plus bad implementation plus no sponsorship is an expensive mistake.",
      type: "choice",
      options: ["Yes — named sponsor, fully committed", "Sales knows about it but hasn't committed to behavior change", "Marketing is driving this, sales will be informed after", "We haven't had that conversation yet"],
    },
    {
      id: "abm_intent", layer: 2,
      text: "Has your team used intent data before?",
      hint: "Intent data is only valuable if you have workflows to act on it.",
      type: "choice",
      options: ["Yes, and we have workflows built around it", "Yes, but we never really trusted or acted on it", "No, this would be our first time", "Not sure what intent data means in practice"],
    },
  ],
  sales_engagement: [
    {
      id: "se_sponsor", layer: 1,
      text: "Is there a named sales leader who will enforce adoption of this tool?",
      hint: "Tools that are optional are dead within 90 days.",
      type: "choice",
      options: ["Yes — it's in their QBR and they're measuring it", "There's interest but no enforcement plan", "This is being pushed on sales from above", "Sales doesn't know about this yet"],
    },
    {
      id: "se_sequences", layer: 1,
      text: "Who owns your sales sequence and cadence library?",
      hint: "If every rep writes their own sequences, you have a content problem that no tool fixes.",
      type: "choice",
      options: ["Marketing owns it — documented and maintained", "Sales ops owns it", "Individual reps write their own", "We don't have sequences yet"],
    },
  ],
  revenue_intelligence: [
    {
      id: "ri_legal", layer: 1,
      text: "Has your legal team reviewed call recording consent requirements for every state and country your reps sell into?",
      hint: "Two-party consent states include California, Illinois, Florida, and others. This needs legal review before go-live.",
      type: "choice",
      options: ["Yes — legal has signed off, consent workflows are in place", "We're aware of it but haven't formally addressed it", "We didn't know this was a legal issue", "We only sell domestically and assumed it was fine"],
    },
  ],
  data_enrichment: [
    {
      id: "de_usecase", layer: 1,
      text: "What specifically are you enriching?",
      hint: "Prospecting lists, CRM contacts, and inbound leads each require different data and different workflows.",
      type: "choice",
      options: ["Prospecting — building new outbound lists", "CRM enrichment — filling gaps in existing records", "Inbound enrichment — appending data to form fills", "All three", "Not sure yet"],
    },
  ],
  marketing_automation: [
    {
      id: "ma_database", layer: 1,
      text: "How would you describe your current contact database — is it segmented, clean, and ready to activate?",
      hint: "Platform selection depends heavily on database readiness, not just size.",
      type: "choice",
      options: ["Yes — segmented by persona, clean, ready to run programs", "Partially — some segments solid, others need work", "No — needs significant cleanup before we can activate", "We don't have a database yet — building from scratch"],
    },
  ],
  crm: [
    {
      id: "crm_consolidation", layer: 1,
      text: "Are you implementing a single new CRM or consolidating multiple existing instances?",
      hint: "PE rollup and acquisition scenarios are a fundamentally different implementation — plan accordingly.",
      type: "choice",
      options: ["Single implementation — one system, one migration", "Consolidating two systems", "Consolidating three or more — PE rollup or acquisition scenario", "Partially consolidated — some business units still on separate systems"],
    },
  ],
};

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const EVAL_PROMPT = `You are Delphi, an independent software evaluation analyst for B2B SaaS buyers. You have no financial relationship with any vendor. Your job is to help buyers understand the gap between what a software tool actually requires and where their organization currently stands.

CRITICAL: The very first line of your output must be ## What We Heard. Do not write a title, introduction, or any other section before it. Nothing before ## What We Heard.

CONTEXT: This report is written for a buyer who is still in the buying phase. They have not made a decision. Do not assume they are ready to implement now.

IMPORTANT ON SHORTLIST HANDLING: Evaluate all items passed under the shortlist array. If an unknown, custom, or custom typed tool is listed on the shortlist that you do not have native database documentation for, you MUST still include it in all tables, scores, metrics, and comparisons. For custom entries, deduce requirements logically based on standard software constraints typical of that primary evaluation category.

IRONCLAD RULES — these override everything else:
- NEVER mention any tool, vendor, or product not explicitly on the buyer's shortlist. Not as a comparison. Not as an example. Not anywhere.
- NEVER fabricate URLs. Only include URLs retrieved via web search in this session. If you cannot find a real URL, omit the source entirely.
- NEVER use days for implementation timelines. Use weeks only.
- NEVER include budget ranges from memory. If you can verify current pricing via web search, include it flagged as approximate. If you cannot verify it, say "pricing requires a direct quote from the vendor."
- NEVER reference account hierarchies, buying committees, or other concepts unless the buyer mentioned them in their answers.
- The "What You Should Know" section is ONLY about vendor-specific gotchas and hidden requirements for the tools on the shortlist — not ABM education, not general implementation advice.

READING THE BUYER'S ANSWERS:
- Text field answers take priority over choice answers. When both exist, reason from the text field first.
- Take stated timelines seriously. If something resolves before implementation begins, do not flag it. Frame it as: when you are ready for implementation, this will not be an issue.
- Do not project org structures the buyer did not describe.
- Never flag problems the buyer has already told you are solved or nearly solved.
- Never make assumptions about what a buyer does not have. Work only from what they told you.
- If a buyer says they have dedicated resources for something, do not flag that thing as a resource risk.
- If a buyer describes a sequenced plan — selecting a tool, then signing, then beginning implementation after a known dependency resolves — recognize that as organized planning, not a risk. Do not flag the sequencing as a problem.

TONE:
- Matter-of-fact. State facts without assigning emotional weight.
- Guidance over assumption. Describe what the tool requires. Let the buyer assess whether they have it.
- Balanced. Not doom-and-gloom. Not sunshine.
- Align the change management assessment with the recommended tool's actual requirements — not the heaviest tool on the list.

CATEGORY-SPECIFIC LOGIC:
- For niche markets with known, finite TAMs: deterministic intent data (Demandbase approach) delivers faster ROI than probabilistic models (6sense approach). A buyer who knows every account in their market does not need AI to surface unknown buyers. Recommend accordingly.
- Spell tool names correctly: 6sense not Six Sense, Demandbase not DemandBase.

Use ONLY these exact section headers, in this order:
## What We Heard
## Your Shortlist, Assessed
## Readiness Score
## What You Should Know
## Questions to Ask During the Sales Cycle
## Our Recommendation
## Sources

SECTION REQUIREMENTS:

**What We Heard** — Read between the lines. Arrive somewhere the buyer has not articulated yet. Do not restate their answers. Do not open with "Based on what you shared" or any similar phrase. Write as a senior adviser who has seen this situation before.

Immediately after the summary paragraph, write:
| Tool | Score | Budget Fit | Readiness Match | Our Take |
- Order tools from most recommended to least recommended
- Score is X/5 based on fit for this specific buyer's situation
- Our Take is one sharp sentence per tool
- This table is what an executive reads first

**Your Shortlist, Assessed** — Order tools from most recommended to least. For each tool, open with a header line in EXACTLY this format — do not add any other text, numbers, or characters to this line:
ToolName | X/5 | Budget: [one word or short phrase] | Readiness: [one word or short phrase]

Example: Salesloft | 4/5 | Budget: Strong fit | Readiness: Excellent match

Then write the assessment using these exact field labels on their own lines followed immediately by the content on the next line. Use plain prose only — no bullet points, no dashes, no lists inside any field. The renderer handles all formatting.

What it does well:
[2-3 sentences of plain prose specific to this buyer's situation]

What it does not do well:
[2-3 sentences of plain prose — only weaknesses relevant to this buyer. Requirements are not weaknesses.]

Implementation timeline:
[X to Y weeks — driven by specific dependency explained in plain prose]

Pricing:
[Verified price or "Requires direct quote from vendor." Plain prose only. Do NOT repeat pricing information anywhere else in the assessment — pricing belongs only in this field.]

Integration requirements:
[Plain prose about their specific CRM and MAP only]

Bottom line:
[One direct sentence on fit for this buyer]

**Readiness Score** — Structure in this exact order:
1. Opening paragraph: 2-3 sentences on what the Readiness Score measures and why this page matters. End after "implement successfully." Do not editorialize further.
2. OVERALL READINESS: X/5
3. | Dimension | Score | Status |
4. How We Score Readiness methodology
5. Detailed analysis per dimension

How We Score Readiness — write this as a compact reference table immediately after the dimensional summary table:
| Score | What It Means |
| 1–2 | Address before go-live |
| 3 | Manageable with preparation |
| 4–5 | Strong foundation |

The six dimensions:
1. Data Readiness — does your data quality and structure meet what this tool requires
2. Ops Capacity — does this implementation have the participation it requires from your team
3. Sales and Marketing Alignment — are the teams aligned on goals, process, and this initiative
4. Change Management — are the processes this tool requires ready to change
5. Integration Readiness — does your existing stack support what this integration needs
6. Executive Sponsorship — is there a named leader with authority who owns this initiative

For each dimension: state the score, describe the current situation factually, explain what the tool requires from this dimension, give one concrete action if there is a gap. Account for stated timelines.

**What You Should Know** — Vendor-specific gotchas and hidden requirements for the tools on the shortlist only. Things the vendor's sales team will not volunteer.

CRITICAL FORMAT REQUIREMENT: For each tool, use an independent subheader section inside double asterisks containing the vendor name, followed immediately by standard thematic bullet rows. Example formatting:
**Salesforce Integration Specifics**
The tool requires custom objects...

Every point must be:
- Directly tied to a specific tool on the shortlist and this buyer's situation
- A fact the vendor will not proactively share
- Attributed to a named source inline where possible
- Not a problem the buyer already told you is solved
- Not a reference to any tool not on the shortlist
- Not general category education

Each point must be distinct — do not repeat the same information in different words. If you've said it once, do not say it again under a different header.

Do not invent stack problems. If the buyer said a system is working — it is working.

**Questions to Ask During the Sales Cycle** — 5-7 questions structured as:

Ask All Vendors:
1. [Question — no quotes]
What to listen for: [one sentence of guidance]

Ask [Vendor A] specifically:
1. [Question]
What to listen for: [one sentence]

Ask [Vendor B] specifically:
1. [Question]
What to listen for: [one sentence]

Numbers restart at 1 for each vendor group. No quotes around questions.

**Our Recommendation** —
We recommend [Tool Name].
[Two to four sentences: why this tool fits this buyer's specific situation — their market, team, data, and sales cycle. Fit for purpose only. Not price. Not simplicity.]

For each tool NOT recommended, write one sentence:
[Tool] is [genuine strength] but is not the best fit for your scenario because [specific reason tied to this buyer's situation].

**Sources** — ONLY include sources for tools the buyer explicitly listed on their shortlist. Do not include sources for any other tool.

Use web search to find real URLs. Only include URLs you retrieved in this session. Do not fabricate URLs. If you cannot find a real URL, omit it.

Format the section with exactly two headers followed by their links:

G2 Reviews
[tool name] G2 Reviews
[url]

Vendor Documentation
[tool name] Knowledge Base
[url]

Search for tools on the buyer's shortlist:
- G2: search "site:g2.com [toolname] reviews"
- Gartner Magic Quadrant or Forrester Wave for the category
- Vendor documentation starting points:
  - Demandbase: support.demandbase.com or docs.demandbase.com
  - 6sense: support.6sense.com or docs.6sense.com
  - Terminus: support.terminus.com or help.terminus.com
  - Outreach: support.outreach.io or university.outreach.io
  - Salesloft: support.salesloft.com or help.salesloft.com
  - Gong: help.gong.io or support.gong.io
  - ZoomInfo: university.zoominfo.com or help.zoominfo.com
  - Apollo: knowledge.apollo.io or help.apollo.io
  - HubSpot: knowledge.hubspot.com
  - Marketo: experienceleague.adobe.com/en/docs/marketo
  - Clearbit: clearbit.com/docs or developer.clearbit.com
  - Cognism: help.cognism.com
  - Lusha: help.lusha.com
  - Groove: help.groove.co or support.groove.co
  - Clari: help.clari.com
  - Mediafly: help.mediafly.com
  - Pardot: help.salesforce.com/s/articleView?id=sf.pardot_overview.htm
  - Eloqua: docs.oracle.com/en/cloud/saas/marketing/eloqua-user
  - Rollworks: help.rollworks.com
  - Chorus: help.chorus.ai
  - Pipedrive: support.pipedrive.com
  - Microsoft Dynamics: learn.microsoft.com/dynamics365
  - Salesforce CRM: help.salesforce.com

Do not include marketing pages, pricing pages, homepage URLs, or any tool not on the buyer's shortlist.
Format: plain label on one line, plain URL on next line. No markdown link syntax.`;

const STACK_PROMPT = `You are Delphi, an independent software implementation analyst for B2B SaaS buyers. You have no financial relationship with any vendor. A buyer has a shortlist and needs to understand what their existing stack and team will need to do to make each tool work.

CRITICAL: The very first line of your output must be ## What We Heard. Nothing before ## What We Heard.

IMPORTANT ON CONSIDERED TOOLS: Evaluate all entries passed under the tools being considered array. You must generate comparative assessments for ALL tools on the shortlist within the same output.

IRONCLAD RULES:
- NEVER mention any tool not on the buyer's shortlist.
- NEVER fabricate URLs. Only include URLs retrieved via web search in this session.
- NEVER use days for timelines. Use weeks only.
- NEVER include pricing from memory. Verify via web search or say "pricing requires a direct quote."

READING THE BUYER'S ANSWERS:
- Text field answers take priority over choice answers.
- Take stated timelines seriously. Only flag dependencies that genuinely extend beyond a typical sales cycle.
- Do not project org structures the buyer did not describe.
- Never flag problems the buyer said are solved or nearly solved.
- Guidance over assumption: describe what the integration requires, not what the buyer lacks.

TONE: Matter-of-fact. Balanced. The buyer makes the final decision.

Use ONLY these exact section headers, in this order:
## What We Heard
## Stack Compatibility Assessment
## Integration Readiness
## What You Should Know
## Questions to Ask During the Sales Cycle
## Our Compatibility Verdict
## Sources

SECTION REQUIREMENTS:

**What We Heard** — Read between the lines. Real read of their stack situation. Do not restate answers. Do not open with "Based on what you shared."

Immediately after the summary paragraph:
| Tool | Score | Stack Compatibility | Integration Complexity | Our Take |
- Order from most compatible to least
- Score X/5, Our Take one sharp sentence

**Stack Compatibility Assessment** — Order most to least compatible. For each tool, open with a header line in EXACTLY this format to feed the engine's parsing metrics — do not add any other text, numbers, or characters to this line:
ToolName | X/5 | Stack Compatibility: [one word] | Integration Complexity: [one word]

Then write the assessment using these exact field labels on their own lines followed immediately by the content on the next line. Use plain prose only — no bullet points, no dashes, no lists inside any field.

What it does well:
[2-3 sentences of plain prose specific to this buyer's situation]

What it does not do well:
[2-3 sentences of plain prose specific to this buyer's configuration dependencies]

Implementation timeline:
[X to Y weeks — driven by specific technical requirements or workflows]

Pricing:
[Verified price or "Requires direct quote from vendor."]

Integration requirements:
[Plain prose detailing specific CRM and MAP hooks]

Bottom line:
[One direct sentence on stack compatibility for this buyer]

**Integration Readiness** — Opening paragraph: 2-3 sentences on what the Integration Readiness Score measures and why this page matters. End after "implement successfully." Do not editorialize further.
OVERALL COMPATIBILITY: X/5
| Dimension | Score | Status |

Then use a summary legend table:
| Score | What It Means |
| 1–2 | Address before go-live |
| 3 | Manageable with preparation |
| 4–5 | Strong foundation |

The five dimensions:
1. Integration Ownership Clarity
2. Current Stack Health
3. Data Model Maturity
4. Team Capacity for New Integrations
5. Historical Integration Track Record

For each dimension, print the header row using this exact format:
Dimension Name | X/5
[Fact breakdown paragraph explaining what this tool integration expects from your stack and how to cover infrastructure gaps.]

**What You Should Know** — Vendor-specific integration gotchas for tools on the shortlist only. No general advice. No tools not on the shortlist.
CRITICAL FORMAT REQUIREMENT: For each tool, use an independent subheader section inside double asterisks containing the vendor name, followed immediately by standard thematic bullet rows. Example formatting:
**6sense Integration Specifics**
The platform requires custom...

**Questions to Ask During the Sales Cycle** —
Ask All Vendors:
1. [Question]
What to listen for: [one sentence]

Ask [Vendor] specifically:
1. [Question]
What to listen for: [one sentence]

**Our Compatibility Verdict** —
Rather than recommending a single product, write an unbiased implementation checklist for the buyer. Break down the Technical Debt Assessment and Implementation Risk Profile for each tool on their list. Structure it as a cold, practical evaluation of what they must build or prepare to integrate each system safely.

**Sources** — Real URLs from web search only. No fabricated URLs. G2 product pages, Gartner/Forrester, vendor integration docs. No marketing pages. Note G2 reviews were referenced. Plain label, plain URL, one per line.`;

// ─── PARSING & RENDERING UTILITIES ───────────────────────────────────────────

function cleanModelText(text) {
  if (!text) return "";

  let cleaned = text.replace(/\[\d+\]/g, "").replace(/\[Source[^\]]*\]/gi, "");
  cleaned = cleaned.replace(/\s+\./g, ".").replace(/\s+,/g, ",");

  const lines = cleaned.split("\n");
  const joined = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    const next = j < lines.length ? lines[j].trim() : null;
    
    const currentEndsIncomplete = trimmed && !trimmed.match(/[.!?:]$/) && !trimmed.startsWith("#") && !trimmed.startsWith("|") && !trimmed.match(/^\d+\/5/);
    const nextIsContinuation = next && /^[A-Za-z]/.test(next) && !next.startsWith("##") && !next.startsWith("###") && !next.startsWith("|");
    
    if (currentEndsIncomplete && nextIsContinuation) {
      joined.push(trimmed + " " + next);
      i = j + 1;
    } else {
      joined.push(line);
      i++;
    }
  }
  
  return joined
    .map(line => {
      const t = line.trim();
      if (t === "." || t === ",") return "";
      return line;
    })
    .filter(line => {
      const t = line.trim();
      return t !== "" && !t.match(/^[.,;!?:]\s*$/);
    })
    .join("\n");
}

const VALID_EVAL_SECTIONS = new Set(["What We Heard", "Your Shortlist, Assessed", "Readiness Score", "What You Should Know", "Questions to Ask During the Sales Cycle", "Our Recommendation", "Sources"]);
const VALID_STACK_SECTIONS = new Set(["What We Heard", "Stack Compatibility Assessment", "Integration Readiness", "What You Should Know", "Questions to Ask During the Sales Cycle", "Our Compatibility Verdict", "Sources"]);

function parseReport(text, type = "evaluation") {
  const validSections = type === "stack_fit" ? VALID_STACK_SECTIONS : VALID_EVAL_SECTIONS;
  const cleaned = cleanModelText(text);
  const sections = [];
  let current = null;
  for (const line of cleaned.split("\n")) {
    if (line.startsWith("## ")) {
      const title = line.replace("## ", "").trim();
      if (current && current.content.some(l => l.trim())) sections.push(current);
      if (validSections.has(title)) {
        current = { title, content: [] };
      } else {
        current = null;
      }
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current && current.content.some(l => l.trim())) sections.push(current);
  return sections;
}

function renderContent(content, sectionTitle) {
  const lines = content.join("\n").split("\n");
  const elements = [];
  let i = 0;

  let inVendorCard = false;
  let cardRawLines = [];
  let cardToolName = null;
  let cardMeta = null;
  let cardIsRecommended = false;
  let questionCounter = 0;
  let inQuestionGroup = false;
  let questionGroupItems = [];
  let questionGroupHeader = null;
  let vendorCardCount = 0;

  const flushVendorCard = (key) => {
    if (!cardToolName) return;

    const fieldLabels = ["What it does well", "What it does not do well", "Implementation timeline", "Pricing", "Integration requirements", "Bottom line"];
    const fieldData = {};
    let currentField = null;
    let currentText = [];

    cardRawLines.forEach(line => {
      const matched = fieldLabels.find(l => line.trim().startsWith(l + ":"));
      if (matched) {
        if (currentField) fieldData[currentField] = currentText.join(" ").trim();
        currentField = matched;
        currentText = [line.trim().slice(matched.length + 1).trim()];
      } else if (currentField && line.trim()) {
        const cleaned = line.trim().replace(/^[-•]\s+/, "");
        if (cleaned) currentText.push(cleaned);
      }
    });
    if (currentField) fieldData[currentField] = currentText.join(" ").trim();

    const gridFields = [
      ["What it does well", "What it does not do well"],
      ["Implementation timeline", "Pricing"],
    ];

    const gridContent = gridFields.map((pair, pi) => (
      <div key={`grid-${pi}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", borderBottom: "1px solid " + C.border, padding: "14px 20px" }}>
        {pair.map(field => (
          <div key={field}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "0 0 6px", fontFamily: FF }}>{field}</p>
            <p style={{ fontSize: 15, color: C.textMid, margin: 0, lineHeight: 1.75, fontFamily: FF }}>{fieldData[field] || "—"}</p>
          </div>
        ))}
      </div>
    ));

    const integrationContent = fieldData["Integration requirements"] ? (
      <div style={{ padding: "14px 20px", borderBottom: "1px solid " + C.border }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "0 0 6px", fontFamily: FF }}>Integration requirements</p>
        <p style={{ fontSize: 15, color: C.textMid, margin: 0, lineHeight: 1.75, fontFamily: FF }}>{fieldData["Integration requirements"]}</p>
      </div>
    ) : null;

    const bottomLine = fieldData["Bottom line"] ? (
      <div style={{ padding: "14px 20px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "0 0 6px", fontFamily: FF }}>Bottom line</p>
        <p style={{ fontSize: 15, color: C.textMid, margin: 0, lineHeight: 1.75, fontFamily: FF, fontStyle: "italic" }}>{fieldData["Bottom line"]}</p>
      </div>
    ) : null;

    elements.push(
      <div style={{ marginBottom: 28 }} key={`vendor-${key}`}>
        <div style={{ background: C.accent, borderRadius: "6px 6px 0 0", padding: "14px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: FFD, margin: "0 0 4px" }}>{cardToolName}</p>
            {cardMeta && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, fontFamily: FF }}>{cardMeta}</p>}
          </div>
          {cardIsRecommended && (
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, padding: "3px 10px", fontSize: 11, color: C.white, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>Recommended</span>
          )}
        </div>
        <div style={{ border: "1px solid " + C.border, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
          {gridContent}
          {integrationContent}
          {bottomLine}
        </div>
      </div>
    );
    cardToolName = null;
    cardMeta = null;
    cardRawLines = [];
    cardIsRecommended = false;
    inVendorCard = false;
  };

  const flushQuestionGroup = (key) => {
    if (!questionGroupHeader) return;
    questionCounter = 0;
    elements.push(
      <div style={{ marginBottom: 24 }} key={`qgroup-${key}`}>
        <div style={{ background: C.accent, borderRadius: "6px 6px 0 0", padding: "10px 18px" }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.white }}>{questionGroupHeader}</span>
        </div>
        <div style={{ border: "0.5px solid " + C.border, borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
          {questionGroupItems}
        </div>
      </div>
    );
    questionGroupHeader = null;
    questionGroupItems = [];
    inQuestionGroup = false;
  };

  const isQuestionsSection = sectionTitle && sectionTitle.includes("Questions to Ask");

  while (i < lines.length) {
    let line = lines[i];
    if (!line.trim()) { i++; continue; }

    const clean = line.replace(/\*\*(.*?)\*\//g, "$1").replace(/\*\/g, "");

    if (line.trim().startsWith("|")) {
      if (inVendorCard) flushVendorCard(i);
      if (inQuestionGroup) flushQuestionGroup(i);
      const rows = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        if (!lines[j].match(/^\s*\|[\s-:]+\|/)) rows.push(lines[j]);
        j++;
      }
      if (rows.length >= 2) {
        const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
        const data = rows.slice(1).map(r => r.split("|").map(c => c.trim()).filter(Boolean));

        const isLegendTable = headers.length === 2 && headers[0].toLowerCase().includes("score") && headers[1].toLowerCase().includes("mean");
        if (isLegendTable) {
          elements.push(
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "8px 0 20px", padding: "10px 14px", background: C.card, borderRadius: 6, border: "1px solid " + C.border }} key={i}>
              {data.map((row, j) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }} key={j}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FF }}>{row[0]}</span>
                  <span style={{ fontSize: 13, color: C.textMid, fontFamily: FF }}>— {row[1]}</span>
                  {j < data.length - 1 && <span style={{ color: C.border, marginLeft: 8 }}>·</span>}
                </div>
              ))}
            </div>
          );
          i = j; continue;
        }

        elements.push(
          <div style={{ overflowX: "auto", margin: "12px 0" }} key={i}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: FF }}>
              <thead>
                <tr style={{ background: C.accent }}>
                  {headers.map((h, j) => <th style={{ padding: "10px 14px", textAlign: "left", color: C.white, fontWeight: 700, fontSize: 13 }} key={j}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, j) => (
                  <tr style={{ background: j % 2 === 0 ? C.white : C.card, borderBottom: "1px solid " + C.border }} key={j}>
                    {row.map((cell, k) => <td style={{ padding: "10px 14px", color: C.textMid, lineHeight: 1.5 }} key={k}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        i = j; continue;
      }
    }

    const rawHeaderLine = line.trim().startsWith("### ") ? line.trim().replace("### ", "") : line.trim();
    if (!isQuestionsSection && !rawHeaderLine.startsWith("|") && (rawHeaderLine.includes("|") && rawHeaderLine.match(/\d+\/5/))) {
      if (inVendorCard) flushVendorCard(i);
      const parts = rawHeaderLine.split("|").map(p => p.trim());
      cardToolName = parts[0].replace(/\*\*/g, "");
      
      cardMeta = parts.slice(1).map(p => {
        return p.replace(/Budget:\s*/i, "")
                .replace(/Readiness:\s*/i, "")
                .replace(/Stack Compatibility:\s*/i, "")
                .replace(/Integration Complexity:\s*/i, "")
                .replace(/\*\*/g, "");
      }).join(" · ");
      
      cardIsRecommended = vendorCardCount === 0;
      vendorCardCount++;
      inVendorCard = true;
      i++; continue;
    }

    if (inVendorCard) {
      cardRawLines.push(line);
      i++; continue;
    }

    if (isQuestionsSection) {
      const cleanLine = line.trim().replace(/^\*+/, "").replace(/\*+$/, "");
      const isAskAll = cleanLine === "Ask All Vendors:" || cleanLine === "Ask All Vendors";
      const isAskVendor = cleanLine.match(/^Ask .+ specifically:?$/) !== null;
      if (isAskAll || isAskVendor) {
        if (inQuestionGroup) flushQuestionGroup(i);
        questionCounter = 0;
        questionGroupHeader = cleanLine.replace(/:$/, "");
        inQuestionGroup = true;
        i++; continue;
      }

      if (inQuestionGroup && /^\d+\./.test(line.trim())) {
        questionCounter++;
        const questionText = line.trim().replace(/^\d+\.\s*/, "");
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        let guidance = null;
        if (j < lines.length) {
          const nextLine = lines[j].trim().replace(/^\*+/, "").replace(/\*+$/, "");
          if (nextLine.startsWith("What to listen for:")) {
            guidance = nextLine.replace("What to listen for:", "").trim();
            j++;
          }
        }
        questionGroupItems.push(
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid " + C.border }} key={`q-${i}`}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.accent, flexShrink: 0, minWidth: 22, lineHeight: 1.75 }}>{questionCounter}.</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, color: C.text, margin: "0 0 6px", lineHeight: 1.75, fontFamily: FF }}>{questionText}</p>
                {guidance && <p style={{ fontSize: 15, color: C.textLight, margin: 0, lineHeight: 1.6, fontStyle: "italic", fontFamily: FF }}>{guidance}</p>}
              </div>
            </div>
          </div>
        );
        i = guidance !== null ? j : i + 1;
        continue;
      }

      if (inQuestionGroup) {
        i++; continue;
      }
    }

    if (/^OVERALL (READINESS|COMPATIBILITY):/i.test(line)) {
      const match = line.match(/(\d(?:\.\d)?)\s*\/\s*5/);
      const score = match ? parseFloat(match[1]) : null;
      if (score !== null) {
        const color = score <= 2 ? C.red : score <= 3 ? C.amber : C.accent;
        const label = score <= 2 ? "Needs attention before purchasing" : score <= 3 ? "Proceed with preparation" : "Well positioned";
        elements.push(
          <div style={{ background: color, borderRadius: 8, padding: "20px 24px", margin: "16px 0 24px", display: "flex", alignItems: "center", gap: 24 }} key={i}>
            <div style={{ textAlign: "center", flexShrink: 0, minWidth: 80 }}>
              <div style={{ fontSize: 64, fontWeight: 700, color: C.white, lineHeight: 1, fontFamily: FFD }}>{score}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: 1, marginTop: 4 }}>OUT OF 5</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.3)", paddingLeft: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 6, fontFamily: FFD }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>The dimensional breakdown below shows where you have alignment and where you have gaps.</div>
            </div>
          </div>
        );
        i++; continue;
      }
    }

    if (!isQuestionsSection && !inVendorCard && line.includes("|") && line.match(/\d+\/5/) && !line.trim().startsWith("|")) {
      const parts = line.trim().split("|").map(p => p.trim());
      elements.push(
        <div style={{ borderBottom: "1px solid " + C.border, paddingBottom: 6, marginTop: 28, marginBottom: 8, display: "flex", alignItems: "baseline", gap: 12 }} key={i}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0, fontFamily: FFD }}>{parts[0]}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.accent, margin: 0, fontFamily: FF }}>{parts[1]}</p>
        </div>
      );
      i++; continue;
    }

    if (line.startsWith("**") && line.endsWith("**")) {
      const blockTitle = line.replace(/\*\*/g, "").trim();
      elements.push(
        <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: "24px 0 8px", lineHeight: 1.6, fontFamily: FF, borderBottom: "1px solid " + C.borderDark, paddingBottom: 6 }} key={i}>
          {blockTitle}
        </p>
      );
      i++; continue;
    }

    if (line.startsWith("### ")) {
      const content = line.replace("### ", "").trim();
      elements.push(<p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "24px 0 8px", fontFamily: FF }} key={i}>{content}</p>);
      i++; continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div style={{ display: "flex", gap: 12, marginBottom: 10 }} key={i}>
          <span style={{ color: C.accent, flexShrink: 0, marginTop: 4, fontSize: 14 }}>—</span>
          <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.8, color: C.textMid, margin: 0, fontFamily: FF }}>{line.replace(/^[-•]\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</p>
        </div>
      );
      i++; continue;
    }

    if (/^\d+\./.test(line)) {
      const num = line.match(/^\d+/)[0];
      const text = line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1");
      elements.push(
        <div style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }} key={i}>
          <span style={{ color: C.accent, flexShrink: 0, fontSize: 15, fontWeight: 700, fontFamily: FF, minWidth: 22, lineHeight: 1.75 }}>{num}.</span>
          <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.75, color: C.textMid, margin: 0, fontFamily: FF }}>{text}</p>
        </div>
      );
      i++; continue;
    }

    elements.push(<p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.9, color: C.textMid, marginBottom: 14, fontFamily: FF, display: "inline-block", width: "100%" }} key={i}>{clean}</p>);
    i++;
  }

  if (inVendorCard) flushVendorCard("end");
  if (inQuestionGroup) flushQuestionGroup("end");

  return elements;
}

// ─── MAIN APP IMPLEMENTATION ENTRY ────────────────────────────────────────────
export default function Delphi({ paymentStatus, startCheckout, onHome }) {
  const [reportType, setReportType] = useState(null);
  const [step, setStep] = useState("select");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [otherToolInputs, setOtherToolInputs] = useState({});
  const [categoryStep, setCategoryStep] = useState("categories");
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [hoveredChoice, setHoveredChoice] = useState(null);
  const [reportSections, setReportSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const inputRef = useRef(null);

  const q = questionQueue[currentQ];
  const progress = questionQueue.length > 0 ? Math.round(((currentQ + 1) / questionQueue.length) * 100) : 0;
  const sectionIcons = reportType === "stack_fit" ? STACK_ICONS : EVAL_ICONS;

  useEffect(() => {
    if (step === "questions" && q?.type === "text") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentQ, step, q]);

  // FIXED: Keeps structural strategy items fully insulated from technical data pipes
  const buildQuestionQueue = (categories, currentType) => {
    const baseQueue = currentType === "stack_fit" ? [...STACK_CORE_QUESTIONS] : [...CORE_QUESTIONS];
    const queue = [...baseQueue];
    
    const seen = new Set(baseQueue.map(item => item.id));
    categories.forEach(catId => {
      const catQs = CATEGORY_QUESTIONS[catId] || [];
      catQs.forEach(item => {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          queue.push(item);
        }
      });
    });
    return queue;
  };

  const startReport = (type) => {
    setReportType(type);
    setStep("category_select");
    setSelectedCategories([]);
    setSelectedTools([]);
    setCategoryStep("categories");
  };

  const toggleCategory = (id) => setSelectedCategories(prev =>
    prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
  );

  const toggleTool = (tool) => setSelectedTools(prev =>
    prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
  );

  const confirmSelection = () => {
    const shortlistKey = reportType === "stack_fit" ? "stack_shortlist" : "shortlist";
    const labels = selectedCategories.map(id => TOOL_CATEGORIES.find(x => x.id === id)?.label).filter(Boolean);
    
    const queue = buildQuestionQueue(selectedCategories, reportType);
    
    const cleanedTools = selectedTools.map(t => t.startsWith("Other: ") ? t.replace("Other: ", "").trim() : t);
    setAnswers({ categories: labels, [shortlistKey]: cleanedTools });
    setQuestionQueue(queue);
    setCurrentQ(0);
    setStep("questions");
  };

  // FIXED: Re-mapped pointer checks to eliminate question index reset loops
  const submitAnswer = (value) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    setCurrentInput("");
    setHoveredChoice(null);

    if (currentQ < questionQueue.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      generateReport(newAnswers);
    }
  };

  const generateReport = async (finalAnswers) => {
    setStep("generating");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 290000);
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          system: reportType === "stack_fit" ? STACK_PROMPT : EVAL_PROMPT,
          prompt: reportType === "stack_fit" ? buildStackPrompt(finalAnswers) : buildEvalPrompt(finalAnswers),
        }),
      });
      clearTimeout(timeout);
      const data = await res.json();
      
      // FIXED: Protective boundary array safeguards free trial promo executions safely
      if (data && data.url) {
        window.location.href = data.url;
        return; 
      }

      if (!data || !data.text) throw new Error("Empty response payload from server");
      
      const sections = parseReport(data.text, reportType);
      setReportSections(sections.length ? sections : [{ title: "What We Heard", content: ["Unable to parse report. Please try again."] }]);
      setStep("report");
    } catch (error) {
      console.log("Delphi Pipeline Generation Error:", error);
      setReportSections([{ title: "What We Heard", content: ["Unable to generate your report. Please try again."] }]);
      setStep("report");
    }
  };

  const restart = () => {
    setStep("select"); setReportType(null); setCurrentQ(0); setAnswers({});
    setCurrentInput(""); setReportSections([]); setActiveSection(0);
    setSelectedCategories([]); setSelectedTools([]); setCategoryStep("categories");
    setQuestionQueue([]); setHoveredChoice(null); setOtherToolInputs({});
  };

  const pageWrap = { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: FF };

  // ─── VIEWPANELS ──────────────────────────────────────────────────────────────
  if (step === "select") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px", fontFamily: FF }}>
      <style>{GS}</style>
      <div style={{ maxWidth: 820, width: "100%", animation: "fadeUp 0.4s ease" }}>
        <Logo />
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -1, marginBottom: 12 }}>What are you trying to figure out?</h1>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.textMid, lineHeight: 1.8, marginBottom: 40 }}>Choose the report type that matches your situation.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { type: "evaluation", tag: "The Evaluation", title: "Find the right tool.", body: "You have a problem to solve. Delphi tells you which tool fits your situation, what it costs to implement, what your organization needs to prepare, and what to ask before you sign.", best: "First-time buyers, teams migrating platforms, anyone wanting an independent read before the sales cycle.", btn: "Start Evaluation", featured: true },
            { type: "stack_fit", tag: "The Stack Fit", title: "Know how it fits what you have.", body: "You are adding to an existing stack. Delphi assesses data flow, integration depth, process overlap, and whether the tool creates dependencies or conflicts in your environment.", best: "Teams with established stacks, ops leaders managing tool sprawl, anyone asking whether this will work with what we have.", btn: "Start Stack Fit", featured: false },
          ].map(card => (
            <div key={card.type}
              style={{ background: card.featured ? C.accent : C.white, border: "1.5px solid " + (card.featured ? C.accent : C.border), borderRadius: 10, padding: "36px 32px", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: card.featured ? C.white : C.accent, background: card.featured ? "rgba(255,255,255,0.18)" : "rgba(61,107,33,0.08)", borderRadius: 20, padding: "4px 12px", marginBottom: 16, fontWeight: 700, alignSelf: "flex-start" }}>{card.tag}</div>
              <h2 style={{ fontFamily: FFD, fontSize: 22, fontWeight: 700, color: card.featured ? C.white : C.text, marginBottom: 12, lineHeight: 1.2 }}>{card.title}</h2>
              <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.8, color: card.featured ? "rgba(255,255,255,0.88)" : C.textMid, marginBottom: 16, flex: 1 }}>{card.body}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: card.featured ? "rgba(255,255,255,0.6)" : C.textLight, lineHeight: 1.6, fontStyle: "italic", paddingTop: 14, borderTop: "1px solid " + (card.featured ? "rgba(255,255,255,0.18)" : C.border), marginBottom: 20 }}>{card.best}</p>
              <button onClick={() => startReport(card.type)} style={{ background: card.featured ? C.white : C.accent, color: card.featured ? C.accent : C.white, border: "none", borderRadius: 40, padding: "11px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF, alignSelf: "flex-start" }}>{card.btn}</button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 20, textAlign: "center" }}>Funded by subscribers, not vendors. No platform pays for placement or recommendation. Ever.</p>
      </div>
    </div>
  );

  if (step === "category_select") return (
    <div style={pageWrap}>
      <style>{GS}</style>
      <div style={{ maxWidth: 600, width: "100%", animation: "fadeUp 0.4s ease" }}>
        <Logo />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.accent, background: "rgba(61,107,33,0.08)", borderRadius: 20, padding: "4px 12px", marginBottom: 16, display: "inline-block" }}>
          {reportType === "stack_fit" ? "The Stack Fit" : "The Evaluation"}
        </div>
        {categoryStep === "categories" ? (
          <>
            <h2 style={{ fontFamily: FFD, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>What category are you evaluating?</h2>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.75, marginBottom: 28 }}>Select all that apply.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {TOOL_CATEGORIES.map(cat => {
                const sel = selectedCategories.includes(cat.id);
                return (
                  <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                    style={{ background: sel ? C.accent : C.white, border: "1.5px solid " + (sel ? C.accent : C.border), borderRadius: 4, padding: "14px 18px", textAlign: "left", fontSize: 16, fontWeight: 500, color: sel ? C.white : C.text, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 3, border: "2px solid " + (sel ? "rgba(255,255,255,0.6)" : C.borderDark), background: sel ? "rgba(255,255,255,0.25)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: C.white, fontWeight: 700 }}>{sel ? "✓" : ""}</div>
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <Btn onClick={() => setCategoryStep("tools")} disabled={selectedCategories.length === 0}>Select Tools</Btn>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: FFD, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>Which tools are you considering?</h2>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.75, marginBottom: 28 }}>Select all that apply.</p>
            {selectedCategories.map(catId => {
              const cat = TOOL_CATEGORIES.find(c => c.id === catId);
              if (!cat) return null;
              const otherVal = otherToolInputs[catId] || "";
              const otherToolName = `Other: ${otherVal.trim()}`;
              const otherSelected = otherVal.trim() && selectedTools.includes(otherToolName);
              return (
                <div key={catId} style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>{cat.label}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {cat.tools.map(tool => {
                      const sel = selectedTools.includes(tool);
                      return (
                        <button key={tool} onClick={() => toggleTool(tool)}
                          style={{ background: sel ? C.accent : C.white, border: "1.5px solid " + (sel ? C.accent : C.border), borderRadius: 4, padding: "12px 18px", textAlign: "left", fontSize: 15, fontWeight: 500, color: sel ? C.white : C.text, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (sel ? "rgba(255,255,255,0.6)" : C.borderDark), background: sel ? "rgba(255,255,255,0.25)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: C.white, fontWeight: 700 }}>{sel ? "✓" : ""}</div>
                          {tool}
                        </button>
                      );
                    })}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={() => {
                          if (otherVal.trim()) {
                            toggleTool(otherToolName);
                          } else {
                            document.getElementById(`other-input-${catId}`)?.focus();
                          }
                        }}
                        style={{ background: otherSelected ? C.accent : C.white, border: "1.5px solid " + (otherSelected ? C.accent : C.border), borderRadius: 4, padding: "12px 18px", textAlign: "left", fontSize: 15, fontWeight: 500, color: otherSelected ? C.white : C.text, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (otherSelected ? "rgba(255,255,255,0.6)" : C.borderDark), background: otherSelected ? "rgba(255,255,255,0.25)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: C.white, fontWeight: 700 }}>{otherSelected ? "✓" : ""}</div>
                        Other
                      </button>
                      <input
                        id={`other-input-${catId}`}
                        type="text"
                        placeholder="Type tool name, then select"
                        value={otherVal}
                        onChange={e => {
                          if (otherSelected) setSelectedTools(prev => prev.filter(t => t !== otherToolName));
                          setOtherToolInputs(prev => ({ ...prev, [catId]: e.target.value }));
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            const newName = `Other: ${e.target.value.trim()}`;
                            if (!selectedTools.includes(newName)) {
                              setSelectedTools(prev => [...prev, newName]);
                            }
                          }
                        }}
                        style={{ flex: 1, border: "1.5px solid " + C.border, borderRadius: 4, padding: "12px 14px", fontSize: 15, fontFamily: FF, color: C.text, background: C.white }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="ghost" onClick={() => setCategoryStep("categories")}>Back</Btn>
              <Btn onClick={confirmSelection} disabled={selectedTools.length === 0}>Continue</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ─── QUESTION STEPS OVERRIDE LAYER ───────────────────────────────────────────
  return (
    <div style={pageWrap}>
      <style>{GS}</style>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: FFD }}>D</div>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent }}>{reportType === "stack_fit" ? "The Stack Fit" : "The Evaluation"}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.textLight }}>{currentQ + 1} / {questionQueue.length}</span>
        </div>

        <div style={{ width: "100%", height: 3, background: C.border, borderRadius: 2, marginBottom: 36 }}>
          <div style={{ width: progress + "%", height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.35s ease" }} />
        </div>

        {q && (
          <>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: C.textLight, marginBottom: 16 }}>
              {reportType === "stack_fit" ? "Layer 1 — Core Infrastructure" : q.layer === 1 ? "Layer 1 — Your Situation" : "Layer 2 — Readiness Assessment"}
            </p>
            <h2 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.5, color: C.text, marginBottom: 12, fontFamily: FFD }}>{q.text}</h2>
            <p style={{ fontSize: 15, fontWeight: 500, color: C.textMid, lineHeight: 1.7, marginBottom: 28 }}>{q.hint}</p>

            {q.type === "text" && (
              <>
                <textarea ref={inputRef} rows={4} value={currentInput}
                  onChange={e => setCurrentInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && e.metaKey && currentInput.trim()) submitAnswer(currentInput.trim()); }}
                  placeholder="Type your answer here..."
                  style={{ width: "100%", background: C.white, border: "1.5px solid " + C.border, borderRadius: 4, color: C.text, fontSize: 16, fontWeight: 500, padding: "14px 16px", resize: "vertical", lineHeight: 1.7, fontFamily: FF }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.borderDark, fontFamily: FF }}>Command + Enter to continue</span>
                  <Btn onClick={() => currentInput.trim() && submitAnswer(currentInput.trim())} disabled={!currentInput.trim()}>Continue</Btn>
                </div>
                <button onClick={() => submitAnswer("Not provided")}
                  style={{ background: "none", border: "none", color: C.textLight, fontSize: 13, fontWeight: 500, marginTop: 16, textDecoration: "underline", cursor: "pointer", display: "block", fontFamily: FF }}>
                  Skip this question
                </button>
              </>
            )}

            {q.type === "choice" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {q.options.map(opt => (
                  <button key={opt} onClick={() => submitAnswer(opt)}
                    onMouseEnter={() => setHoveredChoice(opt)}
                    onMouseLeave={() => setHoveredChoice(null)}
                    style={{ background: hoveredChoice === opt ? C.accent : C.white, border: "1.5px solid " + (hoveredChoice === opt ? C.accent : C.border), borderRadius: 4, color: hoveredChoice === opt ? C.white : C.text, fontSize: 16, fontWeight: 500, padding: "14px 18px", textAlign: "left", lineHeight: 1.4, cursor: "pointer", transition: "all 0.15s", fontFamily: FF }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
