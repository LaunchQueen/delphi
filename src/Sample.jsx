import { useEffect } from "react";

const C = {
  bg: "#FAF7F2", card: "#F2EDE6", sidebar: "#EDE6DC", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830", textLight: "#7A7060",
  accent: "#3D6B21", accentDark: "#2D5016", dark: "#141410", gold: "#B8935A",
  white: "#FFFFFF", red: "#C0392B", amber: "#D4830A",
  stack: "#4A6FA5",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";
const GS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=EB+Garamond:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } button { cursor: pointer; }`;

const shared = {
  nav: { background: "rgba(250,247,242,0.97)", borderBottom: "1px solid " + C.border, padding: "14px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
  logoCircle: { width: 36, height: 36, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: FFD },
  logoName: { fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FFD },
  pill: (color, bg) => ({ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", borderRadius: 20, padding: "5px 14px", display: "inline-block", marginBottom: 18, color, background: bg }),
  scenarioH2: { fontFamily: FFD, fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 12 },
  scenarioDesc: { fontSize: 16, color: C.textLight, lineHeight: 1.75, maxWidth: 600, margin: "0 auto 12px" },
  dividerLine: { width: 48, height: 3, borderRadius: 2, margin: "24px auto 0" },
  altRow: { padding: "52px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" },
  frame: { border: "1px solid " + C.borderDark, borderRadius: 8, overflow: "hidden", background: C.bg },
  frameBar: { background: C.sidebar, borderBottom: "1px solid " + C.border, padding: "9px 14px", display: "flex", alignItems: "center", gap: 6 },
  frameDot: { width: 9, height: 9, borderRadius: "50%", background: C.borderDark },
  frameLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, marginLeft: 6, fontFamily: FF },
  frameBody: { padding: "20px 22px" },
  secTitle: { fontFamily: FFD, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, paddingBottom: 10, borderBottom: "2px solid " + C.borderDark },
  prose: { fontSize: 13, color: C.textMid, lineHeight: 1.85, marginBottom: 10, fontFamily: FF },
  proseFade: { fontSize: 13, color: "#9A8E7E", fontStyle: "italic", fontFamily: FF },
  blurbEyebrow: (color) => ({ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color, marginBottom: 10, fontFamily: FF }),
  blurbH3: { fontFamily: FFD, fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 14 },
  blurbBody: { fontSize: 15, color: C.textMid, lineHeight: 1.85, fontFamily: FF },
};

function Frame({ label, children }) {
  return (
    <div style={shared.frame}>
      <div style={shared.frameBar}>
        <div style={shared.frameDot} /><div style={shared.frameDot} /><div style={shared.frameDot} />
        <span style={shared.frameLabel}>{label}</span>
      </div>
      <div style={shared.frameBody}>{children}</div>
    </div>
  );
}

function ScoreCard({ score, verdict, note, color }) {
  return (
    <div style={{ background: color, borderRadius: 6, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, margin: "12px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: C.white, fontFamily: FFD, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", fontWeight: 600, letterSpacing: 1 }}>OUT OF 5</div>
      </div>
      <div style={{ width: 1, background: "rgba(255,255,255,0.3)", height: 44, flexShrink: 0 }} />
      <div style={{ paddingLeft: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 3 }}>{verdict}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, fontFamily: FF }}>{note}</div>
      </div>
    </div>
  );
}

function DimRow({ name, score, status, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid " + C.border, fontSize: 12, gap: 8, fontFamily: FF }}>
      <span style={{ color: C.textMid, flex: 1 }}>{name}</span>
      <span style={{ color, fontWeight: 700, whiteSpace: "nowrap" }}>{score}</span>
      <span style={{ color: C.textLight, fontSize: 11, whiteSpace: "nowrap" }}>{status}</span>
    </div>
  );
}

function WYSKCard({ theme, body, color }) {
  return (
    <div style={{ border: "1px solid " + C.border, borderRadius: 6, padding: "12px 14px", marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 5, fontFamily: FF }}>{theme}</div>
      <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.65, fontFamily: FF }}>{body}</div>
    </div>
  );
}

function QGroup({ label, items, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ background: color, borderRadius: "6px 6px 0 0", padding: "9px 14px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.white, fontFamily: FF }}>{label}</span>
      </div>
      <div style={{ border: "1px solid " + C.border, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "12px 14px", borderBottom: i < items.length - 1 ? "1px solid " + C.border : "none", display: "flex", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color, flexShrink: 0, minWidth: 18, fontFamily: FF }}>{i + 1}.</span>
            <div>
              <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 4, fontFamily: FF }}>{item.q}</p>
              <p style={{ fontSize: 11, color: C.textLight, fontStyle: "italic", lineHeight: 1.5, fontFamily: FF }}>{item.listen}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AltRow({ frameLeft, frame, blurb, shaded, accentColor }) {
  const rowStyle = { ...shared.altRow, background: shaded ? C.card : C.bg };
  if (frameLeft) {
    return (
      <div style={rowStyle}>
        {frame}
        <div>
          <p style={shared.blurbEyebrow(accentColor)}>{blurb.eyebrow}</p>
          <h3 style={shared.blurbH3}>{blurb.h3}</h3>
          <p style={shared.blurbBody}>{blurb.body}</p>
        </div>
      </div>
    );
  }
  return (
    <div style={rowStyle}>
      <div>
        <p style={shared.blurbEyebrow(accentColor)}>{blurb.eyebrow}</p>
        <h3 style={shared.blurbH3}>{blurb.h3}</h3>
        <p style={shared.blurbBody}>{blurb.body}</p>
      </div>
      {frame}
    </div>
  );
}

export default function Sample({ onHome, onGetReport }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{GS}</style>

      {/* NAV */}
      <nav style={shared.nav}>
        <a href="/" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: 0, textDecoration: "none" }}>
          <div style={shared.logoCircle}>D</div>
          <span style={shared.logoName}>Delphi</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/#how-it-works" style={{ fontSize: 14, color: C.textLight, fontFamily: FF, textDecoration: "none" }}>How it works</a>
          <a href="/#pricing" style={{ fontSize: 14, color: C.textLight, fontFamily: FF, textDecoration: "none" }}>Pricing</a>
          <span style={{ fontSize: 14, color: C.accent, fontWeight: 600, fontFamily: FF }}>Sample Reports</span>
          <button onClick={onGetReport} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "11px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Get a Report</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: C.dark, padding: "64px 56px 56px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 18, fontFamily: FF }}>Sample Reports</p>
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.white, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 16 }}>
          See exactly what<br /><em style={{ fontStyle: "italic", color: C.gold }}>you're buying.</em>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 24px", fontFamily: FF }}>
          Real report output based on a real buyer scenario. Names and companies are anonymized. The analysis is not.
        </p>
      </div>

      {/* INDEPENDENCE STRIP */}
      <div style={{ background: "#0E0E0C", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 56px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: FF }}>Delphi is an independent, AI-generated analysis of your software buying situation. Funded entirely by subscribers. No vendor pays for placement, recommendation, or access. Ever.</p>
      </div>

      {/* ── EVALUATION SECTION ── */}
      <div style={{ padding: "52px 56px 0", textAlign: "center" }}>
        <div style={shared.pill(C.accent, "rgba(61,107,33,0.1)")}>The Evaluation</div>
        <h2 style={{ ...shared.scenarioH2, textAlign: "center" }}>A five-company roll-up evaluating<br /><em style={{ fontStyle: "italic", color: C.accent }}>an ABM platform for the first time.</em></h2>
        <p style={{ ...shared.scenarioDesc, textAlign: "center" }}>New brand, new exec team, reps who have never prospected, and a CRM described as a disaster. This is what the report looked like.</p>
        <div style={{ ...shared.dividerLine, background: C.accent }} />
      </div>

      {/* EVAL ROW 1 */}
      <AltRow frameLeft accentColor={C.accent} shaded={false}
        frame={
          <Frame label="What We Heard">
            <p style={shared.secTitle}>What We Heard</p>
            <p style={shared.prose}>You are not really buying an ABM platform right now. You are buying a stabilization tool for a company still finding its footing. Five companies merging under a new brand, an exec team new to the industry, reps who have never prospected, and a CRM described as a disaster — that is a lot of weight for any software purchase to carry.</p>
            <p style={shared.prose}>Your TAM is genuinely small, under 250 named accounts on your target list. You do not need a platform built to score millions of anonymous signals. The question is how to stay visible to your accounts across a long buying cycle while your team figures out how to actually sell.</p>
            <p style={shared.proseFade}>...continues across 3 paragraphs</p>
          </Frame>
        }
        blurb={{
          eyebrow: "What We Heard",
          h3: "Delphi reads the situation, not just the answers.",
          body: "The opening section doesn't summarize what you told us. It synthesizes it — pulling out what the answers reveal about your actual situation, including the things you may not have realized yet. In this case, the real problem wasn't which ABM platform to choose. It was whether the organization was set up to make any of them work."
        }}
      />

      {/* EVAL ROW 2 */}
      <AltRow frameLeft={false} accentColor={C.accent} shaded
        frame={
          <Frame label="Readiness Score">
            <p style={shared.secTitle}>Readiness Score</p>
            <ScoreCard score="2" verdict="Needs attention before purchasing" note="Dimensional breakdown shows where the gaps are." color={C.red} />
            <div style={{ marginTop: 10 }}>
              {[
                ["Data Readiness", "2/5", "Address before go-live"],
                ["Sales & Marketing Alignment", "2/5", "Address before go-live"],
                ["Change Management", "1/5", "Address before go-live"],
                ["Ops Capacity", "3/5", "Manageable with prep"],
                ["Integration Readiness", "3/5", "Manageable with prep"],
                ["Executive Sponsorship", "2/5", "Address before go-live"],
              ].map(([name, score, status]) => (
                <DimRow key={name} name={name} score={score} status={status} color={C.accent} />
              ))}
            </div>
          </Frame>
        }
        blurb={{
          eyebrow: "Readiness Score",
          h3: "Six dimensions. A clear picture of what to address before you sign.",
          body: "Most buyers go into a software decision not knowing where their gaps are until implementation fails. The Readiness Score maps your organization across six dimensions and tells you what needs to be in place before go-live. A low score is a setup checklist, not a disqualifier."
        }}
      />

      {/* EVAL ROW 3 */}
      <AltRow frameLeft accentColor={C.accent} shaded={false}
        frame={
          <Frame label="Your Shortlist, Assessed">
            <p style={shared.secTitle}>Your Shortlist, Assessed</p>
            <div style={{ marginBottom: 12 }}>
              <div style={{ background: C.accent, borderRadius: "6px 6px 0 0", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 3 }}>Rollworks</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: FF }}>4/5 · Budget: Strong fit · Readiness: Good match for current maturity</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 3, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: C.white, letterSpacing: 1.5, textTransform: "uppercase", flexShrink: 0, fontFamily: FF }}>Recommended</div>
              </div>
              <div style={{ border: "1px solid " + C.border, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid " + C.border }}>
                  <div style={{ padding: "10px 12px", borderRight: "1px solid " + C.border }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, marginBottom: 4, fontFamily: FF }}>Does Well</div>
                    <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5, fontFamily: FF }}>Purpose-built for a defined list of target accounts and a small marketing team. HubSpot and Salesforce integrations are among the most reliable in the category.</div>
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, marginBottom: 4, fontFamily: FF }}>Does Not Do Well</div>
                    <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5, fontFamily: FF }}>Will not fix the gap between marketing signals and sales action on its own. Self-service reporting is limited.</div>
                  </div>
                </div>
                <div style={{ padding: "10px 12px", fontSize: 12, color: C.textMid, fontStyle: "italic", lineHeight: 1.5, fontFamily: FF }}>The right tool for where you are today: focused, fast to stand up, and matched to a finite account list without requiring organizational change you cannot sustain right now.</div>
              </div>
            </div>
          </Frame>
        }
        blurb={{
          eyebrow: "Your Shortlist, Assessed",
          h3: "Each tool evaluated against your situation, not just the average buyer's.",
          body: "What a tool does well for a 500-person enterprise with a dedicated ops team may be irrelevant for your organization. Every tool on your shortlist is assessed against your specific budget, team size, implementation capacity, and current maturity. The report tells you what it does well for you."
        }}
      />

      {/* EVAL ROW 4 */}
      <AltRow frameLeft={false} accentColor={C.accent} shaded
        frame={
          <Frame label="What You Should Know">
            <p style={shared.secTitle}>What You Should Know</p>
            <WYSKCard color={C.accent} theme="Rollworks — Intent setup has a known configuration trap" body="Bombora intent data within Rollworks defaults to contact-level targeting. Rollworks' own team recommends account-level instead — but this is not documented prominently. If your onboarding contact doesn't flag it, you will run campaigns incorrectly from day one." />
            <WYSKCard color={C.accent} theme="Terminus — Acquisition uncertainty is not fully settled" body="Terminus was acquired by DemandScience in November 2024. Brand consolidation is still in progress. Ask for written confirmation of which entity your contract is with and what the support SLA looks like post-acquisition." />
            <WYSKCard color={C.accent} theme="Demandbase — Renewal price increases are not negotiated by default" body="G2 reviewers report renewal increases of approximately 20% at end of initial term. Demandbase does not include renewal caps unless the buyer negotiates them into the initial agreement." />
          </Frame>
        }
        blurb={{
          eyebrow: "What You Should Know",
          h3: "The things your sales rep has no incentive to raise before you sign.",
          body: "Every vendor on your shortlist has its own intelligence card covering what the sales process won't surface: configuration traps, renewal pricing patterns, support routing changes after acquisitions. These are in every report regardless of which tools you're evaluating."
        }}
      />

      {/* EVAL ROW 5 */}
      <AltRow frameLeft accentColor={C.accent} shaded={false}
        frame={
          <Frame label="Questions to Ask in the Demo">
            <p style={shared.secTitle}>Questions to Ask in the Demo</p>
            <QGroup color={C.accent} label="Ask All Vendors" items={[
              { q: "Our Salesforce data has significant gaps. How does your platform handle account matching when domain data is missing or duplicated?", listen: "Vendors with a structured pre-launch audit process are lower risk than those who say the integration handles it automatically." },
              { q: "We have fewer than 250 target accounts. How does your pricing scale down to that list size, and are there features unavailable below a certain threshold?", listen: "Some platforms have feature lockouts below 500 accounts that make the lower tiers significantly less capable." },
            ]} />
            <QGroup color={C.accent} label="Ask Rollworks Specifically" items={[
              { q: "We have heard that Bombora intent defaults to contact-level targeting. Can you walk us through exactly how you configure intent for a small, named account list?", listen: "Whether the rep proactively confirms this known issue and walks you through the correct setup, or whether they are unaware of it." },
            ]} />
            <p style={shared.proseFade}>...additional vendor-specific questions included for each tool on your shortlist</p>
          </Frame>
        }
        blurb={{
          eyebrow: "Questions to Ask in the Demo",
          h3: "Walk into every demo knowing exactly what to ask — and what a good answer sounds like.",
          body: "The report generates questions specific to your situation and your shortlist. Some are for every vendor. Others are written for a specific tool based on what we know about how it behaves in organizations like yours. Under each question is a note on what to listen for — what a good answer looks like versus one that should prompt a follow-up. That distinction helps you walk out of every demo with a clearer read on whether the tool fits the way your organization actually works."
        }}
      />

      {/* EVAL ROW 6 */}
      <AltRow frameLeft={false} accentColor={C.accent} shaded
        frame={
          <Frame label="Our Recommendation">
            <p style={shared.secTitle}>Our Recommendation</p>
            <p style={{ fontFamily: FFD, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>We recommend Rollworks.</p>
            <p style={{ ...shared.prose, marginBottom: 14 }}>Your account list is small, your team is lean, your stack is already HubSpot and Salesforce, and your organization cannot absorb a complex implementation right now. Rollworks is the only tool on your shortlist designed for exactly that profile.</p>
            <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7, marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid " + C.border, fontFamily: FF }}><strong>Terminus:</strong> The multi-channel capability is genuinely stronger, but the post-acquisition uncertainty and separate ad spend minimums create cost and stability risks your organization is not positioned to absorb right now.</p>
            <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7, paddingLeft: 10, borderLeft: "2px solid " + C.border, fontFamily: FF }}><strong>Demandbase:</strong> The best account intelligence in the category for a known, finite TAM, but the all-in cost and implementation complexity rule it out until your CRM is clean and your sales team is functioning as an active selling team.</p>
          </Frame>
        }
        blurb={{
          eyebrow: "Our Recommendation",
          h3: "A clear recommendation based on what you told us.",
          body: "Delphi gives you a clear answer. The report wraps up with a named recommendation and the reasoning behind it, grounded in your answers — not a ranked list with caveats you then have to translate into a decision. If you're not ready to buy based on what you told us, the report will tell you that too, and tell you what to address before you move forward."
        }}
      />

      {/* ── STACK FIT SECTION ── */}
      <div style={{ height: 1, background: C.border, margin: "0 56px" }} />

      <div style={{ padding: "52px 56px 0", textAlign: "center" }}>
        <div style={shared.pill(C.stack, "rgba(74,111,165,0.1)")}>The Stack Fit</div>
        <h2 style={{ ...shared.scenarioH2, textAlign: "center" }}>The same three tools, evaluated<br /><em style={{ fontStyle: "italic", color: C.stack }}>for integration fit.</em></h2>
        <p style={{ ...shared.scenarioDesc, textAlign: "center" }}>A Salesforce-primary stack with HubSpot, LeanData, and three custom objects. The question isn't which tool fits the use case — it's which tool integrates best with what's already there.</p>
        <div style={{ ...shared.dividerLine, background: C.stack }} />
      </div>

      {/* STACK ROW 1 */}
      <AltRow frameLeft accentColor={C.stack} shaded={false}
        frame={
          <Frame label="What We Heard">
            <p style={shared.secTitle}>What We Heard</p>
            <p style={shared.prose}>You are running a tightly scoped ABM program against a finite list of very large accounts with multi-year, multi-million dollar deal cycles. The value of the platform is not in reach or volume — it is in depth of insight at the buying committee level and how well that insight surfaces inside Salesforce for your reps.</p>
            <p style={shared.prose}>What you have not fully articulated yet is that you are running two systems of record in parallel. Any ABM platform you add will sit between Salesforce and HubSpot and will need to pull segmentation from both while writing engagement signals back to Salesforce. That is a three-way data flow, not a simple two-way sync.</p>
            <p style={shared.proseFade}>...continues across 3 paragraphs</p>
          </Frame>
        }
        blurb={{
          eyebrow: "What We Heard",
          h3: "The Stack Fit reads your environment, not your goals.",
          body: "Where the Evaluation surfaces organizational readiness, the Stack Fit surfaces architectural reality. This opening section identified a three-way data flow problem the buyer hadn't named — and that changes which tool belongs in the stack."
        }}
      />

      {/* STACK ROW 2 */}
      <AltRow frameLeft={false} accentColor={C.stack} shaded
        frame={
          <Frame label="Stack Compatibility Assessment">
            <p style={shared.secTitle}>Stack Compatibility Assessment</p>
            {[
              { name: "Demandbase", meta: "5/5 · Strong · Moderate", body: "Demandbase connects natively to Salesforce via a bidirectional sync and supports a direct native integration with HubSpot. The standout piece for your stack: a published native integration with LeanData lets Demandbase trigger LeanData routing flows when account intent spikes, automatically assigning tasks to account owners without manual Slack notification.", bottom: "The best stack fit for a Salesforce-primary, LeanData-enabled buyer running a tightly scoped enterprise ABM program." },
              { name: "Terminus", meta: "3/5 · Moderate · Moderate", body: "Integrates natively with Salesforce and HubSpot for bidirectional data flow. Multi-channel orchestration is strong, but the post-DemandScience merger roadmap uncertainty means new integration development has been deprioritized.", bottom: null },
            ].map((tool, i) => (
              <div key={i} style={{ borderLeft: "4px solid " + C.stack, borderTop: "1px solid " + C.border, borderRight: "1px solid " + C.border, borderBottom: "1px solid " + C.border, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "10px 14px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: FFD }}>{tool.name}</span>
                  <span style={{ fontSize: 11, color: C.stack, fontWeight: 600, fontFamily: FF }}>{tool.meta}</span>
                </div>
                <div style={{ padding: "10px 14px" }}>
                  <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7, fontFamily: FF }}>{tool.body}</p>
                  {tool.bottom && <p style={{ fontSize: 12, color: C.textMid, fontStyle: "italic", marginTop: 8, fontFamily: FF }}>{tool.bottom}</p>}
                </div>
              </div>
            ))}
            <p style={shared.proseFade}>...RollWorks assessment also included</p>
          </Frame>
        }
        blurb={{
          eyebrow: "Stack Compatibility Assessment",
          h3: "Each tool assessed against how it actually integrates with what you have.",
          body: "The compatibility assessment goes beyond 'native integration available' — it maps specifically how data flows between each tool and your existing stack, where custom work is required, and what breaks if prerequisites aren't met before go-live."
        }}
      />

      {/* STACK ROW 3 */}
      <AltRow frameLeft accentColor={C.stack} shaded={false}
        frame={
          <Frame label="Integration Readiness">
            <p style={shared.secTitle}>Integration Readiness</p>
            <ScoreCard score="4" verdict="Well positioned" note="Strong stack health, clear ownership, mature data model." color={C.stack} />
            <div style={{ marginTop: 10 }}>
              {[
                ["Integration Ownership Clarity", "4/5", "Strong foundation"],
                ["Current Stack Health", "4/5", "Strong foundation"],
                ["Data Model Maturity", "4/5", "Strong foundation"],
                ["Team Capacity for New Integrations", "3/5", "Manageable with prep"],
                ["Historical Integration Track Record", "4/5", "Strong foundation"],
              ].map(([name, score, status]) => (
                <DimRow key={name} name={name} score={score} status={status} color={C.stack} />
              ))}
            </div>
          </Frame>
        }
        blurb={{
          eyebrow: "Integration Readiness",
          h3: "Five dimensions measuring whether your environment is ready to absorb a new integration.",
          body: "The same organization that scored 2/5 on organizational readiness in the Evaluation scored 4/5 on integration readiness here. The technical environment is strong. The organizational gaps are elsewhere — which is exactly the kind of information you need before you decide which report to weight more heavily."
        }}
      />

      {/* STACK ROW 4 */}
      <AltRow frameLeft={false} accentColor={C.stack} shaded
        frame={
          <Frame label="What You Should Know">
            <p style={shared.secTitle}>What You Should Know</p>
            <WYSKCard color={C.stack} theme="Demandbase — Custom object blind spot" body="Demandbase's Salesforce integration cannot sync data to or from custom objects. Engagement signals written back will land on standard fields only. Your Salesforce admin will need to build bridge fields or workflow rules to carry those signals into your custom object views." />
            <WYSKCard color={C.stack} theme="Demandbase — Writeback timing is not real-time" body="The Demandbase-to-Salesforce writeback runs on a daily batch cycle between 10am and 10pm UTC. If reps are trained to act on same-day intent signals, the data in Salesforce may be up to 24 hours behind." />
            <WYSKCard color={C.stack} theme="Terminus — Post-merger roadmap risk" body="Terminus merged into DemandScience in late 2024 and the integration is still ongoing. Vendors in this position routinely deprioritize new integration development. For a program with 12 to 14 month deal cycles, that uncertainty compounds." />
          </Frame>
        }
        blurb={{
          eyebrow: "What You Should Know",
          h3: "Integration-specific intelligence your vendor doesn't have enough information to surface in a demo.",
          body: "In the Stack Fit, the intelligence cards focus on technical behavior — sync timing, object limitations, data flow gaps — rather than organizational gotchas. The same vendor can appear on both reports with different things to know."
        }}
      />

      {/* STACK ROW 5 */}
      <AltRow frameLeft accentColor={C.stack} shaded={false}
        frame={
          <Frame label="Questions to Ask in the Demo">
            <p style={shared.secTitle}>Questions to Ask in the Demo</p>
            <QGroup color={C.stack} label="Ask All Vendors" items={[
              { q: "Walk me through exactly how buying committee member engagement is tracked and surfaced. Can I see which specific contacts at a target account have engaged with which content, and can that data be reported at the individual contact level inside Salesforce?", listen: "A good answer names the specific CRM object and field where contact-level engagement lands. A bad answer stays at the account level." },
              { q: "We have three custom Salesforce objects. Can your platform read from and write to those objects, and if not, how do customers typically handle the gap?", listen: "A good answer is specific about which direction the sync works and proposes a concrete workaround." },
            ]} />
            <QGroup color={C.stack} label="Ask Demandbase Specifically" items={[
              { q: "We use LeanData for account routing. What is the current state of your native integration with LeanData, and can Demandbase intent signals trigger LeanData routing flows automatically?", listen: "A good answer references a specific integration mechanism. A bad answer says 'we work with LeanData' without explaining how." },
            ]} />
            <p style={shared.proseFade}>...additional vendor-specific questions included for each tool on your shortlist</p>
          </Frame>
        }
        blurb={{
          eyebrow: "Questions to Ask in the Demo",
          h3: "Walk into every demo knowing exactly what to ask — and what a good answer sounds like.",
          body: "The report generates questions specific to your stack and your shortlist. Some are for every vendor. Others are written for a specific tool based on known integration behaviors and limitations. Under each question is a note on what to listen for — what a good answer looks like versus one that signals a gap your team will have to close. That distinction helps you walk out of every demo with a clearer read on whether the tool's technical requirements match your team's capacity to support them."
        }}
      />

      {/* STACK ROW 6 */}
      <AltRow frameLeft={false} accentColor={C.stack} shaded
        frame={
          <Frame label="Our Compatibility Verdict">
            <p style={shared.secTitle}>Our Compatibility Verdict</p>
            <p style={{ fontFamily: FFD, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>We recommend Demandbase for integration.</p>
            <p style={{ ...shared.prose, marginBottom: 14 }}>Your use case is defined by depth, not breadth: under 250 accounts, $1M+ contracts, 12 to 14 month cycles, and a requirement to track engagement at the buying committee level. Demandbase is the only platform on your shortlist with a published, native integration with LeanData that can convert intent signals into Salesforce-routed account owner actions automatically.</p>
            <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7, marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid " + C.border, fontFamily: FF }}><strong>Terminus:</strong> Strong multi-channel orchestration, but post-acquisition roadmap uncertainty and absence of a native LeanData routing integration make it a less reliable foundation for a long-running enterprise program.</p>
            <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7, paddingLeft: 10, borderLeft: "2px solid " + C.border, fontFamily: FF }}><strong>RollWorks:</strong> Fastest to implement and most HubSpot-native, but its advertising-reach orientation and limitation on contact-level tracking make it a poor fit for a program designed to measure buying committee engagement.</p>
          </Frame>
        }
        blurb={{
          eyebrow: "Our Compatibility Verdict",
          h3: "A clear answer on which tool your stack is ready to support.",
          body: "The Stack Fit verdict answers a different question than the Evaluation. It is not 'which tool fits your goals' — it is 'which tool your current environment can support without requiring you to rebuild what you have.' In this case, the two reports disagreed. They often do."
        }}
      />

      {/* ── WHEN REPORTS DIVERGE ── */}
      <div style={{ background: C.dark, padding: "56px 56px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.gold, textAlign: "center", marginBottom: 18, fontFamily: FF }}>When the reports diverge</p>
        <h2 style={{ fontFamily: FFD, fontSize: 26, fontWeight: 700, color: C.white, textAlign: "center", lineHeight: 1.2, marginBottom: 10 }}>Why the recommendations can differ</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 40px", fontFamily: FF }}>The Evaluation is based on your organizational readiness for change — your team, your alignment, your capacity to absorb a new process and make it stick. The Stack Fit is based on your technical environment — your current stack, your integration architecture, your data flows. They are designed to surface different constraints. In the sample reports above, they did not agree. The question you need to decide is which constraint is harder to change — your organizational capacity to make a change, or the amount of work it takes to prepare your stack to bring in a new tool.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#7AB84A", marginBottom: 12, fontFamily: FF }}>The Evaluation — Organizational fit</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 40, fontWeight: 700, color: C.red, fontFamily: FFD, lineHeight: 1 }}>2</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, fontFamily: FF }}>OUT OF 5</div>
              </div>
              <div style={{ paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 3 }}>Needs attention before purchasing</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: FF }}>Organizational readiness score</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontFamily: FF }}>Recommends <strong style={{ color: C.white }}>Rollworks</strong> — the tool that asks the least of a team not yet ready to run a complex ABM program.</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#7A9FD4", marginBottom: 12, fontFamily: FF }}>The Stack Fit — Technical fit</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 40, fontWeight: 700, color: C.stack, fontFamily: FFD, lineHeight: 1 }}>4</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, fontFamily: FF }}>OUT OF 5</div>
              </div>
              <div style={{ paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 3 }}>Well positioned</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: FF }}>Integration readiness score</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontFamily: FF }}>Recommends <strong style={{ color: C.white }}>Demandbase</strong> — the tool with the deepest native integration for a LeanData-enabled, Salesforce-primary stack.</p>
          </div>
        </div>

        <div style={{ background: "rgba(184,147,90,0.1)", border: "1px solid rgba(184,147,90,0.3)", borderRadius: 8, padding: "28px 32px" }}>
          <p style={{ fontFamily: FFD, fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 12 }}>How to interpret two different recommendations</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 18, fontFamily: FF }}>When the Evaluation and the Stack Fit point to different tools, it means the tool that best fits your use case requires technical accommodations your stack doesn't currently support — or the tool that fits your stack best may not fully serve the use case you're trying to run. Before you decide which to weight more heavily, it is worth asking:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "What specifically needs to change in your environment to support the use case recommendation? Who owns that work, and do they have capacity to do it before go-live?",
              "What is the cost — in time, money, and organizational lift — of closing that technical gap?",
              "If you go with the stack fit recommendation instead, what use case capability are you giving up, and can you achieve your goals with that tradeoff?",
              "Are the organizational gaps in your Evaluation something you can close before go-live, or will they still be present on day one regardless of which tool you choose?",
              "Which constraint is harder to change — your organization or your stack?",
            ].map((q, i) => (
              <li key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none", display: "flex", gap: 10, fontFamily: FF }}>
                <span style={{ color: C.gold, flexShrink: 0 }}>—</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#141410", padding: "56px 56px", textAlign: "center" }}>
        <h2 style={{ fontFamily: FFD, fontSize: 30, fontWeight: 700, color: C.white, marginBottom: 10, lineHeight: 1.2 }}>
          Your reports are built<br /><em style={{ fontStyle: "italic", color: C.gold }}>for your situation.</em>
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 28, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px", fontFamily: FF }}>Every answer you give shapes the output. This is what one buyer's reports looked like. Yours will look different — because your situation is different.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetReport} style={{ background: C.white, color: C.accent, border: "none", borderRadius: 3, padding: "13px 28px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Start an Evaluation — $300</button>
          <button onClick={onGetReport} style={{ background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 3, padding: "13px 28px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Start a Stack Fit — $300</button>
        </div>
      </div>

      {/* FOOTER DISCLAIMER */}
      <div style={{ background: C.bg, borderTop: "1px solid " + C.border, padding: "28px 56px" }}>
        <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, marginBottom: 8, fontFamily: FF }}>Delphi is funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
        <p style={{ fontSize: 12, color: C.textLight, lineHeight: 1.7, fontFamily: FF }}>Delphi reports are generated using AI and publicly available information. They are for informational purposes only and do not constitute professional, legal, or financial advice. Vendor pricing, product capabilities, and market positioning change frequently — verify all claims directly with vendors before making any purchasing decision. Delphi is not responsible for outcomes resulting from decisions made based on this report.</p>
      </div>

    </div>
  );
}
