import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#FAF7F2", card: "#F2EDE6", sidebar: "#EDE6DC", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830", textLight: "#7A7060",
  accent: "#3D6B21", accentDark: "#2D5016", dark: "#141410", gold: "#B8935A",
  white: "#FFFFFF", red: "#C0392B", amber: "#D4830A",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";

const TOOL_CATEGORIES = [
  { id: "abm", label: "Account-Based Marketing (ABM)", tools: ["6sense", "Demandbase", "Terminus", "Rollworks", "HubSpot (ABM)"] },
  { id: "sales_engagement", label: "Sales Engagement", tools: ["Outreach", "Salesloft", "Apollo", "Groove"] },
  { id: "revenue_intelligence", label: "Revenue Intelligence", tools: ["Gong", "Chorus", "Clari", "Mediafly"] },
  { id: "data_enrichment", label: "Data & Enrichment", tools: ["ZoomInfo", "Clearbit", "Cognism", "Lusha"] },
  { id: "marketing_automation", label: "Marketing Automation", tools: ["Marketo", "HubSpot Marketing", "Pardot", "Eloqua"] },
  { id: "crm", label: "CRM", tools: ["Salesforce", "HubSpot CRM", "Microsoft Dynamics", "Pipedrive"] },
];

const BASE_EVAL_QUESTIONS = [
  { id: "problem", layer: 1, text: "Why are you considering new software?", hint: "Include your team size, go-to-market strategy, and the current problem you are trying to solve. The more specific you are, the more accurate your report.", type: "text" },
  { id: "maturity", layer: 1, text: "Has your team used tools in this category before?", hint: "Most teams are somewhere in between — they have tried tactics in this space but never had the right infrastructure.", type: "choice", options: ["First time evaluating this category", "Tried it, never got traction", "Done it before, migrating platforms", "We have a mature program"] },
  { id: "sales_alignment", layer: 1, text: "Is sales involved in this decision, or is marketing driving it alone?", hint: "Tools that require cross-team adoption fail without sales buy-in from the start.", type: "choice", options: ["Marketing driving it, sales not involved", "Sales knows but is not engaged", "Joint decision, sales at the table", "Sales is actually pushing for this"] },
  { id: "stack", layer: 1, text: "What is your current stack — CRM, marketing automation, data provider? And how healthy is it?", hint: "List your key tools and be direct about how healthy each one is — data quality, adoption, and whether they are being used as intended.", type: "text" },
  { id: "ops_support", layer: 1, text: "Who is going to own this tool once it is live?", hint: "Most teams do not have dedicated ops support yet — that is normal. Do you have someone who owns your marketing tech, even part time?", type: "choice", options: ["Dedicated marketing ops person", "Shared ops resource, part time", "Whoever buys it will figure it out", "We plan to hire for this"] },
  { id: "account_list", layer: 1, text: "How many target accounts are you working with — and is that list agreed upon by sales and marketing?", hint: "200 tightly defined accounts and 10,000 loosely defined ones require very different tools.", type: "text" },
  { id: "budget", layer: 1, text: "What is your total budget — subscription plus implementation combined?", hint: "Implementation, integrations, admin, and training can easily match the license cost in year one.", type: "choice", options: ["Under $30K total", "$30K to $75K", "$75K to $150K", "$150K or more", "Not sure yet"] },
  { id: "timeline", layer: 1, text: "Is there a hard deadline driving this decision?", hint: "Timeline pressure is one of the biggest predictors of a rough implementation.", type: "choice", options: ["Hard deadline, under 60 days", "3 to 6 months, some flexibility", "No pressure, doing this right", "Still in internal alignment"] },
  { id: "data_quality", layer: 2, text: "On a scale from disaster we know about to a well-governed system, how would you rank your CRM data cleanliness?", hint: "This single factor predicts implementation success more than anything else.", type: "choice", options: ["It is a disaster", "Messy but functional", "Decent, some gaps", "Clean and well-governed"] },
  { id: "change_readiness", layer: 2, text: "How would you describe your organization's appetite for change right now?", hint: "The tool is rarely the problem. The organization's readiness to change is.", type: "choice", options: ["Low — people are change-fatigued", "Medium — willing but cautious", "High — leadership is aligned and pushing", "Unknown — have not tested it yet"] },
  { id: "vendor_references", layer: 2, text: "Have you talked to customers the vendor did not refer you to?", hint: "References the vendor provides are curated. Finding your own is the single most important thing you can do.", type: "choice", options: ["Yes, found our own references", "Only vendor-provided references", "Have not done reference calls yet", "Planning to"] },
];

const BASE_STACK_QUESTIONS = [
  { id: "current_stack", layer: 1, text: "What does your current stack look like?", hint: "List your CRM, marketing automation platform, data warehouse, BI tool, and enrichment provider. Be direct about how healthy each one is and whether they are being used as intended.", type: "text" },
  { id: "integration_method", layer: 1, text: "How are your current tools integrated?", hint: "How your existing stack is connected tells us what a new addition will require.", type: "choice", options: ["Native integrations built by the vendors", "Middleware like Zapier or Make", "Custom API work built by our team", "A mix of native integrations and custom API work", "A mix of all of these", "Honestly not sure"] },
  { id: "integration_owner", layer: 1, text: "Who owns integrations in your organization?", hint: "This determines what is realistic when a new tool needs to connect to existing systems.", type: "choice", options: ["Engineering team", "Marketing or revenue ops", "A third-party consultant", "Nobody owns it clearly", "We are still figuring that out"] },
  { id: "data_flow", layer: 1, text: "What data needs to flow between the new tool and your existing stack?", hint: "Which systems need to talk to the new tool, in which direction, and how frequently. This is where most stack fit problems live.", type: "text" },
  { id: "connector_tolerance", layer: 1, text: "What is your tolerance for a connector versus a native integration?", hint: "Some organizations are fine with Zapier. Others have learned the hard way that connectors break at the worst moments.", type: "choice", options: ["Native only — connectors have burned us before", "Prefer native but open to connectors", "Connectors are fine if they are reliable", "No preference — we just need it to work", "Not sure what the difference means for us"] },
  { id: "integration_failures", layer: 1, text: "Have you had integration failures before?", hint: "What broke, why, and what it cost. This is one of the most important readiness signals we collect.", type: "choice", options: ["Yes — significant failures that cost us time and money", "Yes — minor issues we worked through", "No failures but we are cautious", "No failures and we are confident in our setup", "We are too early to have had failures yet"] },
  { id: "stack_budget", layer: 2, text: "What is your total budget for this addition — license plus implementation?", hint: "Integration work often costs as much as the license.", type: "choice", options: ["Under $20K total", "$20K to $50K", "$50K to $100K", "$100K or more", "Not sure yet"] },
  { id: "stack_timeline", layer: 2, text: "Is there a timeline pressure on this decision?", hint: "Rushed integrations are where things break.", type: "choice", options: ["Hard deadline, under 60 days", "3 to 6 months, some flexibility", "No pressure, doing this right", "Still in planning"] },
];

const EVAL_PROMPT = `You are Delphi — a direct, experienced advisor for software buyers with deep knowledge of B2B marketing technology.

ABSOLUTE RULES:
- Never use the word "honest" or "honestly"
- Never write "That context shapes everything below" or any similar filler phrase
- Everything must be specific to what this buyer told you — no generic advice
- Write in plain, direct language. No filler. No inflation. No hedging.

WHAT WE HEARD — write a 3 to 5 sentence consultant's synthesis of what you actually learned. This is NOT a playback of their answers. It is a senior advisor's read of their real situation, what they are trying to accomplish, and what stands out as the most important factor. Write it as something a person would say after a discovery call, not as a form summary.

BUDGET RULES — approximate total costs:
HubSpot ABM/Marketing $15K-$50K | Rollworks $20K-$60K | Terminus $30K-$80K | ZoomInfo $30K-$80K | Apollo $10K-$40K | Outreach/Salesloft $30K-$80K | Gong/Chorus $40K-$100K | Demandbase $60K-$150K | 6sense $80K-$200K+ | Marketo/Pardot $30K-$120K | Salesforce $50K-$200K+
Lead with tools that fit their budget. If shortlisted tools exceed budget, show them first with a disclaimer, then include 1-2 alternatives that fit. Always include 1-2 tools above their budget so they understand the full option set.

SHORTLIST ASSESSMENT — structure this section in this exact order:
1. Open with a markdown comparison table summarizing ALL shortlisted tools:
| Tool | Budget Fit | Implementation Complexity | Integration Type | Best For |
2. Then write the detailed assessment for EVERY tool on the shortlist — not just the first one. Every single tool gets its own subsection with fit assessment, practical risks, and integration requirements.
3. If a tool exceeds budget, include it but label it clearly as above their stated budget range.

INTEGRATION — required for every tool:
- Integration type with their stated CRM and MAP (native, connector, webhook, API)
- What that type means practically for their team
- What prerequisites must be true in their stack
- What breaks or degrades if prerequisites are not met

READINESS SCORE — most important section. Structure in this exact order:
1. Write OVERALL READINESS: X/5 score card line first
2. Then write the dimensional summary table:
| Dimension | Score | Status |
3. Then write the How We Score Readiness methodology explanation
4. Then write the detailed gap analysis for each dimension

How We Score Readiness

Your readiness score shows how prepared your organization is to implement and get value from this tool. Each of six dimensions is scored 1 to 5. Your overall score is the average.

1 to 2: Serious gaps — address before purchasing
3: Some gaps — manageable with the right preparation
4 to 5: Well positioned — strong foundation for success

The six dimensions:
1. Data Readiness — do you have the data quality and structure this tool requires
2. Ops Capacity — do you have the people and time to implement and manage this tool
3. Sales and Marketing Alignment — are the teams aligned on goals and process
4. Change Management — is your organization ready to change the processes this tool requires
5. Integration Readiness — does your existing stack support the integrations this tool needs
6. Executive Sponsorship — is there a named leader who owns this initiative

Your score shows where you have alignment and where you have gaps. Each gap includes what it means in practice and what to do about it.

Then write: OVERALL READINESS: X/5
Then score each dimension and explain each gap specifically.

CRITICAL: Use ONLY these exact section headers, nothing else:
## What We Heard
## Your Shortlist, Assessed
## Readiness Score
## What You Should Know
## Questions to Ask in Your Next Demo
## Our Recommendation`;

const STACK_PROMPT = `You are Delphi — a direct, experienced advisor for software buyers with deep knowledge of B2B technology stacks and integrations.

ABSOLUTE RULES:
- Never use the word "honest" or "honestly"
- Never write "That context shapes everything below" or any similar filler phrase
- Everything must be specific to what this buyer told you — no generic advice
- Write in plain, direct language. No filler. No inflation. No hedging.

WHAT WE HEARD — write a 3 to 5 sentence consultant's synthesis of what you actually learned. This is NOT a playback of their answers. Write what a senior integration consultant would say after a discovery call about this team's stack situation and what the real compatibility challenge is.

STACK COMPATIBILITY ASSESSMENT — open with this exact text before any tool assessments:

How We Score Compatibility

Your compatibility score shows how well a tool will work inside your existing stack. Each of five dimensions is scored 1 to 5. Your overall score is the average.

1 to 2: Serious misalignment — resolve before adding this tool
3: Some gaps — workable with the right preparation
4 to 5: Clean fit — well positioned to integrate successfully

The five dimensions:
1. Data Model Compatibility — does the new tool align with how your systems organize data, or will you need custom field mapping
2. Integration Architecture — what type of integration exists and what does that demand from your team
3. Process Overlap — does this tool require changing workflows that other tools depend on
4. Team Capacity — do you have the ops resources to manage another integration ongoing
5. Stack Complexity — how much harder does adding this tool make your stack to manage

Your assessment shows which dimensions have alignment and which need attention. Each gap includes what it means in practice and what to do about it.

Structure this section in this exact order:
1. Write the comparison table FIRST summarizing ALL tools being assessed:
| Tool | Compatibility Score | Integration Type | Key Risk | Verdict |
2. Then write the How We Score Compatibility methodology explanation
3. Then write the detailed assessment for EVERY tool — not just the first one. Every single tool gets its own subsection with integration type, prerequisites, what breaks, data flow analysis, and OVERALL COMPATIBILITY: X/5 score.

For each tool cover:
- Integration type with their specific stack (native, connector, custom API)
- What that type means practically for their team
- Specific prerequisites in their existing stack
- What degrades or fails if prerequisites are not met
- Write: OVERALL COMPATIBILITY: X/5
- Score each of the five dimensions with specific gap analysis

CRITICAL: Use ONLY these exact section headers, nothing else:
## What We Heard
## Stack Compatibility Assessment
## Integration Readiness
## What You Should Know
## Questions to Ask Before You Integrate
## Our Compatibility Verdict`;

function buildEvalPrompt(answers) {
  return "Buyer diagnostic answers:\nCategories: " + (Array.isArray(answers.categories) ? answers.categories.join(", ") : answers.categories || "Not provided") +
    "\nTools on shortlist: " + (Array.isArray(answers.shortlist) ? answers.shortlist.join(", ") : answers.shortlist || "Not provided") +
    "\nWhy considering / team context: " + (answers.problem || "Not provided") +
    "\nPrior experience: " + (answers.maturity || "Not provided") +
    "\nSales alignment: " + (answers.sales_alignment || "Not provided") +
    "\nCurrent stack and health: " + (answers.stack || "Not provided") +
    "\nOps ownership: " + (answers.ops_support || "Not provided") +
    "\nTarget account list: " + (answers.account_list || "Not provided") +
    "\nTotal budget: " + (answers.budget || "Not provided") +
    "\nTimeline: " + (answers.timeline || "Not provided") +
    "\nCRM data quality: " + (answers.data_quality || "Not provided") +
    "\nChange readiness: " + (answers.change_readiness || "Not provided") +
    "\nIndependent references: " + (answers.vendor_references || "Not provided") +
    "\n\nGenerate the Delphi evaluation report now.";
}

function buildStackPrompt(answers) {
  return "Stack Fit diagnostic answers:\nCategories being added: " + (Array.isArray(answers.categories) ? answers.categories.join(", ") : answers.categories || "Not provided") +
    "\nTools being considered: " + (Array.isArray(answers.stack_shortlist) ? answers.stack_shortlist.join(", ") : answers.stack_shortlist || "Not provided") +
    "\nCurrent stack: " + (answers.current_stack || "Not provided") +
    "\nHow current tools are integrated: " + (answers.integration_method || "Not provided") +
    "\nWho owns integrations: " + (answers.integration_owner || "Not provided") +
    "\nData flow requirements: " + (answers.data_flow || "Not provided") +
    "\nConnector tolerance: " + (answers.connector_tolerance || "Not provided") +
    "\nPrior integration failures: " + (answers.integration_failures || "Not provided") +
    "\nTotal budget: " + (answers.stack_budget || "Not provided") +
    "\nTimeline: " + (answers.stack_timeline || "Not provided") +
    "\n\nGenerate the Delphi Stack Fit compatibility report now.";
}

const EVAL_ICONS = { "What We Heard": "◎", "Your Shortlist, Assessed": "◈", "Readiness Score": "◐", "What You Should Know": "◆", "Questions to Ask in Your Next Demo": "◇", "Our Recommendation": "●" };
const STACK_ICONS = { "What We Heard": "◎", "Stack Compatibility Assessment": "◈", "Integration Readiness": "◐", "What You Should Know": "◆", "Questions to Ask Before You Integrate": "◇", "Our Compatibility Verdict": "●" };
const TIMING_OPTIONS = ["Within 1 to 3 months", "3 to 6 months", "6 to 12 months", "Just researching for now"];

function parseReport(text) {
  const sections = [];
  let current = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace("## ", "").trim(), content: [] };
    } else if (current) current.content.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

function getScoreColor(score) {
  if (score <= 2) return C.red;
  if (score <= 3) return C.amber;
  return C.accent;
}

function getScoreLabel(score) {
  if (score <= 2) return "Needs attention before purchasing";
  if (score <= 3) return "Proceed with preparation";
  return "Well positioned";
}

function renderTable(rows) {
  if (!rows || rows.length < 2) return null;
  const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
  const dataRows = rows.slice(1).map(r => r.split("|").map(c => c.trim()).filter(Boolean));
  return (
    <div style={{ overflowX: "auto", marginBottom: 20, marginTop: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, fontFamily: FF }}>
        <thead>
          <tr style={{ background: C.accent }}>
            {headers.map((h, j) => <th key={j} style={{ padding: "10px 14px", textAlign: "left", color: C.white, fontWeight: 700, fontSize: 13 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, j) => (
            <tr key={j} style={{ background: j % 2 === 0 ? C.white : C.card, borderBottom: "1px solid " + C.border }}>
              {row.map((cell, k) => <td key={k} style={{ padding: "10px 14px", color: C.textMid, fontWeight: 500, lineHeight: 1.5 }}>{cell.replace(/\*\*(.*?)\*\*/g, "$1")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderContent(content) {
  const rawLines = content.join("\n").split("\n");
  const elements = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    if (!line.trim()) { i++; continue; }
    const clean = line.replace(/\*\*(.*?)\*\*/g, "$1");

    // Table detection
    if (line.trim().startsWith("|")) {
      const tableRows = [];
      let j = i;
      while (j < rawLines.length && rawLines[j].trim().startsWith("|")) {
        if (!rawLines[j].match(/^\s*\|[\s-:]+\|/)) tableRows.push(rawLines[j]);
        j++;
      }
      if (tableRows.length >= 2) {
        const tableEl = renderTable(tableRows);
        if (tableEl) elements.push(<div key={i}>{tableEl}</div>);
        i = j; continue;
      }
    }

    // Score card
    if (/^OVERALL (READINESS|COMPATIBILITY):/i.test(line)) {
      const match = line.match(/(\d(?:\.\d)?)\s*\/\s*5/);
      const score = match ? parseFloat(match[1]) : null;
      if (score) {
        const color = getScoreColor(score);
        elements.push(
          <div key={i} style={{ background: color, borderRadius: 8, padding: "24px 28px", margin: "16px 0 24px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 52, fontWeight: 700, color: C.white, lineHeight: 1, fontFamily: FFD }}>{score}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: 1 }}>OUT OF 5</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 4, fontFamily: FFD }}>{getScoreLabel(score)}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>The dimensional breakdown below shows where you have alignment and where you have gaps.</div>
            </div>
          </div>
        );
        i++; continue;
      }
    }

    if (line.startsWith("### ")) { elements.push(<h3 key={i} style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "24px 0 10px", fontFamily: FF }}>{line.replace("### ", "")}</h3>); i++; continue; }
    if (line.match(/^\*\*(.+)\*\*$/)) { elements.push(<p key={i} style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 10px", lineHeight: 1.6, fontFamily: FF }}>{clean}</p>); i++; continue; }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(<div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}><span style={{ color: C.accent, flexShrink: 0, marginTop: 4, fontSize: 14 }}>—</span><p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: C.textMid, margin: 0, fontFamily: FF }}>{line.replace(/^[-•]\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</p></div>);
      i++; continue;
    }
    if (/^\d+\./.test(line)) {
      elements.push(<div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}><span style={{ color: C.accent, flexShrink: 0, marginTop: 4, minWidth: 20, fontSize: 14, fontFamily: FF }}>{line.match(/^\d+/)[0]}.</span><p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: C.textMid, margin: 0, fontFamily: FF }}>{line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</p></div>);
      i++; continue;
    }
    elements.push(<p key={i} style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.9, color: C.textMid, marginBottom: 14, fontFamily: FF }}>{clean}</p>);
    i++;
  }
  return elements;
}

export default function Delphi({ paymentStatus, startCheckout, onHome }) {
  const [reportType, setReportType] = useState(null);
  const [step, setStep] = useState("select");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [categoryStep, setCategoryStep] = useState("categories");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [currentMulti, setCurrentMulti] = useState([]);
  const [reportSections, setReportSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [consentOn, setConsentOn] = useState(false);
  const [timing, setTiming] = useState(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState(null);
  const inputRef = useRef(null);

  const questions = reportType === "stack_fit" ? BASE_STACK_QUESTIONS : BASE_EVAL_QUESTIONS;
  const sectionIcons = reportType === "stack_fit" ? STACK_ICONS : EVAL_ICONS;
  const q = questions[currentQ];
  const progress = Math.round(((currentQ + 1) / questions.length) * 100);

  useEffect(() => {
    if (step === "questions" && q && q.type === "text") setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [currentQ, step]);

  const startReport = (type) => { setReportType(type); setStep("category_select"); setSelectedCategories([]); setSelectedTools([]); setCategoryStep("categories"); };
  const toggleCategory = (id) => setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleTool = (tool) => setSelectedTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);

  const confirmSelection = () => {
    const shortlistKey = reportType === "stack_fit" ? "stack_shortlist" : "shortlist";
    const labels = selectedCategories.map(id => { const c = TOOL_CATEGORIES.find(x => x.id === id); return c ? c.label : null; }).filter(Boolean);
    setAnswers(prev => ({ ...prev, categories: labels, [shortlistKey]: selectedTools }));
    setStep("questions"); setCurrentQ(0);
  };

  const submitAnswer = (value) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers); setCurrentInput(""); setCurrentMulti([]); setHoveredChoice(null);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else generateReport(newAnswers);
  };

  const generateReport = async (finalAnswers) => {
    setStep("generating");
    try {
      const res = await fetch("/.netlify/functions/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: reportType === "stack_fit" ? STACK_PROMPT : EVAL_PROMPT,
          prompt: reportType === "stack_fit" ? buildStackPrompt(finalAnswers) : buildEvalPrompt(finalAnswers),
        }),
      });
      const data = await res.json();
      const text = data.text || "";
      if (!text) throw new Error("empty");
      const sections = parseReport(text);
      if (!sections.length) throw new Error("no sections");
      setReportSections(sections);
      setStep("report");
    } catch (e) {
      setReportSections([{ title: "What We Heard", content: ["Unable to generate your report. Please try again."] }]);
      setStep("report");
    }
  };

  const restart = () => {
    setStep("select"); setReportType(null); setCurrentQ(0); setAnswers({});
    setCurrentInput(""); setCurrentMulti([]); setReportSections([]); setActiveSection(0);
    setConsentOn(false); setTiming(null); setEmail(""); setEmailSubmitted(false);
    setSelectedCategories([]); setSelectedTools([]); setCategoryStep("categories");
  };

  const gs = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=EB+Garamond:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } button { cursor: pointer; } textarea { outline: none; } textarea:focus { border-color: " + C.accent + " !important; } input:focus { outline: none; border-color: " + C.accent + " !important; } @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } } @keyframes spin { to { transform: rotate(360deg); } } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: " + C.border + "; border-radius: 3px; }";

  const Btn = ({ children, onClick, variant, disabled, full }) => {
    const v = variant || "primary";
    const d = disabled || false;
    return (
      <button onClick={onClick} disabled={d} style={{ background: v === "primary" ? (d ? C.border : C.accent) : v === "white" ? C.white : "transparent", color: v === "primary" ? C.white : v === "white" ? C.accent : C.textLight, border: v === "ghost" ? "1.5px solid " + C.borderDark : v === "white" ? "1.5px solid " + C.border : "none", borderRadius: 4, padding: "12px 24px", fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF, fontWeight: 700, cursor: d ? "default" : "pointer", width: full ? "100%" : "auto", opacity: d ? 0.5 : 1, transition: "all 0.15s" }}>{children}</button>
    );
  };

  const Toggle = ({ on, onChange, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onChange(!on)}>
      <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? C.accent : C.border, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 500, color: C.textMid, fontFamily: FF }}>{label}</span>
    </div>
  );

  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: FFD }}>D</div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</p>
        <p style={{ fontSize: 11, color: C.textLight, letterSpacing: 2, textTransform: "uppercase" }}>Independent report for software buyers</p>
      </div>
    </div>
  );

  const pageWrap = { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: FF };

  // ─── SELECT ────────────────────────────────────────────────────────────────
  if (step === "select") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px", fontFamily: FF }}>
      <style>{gs}</style>
      <div style={{ maxWidth: 820, width: "100%", animation: "fadeUp 0.4s ease" }}>
        <Logo />
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -1, marginBottom: 12 }}>What are you trying to figure out?</h1>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.textMid, lineHeight: 1.8, marginBottom: 40 }}>Choose the report type that matches your situation.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { type: "evaluation", tag: "The Evaluation", title: "Find the right tool.", body: "You have a problem to solve. Delphi tells you which tool fits your situation, what it costs to implement, what your organization needs to prepare, and what to ask before you sign.", best: "First-time buyers, teams migrating platforms, anyone wanting an independent read before the sales cycle.", featured: true, btn: "Start Evaluation" },
            { type: "stack_fit", tag: "The Stack Fit", title: "Know how it fits what you have.", body: "You are adding to an existing stack. Delphi assesses data flow, integration depth, process overlap, and whether the tool creates dependencies or conflicts in your environment.", best: "Teams with established stacks, ops leaders managing tool sprawl, anyone asking whether this will work with what we have.", featured: false, btn: "Start Stack Fit" },
          ].map(card => (
            <div key={card.type} style={{ background: card.featured ? C.accent : C.white, border: "1.5px solid " + (card.featured ? C.accent : C.border), borderRadius: 10, padding: "36px 32px", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }}
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

  // ─── CATEGORY SELECT ────────────────────────────────────────────────────────
  if (step === "category_select") return (
    <div style={pageWrap}>
      <style>{gs}</style>
      <div style={{ maxWidth: 600, width: "100%", animation: "fadeUp 0.4s ease" }}>
        <Logo />
        <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.accent, background: "rgba(61,107,33,0.08)", borderRadius: 20, padding: "4px 12px", marginBottom: 16 }}>
          {reportType === "stack_fit" ? "The Stack Fit" : "The Evaluation"}
        </div>

        {categoryStep === "categories" ? (
          <>
            <h2 style={{ fontFamily: FFD, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>
              {reportType === "stack_fit" ? "What type of tool are you adding?" : "What category are you evaluating?"}
            </h2>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.75, marginBottom: 28 }}>Select all that apply — you can evaluate tools across multiple categories at the same time.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {TOOL_CATEGORIES.map(cat => {
                const sel = selectedCategories.includes(cat.id);
                return (
                  <button key={cat.id} onClick={() => toggleCategory(cat.id)} style={{ background: sel ? C.accent : C.white, border: "1.5px solid " + (sel ? C.accent : C.border), borderRadius: 4, padding: "14px 18px", textAlign: "left", fontSize: 16, fontWeight: 500, color: sel ? C.white : C.text, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
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
                        <button key={tool} onClick={() => toggleTool(tool)} style={{ background: sel ? C.accent : C.white, border: "1.5px solid " + (sel ? C.accent : C.border), borderRadius: 4, padding: "12px 18px", textAlign: "left", fontSize: 15, fontWeight: 500, color: sel ? C.white : C.text, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (sel ? "rgba(255,255,255,0.6)" : C.borderDark), background: sel ? "rgba(255,255,255,0.25)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: C.white, fontWeight: 700 }}>{sel ? "✓" : ""}</div>
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={() => setCategoryStep("categories")} style={{ background: "none", border: "1.5px solid " + C.borderDark, borderRadius: 4, padding: "12px 24px", fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMid, fontFamily: FF }}>Back</button>
              <Btn onClick={confirmSelection} disabled={selectedTools.length === 0}>Continue</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ─── GENERATING ────────────────────────────────────────────────────────────
  if (step === "generating") return (
    <div style={pageWrap}>
      <style>{gs}</style>
      <div style={{ textAlign: "center", maxWidth: 440, padding: "0 24px" }}>
        <div style={{ width: 48, height: 48, border: "3px solid " + C.border, borderTop: "3px solid " + C.accent, borderRadius: "50%", margin: "0 auto 28px", animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14, fontFamily: FFD }}>{reportType === "stack_fit" ? "Building your Stack Fit report" : "Building your evaluation report"}</p>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.75 }}>{reportType === "stack_fit" ? "Analyzing your stack, integration patterns, and compatibility signals." : "Analyzing your situation against known implementation requirements and organizational readiness signals."}</p>
      </div>
    </div>
  );

  // ─── REPORT ────────────────────────────────────────────────────────────────
  if (step === "report") {
    const section = reportSections[activeSection];
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: FF }}>
        <style>{gs}</style>
        <div style={{ width: 240, minWidth: 240, background: C.sidebar, borderRight: "1px solid " + C.border, padding: "32px 20px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, fontFamily: FFD }}>D</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</p>
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24, marginLeft: 44 }}>{reportType === "stack_fit" ? "Stack Fit Report" : "Evaluation Report"}</p>
          <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {reportSections.map((sec, i) => {
              const isActive = activeSection === i;
              return (
                <button key={i} onClick={() => setActiveSection(i)} style={{ background: isActive ? C.accent : "transparent", border: "none", borderRadius: 4, padding: "10px 12px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
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
            <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: FFD }}>{section && section.title}</h2>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 6 }}>{activeSection + 1} / {reportSections.length}</span>
          </div>

          <div style={{ marginBottom: 32 }}>{section && renderContent(section.content)}</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid " + C.border, marginTop: 8 }}>
            <button onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)} style={{ background: "none", border: "none", color: C.textMid, fontSize: 15, fontWeight: 500, opacity: activeSection === 0 ? 0.3 : 1, cursor: activeSection === 0 ? "default" : "pointer", fontFamily: FF }}>← Previous</button>
            <div style={{ display: "flex", gap: 7 }}>
              {reportSections.map((_, i) => <div key={i} onClick={() => setActiveSection(i)} style={{ width: 7, height: 7, borderRadius: "50%", background: i === activeSection ? C.accent : C.border, cursor: "pointer", transition: "background 0.2s" }} />)}
            </div>
            <button onClick={() => setActiveSection(Math.min(activeSection + 1, reportSections.length - 1))} style={{ background: "none", border: "none", color: C.textMid, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: FF }}>Next →</button>
          </div>

          <p style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 36, paddingTop: 20, borderTop: "1px solid " + C.border, lineHeight: 1.7 }}>Delphi is funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
        </div>
      </div>
    );
  }

  // ─── QUESTIONS ─────────────────────────────────────────────────────────────
  return (
    <div style={pageWrap}>
      <style>{gs}</style>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: FFD }}>D</div>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent }}>{reportType === "stack_fit" ? "The Stack Fit" : "The Evaluation"}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.textLight }}>{currentQ + 1} / {questions.length}</span>
        </div>

        <div style={{ width: "100%", height: 3, background: C.border, borderRadius: 2, marginBottom: 36 }}>
          <div style={{ width: progress + "%", height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.35s ease" }} />
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: C.textLight, marginBottom: 16 }}>
          {q && q.layer === 1 ? "Layer 1 — Your Situation" : "Layer 2 — Tool Assessment"}
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.5, color: C.text, marginBottom: 12, fontFamily: FFD }}>{q && q.text}</h2>
        <p style={{ fontSize: 15, fontWeight: 500, color: C.textMid, lineHeight: 1.7, marginBottom: 28 }}>{q && q.hint}</p>

        {q && q.type === "text" && (
          <>
            <textarea ref={inputRef} rows={4} value={currentInput} onChange={e => setCurrentInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && e.metaKey && currentInput.trim()) submitAnswer(currentInput.trim()); }} placeholder="Type your answer here..." style={{ width: "100%", background: C.white, border: "1.5px solid " + C.border, borderRadius: 4, color: C.text, fontSize: 16, fontWeight: 500, padding: "14px 16px", resize: "vertical", lineHeight: 1.7, fontFamily: FF }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: C.border, fontFamily: FF }}>Command + Enter to continue</span>
              <Btn onClick={() => currentInput.trim() && submitAnswer(currentInput.trim())} disabled={!currentInput.trim()}>Continue</Btn>
            </div>
            <button onClick={() => submitAnswer("Not provided")} style={{ background: "none", border: "none", color: C.textLight, fontSize: 13, fontWeight: 500, marginTop: 16, textDecoration: "underline", cursor: "pointer", display: "block", fontFamily: FF }}>Skip this question</button>
          </>
        )}

        {q && q.type === "choice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map(opt => (
              <button key={opt} onClick={() => submitAnswer(opt)} onMouseEnter={() => setHoveredChoice(opt)} onMouseLeave={() => setHoveredChoice(null)} style={{ background: hoveredChoice === opt ? C.accent : C.white, border: "1.5px solid " + (hoveredChoice === opt ? C.accent : C.border), borderRadius: 4, color: hoveredChoice === opt ? C.white : C.text, fontSize: 16, fontWeight: 500, padding: "14px 18px", textAlign: "left", lineHeight: 1.4, cursor: "pointer", transition: "all 0.15s", fontFamily: FF }}>{opt}</button>
            ))}
          </div>
        )}

        {q && q.type === "multi" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {q.options.map(opt => {
                const sel = currentMulti.includes(opt);
                return (
                  <button key={opt} onClick={() => setCurrentMulti(sel ? currentMulti.filter(o => o !== opt) : [...currentMulti, opt])} style={{ background: sel ? C.accent : C.white, border: "1.5px solid " + (sel ? C.accent : C.border), borderRadius: 4, color: sel ? C.white : C.text, fontSize: 16, fontWeight: 500, padding: "14px 18px", textAlign: "left", lineHeight: 1.4, cursor: "pointer", transition: "all 0.15s", fontFamily: FF }}>
                    {sel && <span style={{ marginRight: 10 }}>✓</span>}{opt}
                  </button>
                );
              })}
            </div>
            <Btn onClick={() => currentMulti.length > 0 && submitAnswer(currentMulti)} disabled={currentMulti.length === 0}>Continue</Btn>
          </>
        )}
      </div>
    </div>
  );
}
