import { useState } from "react";

const C = {
  bg: "#FAF7F2", border: "#E0D8CE", text: "#1C1C1A", textMid: "#3E3830",
  textLight: "#7A7060", accent: "#3D6B21", accentDark: "#2D5016",
  dark: "#141410", gold: "#B8935A", white: "#FFFFFF", card: "#F2EDE6",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";

const RATINGS = [1, 2, 3, 4, 5];

function RatingField({ label, name, value, onChange }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 12, fontFamily: FF }}>{label}</p>
      <div style={{ display: "flex", gap: 12 }}>
        {RATINGS.map(r => (
          <button key={r} onClick={() => onChange(name, r)}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: value === r ? C.accent : C.white,
              color: value === r ? C.white : C.textMid,
              border: "1.5px solid " + (value === r ? C.accent : C.border),
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FF,
              transition: "all 0.15s"
            }}>{r}</button>
        ))}
        <span style={{ fontSize: 13, color: C.textLight, alignSelf: "center", marginLeft: 8, fontFamily: FF }}>1 = poor · 5 = excellent</span>
      </div>
    </div>
  );
}

function YesNoField({ label, name, value, onChange }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 12, fontFamily: FF }}>{label}</p>
      <div style={{ display: "flex", gap: 12 }}>
        {["Yes", "No", "Maybe"].map(opt => (
          <button key={opt} onClick={() => onChange(name, opt)}
            style={{
              padding: "10px 24px", borderRadius: 3,
              background: value === opt ? C.accent : C.white,
              color: value === opt ? C.white : C.textMid,
              border: "1.5px solid " + (value === opt ? C.accent : C.border),
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FF,
              transition: "all 0.15s"
            }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

export default function FeedbackForm() {
  const [answers, setAnswers] = useState({});
  const [freeText, setFreeText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, freeText }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FF }}>
        <style>{"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');"}</style>
        <div style={{ textAlign: "center", maxWidth: 480, padding: "48px 24px" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 24px" }}>✓</div>
          <h2 style={{ fontFamily: FFD, fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 16 }}>Thank you.</h2>
          <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.8 }}>Your feedback helps make Delphi better. We appreciate you taking the time.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }"}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid " + C.border, padding: "20px 48px", display: "flex", alignItems: "center", gap: 12, background: C.bg }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: FFD }}>D</div>
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.textLight, marginLeft: 12 }}>Beta Feedback</span>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px" }}>
        <h1 style={{ fontFamily: FFD, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.1 }}>How did we do?</h1>
        <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.8, marginBottom: 48 }}>Your honest feedback shapes what Delphi becomes. This takes about 3 minutes.</p>

        <div style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 10, padding: "40px 36px", marginBottom: 24 }}>
          <h2 style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid " + C.border }}>The Report</h2>

          <RatingField label="How would you rate the tone of the report?" name="tone" value={answers.tone} onChange={handleChange} />
          <RatingField label="How valuable was the content?" name="value" value={answers.value} onChange={handleChange} />
          <RatingField label="How accurate did the information seem?" name="accuracy" value={answers.accuracy} onChange={handleChange} />
          <RatingField label="How would you rate the design?" name="design" value={answers.design} onChange={handleChange} />
          <RatingField label="How easy was the report to read?" name="readability" value={answers.readability} onChange={handleChange} />
          <RatingField label="How useful were the results for your actual situation?" name="usefulness" value={answers.usefulness} onChange={handleChange} />
        </div>

        <div style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 10, padding: "40px 36px", marginBottom: 24 }}>
          <h2 style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid " + C.border }}>Pricing</h2>

          <YesNoField label="Would you pay $175 for this report on your next software evaluation?" name="pay175" value={answers.pay175} onChange={handleChange} />
          <YesNoField label="Would you pay $300/year for unlimited reports?" name="pay300" value={answers.pay300} onChange={handleChange} />
          <YesNoField label="Would you share this with a colleague evaluating software?" name="share" value={answers.share} onChange={handleChange} />
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 12, fontFamily: FF }}>How does this compare to how you normally research software purchases?</p>
            <textarea value={answers.compare || ""} onChange={e => handleChange("compare", e.target.value)} placeholder="Tell us how you usually research software..." rows={4} style={{ width: "100%", border: "1.5px solid " + C.border, borderRadius: 4, padding: "14px 16px", fontSize: 15, fontFamily: FF, color: C.text, background: C.bg, resize: "vertical", outline: "none" }} />
          </div>
        </div>

        <div style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 10, padding: "40px 36px", marginBottom: 32 }}>
          <h2 style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Anything else?</h2>
          <p style={{ fontSize: 14, color: C.textLight, marginBottom: 20, fontFamily: FF }}>What worked, what didn't, what you wish it did.</p>
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            placeholder="Write anything here..."
            rows={6}
            style={{ width: "100%", border: "1.5px solid " + C.border, borderRadius: 4, padding: "14px 16px", fontSize: 15, fontFamily: FF, color: C.text, background: C.bg, resize: "vertical", outline: "none" }}
          />
        </div>

        {error && <p style={{ color: "#C0392B", fontSize: 14, marginBottom: 16, fontFamily: FF }}>{error}</p>}

        <button onClick={handleSubmit} disabled={submitting}
          style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "16px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: submitting ? "wait" : "pointer", fontFamily: FF, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
