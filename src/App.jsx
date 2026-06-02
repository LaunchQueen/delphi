import { useState, useEffect } from "react";
import Delphi from "./Delphi.jsx";
import FeedbackForm from "./FeedbackForm.jsx";

const C = {
  bg: "#FAF7F2", card: "#F2EDE6", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830",
  textLight: "#7A7060", accent: "#3D6B21", accentDark: "#2D5016",
  dark: "#141410", gold: "#B8935A", white: "#FFFFFF", stack: "#4A6FA5",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";

export default function App() {
  const [page, setPage] = useState("home");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [initialReportType, setInitialReportType] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      setCheckingPayment(true);
      verifyPayment(sessionId);
    }
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.paid) {
        const savedReportType = sessionStorage.getItem("pendingReportType") || null;
        sessionStorage.removeItem("pendingReportType");
        setPaymentStatus({ paid: true, mode: data.mode, email: data.customerEmail });
        setInitialReportType(savedReportType);
        setPage("tool");
        window.history.replaceState({}, "", "/");
      }
    } catch (e) {
      console.error("Payment verification failed", e);
    }
    setCheckingPayment(false);
  };

  const startCheckout = async (priceType, reportType) => {
    try {
      if (reportType) sessionStorage.setItem("pendingReportType", reportType);
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceType,
          successUrl: window.location.origin,
          cancelUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error("Checkout failed", e);
      alert("Payment setup failed. Please try again.");
    }
  };

  if (window.location.pathname === "/feedback") return <FeedbackForm />;

  if (checkingPayment) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FF }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid " + C.border, borderTop: "3px solid " + C.accent, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontSize: 18, color: C.textMid }}>Confirming your payment...</p>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  if (page === "tool") {
    return <Delphi
      paymentStatus={paymentStatus}
      startCheckout={startCheckout}
      onHome={() => setPage("home")}
      initialReportType={initialReportType}
    />;
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-primary:hover { background: ${C.accentDark} !important; }
        .btn-white:hover { background: ${C.card} !important; }
        .card-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .card-lift { transition: transform 0.2s, box-shadow 0.2s; }
        .nav-link:hover { color: ${C.accent} !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(250,247,242,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid " + C.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#how-it-works" className="nav-link" style={{ fontSize: 14, color: C.textLight, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ fontSize: 14, color: C.textLight, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}>Pricing</a>
          <button onClick={() => startCheckout("single_report", "evaluation")} className="btn-primary" style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "11px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF, transition: "background 0.15s" }}>Get a Report</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 48px 80px", maxWidth: 900, margin: "0 auto", animation: "fadeUp 0.65s ease" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>Independent software evaluation</div>
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(44px, 6.5vw, 80px)", fontWeight: 700, lineHeight: 1.05, color: C.text, marginBottom: 32, letterSpacing: -2 }}>
          Software buying is hard.<br />
          <em style={{ fontStyle: "italic", color: C.accent }}>Getting it right is harder.</em>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.85, color: C.textMid, marginBottom: 48, maxWidth: 680, fontWeight: 500 }}>
          Delphi gives B2B buyers an independent second opinion on any software decision — translating vendor promises into a personalized assessment of what the tool actually requires for your business, and whether your organization is ready to make it work.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <button onClick={() => startCheckout("single_report", "evaluation")} className="btn-primary" style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "16px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontFamily: FF, transition: "background 0.15s" }}>Start your evaluation — $175</button>
          <a href="#how-it-works" style={{ color: C.textMid, fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", borderBottom: "1.5px solid " + C.borderDark, paddingBottom: 2 }}>See what's in the report</a>
        </div>
      </div>

      {/* ── THE TRANSLATION PROBLEM ── */}
      <div style={{ background: C.dark, padding: "88px 56px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 28 }}>
              The buying cycle is hard<br />
              <em style={{ fontStyle: "italic", color: C.gold }}>for everyone.</em>
            </h2>
            <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.9, color: "rgba(255,255,255,0.72)" }}>
              <p style={{ marginBottom: 16 }}>Vendors are trying to show their product at its best. Buyers are trying to make a significant investment decision with incomplete information. And the content that fills the buying cycle — demos, comparison sites, case studies — is designed to show the tool working, not to help you understand what it will take to make it work for you.</p>
              <p style={{ marginBottom: 16 }}>What's missing isn't more information. It's <strong style={{ color: "rgba(255,255,255,0.92)" }}>translation.</strong> Translating vendor promises into realistic implementation requirements. Translating your organization's current state into a realistic readiness assessment. Knowing which questions to ask before you sign, not after.</p>
              <p>Software doesn't just solve a problem. It becomes part of how your company runs. That decision deserves better support than a demo and a comparison site.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["The demo shows the product working perfectly.", "Nobody shows you what it takes to get there."],
              ["The comparison site ranks the tools.", "Nobody ranks your organization's readiness to use them."],
              ["The sales rep has an answer for every objection.", "The questions that matter most never get asked."],
              ["You buy the solution.", "You inherit the implementation."],
            ].map(([problem, reality], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "20px 22px", borderLeft: "3px solid " + C.accent }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 6, lineHeight: 1.5 }}>{problem}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{reality}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="how-it-works" style={{ padding: "88px 56px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Two reports</div>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 16 }}>One clear picture.<br /><em style={{ fontStyle: "italic", color: C.accent }}>Built for your situation.</em></h2>
          <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.8, marginBottom: 52, maxWidth: 600 }}>You answer a short diagnostic questionnaire about your team, your stack, and your situation. Delphi analyzes your answers against current vendor information and real implementation patterns, and returns a personalized report in under 60 seconds. No vendor relationships. No sponsored placements. No agenda.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { tag: "The Evaluation", tagColor: C.white, tagBg: "rgba(255,255,255,0.18)", title: "Find the right tool.", body: "Which tool on your shortlist fits your use case, what it will realistically cost to implement, where your organization has gaps, and exactly what to ask before you sign.", features: ["Tool recommendation based on your specific situation", "Readiness assessment across six dimensions", "Questions to ask in every demo", "Vendor-specific gotchas your rep won't mention", "Current pricing and implementation timelines"], featured: true, reportType: "evaluation", btn: "Start Evaluation" },
              { tag: "The Stack Fit", tagColor: C.stack, tagBg: "rgba(74,111,165,0.1)", title: "See what it means to bring it into your stack.", body: "Take your shortlist and understand what it would actually mean to bring each tool into your existing environment — integrations, data flow, friction points, and whether your stack is ready.", features: ["Stack compatibility assessment per tool", "Integration complexity and data flow analysis", "Readiness across five integration dimensions", "Questions specific to your environment", "Vendor integration gotchas before go-live"], featured: false, reportType: "stack_fit", btn: "Start Stack Fit" },
            ].map((card, idx) => (
              <div key={idx} className="card-lift" style={{ background: card.featured ? C.accent : C.white, border: "1.5px solid " + (card.featured ? C.accent : C.border), borderRadius: 10, padding: "44px 40px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: card.tagColor, background: card.tagBg, borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontWeight: 700, alignSelf: "flex-start" }}>{card.tag}</div>
                <h3 style={{ fontFamily: FFD, fontSize: 26, fontWeight: 700, color: card.featured ? C.white : C.text, marginBottom: 14, lineHeight: 1.2 }}>{card.title}</h3>
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.8, color: card.featured ? "rgba(255,255,255,0.88)" : C.textMid, marginBottom: 24 }}>{card.body}</p>
                <div style={{ borderTop: "1px solid " + (card.featured ? "rgba(255,255,255,0.2)" : C.border), paddingTop: 20, marginBottom: 28, flex: 1 }}>
                  {card.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ color: card.featured ? "rgba(255,255,255,0.5)" : C.accent, fontSize: 14, marginTop: 2, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 14, color: card.featured ? "rgba(255,255,255,0.8)" : C.textMid, lineHeight: 1.6 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => startCheckout("single_report", card.reportType)} className={card.featured ? "btn-white" : "btn-primary"} style={{ background: card.featured ? C.white : C.accent, color: card.featured ? C.accent : C.white, border: "none", borderRadius: 40, padding: "12px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF, alignSelf: "flex-start", cursor: "pointer", transition: "background 0.15s" }}>{card.btn}</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: C.textLight, lineHeight: 1.75, marginTop: 20, fontStyle: "italic", maxWidth: 640 }}>The two reports may recommend different tools — and that's intentional. The Evaluation is based on your business needs and readiness. The Stack Fit is based on your technology environment. That tension is often where the real insight lives.</p>
        </div>
      </div>

      {/* ── WHAT YOU GET ── */}
      <div style={{ padding: "88px 56px", background: C.card, borderTop: "1px solid " + C.border }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 52 }}>A report built for<br /><em style={{ fontStyle: "italic", color: C.accent }}>your</em> situation.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border, border: "1px solid " + C.border, borderRadius: 10, overflow: "hidden" }}>
            {[
              { title: "Tools matched to your budget and readiness", body: "Your shortlist assessed against total budget — subscription plus implementation — and your organizational capacity. Tools that fit come first." },
              { title: "Realistic implementation requirements", body: "What each tool actually requires from your organization. Setup, data preparation, integration type, and ongoing admin burden — not just the license fee." },
              { title: "Integration reality check", body: "Native integration or third-party connector? What breaks if prerequisites are not met. The difference between what the vendor says and what implementation requires." },
              { title: "Organizational readiness score", body: "Scored across six dimensions: data readiness, ops capacity, alignment, change management, integration readiness, and executive sponsorship." },
              { title: "Questions to ask before you decide", body: "Pointed questions specific to your situation — the ones that surface gaps if they exist, and that the sales conversation will not naturally raise." },
              { title: "One clear recommendation", body: "One tool, clearly stated, with reasoning tied to what you told us. If you are not ready to buy, we say that and tell you what to address first." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.white, padding: "36px 32px" }}>
                <div style={{ width: 36, height: 3, background: C.accent, marginBottom: 20, borderRadius: 2 }} />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.35, fontFamily: FF }}>{item.title}</h3>
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.8, color: C.textMid }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY TRANSLATION IS HARD ── */}
      <div style={{ padding: "88px 56px", borderTop: "1px solid " + C.border }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Why translation is hard</div>
            <h2 style={{ fontFamily: FFD, fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 700, color: C.text, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 24 }}>Vendors speak their language.<br /><em style={{ fontStyle: "italic", color: C.accent }}>You need yours.</em></h2>
            <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.85, marginBottom: 20 }}>Every vendor has a vocabulary designed to make their product sound like the answer. Feature names, integration claims, implementation timelines — all framed to minimize friction in the sales process, not to help you assess readiness on your side.</p>
            <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.85, marginBottom: 20 }}>Understanding what a tool actually requires — in terms of your data, your processes, your team, and your organizational readiness — is a different skill entirely. It's the skill of translating between what a system can do and what a business actually needs.</p>
            <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.85 }}>That's what Delphi does. And it's what every software buying decision has been missing.</p>
          </div>
          <div style={{ background: C.card, borderRadius: 8, padding: "40px 36px", borderLeft: "3px solid " + C.accent }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Built by someone who has been on both sides</div>
            <p style={{ fontSize: 16, color: C.textMid, lineHeight: 1.85, marginBottom: 16 }}>Product marketing is built to help buyers understand what a tool does. What it isn't built to do is help buyers understand what bringing that tool into their organization actually requires — the business readiness, the process changes, the ownership questions that determine whether an implementation succeeds or fails.</p>
            <p style={{ fontSize: 16, color: C.textMid, lineHeight: 1.85, marginBottom: 16 }}>Analysts cover the market. G2 covers user sentiment. Neither one helps you understand what you need to change inside your organization before you sign.</p>
            <p style={{ fontSize: 16, color: C.textMid, lineHeight: 1.85 }}>With nearly 20 years of experience in product marketing, I'm turning my expertise to helping the buyer understand their readiness when it comes to buying software.</p>
            <p style={{ fontSize: 15, color: C.textLight, fontStyle: "italic", marginTop: 24, paddingTop: 20, borderTop: "1px solid " + C.border }}>— Maureen West, Founder</p>
          </div>
        </div>
      </div>

      {/* ── AI NOTE ── */}
      <div style={{ background: C.card, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "48px 56px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 14 }}>A note on AI</div>
          <p style={{ fontSize: 16, color: C.textMid, lineHeight: 1.85, margin: 0 }}>Delphi uses AI to analyze your situation against publicly available vendor information and real implementation patterns. AI can be wrong. Vendor capabilities change. Your situation is unique. This report is designed to make you a smarter buyer and give you better questions — not to make the decision for you. The judgment is still yours.</p>
        </div>
      </div>

      {/* ── PRICING ── */}
      <div id="pricing" style={{ padding: "88px 56px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Pricing</div>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 48 }}>No subscriptions.<br /><em style={{ fontStyle: "italic", color: C.accent }}>No vendor relationships. Ever.</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 580 }}>
            {[
              { label: "Single report", price: "$175", desc: "One Evaluation or one Stack Fit. Delivered immediately to your inbox.", btn: "Get started", featured: false, reportType: "evaluation" },
              { label: "Unlimited reports", price: "$300", desc: "Run as many reports as you need. Ideal for active evaluations comparing multiple tools.", btn: "Get started", featured: true, reportType: "evaluation" },
            ].map((card, i) => (
              <div key={i} className="card-lift" style={{ background: card.featured ? C.accent : C.white, border: card.featured ? "1.5px solid " + C.accent : "1.5px solid " + C.border, borderRadius: 8, padding: "32px", display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                {card.featured && <div style={{ position: "absolute", top: -1, right: 20, background: C.accentDark, color: C.white, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 12px", borderRadius: "0 0 4px 4px" }}>Best value</div>}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: card.featured ? "rgba(255,255,255,0.6)" : C.textLight }}>{card.label}</p>
                <p style={{ fontSize: 44, fontWeight: 700, color: card.featured ? C.white : C.text, fontFamily: FFD, lineHeight: 1 }}>{card.price}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: card.featured ? "rgba(255,255,255,0.8)" : C.textMid, lineHeight: 1.6, flex: 1 }}>{card.desc}</p>
                <button onClick={() => startCheckout(i === 0 ? "single_report" : "unlimited", card.reportType)} className={card.featured ? "btn-white" : "btn-primary"} style={{ background: card.featured ? C.white : C.accent, color: card.featured ? C.accent : C.white, border: "none", borderRadius: 3, padding: "12px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF, cursor: "pointer", width: "100%", transition: "background 0.15s" }}>{card.btn}</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 16 }}>Beta access available. Use your access code at checkout.</p>
        </div>
      </div>

      {/* ── CLOSING ── */}
      <div style={{ textAlign: "center", padding: "88px 48px", background: C.dark }}>
        <h2 style={{ fontFamily: FFD, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: C.white, letterSpacing: -0.5, marginBottom: 14, lineHeight: 1.1 }}>The second opinion<br /><em style={{ fontStyle: "italic", color: C.gold }}>your vendor can't give you.</em></h2>
        <p style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 36, fontFamily: FF }}>Independent. Personalized. Built for the buyer.</p>
        <button onClick={() => startCheckout("single_report", "evaluation")} style={{ background: C.white, color: C.accent, border: "none", borderRadius: 3, padding: "16px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Get your report — $175</button>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.dark, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: FFD }}>Delphi</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.32)", textAlign: "center", lineHeight: 1.65, maxWidth: 420, fontFamily: FF }}>Funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2025 Delphi</p>
      </footer>
    </div>
  );
}
