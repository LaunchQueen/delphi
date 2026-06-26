import { useEffect } from "react";

const C = {
  bg: "#FAF7F2", warm: "#F2EDE6", sidebar: "#EDE6DC", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830", textBody: "#5A5248",
  textLight: "#7A7060", accent: "#3D6B21", stack: "#4A6FA5", dark: "#1C1C1A",
  darker: "#141410", gold: "#B8935A", white: "#FFFFFF", red: "#C0392B",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";
const GS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=EB+Garamond:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } button { cursor: pointer; }`;

function FrameBar({ label }) {
  return (
    <div style={{ background: C.sidebar, borderBottom: "1px solid " + C.border, padding: "10px 16px", display: "flex", alignItems: "center", gap: 7, borderRadius: "10px 10px 0 0" }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: C.borderDark }} />)}
      <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, marginLeft: 6, fontFamily: FF }}>{label}</span>
    </div>
  );
}

function Frame({ label, children }) {
  return (
    <div style={{ border: "1px solid " + C.borderDark, borderRadius: 10, overflow: "visible", background: C.bg, position: "relative" }}>
      <FrameBar label={label} />
      <div style={{ padding: "28px 32px", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function FrameTitle({ children, accentColor }) {
  return <p style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 14, paddingBottom: 12, borderBottom: "2px solid " + (accentColor || C.borderDark) }}>{children}</p>;
}

function Prose({ children, fade }) {
  return <p style={{ fontSize: 16, color: fade ? "#9A8E7E" : C.textMid, lineHeight: 1.85, marginBottom: 12, fontFamily: FF, fontStyle: fade ? "italic" : "normal" }}>{children}</p>;
}

function Eyebrow({ children, color }) {
  return <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: color || C.accent, marginBottom: 10, fontFamily: FF }}>{children}</p>;
}

function SectionHeading({ children }) {
  return <h2 style={{ fontFamily: FFD, fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 32 }}>{children}</h2>;
}

function ValueProp({ text, accentColor }) {
  return (
    <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid " + C.border }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: accentColor || C.accent, marginBottom: 8, fontFamily: FF }}>What this gives you</p>
      <p style={{ fontSize: 17, color: C.textBody, lineHeight: 1.85, maxWidth: 680, fontFamily: FF }}>{text}</p>
    </div>
  );
}

function Callout({ label, text, color, side }) {
  const isRight = side !== "left";
  return (
    <div style={{ position: "absolute", [isRight ? "right" : "left"]: isRight ? -260 : -260, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 0, zIndex: 10, pointerEvents: "none" }}>
      {!isRight && <>
        <div style={{ background: C.white, border: "1.5px solid " + color, borderRadius: 8, padding: "12px 16px", width: 200, flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color, marginBottom: 5, fontFamily: FF }}>{label}</p>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, fontFamily: FF }}>{text}</p>
        </div>
        <div style={{ width: 24, height: 2, background: color, flexShrink: 0 }} />
      </>}
      {isRight && <>
        <div style={{ width: 24, height: 2, background: color, flexShrink: 0 }} />
        <div style={{ background: C.white, border: "1.5px solid " + color, borderRadius: 8, padding: "12px 16px", width: 200, flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color, marginBottom: 5, fontFamily: FF }}>{label}</p>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, fontFamily: FF }}>{text}</p>
        </div>
      </>}
    </div>
  );
}

function Highlight({ children, color }) {
  return (
    <div style={{ background: color === C.red ? "rgba(192,57,43,0.05)" : color === C.stack ? "rgba(74,111,165,0.05)" : "rgba(61,107,33,0.05)", borderLeft: "3px solid " + color, padding: "10px 14px", borderRadius: "0 4px 4px 0", margin: "4px 0" }}>
      {children}
    </div>
  );
}

function ScoreCard({ score, verdict, note, color }) {
  return (
    <div style={{ background: color, borderRadius: 8, padding: "18px 20px", display: "flex", alignItems: "center", gap: 20, margin: "16px 0" }}>
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: C.white, fontFamily: FFD, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: 1 }}>OUT OF 5</div>
      </div>
      <div style={{ width: 1, background: "rgba(255,255,255,0.25)", height: 52, flexShrink: 0 }} />
      <div style={{ paddingLeft: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 4 }}>{verdict}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.4, fontFamily: FF }}>{note}</div>
      </div>
    </div>
  );
}

function DimRow({ name, score, status, color, flagged }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + C.border, fontSize: 15, gap: 8, fontFamily: FF, background: flagged ? "rgba(192,57,43,0.04)" : "transparent" }}>
      <span style={{ color: C.textMid, flex: 1 }}>{name}</span>
      <span style={{ color, fontWeight: 700, whiteSpace: "nowrap" }}>{score}</span>
      <span style={{ color: C.textLight, fontSize: 13, whiteSpace: "nowrap" }}>{status}</span>
    </div>
  );
}

function WYSKCard({ theme, body, color, highlight }) {
  return (
    <div style={{ border: highlight ? "1.5px solid " + color : "1px solid " + C.border, borderRadius: 8, padding: "16px 18px", marginBottom: 12, background: highlight ? "rgba(61,107,33,0.03)" : "transparent" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color, marginBottom: 6, fontFamily: FF }}>{theme}</div>
      <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, fontFamily: FF }}>{body}</div>
    </div>
  );
}

function QGroup({ label, items, color, highlightFirst }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ background: color, borderRadius: "6px 6px 0 0", padding: "9px 14px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.white, fontFamily: FF }}>{label}</span>
      </div>
      <div style={{ border: "1px solid " + C.border, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "14px 16px", borderBottom: i < items.length - 1 ? "1px solid " + C.border : "none", display: "flex", gap: 12, background: highlightFirst && i === 0 ? "rgba(61,107,33,0.03)" : "transparent" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color, flexShrink: 0, minWidth: 20, fontFamily: FF }}>{i + 1}.</span>
            <div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65, marginBottom: 5, fontFamily: FF }}>{item.q}</p>
              <p style={{ fontSize: 13, color: C.textLight, fontStyle: "italic", lineHeight: 1.5, fontFamily: FF, borderLeft: highlightFirst && i === 0 ? "2px solid " + color : "none", paddingLeft: highlightFirst && i === 0 ? 8 : 0 }}>{item.listen}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ bg, children, first }) {
  return (
    <div style={{ background: bg, padding: first ? "72px 56px 56px" : "72px 56px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

function ScenarioIntro({ pill, pillColor, pillBg, pillBorder, h2color, title, sub, ruleColor }) {
  return (
    <div style={{ background: C.bg, padding: "72px 56px 0", textAlign: "center" }}>
      <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", borderRadius: 20, padding: "5px 16px", marginBottom: 20, background: pillBg, color: pillColor, border: "1px solid " + pillBorder, fontFamily: FF }}>{pill}</div>
      <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: title }} />
      <p style={{ fontSize: 18, color: C.textLight, lineHeight: 1.75, maxWidth: 600, margin: "0 auto" }}>{sub}</p>
      <div style={{ width: 48, height: 3, background: ruleColor, margin: "28px auto 0", borderRadius: 2 }} />
    </div>
  );
}

export default function Sample({ onHome, onGetReport }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{GS}</style>

      {/* NAV */}
      <nav style={{ background: C.bg, borderBottom: "1px solid " + C.border, padding: "14px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="/#how-it-works" style={{ fontSize: 14, color: C.textLight, fontFamily: FF, textDecoration: "none" }}>How it works</a>
          <a href="/#pricing" style={{ fontSize: 14, color: C.textLight, fontFamily: FF, textDecoration: "none" }}>Pricing</a>
          <span style={{ fontSize: 14, color: C.accent, fontWeight: 600, fontFamily: FF }}>Sample Reports</span>
          <button onClick={onGetReport} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "11px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF }}>Get a Report</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: C.bg, padding: "88px 56px 80px", textAlign: "center", borderBottom: "1px solid " + C.border }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20, fontFamily: FF }}>Sample Reports</p>
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(38px, 5vw, 56px)", fontWeight: 700, color: C.text, lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 20 }}>
          See exactly what<br /><em style={{ fontStyle: "italic", color: C.accent }}>you're buying.</em>
        </h1>
        <p style={{ fontSize: 20, color: C.textLight, lineHeight: 1.8, maxWidth: 520, margin: "0 auto", fontWeight: 400 }}>
          Real report output from a real buyer scenario. Names and companies are anonymized. The analysis is not.
        </p>
      </div>

      {/* GREEN INDEPENDENCE STRIP */}
      <div style={{ background: C.accent, padding: "14px 56px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: FF, lineHeight: 1.6 }}>
          Delphi is an independent, AI-generated analysis of your software buying situation. Funded entirely by subscribers. No vendor pays for placement, recommendation, or access. Ever.
        </p>
      </div>

      {/* ── EVALUATION ── */}
      <ScenarioIntro
        pill="The Evaluation"
        pillColor={C.accent}
        pillBg="rgba(61,107,33,0.08)"
        pillBorder="rgba(61,107,33,0.2)"
        title={`A five-company roll-up evaluating<br/><em style="font-style:italic;color:#3D6B21;">an ABM platform for the first time.</em>`}
        sub="New brand, new exec team, reps who have never prospected, and a CRM described as a disaster. This is what the report looked like."
        ruleColor={C.accent}
      />

      {/* EVAL 1 — What We Heard · warm */}
      <Section bg={C.warm} first>
        <Eyebrow color={C.accent}>What We Heard</Eyebrow>
        <SectionHeading>Delphi reads the situation, <em style={{ fontStyle: "italic", color: C.accent }}>not just the answers.</em></SectionHeading>
        <Frame label="What We Heard">
          <FrameTitle accentColor={C.accent}>What We Heard</FrameTitle>
          <Prose>You are not really buying an ABM platform right now. You are buying a stabilization tool for a company still finding its footing. Five companies merging under a new brand, an exec team new to the industry, reps who have never prospected, and a CRM described as a disaster — that is a lot of weight for any software purchase to carry.</Prose>
          <div style={{ position: "relative" }}>
            <Highlight color={C.accent}>
              <Prose>Your TAM is genuinely small, under 250 named accounts on your target list. You do not need a platform built to score millions of anonymous signals. The question is how to stay visible to your accounts across a long buying cycle while your team figures out how to actually sell.</Prose>
            </Highlight>
            <Callout color={C.accent} side="right" label="Why this matters" text="Most ABM platforms are built for scale you don't need. TAM size changes which tools make sense." />
          </div>
          <Prose>The harder problem underneath all of this is sales activation. No ABM platform closes that gap on its own. But the right platform minimizes it by making the sales ask as simple as possible — showing reps which accounts are engaging, in a tool they already use.</Prose>
          <Prose fade>...continues across 3 paragraphs</Prose>
        </Frame>
        <ValueProp accentColor={C.accent} text="A read of your situation that goes beyond what you said — including the constraints you may not have realized yet." />
      </Section>

      {/* EVAL 2 — Readiness Score · cream */}
      <Section bg={C.bg}>
        <Eyebrow color={C.accent}>Readiness Score</Eyebrow>
        <SectionHeading>Six dimensions. A clear picture of <em style={{ fontStyle: "italic", color: C.accent }}>what to address before you sign.</em></SectionHeading>
        <Frame label="Readiness Score">
          <FrameTitle accentColor={C.accent}>Readiness Score</FrameTitle>
          <Prose>You are at an early but honest starting point. The self-awareness about your CRM, your reps, and your organizational change fatigue is actually a strong signal — teams that overestimate their readiness make worse buying decisions.</Prose>
          <div style={{ position: "relative" }}>
            <ScoreCard score="2" verdict="Needs attention before purchasing" note="Dimensional breakdown shows where the gaps are." color={C.red} />
            <Callout color={C.red} side="right" label="Low score = setup list" text="A 2/5 tells you what to fix before go-live — not whether to buy." />
          </div>
          <div style={{ marginTop: 8 }}>
            <DimRow name="Data Readiness" score="2/5" status="Address before go-live" color={C.red} />
            <DimRow name="Sales & Marketing Alignment" score="2/5" status="Address before go-live" color={C.red} />
            <div style={{ position: "relative" }}>
              <DimRow name="Change Management" score="1/5" status="Address before go-live" color={C.red} flagged />
              <Callout color={C.red} side="right" label="Lowest score" text="1/5 here affects every tool equally — it's not a tool problem, it's an org problem." />
            </div>
            <DimRow name="Ops Capacity" score="3/5" status="Manageable with prep" color={C.accent} />
            <DimRow name="Integration Readiness" score="3/5" status="Manageable with prep" color={C.accent} />
            <DimRow name="Executive Sponsorship" score="2/5" status="Address before go-live" color={C.red} />
          </div>
        </Frame>
        <ValueProp accentColor={C.accent} text="Six dimensions scored before you sign, not after implementation fails. Each gap comes with specific analysis on what needs to be true before go-live." />
      </Section>

      {/* EVAL 3 — Shortlist · warm */}
      <Section bg={C.warm}>
        <Eyebrow color={C.accent}>Your Shortlist, Assessed</Eyebrow>
        <SectionHeading>Each tool evaluated against your situation, <em style={{ fontStyle: "italic", color: C.accent }}>not just the average buyer's.</em></SectionHeading>
        <Frame label="Your Shortlist, Assessed">
          <FrameTitle accentColor={C.accent}>Your Shortlist, Assessed</FrameTitle>
          <div style={{ marginBottom: 12 }}>
            <div style={{ background: C.accent, borderRadius: "6px 6px 0 0", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 3 }}>Rollworks</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: FF }}>4/5 · Budget: Strong fit · Readiness: Good match for current maturity</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 3, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: C.white, letterSpacing: 1.5, textTransform: "uppercase", flexShrink: 0, fontFamily: FF }}>Recommended</div>
            </div>
            <div style={{ border: "1px solid " + C.border, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid " + C.border }}>
                <div style={{ padding: "12px 14px", borderRight: "1px solid " + C.border }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, marginBottom: 5, fontFamily: FF }}>Does Well</div>
                  <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.6, fontFamily: FF }}>Purpose-built for a defined list of target accounts and a small marketing team. HubSpot and Salesforce integrations are among the most reliable in the category.</div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, marginBottom: 5, fontFamily: FF }}>Does Not Do Well</div>
                  <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.6, fontFamily: FF }}>Will not fix the gap between marketing signals and sales action on its own. Self-service reporting is limited.</div>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ padding: "12px 14px", fontSize: 14, color: C.textMid, fontStyle: "italic", lineHeight: 1.6, fontFamily: FF, background: "rgba(61,107,33,0.03)", borderLeft: "3px solid " + C.accent }}>
                  The right tool for where you are today: focused, fast to stand up, and matched to a finite account list without requiring organizational change you cannot sustain right now.
                </div>
                <Callout color={C.accent} side="right" label="Read this first" text="This one-sentence verdict tells you more than the entire comparison grid." />
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.textLight, fontStyle: "italic", fontFamily: FF }}>...Terminus and Demandbase assessments also included</p>
        </Frame>
        <ValueProp accentColor={C.accent} text="Each tool assessed against your budget, team size, implementation capacity, and current maturity — not the average buyer's situation." />
      </Section>

      {/* EVAL 4 — What You Should Know · cream */}
      <Section bg={C.bg}>
        <Eyebrow color={C.accent}>What You Should Know</Eyebrow>
        <SectionHeading>What the scripted demo <em style={{ fontStyle: "italic", color: C.accent }}>doesn't address about your situation.</em></SectionHeading>
        <Frame label="What You Should Know">
          <FrameTitle accentColor={C.accent}>What You Should Know</FrameTitle>
          <div style={{ position: "relative" }}>
            <WYSKCard color={C.accent} highlight theme="Rollworks — Intent setup has a known configuration trap" body="Bombora intent data within Rollworks defaults to contact-level targeting. Rollworks' own team recommends account-level instead — but this is not documented prominently. If your onboarding contact doesn't flag it, you will run campaigns incorrectly from day one." />
            <Callout color={C.accent} side="right" label="Your rep won't raise this" text="This configuration error happens in the first week. By the time you notice, you've been running campaigns wrong for months." />
          </div>
          <WYSKCard color={C.accent} theme="Terminus — Acquisition uncertainty is not fully settled" body="Terminus was acquired by DemandScience in November 2024. Brand consolidation is still in progress. Ask for written confirmation of which entity your contract is with and what the support SLA looks like post-acquisition." />
          <WYSKCard color={C.accent} theme="Demandbase — Renewal price increases are not negotiated by default" body="G2 reviewers report renewal increases of approximately 20% at end of initial term. Demandbase does not include renewal caps unless the buyer negotiates them into the initial agreement." />
        </Frame>
        <ValueProp accentColor={C.accent} text="Intelligence the sales process won't surface — for every vendor on your list, regardless of which tools you're evaluating." />
      </Section>

      {/* EVAL 5 — Questions · warm */}
      <Section bg={C.warm}>
        <Eyebrow color={C.accent}>Questions to Ask in the Demo</Eyebrow>
        <SectionHeading>Walk into every demo knowing exactly what to ask — <em style={{ fontStyle: "italic", color: C.accent }}>and what a good answer sounds like.</em></SectionHeading>
        <Frame label="Questions to Ask in the Demo">
          <FrameTitle accentColor={C.accent}>Questions to Ask in the Demo</FrameTitle>
          <QGroup color={C.accent} label="Ask All Vendors" highlightFirst items={[
            { q: "Our Salesforce data has significant gaps. How does your platform handle account matching when domain data is missing or duplicated?", listen: "Vendors with a structured pre-launch audit process are lower risk than those who say the integration handles it automatically." },
            { q: "We have fewer than 250 target accounts. How does your pricing scale down to that list size, and are there features unavailable below a certain threshold?", listen: "Some platforms have feature lockouts below 500 accounts that make the lower tiers significantly less capable." },
          ]} />
          <div style={{ position: "relative" }}>
            <div>
              <QGroup color={C.accent} label="Ask Rollworks Specifically" items={[
                { q: "We have heard that Bombora intent defaults to contact-level targeting. Can you walk us through exactly how you configure intent for a small, named account list?", listen: "Whether the rep proactively confirms this known issue and walks you through the correct setup, or whether they are unaware of it." },
              ]} />
            </div>
            <Callout color={C.accent} side="right" label="The listen-for note" text="The italicized note under each question separates a useful demo from a sales conversation." />
          </div>
          <p style={{ fontSize: 14, color: "#9A8E7E", fontStyle: "italic", fontFamily: FF }}>...additional vendor-specific questions included for each tool on your shortlist</p>
        </Frame>
        <ValueProp accentColor={C.accent} text="Questions written for your situation, with guidance on what a good answer looks like — so you walk out of every demo with a clearer read on fit." />
      </Section>

      {/* EVAL 6 — Recommendation · cream */}
      <Section bg={C.bg}>
        <Eyebrow color={C.accent}>Our Recommendation</Eyebrow>
        <SectionHeading>A clear recommendation <em style={{ fontStyle: "italic", color: C.accent }}>based on what you told us.</em></SectionHeading>
        <Frame label="Our Recommendation">
          <FrameTitle accentColor={C.accent}>Our Recommendation</FrameTitle>
          <p style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 14 }}>We recommend Rollworks.</p>
          <Prose>Your account list is small, your team is lean, your stack is already HubSpot and Salesforce, and your organization cannot absorb a complex implementation right now. Rollworks is the only tool on your shortlist designed for exactly that profile.</Prose>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 10, paddingLeft: 12, borderLeft: "2px solid " + C.border, fontFamily: FF }}><strong>Terminus:</strong> The multi-channel capability is genuinely stronger, but the post-acquisition uncertainty and separate ad spend minimums create cost and stability risks your organization is not positioned to absorb right now.</p>
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, paddingLeft: 12, borderLeft: "2px solid " + C.border, fontFamily: FF, background: "rgba(61,107,33,0.03)", padding: "10px 12px", borderRadius: "0 4px 4px 0" }}><strong>Demandbase:</strong> The best account intelligence in the category for a known, finite TAM, but the all-in cost and implementation complexity rule it out until your CRM is clean and your sales team is functioning as an active selling team.</p>
            <Callout color={C.accent} side="right" label="One clear answer" text="No ranked list. No caveats to decode. One named recommendation with reasoning tied to what you told us." />
          </div>
        </Frame>
        <ValueProp accentColor={C.accent} text="A named recommendation with reasoning tied to what you told us — not a ranked list you then have to translate into a decision." />
      </Section>

      {/* ── STACK FIT ── */}
      <div style={{ height: 1, background: C.border, margin: "0 56px" }} />

      <ScenarioIntro
        pill="The Stack Fit"
        pillColor={C.stack}
        pillBg="rgba(74,111,165,0.08)"
        pillBorder="rgba(74,111,165,0.2)"
        title={`The same three tools, evaluated<br/><em style="font-style:italic;color:#4A6FA5;">for integration fit.</em>`}
        sub="A Salesforce-primary stack with HubSpot, LeanData, and three custom objects. The question isn't which tool fits the use case — it's which tool integrates best with what's already there."
        ruleColor={C.stack}
      />

      {/* STACK 1 — What We Heard · warm */}
      <Section bg={C.warm} first>
        <Eyebrow color={C.stack}>What We Heard</Eyebrow>
        <SectionHeading>The Stack Fit reads your environment, <em style={{ fontStyle: "italic", color: C.stack }}>not your goals.</em></SectionHeading>
        <Frame label="What We Heard">
          <FrameTitle accentColor={C.stack}>What We Heard</FrameTitle>
          <Prose>You are running a tightly scoped ABM program against a finite list of very large accounts with multi-year, multi-million dollar deal cycles. The value of the platform is not in reach or volume — it is in depth of insight at the buying committee level and how well that insight surfaces inside Salesforce for your reps.</Prose>
          <div style={{ position: "relative" }}>
            <Highlight color={C.stack}>
              <Prose>What you have not fully articulated yet is that you are running two systems of record in parallel. Any ABM platform you add will sit between Salesforce and HubSpot and will need to pull segmentation from both while writing engagement signals back to Salesforce. That is a three-way data flow, not a simple two-way sync.</Prose>
            </Highlight>
            <Callout color={C.stack} side="right" label="Named the real problem" text="Three-way data flow is harder than a standard two-way sync. Most buyers don't realize this until go-live." />
          </div>
          <Prose>You also have LeanData in your stack, which is significant. LeanData runs natively inside Salesforce and can act as the signal-routing layer that takes ABM intent spikes and pushes them into account owner tasks automatically.</Prose>
          <Prose fade>...continues across 3 paragraphs</Prose>
        </Frame>
        <ValueProp accentColor={C.stack} text="A read of your architectural reality — including the constraints you hadn't named yet — that changes which tool belongs in your stack." />
      </Section>

      {/* STACK 2 — Compatibility · cream */}
      <Section bg={C.bg}>
        <Eyebrow color={C.stack}>Stack Compatibility Assessment</Eyebrow>
        <SectionHeading>Each tool assessed against how it <em style={{ fontStyle: "italic", color: C.stack }}>actually integrates with what you have.</em></SectionHeading>
        <Frame label="Stack Compatibility Assessment">
          <FrameTitle accentColor={C.stack}>Stack Compatibility Assessment</FrameTitle>
          {[
            { name: "Demandbase", meta: "5/5 · Strong · Moderate", body: "Demandbase connects natively to Salesforce via a bidirectional sync and supports a direct native integration with HubSpot. The standout piece for your stack: a published native integration with LeanData lets Demandbase trigger LeanData routing flows when account intent spikes, automatically assigning tasks to account owners without manual Slack notification.", bottom: "The best stack fit for a Salesforce-primary, LeanData-enabled buyer running a tightly scoped enterprise ABM program.", highlight: true },
            { name: "Terminus", meta: "3/5 · Moderate · Moderate", body: "Integrates natively with Salesforce and HubSpot for bidirectional data flow. Multi-channel orchestration is strong, but the post-DemandScience merger roadmap uncertainty means new integration development has been deprioritized.", bottom: null, highlight: false },
          ].map((tool, i) => (
            <div key={i}>
              {tool.highlight ? (
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <div style={{ border: "1px solid " + C.border, borderLeft: "4px solid " + C.stack, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ padding: "10px 14px", background: C.warm, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>{tool.name}</span>
                      <span style={{ fontSize: 12, color: C.stack, fontWeight: 600, fontFamily: FF }}>{tool.meta}</span>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, fontFamily: FF, marginBottom: 8 }}>{tool.body}</p>
                      {tool.bottom && <p style={{ fontSize: 14, color: C.textMid, fontStyle: "italic", fontFamily: FF }}>{tool.bottom}</p>}
                    </div>
                  </div>
                  <Callout color={C.stack} side="right" label="LeanData is the differentiator" text="No other tool on this list has a published native integration with LeanData. That's the gap this closes." />
                </div>
              ) : (
                <div style={{ border: "1px solid " + C.border, borderLeft: "4px solid " + C.stack, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ padding: "10px 14px", background: C.warm, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>{tool.name}</span>
                    <span style={{ fontSize: 12, color: C.stack, fontWeight: 600, fontFamily: FF }}>{tool.meta}</span>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, fontFamily: FF }}>{tool.body}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <p style={{ fontSize: 14, color: "#9A8E7E", fontStyle: "italic", fontFamily: FF }}>...RollWorks assessment also included</p>
        </Frame>
        <ValueProp accentColor={C.stack} text="Goes beyond 'native integration available' — maps exactly how data flows between each tool and your stack, where custom work is required, and what breaks if prerequisites aren't met." />
      </Section>

      {/* STACK 3 — Integration Readiness · warm */}
      <Section bg={C.warm}>
        <Eyebrow color={C.stack}>Integration Readiness</Eyebrow>
        <SectionHeading>Five dimensions measuring whether your environment <em style={{ fontStyle: "italic", color: C.stack }}>is ready to absorb a new integration.</em></SectionHeading>
        <Frame label="Integration Readiness">
          <FrameTitle accentColor={C.stack}>Integration Readiness</FrameTitle>
          <Prose>Integration readiness measures how prepared your current stack, data, team, and processes are to absorb a new ABM platform and get meaningful value out of it quickly.</Prose>
          <div style={{ position: "relative" }}>
            <ScoreCard score="4" verdict="Well positioned" note="Strong stack health, clear ownership, mature data model." color={C.stack} />
            <Callout color={C.stack} side="right" label="Same org, different score" text="This org scored 2/5 on organizational readiness. Their technical environment is a different story." />
          </div>
          <div style={{ marginTop: 8 }}>
            <DimRow name="Integration Ownership Clarity" score="4/5" status="Strong foundation" color={C.stack} />
            <DimRow name="Current Stack Health" score="4/5" status="Strong foundation" color={C.stack} />
            <DimRow name="Data Model Maturity" score="4/5" status="Strong foundation" color={C.stack} />
            <DimRow name="Team Capacity for New Integrations" score="3/5" status="Manageable with prep" color={C.stack} />
            <DimRow name="Historical Integration Track Record" score="4/5" status="Strong foundation" color={C.stack} />
          </div>
        </Frame>
        <ValueProp accentColor={C.stack} text="The same organization that scored 2/5 on organizational readiness scored 4/5 here. The technical environment is strong. The organizational gaps are elsewhere — and that's the tension you need to resolve before you decide." />
      </Section>

      {/* STACK 4 — What You Should Know · cream */}
      <Section bg={C.bg}>
        <Eyebrow color={C.stack}>What You Should Know</Eyebrow>
        <SectionHeading>What the scripted demo <em style={{ fontStyle: "italic", color: C.stack }}>doesn't address about your stack.</em></SectionHeading>
        <Frame label="What You Should Know">
          <FrameTitle accentColor={C.stack}>What You Should Know</FrameTitle>
          <div style={{ position: "relative" }}>
            <WYSKCard color={C.stack} highlight theme="Demandbase — Custom object blind spot" body="Demandbase's Salesforce integration cannot sync data to or from custom objects. Engagement signals written back will land on standard fields only. Your Salesforce admin will need to build bridge fields or workflow rules to carry those signals into your custom object views." />
            <Callout color={C.stack} side="right" label="A structural limitation" text="This isn't a configuration issue — it's how the integration works. Know it before you sign." />
          </div>
          <WYSKCard color={C.stack} theme="Demandbase — Writeback timing is not real-time" body="The Demandbase-to-Salesforce writeback runs on a daily batch cycle between 10am and 10pm UTC. If reps are trained to act on same-day intent signals, the data in Salesforce may be up to 24 hours behind." />
          <WYSKCard color={C.stack} theme="Terminus — Post-merger roadmap risk" body="Terminus merged into DemandScience in late 2024 and the integration is still ongoing. Vendors in this position routinely deprioritize new integration development. For a program with 12 to 14 month deal cycles, that uncertainty compounds." />
        </Frame>
        <ValueProp accentColor={C.stack} text="Technical behavior your vendor may not know to mention — sync timing, object limitations, data flow gaps — specific to each tool on your shortlist." />
      </Section>

      {/* STACK 5 — Questions · warm */}
      <Section bg={C.warm}>
        <Eyebrow color={C.stack}>Questions to Ask in the Demo</Eyebrow>
        <SectionHeading>Walk into every demo knowing exactly what to ask — <em style={{ fontStyle: "italic", color: C.stack }}>and what a good answer sounds like.</em></SectionHeading>
        <Frame label="Questions to Ask in the Demo">
          <FrameTitle accentColor={C.stack}>Questions to Ask in the Demo</FrameTitle>
          <QGroup color={C.stack} label="Ask All Vendors" items={[
            { q: "Walk me through exactly how buying committee member engagement is tracked and surfaced. Can I see which specific contacts at a target account have engaged with which content inside Salesforce?", listen: "A good answer names the specific CRM object and field where contact-level engagement lands. A bad answer stays at the account level." },
            { q: "We have three custom Salesforce objects. Can your platform read from and write to those objects, and if not, how do customers typically handle the gap?", listen: "A good answer is specific about which direction the sync works and proposes a concrete workaround." },
          ]} />
          <div style={{ position: "relative" }}>
            <QGroup color={C.stack} label="Ask Demandbase Specifically" items={[
              { q: "We use LeanData for account routing. What is the current state of your native integration with LeanData, and can Demandbase intent signals trigger LeanData routing flows automatically?", listen: "A good answer references a specific integration mechanism such as an API action node or named connector. A bad answer says 'we work with LeanData' without explaining how." },
            ]} />
            <Callout color={C.stack} side="right" label="The listen-for note" text="The answer to this question tells you whether the rep understands your stack — or is guessing." />
          </div>
          <p style={{ fontSize: 14, color: "#9A8E7E", fontStyle: "italic", fontFamily: FF }}>...additional vendor-specific questions included for each tool on your shortlist</p>
        </Frame>
        <ValueProp accentColor={C.stack} text="Questions written for your stack and your shortlist, with guidance on what a good answer looks like — so you can evaluate technical complexity against your team's capacity to support it." />
      </Section>

      {/* STACK 6 — Verdict · cream */}
      <Section bg={C.bg}>
        <Eyebrow color={C.stack}>Our Compatibility Verdict</Eyebrow>
        <SectionHeading>A clear answer on which tool <em style={{ fontStyle: "italic", color: C.stack }}>your stack is ready to support.</em></SectionHeading>
        <Frame label="Our Compatibility Verdict">
          <FrameTitle accentColor={C.stack}>Our Compatibility Verdict</FrameTitle>
          <p style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 14 }}>We recommend Demandbase for integration.</p>
          <Prose>Your use case is defined by depth, not breadth: under 250 accounts, $1M+ contracts, 12 to 14 month cycles, and a requirement to track engagement at the buying committee level. Demandbase is the only platform on your shortlist with a published, native integration with LeanData that can convert intent signals into Salesforce-routed account owner actions automatically.</Prose>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 10, paddingLeft: 12, borderLeft: "2px solid " + C.border, fontFamily: FF }}><strong>Terminus:</strong> Strong multi-channel orchestration, but post-acquisition roadmap uncertainty and absence of a native LeanData routing integration make it a less reliable foundation for a long-running enterprise program.</p>
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, padding: "10px 12px", borderLeft: "2px solid " + C.border, background: "rgba(74,111,165,0.03)", borderRadius: "0 4px 4px 0", fontFamily: FF }}><strong>RollWorks:</strong> Fastest to implement and most HubSpot-native, but its advertising-reach orientation and limitation on contact-level tracking make it a poor fit for a program designed to measure buying committee engagement.</p>
            <Callout color={C.stack} side="right" label="One clear answer" text="The Stack Fit and Evaluation disagreed. This is the technical verdict — the Evaluation gave the organizational one." />
          </div>
        </Frame>
        <ValueProp accentColor={C.stack} text="A named recommendation grounded in your stack's actual capabilities — and a clear explanation of what each other tool can't do for your environment." />
      </Section>

      {/* ── WHEN REPORTS DIVERGE ── */}
      <div style={{ background: C.dark, padding: "72px 56px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 18, fontFamily: FF }}>When the reports diverge</p>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: C.white, lineHeight: 1.2, marginBottom: 20, maxWidth: 700 }}>Why the recommendations can differ</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, maxWidth: 680, marginBottom: 48, fontFamily: FF }}>The Evaluation is based on your organizational readiness for change — your team, your alignment, your capacity to absorb a new process and make it stick. The Stack Fit is based on your technical environment — your current stack, your integration architecture, your data flows. They are designed to surface different constraints. In the sample reports above, they did not agree. The question you need to decide is which constraint is harder to change — your organizational capacity to make a change, or the amount of work it takes to prepare your stack to bring in a new tool.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
            {[
              { label: "The Evaluation — Organizational fit", labelColor: "#7AB84A", score: "2", scoreColor: C.red, verdict: "Needs attention before purchasing", sub: "Organizational readiness score", rec: "Rollworks", recNote: "the tool that asks the least of a team not yet ready to run a complex ABM program" },
              { label: "The Stack Fit — Technical fit", labelColor: "#7A9FD4", score: "4", scoreColor: C.stack, verdict: "Well positioned", sub: "Integration readiness score", rec: "Demandbase", recNote: "the tool with the deepest native integration for a LeanData-enabled, Salesforce-primary stack" },
            ].map((card, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 28 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: card.labelColor, marginBottom: 16, fontFamily: FF }}>{card.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: 44, fontWeight: 700, color: card.scoreColor, fontFamily: FFD, lineHeight: 1 }}>{card.score}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, fontFamily: FF }}>OUT OF 5</div>
                  </div>
                  <div style={{ paddingLeft: 14, borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FFD, marginBottom: 3 }}>{card.verdict}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: FF }}>{card.sub}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, fontFamily: FF }}>Recommends <strong style={{ color: C.white }}>{card.rec}</strong> — {card.recNote}.</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(184,147,90,0.1)", border: "1px solid rgba(184,147,90,0.3)", borderRadius: 10, padding: "32px 36px" }}>
            <p style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.gold, marginBottom: 14 }}>How to interpret two different recommendations</p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, marginBottom: 24, fontFamily: FF }}>When the Evaluation and the Stack Fit point to different tools, it means the tool that best fits your use case requires technical accommodations your stack doesn't currently support — or the tool that fits your stack best may not fully serve the use case you're trying to run. Before you decide which to weight more heavily, it is worth asking:</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                "What specifically needs to change in your environment to support the use case recommendation? Who owns that work, and do they have capacity to do it before go-live?",
                "What is the cost — in time, money, and organizational lift — of closing that technical gap?",
                "If you go with the stack fit recommendation instead, what use case capability are you giving up, and can you achieve your goals with that tradeoff?",
                "Are the organizational gaps in your Evaluation something you can close before go-live, or will they still be present on day one regardless of which tool you choose?",
                "Which constraint is harder to change — your organization or your stack?",
              ].map((q, i) => (
                <li key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none", display: "flex", gap: 14, fontFamily: FF }}>
                  <span style={{ color: C.gold, flexShrink: 0, fontWeight: 700 }}>—</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: C.darker, padding: "72px 56px", textAlign: "center" }}>
        <h2 style={{ fontFamily: FFD, fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700, color: C.white, marginBottom: 14, lineHeight: 1.2 }}>
          Your reports are built<br /><em style={{ fontStyle: "italic", color: C.gold }}>for your situation.</em>
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", marginBottom: 36, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 36px", fontFamily: FF }}>Every answer you give shapes the output. This is what one buyer's reports looked like. Yours will look different — because your situation is different.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetReport} style={{ background: C.white, color: C.accent, border: "none", borderRadius: 3, padding: "14px 32px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF }}>Start an Evaluation — $300</button>
          <button onClick={onGetReport} style={{ background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 3, padding: "14px 32px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF }}>Start a Stack Fit — $300</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: C.bg, borderTop: "1px solid " + C.border, padding: "32px 56px" }}>
        <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, marginBottom: 8, fontFamily: FF }}>Delphi is funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
        <p style={{ fontSize: 12, color: C.textLight, lineHeight: 1.7, fontFamily: FF }}>Delphi reports are generated using AI and publicly available information. They are for informational purposes only and do not constitute professional, legal, or financial advice. Vendor pricing, product capabilities, and market positioning change frequently — verify all claims directly with vendors before making any purchasing decision. Delphi is not responsible for outcomes resulting from decisions made based on this report.</p>
      </div>

    </div>
  );
}
