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
const GS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=EB+Garamond:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } button { cursor: pointer; } textarea { outline: none; } textarea:focus { border-color: " + C.accent + " !important; } input:focus { outline: none; border-color: " + C.accent + " !important; } @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } } @keyframes spin { to { transform: rotate(360deg); } } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: " + C.border + "; border-radius: 3px; }";

// ─── TOOL CATEGORIES ──────────────────────────────────────────────────────────
const TOOL_CATEGORIES = [
  { id: "abm", label: "Account-Based Marketing (ABM)", tools: ["6sense", "Demandbase", "Terminus", "Rollworks", "HubSpot (ABM)"] },
  { id: "sales_engagement", label: "Sales Engagement", tools: ["Outreach", "Salesloft", "Apollo", "Groove"] },
  { id: "revenue_intelligence", label: "Revenue Intelligence", tools: ["Gong", "Chorus", "Clari", "Mediafly"] },
  { id: "data_enrichment", label: "Data & Enrichment", tools: ["ZoomInfo", "Clearbit", "Cognism", "Lusha"] },
  { id: "marketing_automation", label: "Marketing Automation", tools: ["Marketo", "HubSpot Marketing", "Pardot", "Eloqua"] },
  { id: "crm", label: "CRM", tools: ["Salesforce", "HubSpot CRM", "Microsoft Dynamics", "Pipedrive"] },
];

// ─── UNIVERSAL CORE QUESTIONS ─────────────────────────────────────────────────
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

// ─── CATEGORY-SPECIFIC QUESTIONS ──────────────────────────────────────────────
const CATEGORY_QUESTIONS = {
  abm: [
    {
      id: "abm_account_list", layer: 1,
      text: "How many target accounts are you working with?",
      hint: "200 tightly defined accounts and 10,000 loosely defined ones require very different tools.",
      type: "choice",
      options: ["Fewer than 250 — tightly defined", "250 to 1,000", "1,000 to 5,000", "More than 5,000 — broadly defined"],
      branch: {
        trigger: ["More than 5,000 — broadly defined"],
        id: "abm_account_detail",
        text: "Are these accounts agreed upon by sales and marketing, or is this primarily a marketing-defined list?",
        hint: "Sales ignoring the list is the #1 ABM failure mode.",
        type: "text",
      },
    },
    {
      id: "abm_sales_sponsor", layer: 1,
      text: "Is there a named sales leader sponsoring this initiative who has committed to changing how their team works accounts?",
      hint: "Right tool plus bad implementation plus no sponsorship is an expensive mistake.",
      type: "choice",
      options: ["Yes — named sponsor, fully committed", "Sales knows about it but hasn't committed to behavior change", "Marketing is driving this, sales will be informed after", "We haven't had that conversation yet"],
      branch: {
        trigger: ["Sales knows about it but hasn't committed to behavior change", "Marketing is driving this, sales will be informed after", "We haven't had that conversation yet"],
        id: "abm_sponsor_detail",
        text: "What's the plan to get sales committed before go-live? Without it, ABM tools fail within 6 months.",
        hint: "This isn't a judgment — it's the most important thing to solve before you sign.",
        type: "text",
      },
    },
    {
      id: "abm_intent", layer: 2,
      text: "Has your team used intent data before?",
      hint: "Intent data is only valuable if you have workflows to act on it.",
      type: "choice",
      options: ["Yes, and we have workflows built around it", "Yes, but we never really trusted or acted on it", "No, this would be our first time", "Not sure what intent data means in practice"],
      branch: {
        trigger: ["Yes, but we never really trusted or acted on it", "Not sure what intent data means in practice"],
        id: "abm_intent_detail",
        text: "What would it take for your team to trust and act on intent signals? Who would own that workflow?",
        hint: "Unused intent data is expensive noise.",
        type: "text",
      },
    },
    {
      id: "abm_content", layer: 2,
      text: "Do you have content mapped to each persona in your buying committee?",
      hint: "ABM without multi-threaded content is expensive banner ads.",
      type: "choice",
      options: ["Yes — persona-specific content for each stage", "Partially — some personas covered, not all", "We have content but it's not persona-mapped", "No — we're selling to whoever picks up the phone"],
      branch: {
        trigger: ["Partially — some personas covered, not all", "We have content but it's not persona-mapped", "No — we're selling to whoever picks up the phone"],
        id: "abm_content_detail",
        text: "Who owns content creation, and is there capacity to build persona-specific content before or during implementation?",
        hint: "The content gap is usually bigger than teams expect.",
        type: "text",
      },
    },
  ],

  sales_engagement: [
    {
      id: "se_sponsor", layer: 1,
      text: "Is there a named sales leader who will enforce adoption of this tool?",
      hint: "Tools that are optional are dead within 90 days.",
      type: "choice",
      options: ["Yes — it's in their QBR and they're measuring it", "There's interest but no enforcement plan", "This is being pushed on sales from above", "Sales doesn't know about this yet"],
      branch: {
        trigger: ["There's interest but no enforcement plan", "This is being pushed on sales from above", "Sales doesn't know about this yet"],
        id: "se_sponsor_detail",
        text: "What's the plan to make adoption non-optional? This is the single biggest predictor of whether this tool succeeds.",
        hint: "Be specific — who will enforce it and how.",
        type: "text",
      },
    },
    {
      id: "se_sequences", layer: 1,
      text: "Who owns your sales sequence and cadence library?",
      hint: "If every rep writes their own sequences, you have a content problem that no tool fixes.",
      type: "choice",
      options: ["Marketing owns it — documented and maintained", "Sales ops owns it", "Individual reps write their own", "We don't have sequences yet"],
      branch: {
        trigger: ["Individual reps write their own", "We don't have sequences yet"],
        id: "se_sequences_detail",
        text: "Who will own building and maintaining the sequence library in the new tool? This is the #1 implementation gap.",
        hint: "Marketing typically owns this in high-performing orgs.",
        type: "text",
      },
    },
    {
      id: "se_fatigue", layer: 1,
      text: "How many tools are your reps currently expected to use daily?",
      hint: "More tools means less selling. Every addition needs a justification.",
      type: "choice",
      options: ["1 to 2 — very lean stack", "3 to 4 — manageable", "5 or more — it's a lot", "Honestly not sure, nobody has counted"],
      branch: {
        trigger: ["5 or more — it's a lot", "Honestly not sure, nobody has counted"],
        id: "se_fatigue_detail",
        text: "Which tools are actually being used vs. ignored? Adding another tool to an ignored stack doesn't work.",
        hint: "The ones being ignored tell you more than the ones being used.",
        type: "text",
      },
    },
    {
      id: "se_contact_data", layer: 2,
      text: "How would you rate your contact data quality — email validity, phone numbers, titles?",
      hint: "Sequences sent to bad data destroy your domain reputation and demoralizes reps.",
      type: "choice",
      options: ["Clean — regularly validated", "Decent but aging", "Patchy — some segments good, some bad", "It's a mess"],
      branch: {
        trigger: ["Patchy — some segments good, some bad", "It's a mess"],
        id: "se_contact_detail",
        text: "Is there a data enrichment or validation plan before go-live? Domain reputation damage from bad sends is slow to recover.",
        hint: "This needs to be solved before sequences go live, not after.",
        type: "text",
      },
    },
    {
      id: "se_managers", layer: 2,
      text: "Will sales managers use this tool to coach — reviewing sequence performance, running 1:1s from the data?",
      hint: "Manager adoption is where ROI lives. Rep adoption is table stakes.",
      type: "choice",
      options: ["Yes — it's already in their workflow expectations", "Probably, but it's not formalized", "Unlikely — managers are already stretched", "We haven't thought about manager adoption"],
      branch: {
        trigger: ["Probably, but it's not formalized", "Unlikely — managers are already stretched", "We haven't thought about manager adoption"],
        id: "se_managers_detail",
        text: "What would need to be true for managers to actually use this for coaching? That's where the ROI conversation lives.",
        hint: "If managers won't use it, the tool becomes a rep surveillance tool — which kills adoption.",
        type: "text",
      },
    },
  ],

  revenue_intelligence: [
    {
      id: "ri_legal", layer: 1,
      text: "Has your legal team reviewed call recording consent requirements for every state and country your reps sell into?",
      hint: "Two-party consent states include California, Illinois, Florida, and others. This needs legal review before go-live.",
      type: "choice",
      options: ["Yes — legal has signed off, consent workflows are in place", "We're aware of it but haven't formally addressed it", "We didn't know this was a legal issue", "We only sell domestically and assumed it was fine"],
      branch: {
        trigger: ["We're aware of it but haven't formally addressed it", "We didn't know this was a legal issue", "We only sell domestically and assumed it was fine"],
        id: "ri_legal_detail",
        text: "Which states and countries do your reps sell into? List them — we'll flag specific consent requirements in your report.",
        hint: "This is not a box-checking exercise. Exposure here is real.",
        type: "text",
      },
    },
    {
      id: "ri_rep_buyin", layer: 1,
      text: "Have reps been involved in the evaluation, or will recording be announced after the decision is made?",
      hint: "Reps who feel surveilled without consent become actively resistant and find workarounds.",
      type: "choice",
      options: ["Reps were part of the selection process", "We plan to involve them before go-live", "This will be announced after the decision", "We haven't thought about how to introduce it"],
      branch: {
        trigger: ["This will be announced after the decision", "We haven't thought about how to introduce it"],
        id: "ri_buyin_detail",
        text: "What's the change management plan for introducing recording to the team?",
        hint: "The best implementations involved reps early. The worst were surprise announcements.",
        type: "text",
      },
    },
    {
      id: "ri_managers", layer: 2,
      text: "Will managers watch calls and coach from them weekly?",
      hint: "If managers won't watch calls, the ROI calculation changes significantly.",
      type: "choice",
      options: ["Yes — defined expectation with accountability", "Probably, but it's not formalized yet", "Managers are already stretched thin", "We're buying it for deal visibility, not coaching"],
      branch: {
        trigger: ["Probably, but it's not formalized yet", "Managers are already stretched thin", "We're buying it for deal visibility, not coaching"],
        id: "ri_managers_detail",
        text: "If coaching isn't the primary use case, what is? The ROI story — and the vendor you choose — depends heavily on the answer.",
        hint: "Deal visibility, forecasting accuracy, and coaching require different configurations.",
        type: "text",
      },
    },
    {
      id: "ri_crm", layer: 2,
      text: "Is your CRM ready to receive structured data from a revenue intelligence tool — call summaries, next steps, deal risk scores?",
      hint: "This is where most revenue intelligence implementations stall.",
      type: "choice",
      options: ["Yes — fields are mapped and ops owns the integration", "Probably, but we haven't scoped it", "Our CRM is too messy to receive clean data", "We don't know what that integration requires"],
      branch: {
        trigger: ["Probably, but we haven't scoped it", "Our CRM is too messy to receive clean data", "We don't know what that integration requires"],
        id: "ri_crm_detail",
        text: "Who will own the CRM integration and field mapping? And what's the current state of the fields that would receive this data?",
        hint: "Garbage in from revenue intelligence on top of a messy CRM makes the CRM worse, not better.",
        type: "text",
      },
    },
    {
      id: "ri_sponsor", layer: 2,
      text: "Who is the executive sponsor — is this sales-driven or being pushed on sales from another function?",
      hint: "Tools pushed on sales without a sales sponsor get ignored.",
      type: "choice",
      options: ["Sales leadership is driving this", "Joint decision between sales and revenue ops", "Being pushed on sales from marketing or finance", "No clear sponsor yet"],
      branch: {
        trigger: ["Being pushed on sales from marketing or finance", "No clear sponsor yet"],
        id: "ri_sponsor_detail",
        text: "What's the plan to get a sales leader as the named owner before go-live?",
        hint: "This is a political problem, not a technical one. It needs to be solved first.",
        type: "text",
      },
    },
  ],

  data_enrichment: [
    {
      id: "de_usecase", layer: 1,
      text: "What specifically are you enriching?",
      hint: "Prospecting lists, CRM contacts, and inbound leads each require different data and different workflows.",
      type: "choice",
      options: ["Prospecting — building new outbound lists", "CRM enrichment — filling gaps in existing records", "Inbound enrichment — appending data to form fills", "All three", "Not sure yet"],
      branch: {
        trigger: ["Not sure yet"],
        id: "de_usecase_detail",
        text: "Walk us through your current outbound or inbound process. Where are the data gaps that are hurting you most?",
        hint: "Use case clarity is the single biggest predictor of enrichment ROI.",
        type: "text",
      },
    },
    {
      id: "de_writeback", layer: 1,
      text: "Do you have a plan for where enriched data goes in your CRM?",
      hint: "Field mapping and conflict resolution are where enrichment implementations break down.",
      type: "choice",
      options: ["Yes — documented field mapping, ops owns it", "We know roughly where it goes but it's not documented", "We haven't figured that out yet", "We don't have someone who owns that decision"],
      branch: {
        trigger: ["We know roughly where it goes but it's not documented", "We haven't figured that out yet", "We don't have someone who owns that decision"],
        id: "de_writeback_detail",
        text: "Who will own the field mapping decision, and what happens to existing data that conflicts with enriched data?",
        hint: "Overwriting good data with bad enriched data is a real and common problem.",
        type: "text",
      },
    },
    {
      id: "de_decay", layer: 2,
      text: "Do you have a plan for managing data decay over time?",
      hint: "B2B data decays at roughly 30% annually. Enrichment is a subscription to ongoing maintenance, not a one-time fix.",
      type: "choice",
      options: ["Yes — we have a refresh cadence and someone owns it", "We know it's a problem but don't have a plan", "We didn't know data decayed that fast", "We're planning to address it after we get the tool"],
      branch: {
        trigger: ["We know it's a problem but don't have a plan", "We didn't know data decayed that fast", "We're planning to address it after we get the tool"],
        id: "de_decay_detail",
        text: "Who would own the refresh cadence, and how often does your sales team complain about stale contact data today?",
        hint: "If sales is already frustrated with data quality, enrichment without a maintenance plan just delays the complaint.",
        type: "text",
      },
    },
    {
      id: "de_ownership", layer: 2,
      text: "Who will own the enrichment workflow day-to-day?",
      hint: "Enrichment tools bought without a named operator become shelfware within a quarter.",
      type: "choice",
      options: ["Dedicated ops or data person", "Shared ops resource", "The person who bought it", "We're figuring that out"],
      branch: {
        trigger: ["The person who bought it", "We're figuring that out"],
        id: "de_ownership_detail",
        text: "What is that person's current capacity, and what will they stop doing to take this on?",
        hint: "Capacity is the honest question most teams avoid.",
        type: "text",
      },
    },
    {
      id: "de_intent", layer: 2,
      text: "Are you looking for contact and company data, intent data, or both?",
      hint: "These are different products with different use cases, even when sold by the same vendor.",
      type: "choice",
      options: ["Contact and company data only", "Intent data only", "Both — we understand the difference", "Both — we're not sure what the difference means in practice"],
      branch: {
        trigger: ["Both — we're not sure what the difference means in practice"],
        id: "de_intent_detail",
        text: "Walk us through how you'd use each. Intent data without a workflow to act on signals is expensive noise.",
        hint: "Most teams buy both and only use one.",
        type: "text",
      },
    },
  ],

  marketing_automation: [
    {
      id: "ma_database", layer: 1,
      text: "How would you describe your current contact database — is it segmented, clean, and ready to activate?",
      hint: "Platform selection depends heavily on database readiness, not just size.",
      type: "choice",
      options: ["Yes — segmented by persona, clean, ready to run programs", "Partially — some segments solid, others need work", "No — needs significant cleanup before we can activate", "We don't have a database yet — building from scratch"],
      branch: {
        trigger: ["Partially — some segments solid, others need work", "No — needs significant cleanup before we can activate"],
        id: "ma_database_detail",
        text: "What's the primary issue — duplicates, missing fields, no engagement history, or poor segmentation?",
        hint: "The answer determines whether you need a data project before or alongside the platform implementation.",
        type: "text",
      },
    },
    {
      id: "ma_nurture", layer: 1,
      text: "How complex is your nurture program — or how complex do you need it to be?",
      hint: "Complex programs without a dedicated owner become unmaintainable within a year.",
      type: "choice",
      options: ["Simple — one or two linear drip sequences", "Moderate — branching logic based on behavior", "Complex — multi-track, persona-based, behavior-triggered", "We don't have nurture yet — starting from scratch"],
      branch: {
        trigger: ["Complex — multi-track, persona-based, behavior-triggered", "We don't have nurture yet — starting from scratch"],
        id: "ma_nurture_detail",
        text: "Who will build and maintain the nurture architecture? And is that person already on staff?",
        hint: "This is a full-time job at scale. Most teams underestimate it.",
        type: "text",
      },
    },
    {
      id: "ma_content", layer: 1,
      text: "Do you have enough content to actually run nurture programs right now?",
      hint: "Platforms bought before content exists sit idle and create organizational frustration.",
      type: "choice",
      options: ["Yes — library built and mapped to funnel stages", "Partially — some content exists but gaps remain", "No — we'd be buying the platform before the content exists", "Content is being created in parallel"],
      branch: {
        trigger: ["No — we'd be buying the platform before the content exists", "Content is being created in parallel"],
        id: "ma_content_detail",
        text: "What's the content production timeline, and who owns it?",
        hint: "If content and platform go live at the same time, neither gets the attention it needs.",
        type: "text",
      },
    },
    {
      id: "ma_crm_sync", layer: 2,
      text: "How will this platform sync with your CRM?",
      hint: "Marketing automation without clean CRM sync creates duplicate data and broken lead routing.",
      type: "choice",
      options: ["Native integration — already scoped", "Middleware like Zapier or Make", "Custom API work", "We don't know yet"],
      branch: {
        trigger: ["Custom API work", "We don't know yet"],
        id: "ma_crm_detail",
        text: "Who owns the integration decision and build? And has ops reviewed the field mapping requirements?",
        hint: "The CRM sync is the most common MAP implementation failure point.",
        type: "text",
      },
    },
    {
      id: "ma_scoring", layer: 2,
      text: "Do you have a lead scoring model, and does sales agree with how leads are qualified?",
      hint: "Automation that routes leads sales doesn't trust creates more conflict than it solves.",
      type: "choice",
      options: ["Yes — documented model, sales has signed off", "We have scoring but sales ignores the scores", "No scoring yet — starting from scratch", "Sales and marketing disagree on what a qualified lead looks like"],
      branch: {
        trigger: ["We have scoring but sales ignores the scores", "Sales and marketing disagree on what a qualified lead looks like"],
        id: "ma_scoring_detail",
        text: "What's driving the disagreement or distrust? And who owns the conversation to align on lead definitions?",
        hint: "This is a process problem that needs to be solved before the platform is configured, not after.",
        type: "text",
      },
    },
  ],

  crm: [
    {
      id: "crm_consolidation", layer: 1,
      text: "Are you implementing a single new CRM or consolidating multiple existing instances?",
      hint: "PE rollup and acquisition scenarios are a fundamentally different implementation — plan accordingly.",
      type: "choice",
      options: ["Single implementation — one system, one migration", "Consolidating two systems", "Consolidating three or more — PE rollup or acquisition scenario", "Partially consolidated — some business units still on separate systems"],
      branch: {
        trigger: ["Consolidating two systems", "Consolidating three or more — PE rollup or acquisition scenario", "Partially consolidated — some business units still on separate systems"],
        id: "crm_consolidation_detail",
        text: "Who owns the data reconciliation across instances — specifically duplicate accounts, conflicting contact records, and different pipeline stage definitions?",
        hint: "This is the highest-risk element of a multi-instance consolidation. It needs a named owner before day one.",
        type: "text",
      },
    },
    {
      id: "crm_migration", layer: 1,
      text: "What data are you migrating from your current system?",
      hint: "Full history migrations without a dedicated owner are the #1 CRM implementation failure.",
      type: "choice",
      options: ["Full history — all contacts, accounts, activities, opportunities", "Selective — active accounts and open pipeline only", "Starting fresh — no migration", "We don't know yet what needs to move"],
      branch: {
        trigger: ["Full history — all contacts, accounts, activities, opportunities", "We don't know yet what needs to move"],
        id: "crm_migration_detail",
        text: "Who owns the migration plan — internal ops, a consultant, or the vendor?",
        hint: "Vendor-led migrations are rarely as complete as vendor-assisted migrations with internal ownership.",
        type: "text",
      },
    },
    {
      id: "crm_process", layer: 1,
      text: "Are your current sales processes documented before you move them into a new CRM?",
      hint: "A CRM reflects your process — it doesn't create one.",
      type: "choice",
      options: ["Yes — stages, fields, and workflows are all documented", "Partially — main process is clear but details aren't written down", "No — hoping the new CRM helps us figure that out", "Our process is broken and we want the CRM to fix it"],
      branch: {
        trigger: ["No — hoping the new CRM helps us figure that out", "Our process is broken and we want the CRM to fix it"],
        id: "crm_process_detail",
        text: "What's the plan to document the process before configuration begins? Who owns that work?",
        hint: "Configuring a CRM around a broken process permanently encodes the broken process.",
        type: "text",
      },
    },
    {
      id: "crm_adherence", layer: 2,
      text: "When a rep closes a deal today, how completely does the full activity history exist in your current system?",
      hint: "This pattern — disciplined or not — follows you into every new CRM.",
      type: "choice",
      options: ["Completely — full visibility into every deal", "Mostly — key activities logged, details missing", "Partially — depends on the rep", "Poorly — the CRM is a graveyard of incomplete records"],
      branch: {
        trigger: ["Partially — depends on the rep", "Poorly — the CRM is a graveyard of incomplete records"],
        id: "crm_adherence_detail",
        text: "What's driving the inconsistency — too many required fields, no manager enforcement, or the tool doesn't match how reps sell?",
        hint: "The cause determines whether a new CRM fixes it or inherits it.",
        type: "text",
      },
    },
    {
      id: "crm_customization", layer: 2,
      text: "How customized does your CRM need to be to match your sales process?",
      hint: "Heavy customization without a dedicated admin becomes unmaintainable and gets blamed on the tool.",
      type: "choice",
      options: ["Minimal — standard pipeline stages and fields work for us", "Moderate — some custom fields and workflow automation", "Heavy — complex territory rules, custom objects, advanced automation", "We don't know yet"],
      branch: {
        trigger: ["Heavy — complex territory rules, custom objects, advanced automation", "We don't know yet"],
        id: "crm_custom_detail",
        text: "Who will own configuration and ongoing administration? What's their current capacity?",
        hint: "Heavy CRM customization is a full-time job. Most teams treat it as a project, then wonder why it breaks.",
        type: "text",
      },
    },
    {
      id: "crm_integrations", layer: 2,
      text: "How many systems need to integrate with the new CRM?",
      hint: "CRM sits at the center of your stack — every integration decision downstream flows from this.",
      type: "choice",
      options: ["Just one or two — MAP and maybe one other", "Three to five systems", "Six or more — complex integration environment", "We haven't mapped our integration requirements yet"],
      branch: {
        trigger: ["Six or more — complex integration environment", "We haven't mapped our integration requirements yet"],
        id: "crm_integrations_detail",
        text: "Who owns your integration architecture? And has ops reviewed what breaks during the CRM migration?",
        hint: "Integrations that work in the old CRM don't automatically work in the new one.",
        type: "text",
      },
    },
  ],
};

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const EVAL_PROMPT = `You are Delphi, an independent software evaluation analyst for B2B SaaS buyers. You have no financial relationship with any vendor. Your job is to help buyers understand the gap between what a software tool actually requires and where their organization currently stands.

Be direct, honest, and specific. You work for the buyer, not the vendor. Never hedge to protect a vendor relationship — you have none.

Use ONLY these exact section headers, in this order:
## What We Heard
## Tool-by-Tool Assessment
## What Your Organization Will Need
## Questions to Ask Each Vendor
## Red Flags to Watch For
## Our Recommendation
## Sources

SECTION REQUIREMENTS:

**What We Heard** — Synthesize the buyer's situation in 3-4 sentences. This is a senior analyst's read of their real situation, not a playback of their answers.

**Tool-by-Tool Assessment** — For each tool: what it actually does well, what it struggles with, typical implementation timeline, real pricing if known, and what kind of org it fits best. Be specific.

**What Your Organization Will Need** — Based on their answers: what specifically will they need to prepare, invest in, or change. Tied directly to what they told you. No generic advice.

**Questions to Ask Each Vendor** — 5-7 sharp questions vendors often dodge or answer vaguely. Make them specific to this category and this buyer's situation.

**Red Flags to Watch For** — Specific warning signs during demos and sales conversations for this category. Name names when warranted.

**Our Recommendation** — One clear recommendation based on this specific buyer's situation. If none of the tools are a good fit, say so directly.

**Sources** — List the key reference sources for this report. Include vendor documentation pages, G2 and Gartner Peer Insights profiles, and category-specific research sources. Format as a simple list with URLs. These are starting points for the buyer's own verification — not footnotes.

Tone: Direct. Honest. Independent. No filler. No hedging.`;

const STACK_PROMPT = `You are Delphi, an independent software implementation analyst for B2B SaaS buyers. You have no financial relationship with any vendor. A buyer has a shortlist and needs to understand what their existing stack and team will need to do to make each tool work.

Be direct, honest, and specific. You work for the buyer. The goal is to prevent failed implementations.

Use ONLY these exact section headers, in this order:
## What We Heard
## Stack Compatibility Assessment
## Integration Readiness
## What Your Team Will Need to Do
## Questions to Ask Before You Integrate
## Our Compatibility Verdict
## Sources

SECTION REQUIREMENTS:

**What We Heard** — Synthesize the buyer's current stack and situation in 3-4 sentences.

**Stack Compatibility Assessment** — For each tool on the shortlist: compatibility with their current stack, score each integration dimension 1-5, flag known integration failures or common problems.

**Integration Readiness** — Assess on five dimensions: Integration Ownership Clarity, Current Stack Health, Data Model Maturity, Team Capacity, Historical Integration Track Record. Score 1-5 each, explain, say what to do about it.

**What Your Team Will Need to Do** — Specific concrete actions before, during, and after implementation. Tied directly to their answers.

**Questions to Ask Before You Integrate** — 5-7 sharp integration-specific questions vendors avoid answering clearly.

**Our Compatibility Verdict** — Direct verdict on whether each tool is a realistic fit. If no, say so and explain why.

**Sources** — List key reference sources: vendor integration documentation, known compatibility guides, G2 and Gartner Peer Insights profiles. Format as a simple list with URLs.

Tone: Direct. Honest. Independent. No filler.`;

// ─── PROMPT BUILDERS ──────────────────────────────────────────────────────────
function buildEvalPrompt(answers) {
  const lines = [
    "Buyer diagnostic answers:",
    "Categories: " + (answers.categories?.join(", ") || "Not provided"),
    "Tools on shortlist: " + (answers.shortlist?.join(", ") || "Not provided"),
    "Problem / why now: " + (answers.problem || "Not provided"),
    "Prior experience: " + (answers.maturity || "Not provided"),
    answers.maturity_detail ? "Prior experience detail: " + answers.maturity_detail : null,
    "Ops ownership: " + (answers.ops_support || "Not provided"),
    answers.ops_detail ? "Ops detail: " + answers.ops_detail : null,
    "Current stack: " + (answers.stack || "Not provided"),
    "CRM data quality: " + (answers.data_quality || "Not provided"),
    answers.data_detail ? "Data detail: " + answers.data_detail : null,
    "Change readiness: " + (answers.change_readiness || "Not provided"),
    answers.change_detail ? "Change detail: " + answers.change_detail : null,
    "Budget: " + (answers.budget || "Not provided"),
    answers.budget_detail ? "Budget detail: " + answers.budget_detail : null,
    "Timeline: " + (answers.timeline || "Not provided"),
    answers.timeline_detail ? "Timeline detail: " + answers.timeline_detail : null,
  ];

  // Category-specific answers
  const catKeys = Object.keys(answers).filter(k =>
    !["categories", "shortlist", "problem", "maturity", "maturity_detail", "ops_support", "ops_detail",
      "stack", "data_quality", "data_detail", "change_readiness", "change_detail",
      "budget", "budget_detail", "timeline", "timeline_detail"].includes(k)
  );
  if (catKeys.length) {
    lines.push("\nCategory-specific answers:");
    catKeys.forEach(k => answers[k] && lines.push(k + ": " + answers[k]));
  }

  lines.push("\nGenerate the Delphi evaluation report now.");
  return lines.filter(Boolean).join("\n");
}

function buildStackPrompt(answers) {
  const lines = [
    "Stack Fit diagnostic answers:",
    "Categories: " + (answers.categories?.join(", ") || "Not provided"),
    "Tools being considered: " + (answers.stack_shortlist?.join(", ") || "Not provided"),
    "Problem / why now: " + (answers.problem || "Not provided"),
    "Current stack: " + (answers.stack || "Not provided"),
    "CRM data quality: " + (answers.data_quality || "Not provided"),
    answers.data_detail ? "Data detail: " + answers.data_detail : null,
    "Change readiness: " + (answers.change_readiness || "Not provided"),
    "Budget: " + (answers.budget || "Not provided"),
    "Timeline: " + (answers.timeline || "Not provided"),
  ];

  const catKeys = Object.keys(answers).filter(k =>
    !["categories", "stack_shortlist", "problem", "stack", "data_quality", "data_detail",
      "change_readiness", "budget", "timeline"].includes(k)
  );
  if (catKeys.length) {
    lines.push("\nCategory-specific answers:");
    catKeys.forEach(k => answers[k] && lines.push(k + ": " + answers[k]));
  }

  lines.push("\nGenerate the Delphi Stack Fit compatibility report now.");
  return lines.filter(Boolean).join("\n");
}

// ─── REPORT PARSING & RENDERING ───────────────────────────────────────────────
function parseReport(text) {
  const sections = [];
  let current = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace("## ", "").trim(), content: [] };
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function renderContent(content) {
  const lines = content.join("\n").split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    const clean = line.replace(/\*\*(.*?)\*\*/g, "$1");

    // Table
    if (line.trim().startsWith("|")) {
      const rows = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        if (!lines[j].match(/^\s*\|[\s-:]+\|/)) rows.push(lines[j]);
        j++;
      }
      if (rows.length >= 2) {
        const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
        const data = rows.slice(1).map(r => r.split("|").map(c => c.trim()).filter(Boolean));
        elements.push(
          <div key={i} style={{ overflowX: "auto", margin: "12px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: FF }}>
              <thead>
                <tr style={{ background: C.accent }}>
                  {headers.map((h, j) => <th key={j} style={{ padding: "10px 14px", textAlign: "left", color: C.white, fontWeight: 700, fontSize: 13 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, j) => (
                  <tr key={j} style={{ background: j % 2 === 0 ? C.white : C.card, borderBottom: "1px solid " + C.border }}>
                    {row.map((cell, k) => <td key={k} style={{ padding: "10px 14px", color: C.textMid, lineHeight: 1.5 }}>{cell.replace(/\*\*(.*?)\*\*/g, "$1")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        i = j; continue;
      }
    }

    // URL detection for Sources section
    if (line.trim().match(/^https?:\/\//)) {
      const url = line.trim();
      elements.push(
        <div key={i} style={{ marginBottom: 8 }}>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ color: C.accent, fontSize: 15, fontFamily: FF, wordBreak: "break-all", textDecoration: "underline" }}>
            {url}
          </a>
        </div>
      );
      i++; continue;
    }

    // Source lines with label
    if (line.trim().match(/^[-•]\s*https?:\/\//)) {
      const url = line.trim().replace(/^[-•]\s*/, "");
      elements.push(
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <span style={{ color: C.accent, flexShrink: 0 }}>—</span>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ color: C.accent, fontSize: 15, fontFamily: FF, wordBreak: "break-all", textDecoration: "underline" }}>
            {url}
          </a>
        </div>
      );
      i++; continue;
    }

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "24px 0 10px", fontFamily: FF }}>{line.replace("### ", "")}</h3>);
      i++; continue;
    }
    if (line.match(/^\*\*(.+)\*\*$/)) {
      elements.push(<p key={i} style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 10px", lineHeight: 1.6, fontFamily: FF }}>{clean}</p>);
      i++; continue;
    }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <span style={{ color: C.accent, flexShrink: 0, marginTop: 4, fontSize: 14 }}>—</span>
          <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: C.textMid, margin: 0, fontFamily: FF }}>{line.replace(/^[-•]\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</p>
        </div>
      );
      i++; continue;
    }
    if (/^\d+\./.test(line)) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <span style={{ color: C.accent, flexShrink: 0, minWidth: 20, fontSize: 14, fontFamily: FF }}>{line.match(/^\d+/)[0]}.</span>
          <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: C.textMid, margin: 0, fontFamily: FF }}>{line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</p>
        </div>
      );
      i++; continue;
    }

    elements.push(<p key={i} style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.9, color: C.textMid, marginBottom: 14, fontFamily: FF }}>{clean}</p>);
    i++;
  }
  return elements;
}

// ─── SECTION ICONS ────────────────────────────────────────────────────────────
const EVAL_ICONS = {
  "What We Heard": "◎", "Tool-by-Tool Assessment": "◈", "What Your Organization Will Need": "◐",
  "Questions to Ask Each Vendor": "◇", "Red Flags to Watch For": "◆", "Our Recommendation": "●", "Sources": "○"
};
const STACK_ICONS = {
  "What We Heard": "◎", "Stack Compatibility Assessment": "◈", "Integration Readiness": "◐",
  "What Your Team Will Need to Do": "◆", "Questions to Ask Before You Integrate": "◇", "Our Compatibility Verdict": "●", "Sources": "○"
};

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
const Logo = ({ small }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: small ? 4 : 40 }}>
    <div style={{ width: small ? 34 : 36, height: small ? 34 : 36, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: small ? 15 : 16, fontWeight: 700, fontFamily: FFD }}>D</div>
    {!small && (
      <div>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</p>
        <p style={{ fontSize: 11, color: C.textLight, letterSpacing: 2, textTransform: "uppercase" }}>Independent report for software buyers</p>
      </div>
    )}
    {small && <p style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</p>}
  </div>
);

const Btn = ({ children, onClick, disabled, variant = "primary", full }) => (
  <button onClick={onClick} disabled={disabled}
    style={{
      background: variant === "primary" ? (disabled ? C.border : C.accent) : variant === "ghost" ? "transparent" : C.white,
      color: variant === "primary" ? C.white : variant === "ghost" ? C.textLight : C.accent,
      border: variant === "ghost" ? "1.5px solid " + C.borderDark : variant === "white" ? "1.5px solid " + C.border : "none",
      borderRadius: 4, padding: "12px 24px", fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase",
      fontFamily: FF, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, transition: "all 0.15s",
    }}>{children}</button>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Delphi({ paymentStatus, startCheckout, onHome }) {
  const [reportType, setReportType] = useState(null);
  const [step, setStep] = useState("select");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
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
  }, [currentQ, step]);

  // Build question queue from selected categories
  const buildQuestionQueue = (categories) => {
    const queue = [...CORE_QUESTIONS];
    // Add category-specific questions for selected categories
    // If multiple categories selected, deduplicate by question id
    const seen = new Set(CORE_QUESTIONS.map(q => q.id));
    categories.forEach(catId => {
      const catQs = CATEGORY_QUESTIONS[catId] || [];
      catQs.forEach(q => {
        if (!seen.has(q.id)) {
          seen.add(q.id);
          queue.push(q);
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
    const queue = buildQuestionQueue(selectedCategories);
    setAnswers({ categories: labels, [shortlistKey]: selectedTools });
    setQuestionQueue(queue);
    setCurrentQ(0);
    setStep("questions");
  };

  const submitAnswer = (value) => {
    const newAnswers = { ...answers, [q.id]: value };

    // Check for branch question
    if (q.branch && q.branch.trigger.includes(value)) {
      const branchQ = { ...q.branch, isBranch: true };
      const newQueue = [
        ...questionQueue.slice(0, currentQ + 1),
        branchQ,
        ...questionQueue.slice(currentQ + 1),
      ];
      setQuestionQueue(newQueue);
    }

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
    const jobId = `r-${Date.now()}`;
    const system = reportType === "stack_fit" ? STACK_PROMPT : EVAL_PROMPT;
    const prompt = reportType === "stack_fit" ? buildStackPrompt(finalAnswers) : buildEvalPrompt(finalAnswers);

    await fetch("/.netlify/functions/generate-report-background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, system, prompt }),
    });

    const poll = async (attempts = 0) => {
      if (attempts > 60) {
        setReportSections([{ title: "What We Heard", content: ["Report timed out. Please try again."] }]);
        return setStep("report");
      }
      try {
        const { status, text } = await fetch(`/.netlify/functions/get-report?jobId=${jobId}`).then(r => r.json());
        if (status === "done") {
          const sections = parseReport(text ?? "");
          setReportSections(sections.length ? sections : [{ title: "What We Heard", content: ["Unable to parse report. Please try again."] }]);
          setStep("report");
        } else if (status === "error") {
          setReportSections([{ title: "What We Heard", content: ["Unable to generate your report. Please try again."] }]);
          setStep("report");
        } else {
          setTimeout(() => poll(attempts + 1), 3000);
        }
      } catch {
        setTimeout(() => poll(attempts + 1), 3000);
      }
    };

    setTimeout(() => poll(), 5000);
  };

  const restart = () => {
    setStep("select"); setReportType(null); setCurrentQ(0); setAnswers({});
    setCurrentInput(""); setReportSections([]); setActiveSection(0);
    setSelectedCategories([]); setSelectedTools([]); setCategoryStep("categories");
    setQuestionQueue([]); setHoveredChoice(null);
  };

  const pageWrap = { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: FF };

  // ─── SELECT ──────────────────────────────────────────────────────────────────
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

  // ─── CATEGORY SELECT ─────────────────────────────────────────────────────────
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

  // ─── GENERATING ──────────────────────────────────────────────────────────────
  if (step === "generating") return (
    <div style={pageWrap}>
      <style>{GS}</style>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
        <div style={{ width: 48, height: 48, border: "3px solid " + C.border, borderTop: "3px solid " + C.accent, borderRadius: "50%", margin: "0 auto 28px", animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14, fontFamily: FFD }}>Building your report</p>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.75, marginBottom: 12 }}>
          {reportType === "stack_fit"
            ? "Analyzing your stack, integration patterns, and compatibility signals."
            : "Analyzing your situation against known implementation requirements and organizational readiness signals."}
        </p>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.textLight, lineHeight: 1.6 }}>This takes about 45–60 seconds. We're pulling current information, not cached answers.</p>
      </div>
    </div>
  );

  // ─── REPORT ──────────────────────────────────────────────────────────────────
  if (step === "report") {
    const section = reportSections[activeSection];
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: FF }}>
        <style>{GS}</style>
        <div style={{ width: 240, minWidth: 240, background: C.sidebar, borderRight: "1px solid " + C.border, padding: "32px 20px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <Logo small />
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24, marginLeft: 44 }}>
            {reportType === "stack_fit" ? "Stack Fit Report" : "Evaluation Report"}
          </p>
          <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {reportSections.map((sec, i) => {
              const isActive = activeSection === i;
              return (
                <button key={i} onClick={() => setActiveSection(i)}
                  style={{ background: isActive ? C.accent : "transparent", border: "none", borderRadius: 4, padding: "10px 12px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 11, color: isActive ? C.white : C.accent, marginTop: 2, flexShrink: 0 }}>{sectionIcons[sec.title] || "○"}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: isActive ? C.white : C.textMid }}>{sec.title}</span>
                </button>
              );
            })}
          </nav>
          <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
          <button onClick={restart} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 4, color: C.textLight, fontSize: 12, fontWeight: 700, padding: "9px 12px", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>New Report</button>
        </div>

        <div style={{ flex: 1, padding: "40px 48px", maxWidth: 740, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 22, borderBottom: "1px solid " + C.border }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: FFD }}>{section?.title}</h2>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 6 }}>{activeSection + 1} / {reportSections.length}</span>
          </div>
          <div style={{ marginBottom: 32 }}>{section && renderContent(section.content)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid " + C.border }}>
            <button onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)}
              style={{ background: "none", border: "none", color: C.textMid, fontSize: 15, fontWeight: 500, opacity: activeSection === 0 ? 0.3 : 1, cursor: activeSection === 0 ? "default" : "pointer", fontFamily: FF }}>← Previous</button>
            <div style={{ display: "flex", gap: 7 }}>
              {reportSections.map((_, i) => (
                <div key={i} onClick={() => setActiveSection(i)}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: i === activeSection ? C.accent : C.border, cursor: "pointer", transition: "background 0.2s" }} />
              ))}
            </div>
            <button onClick={() => setActiveSection(Math.min(activeSection + 1, reportSections.length - 1))}
              style={{ background: "none", border: "none", color: C.textMid, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: FF }}>Next →</button>
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 36, paddingTop: 20, borderTop: "1px solid " + C.border, lineHeight: 1.7 }}>Delphi is funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
        </div>
      </div>
    );
  }

  // ─── QUESTIONS ───────────────────────────────────────────────────────────────
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
              {q.isBranch ? "Tell us more" : q.layer === 1 ? "Layer 1 — Your Situation" : "Layer 2 — Readiness Assessment"}
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
