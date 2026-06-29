const C = {
  bg: "#FAF7F2", card: "#F2EDE6", sidebar: "#EDE6DC", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830",
  textLight: "#7A7060", accent: "#3D6B21", accentDark: "#2D5016",
  dark: "#141410", gold: "#B8935A", white: "#FFFFFF", stack: "#4A6FA5",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";
const GS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } } button { cursor: pointer; }`;

export default function About({ onHome, onGetReport }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{GS}</style>
      <style>{`
        .about-nav-link:hover { color: ${C.accent} !important; }
        .about-btn:hover { background: ${C.accentDark} !important; }
        @media (max-width: 768px) {
          .about-two-col { grid-template-columns: 1fr !important; }
          .about-founder-grid { grid-template-columns: 1fr !important; }
          .about-founder-grid img { max-width: 280px; margin: 0 auto; }
          .about-hero { padding: 120px 28px 64px !important; }
          .about-section { padding: 64px 28px !important; }
          .about-nav { padding: 14px 24px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="about-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(250,247,242,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid " + C.border }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" className="about-nav-link" style={{ fontSize: 14, color: C.textLight, fontWeight: 500, textDecoration: "none", fontFamily: FF, transition: "color 0.15s" }}>Home</a>
          <button onClick={onGetReport} className="about-btn" style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "11px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF, transition: "background 0.15s" }}>Get a Report</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="about-hero" style={{ padding: "140px 56px 80px", maxWidth: 800, margin: "0 auto", animation: "fadeUp 0.65s ease" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>About Delphi</div>
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 700, lineHeight: 1.08, color: C.text, marginBottom: 28, letterSpacing: -1.5 }}>
          Translate your decision<br />
          <em style={{ fontStyle: "italic", color: C.accent }}>into business success.</em>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.85, color: C.textMid, maxWidth: 640, fontWeight: 500 }}>
          Delphi gives B2B buyers an independent second opinion on any sales and marketing software decision — translating vendor promises into a personalized assessment of what the tool actually requires for your business, and whether your organization is ready to make it work.
        </p>
      </div>

      {/* ── WHAT DELPHI DOES ── */}
      <div className="about-section" style={{ padding: "0 56px 88px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ borderTop: "1px solid " + C.border, paddingTop: 56 }}>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 24, letterSpacing: -0.5 }}>What Delphi does</h2>
          <p style={{ fontSize: 19, color: C.textMid, lineHeight: 1.85, marginBottom: 20, fontWeight: 500 }}>
            The content that fills a software buying cycle — demos, comparison sites, case studies, analyst reports — is designed to show a tool working at its best. None of it is designed to help you understand what it will take to make that tool work for your organization specifically.
          </p>
          <p style={{ fontSize: 19, color: C.textMid, lineHeight: 1.85, marginBottom: 20, fontWeight: 500 }}>
            Delphi is your translator. You answer a short diagnostic questionnaire about your team, your stack, and your current situation. Delphi analyzes your answers against current publicly available vendor information and real implementation patterns, and returns a personalized report in under 60 seconds.
          </p>
          <p style={{ fontSize: 19, color: C.textMid, lineHeight: 1.85, fontWeight: 500 }}>
            Two report types cover the full buying journey: the Evaluation assesses organizational fit and readiness, and the Stack Fit covers technical and integration compatibility. Together they give you a complete picture before you sign — not after.
          </p>
        </div>
      </div>

      {/* ── DARK: FOUNDER ── */}
      <div style={{ background: C.dark, padding: "88px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 24 }}>The founder</div>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: C.white, lineHeight: 1.2, marginBottom: 48, letterSpacing: -0.5 }}>
            Built by someone who has been<br />
            <em style={{ fontStyle: "italic", color: C.gold }}>on both sides of the table.</em>
          </h2>

          <div className="about-founder-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <img
                src="/maureen.jpg"
                alt="Maureen West, Founder of Delphi"
                style={{ width: "100%", borderRadius: 6, display: "block", filter: "brightness(0.96)" }}
              />
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginTop: 14, lineHeight: 1.5 }}>Maureen West<br />Founder, Delphi</p>
            </div>
            <div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 20 }}>
                Nearly 20 years in B2B SaaS product marketing means a lot of time spent on win/loss interviews and customer conversations — asking buyers why they chose a tool, and why it did or didn't deliver.
              </p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 20 }}>
                The same two things kept coming up. Either organizations hadn't accounted for the changes implementation would actually require, or they underestimated the impact of those changes — and never got full value from what they'd bought. Neither of these should be seen as a failure of the vendor or the buyer. This is a structural gap in the buying process itself: the vendor doesn't know what it's like to work inside your organization, and the buyer has no real picture of how the tool was designed to be used.
              </p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 20 }}>
                What's missing is a translation layer — something that helps buyers understand what a tool will actually require from their organization, how to make it work for their specific business, and how to get the most out of the vendor relationship from day one. That's what Delphi is built to do.
              </p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 20 }}>
                Analysts cover the market and G2 covers user sentiment, but neither helps you understand what you need to change inside your organization before you sign. Consultants can help — but they come in after you've already started. What's been missing is a way for buyers to understand their own readiness before the decision, in a way that's fast, affordable, and has no vendor angle.
              </p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}>
                What I kept seeing across nearly two decades of GTM engagements, win/loss work, and churn analysis is that more content doesn't make buyers more prepared. Success comes from the combination of the right solution and an organization that's ready for it. Delphi exists to help companies get that combination right.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── INDEPENDENCE PLEDGE ── */}
      <div className="about-section" style={{ padding: "88px 56px", background: C.card, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>Independence</div>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 32, letterSpacing: -0.5 }}>
            Funded by subscribers.<br />
            <em style={{ fontStyle: "italic", color: C.accent }}>No vendor relationships. Ever.</em>
          </h2>
          <div className="about-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { label: "No vendor payments", body: "No software vendor pays for placement, favorable coverage, or access to Delphi's reports or users. Not directly, not through a partner program, not through any other arrangement." },
              { label: "No sponsored placements", body: "Tools are assessed on their actual fit for your situation. A vendor's ad spend, partner tier, or marketing relationship with any third party has no bearing on what Delphi recommends." },
              { label: "No affiliate revenue", body: "Delphi does not earn a commission when you purchase a tool. The analysis has no financial stake in which direction you go." },
              { label: "Funded by you", body: "Delphi is funded entirely by the people who use it. That's the only model that keeps the analysis clean." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 8, padding: "28px 28px", borderLeft: "3px solid " + C.accent }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: FF }}>{item.label}</p>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI NOTE ── */}
      <div className="about-section" style={{ padding: "88px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>A note on AI</div>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 24, letterSpacing: -0.5 }}>The judgment is still yours.</h2>
          <p style={{ fontSize: 19, color: C.textMid, lineHeight: 1.85, marginBottom: 20, maxWidth: 640, fontWeight: 500 }}>
            Delphi uses AI to analyze your situation against publicly available vendor information and real implementation patterns. AI can be wrong. Vendor capabilities change. Your situation is unique.
          </p>
          <p style={{ fontSize: 19, color: C.textMid, lineHeight: 1.85, maxWidth: 640, fontWeight: 500 }}>
            This report is designed to make you a smarter buyer and give you better questions — not to make the decision for you. Use it as the second opinion it's intended to be.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.dark, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: FFD }}>Delphi</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.32)", textAlign: "center", lineHeight: 1.65, maxWidth: 420, fontFamily: FF }}>Funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="mailto:support@delphi.report" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: FF }}>support@delphi.report</a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2025 Delphi</p>
        </div>
      </footer>
    </div>
  );
}
