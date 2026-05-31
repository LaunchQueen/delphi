import { useState, useEffect } from "react";
import Delphi from "./Delphi.jsx";
import FeedbackForm from "./FeedbackForm.jsx";

const C = {
  bg: "#FAF7F2", border: "#E0D8CE", text: "#1C1C1A", textMid: "#3E3830",
  textLight: "#7A7060", accent: "#3D6B21", accentDark: "#2D5016",
  dark: "#141410", gold: "#B8935A", white: "#FFFFFF",
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

  // Home page
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }"}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(250,247,242,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid " + C.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </div>
        <button onClick={() => startCheckout("single_report", "evaluation")} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "11px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Start Evaluation</button>
      </nav>

      {/* Hero */}
      <div style={{ minHeight: "86vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 48px 80px", maxWidth: 860, margin: "0 auto", animation: "fadeUp 0.65s ease" }}>
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(44px, 6.5vw, 84px)", fontWeight: 700, lineHeight: 1.05, color: C.text, marginBottom: 36, letterSpacing: -2 }}>
          Know the gap<br /><em style={{ fontStyle: "italic", color: C.accent }}>before you commit.</em>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.85, color: C.textMid, marginBottom: 48, maxWidth: 720, fontWeight: 500 }}>
          It's time to buy new software. You have a good idea of the vendors in the space and you know what problem you need to solve. What is less clear is what it means to prepare your organization to adopt and use the solution.
          <br /><br />
          Delphi shows you a shortlist based on your inputs, how to prepare your data and your organization before you go into the demo, and what questions to ask throughout the buying cycle.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <button onClick={() => startCheckout("single_report", "evaluation")} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "16px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Start your evaluation</button>
          <a href="#what" style={{ color: C.textMid, fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", borderBottom: "1.5px solid #C4BAB0", paddingBottom: 2 }}>See what's in the report</a>
        </div>
      </div>

      {/* Trust */}
      <div style={{ background: C.dark, padding: "88px 56px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72 }}>
          <div>
            <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 28 }}>Funded by subscribers.<br /><em style={{ fontStyle: "italic", color: C.gold }}>Not vendors.</em></h2>
            <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.9, color: "rgba(255,255,255,0.72)" }}>
              <p style={{ marginBottom: 16 }}>No platform pays for placement. No vendor pays for a favorable assessment. No affiliate relationships influence what we recommend. <strong style={{ color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>Ever.</strong></p>
              <p style={{ marginBottom: 16 }}>Every material claim in your report is linked to a source — vendor documentation, verified user reviews, published implementation data.</p>
              <p>This is not a review site. It is not a comparison tool. It is an independent assessment built for your specific situation.</p>
            </div>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, overflow: "hidden" }}>
            {["No vendor pays for placement or recommendation", "Every claim linked to a source you can verify", "Based on publicly available vendor documentation and verified user reviews", "Specific to your situation — not a generic ranking", "If you are not ready to buy, we tell you that and explain what to address first"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 26px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 11, fontWeight: 700, color: C.white }}>✓</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.82)", lineHeight: 1.65, fontFamily: FF }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div style={{ padding: "88px 56px", maxWidth: 1060, margin: "0 auto" }} id="what">
        <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 52 }}>Two report types.<br /><em style={{ fontStyle: "italic", color: C.accent }}>One clear picture.</em></h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            { tag: "The Evaluation", title: "Find the right tool.", body: "You have a problem to solve. Delphi recommends the best solution for your situation, with practical implementation requirements, total cost of ownership, and what vendors are not saying in the demo, because buyers do not have the necessary insight to ask the right questions.", best: "First-time buyers, teams migrating platforms, anyone wanting an independent read before the sales cycle.", featured: true, btn: "Start Evaluation", reportType: "evaluation" },
            { tag: "The Stack Fit", title: "Know how it fits what you have.", body: "Your tech stack is growing and you want to know which tools work together the best. Practical integration requirements, data flow, where the gaps are, and what breaks when you add something new to what you already have.", best: "Teams with established stacks, ops leaders managing tool sprawl, anyone asking whether this will work with what we have.", featured: false, btn: "Start Stack Fit", reportType: "stack_fit" },
          ].map((card, idx) => (
            <div key={idx} style={{ background: card.featured ? C.accent : C.white, border: "1.5px solid " + (card.featured ? C.accent : C.border), borderRadius: 10, padding: "44px 40px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: card.featured ? C.white : C.accent, background: card.featured ? "rgba(255,255,255,0.18)" : "rgba(61,107,33,0.08)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontWeight: 700, alignSelf: "flex-start" }}>{card.tag}</div>
              <h3 style={{ fontFamily: FFD, fontSize: 28, fontWeight: 700, color: card.featured ? C.white : C.text, marginBottom: 16, lineHeight: 1.15 }}>{card.title}</h3>
              <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: card.featured ? "rgba(255,255,255,0.88)" : C.textMid, marginBottom: 20, flex: 1 }}>{card.body}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: card.featured ? "rgba(255,255,255,0.6)" : C.textLight, lineHeight: 1.65, fontStyle: "italic", paddingTop: 20, borderTop: "1px solid " + (card.featured ? "rgba(255,255,255,0.18)" : C.border), marginBottom: 24 }}>{card.best}</p>
              <button onClick={() => startCheckout("single_report", card.reportType)} style={{ background: card.featured ? C.white : C.accent, color: card.featured ? C.accent : C.white, border: "none", borderRadius: 40, padding: "12px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF, alignSelf: "flex-start", cursor: "pointer" }}>{card.btn}</button>
            </div>
          ))}
        </div>
      </div>

      {/* What You Get */}
      <div style={{ padding: "88px 56px", background: "#F2EDE6", borderTop: "1px solid " + C.border }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 52 }}>A report built for<br /><em style={{ fontStyle: "italic", color: C.accent }}>your</em> situation.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border, border: "1px solid " + C.border, borderRadius: 10, overflow: "hidden" }}>
            {[
              { title: "Tools matched to your budget and readiness", body: "Your shortlist assessed against total budget — subscription plus implementation — and your organizational capacity. Tools that fit come first." },
              { title: "Practical implementation requirements", body: "What each tool actually requires from your organization. Setup, data preparation, integration type, and ongoing admin burden — not just the license fee." },
              { title: "Integration reality check", body: "Native integration or third-party connector? What breaks if prerequisites are not met. The difference between what the vendor says and what implementation requires." },
              { title: "Organizational readiness score", body: "Scored across six dimensions: data readiness, ops capacity, alignment, change management, integration readiness, and executive sponsorship." },
              { title: "Questions to ask before you decide", body: "Pointed questions specific to your situation — the ones that surface gaps if they exist, and that the sales conversation will not naturally raise." },
              { title: "One clear recommendation", body: "One tool, clearly stated, with reasoning tied to what you told us. If you are not ready to buy, we say that and tell you what to address first." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.white, padding: "36px 32px" }}>
                <div style={{ width: 36, height: 3, background: C.accent, marginBottom: 20, borderRadius: 2 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.35, fontFamily: FF }}>{item.title}</h3>
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.8, color: C.textMid }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "88px 56px", background: C.bg, borderTop: "1px solid " + C.border }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FFD, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 48 }}>Transparent<br /><em style={{ fontStyle: "italic", color: C.accent }}>Pricing.</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 580 }}>
            {[
              { type: "single_report", reportType: "evaluation", label: "One Report", price: "$175", period: "", desc: "Full evaluation, one category. Most organizations evaluate more than once.", btn: "Start Evaluation", featured: false },
              { type: "single_report", reportType: "stack_fit", label: "Stack Fit Report", price: "$175", period: "", desc: "Know how a new tool fits your existing stack before you commit.", btn: "Start Stack Fit", featured: true },
            ].map((card, i) => (
              <div key={i} style={{ background: card.featured ? C.accent : C.white, border: "1.5px solid " + (card.featured ? C.accent : C.border), borderRadius: 8, padding: "32px", display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: card.featured ? "rgba(255,255,255,0.6)" : C.textLight }}>{card.label}</p>
                <p style={{ fontSize: 44, fontWeight: 700, color: card.featured ? C.white : C.text, fontFamily: FFD, lineHeight: 1 }}>{card.price}<span style={{ fontSize: 18, fontWeight: 400 }}>{card.period}</span></p>
                <p style={{ fontSize: 14, fontWeight: 500, color: card.featured ? "rgba(255,255,255,0.8)" : C.textMid, lineHeight: 1.6, flex: 1 }}>{card.desc}</p>
                <button onClick={() => startCheckout(card.type, card.reportType)} style={{ background: card.featured ? C.white : C.accent, color: card.featured ? C.accent : C.white, border: "none", borderRadius: 3, padding: "12px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF, cursor: "pointer", width: "100%" }}>{card.btn}</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.textLight, marginTop: 16 }}>Beta access available. Use your access code at checkout.</p>
        </div>
      </div>

      {/* Closing */}
      <div style={{ textAlign: "center", padding: "88px 48px", background: C.dark }}>
        <h2 style={{ fontFamily: FFD, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: C.white, letterSpacing: -0.5, marginBottom: 14, lineHeight: 1.1 }}>Know the gap<br /><em style={{ fontStyle: "italic", color: C.gold }}>before you commit.</em></h2>
        <p style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 36, fontFamily: FF }}>The independent report for software buyers.</p>
        <button onClick={() => startCheckout("single_report", "evaluation")} style={{ background: C.white, color: C.accent, border: "none", borderRadius: 3, padding: "16px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontFamily: FF }}>Start your evaluation</button>
      </div>

      {/* Footer */}
      <footer style={{ background: C.dark, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: FFD }}>Delphi</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.32)", textAlign: "right", lineHeight: 1.65, maxWidth: 380, fontFamily: FF }}>Funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
      </footer>
    </div>
  );
}
