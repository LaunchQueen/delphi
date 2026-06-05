import { useState, useEffect } from "react";
import Delphi from "./Delphi.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const C = {
  bg: "#FAF7F2", card: "#F2EDE6", sidebar: "#EDE6DC", border: "#E0D8CE",
  borderDark: "#C4BAB0", text: "#1C1C1A", textMid: "#3E3830",
  textLight: "#7A7060", accent: "#3D6B21", accentDark: "#2D5016",
  dark: "#141410", gold: "#B8935A", white: "#FFFFFF", stack: "#4A6FA5",
  red: "#C0392B",
};
const FF = "'EB Garamond', Georgia, serif";
const FFD = "'Playfair Display', Georgia, serif";
const GS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } } @keyframes spin { to { transform: rotate(360deg); } } button { cursor: pointer; } input:focus { outline: none; border-color: ${C.accent} !important; }`;

// ─── SIGN IN MODAL ────────────────────────────────────────────────────────────
function SignInModal({ signInEmail, setSignInEmail, signInStatus, setSignInStatus, signInError, handleSignIn, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <style>{GS}</style>
      <div style={{ background: C.bg, borderRadius: 8, padding: "40px 36px", maxWidth: 420, width: "100%", animation: "fadeUp 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </div>
        {signInStatus === "sent" ? (
          <>
            <h2 style={{ fontFamily: FFD, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 12 }}>Check your email</h2>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.75, marginBottom: 20 }}>We sent a sign-in link to <strong>{signInEmail}</strong>. Click it to access your reports.</p>
            <p style={{ fontSize: 13, color: C.textLight }}>No password. The link expires in 1 hour.</p>
            <button onClick={() => { setSignInStatus("idle"); setSignInEmail(""); }} style={{ background: "none", border: "none", color: C.accent, fontSize: 13, fontWeight: 600, marginTop: 16, cursor: "pointer", fontFamily: FF, textDecoration: "underline" }}>Use a different email</button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: FFD, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 12 }}>Sign in to your reports</h2>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.75, marginBottom: 24 }}>Enter your email and we'll send you a sign-in link. No password required.</p>
            <input type="email" placeholder="you@company.com" value={signInEmail}
              onChange={e => setSignInEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSignIn(); }}
              style={{ width: "100%", border: "1.5px solid " + C.border, borderRadius: 4, padding: "12px 14px", fontSize: 15, fontFamily: FF, color: C.text, background: C.white, marginBottom: 12 }} />
            {signInError && <p style={{ fontSize: 13, color: C.red, marginBottom: 10 }}>{signInError}</p>}
            <button onClick={handleSignIn} disabled={!signInEmail.trim() || signInStatus === "sending"}
              style={{ background: !signInEmail.trim() ? C.border : C.accent, color: C.white, border: "none", borderRadius: 4, padding: "12px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF, cursor: "pointer", width: "100%", opacity: !signInEmail.trim() ? 0.6 : 1 }}>
              {signInStatus === "sending" ? "Sending..." : "Send Sign-In Link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── UPGRADE MODAL ────────────────────────────────────────────────────────────
function UpgradeModal({ purchase, onUpgrade, onSingleReport, onClose }) {
  const purchasedAt = purchase ? new Date(purchase.purchased_at) : null;
  const daysSince = purchasedAt ? Math.floor((Date.now() - purchasedAt) / (1000 * 60 * 60 * 24)) : 999;
  const withinWindow = daysSince <= 30;
  const upgradePrice = withinWindow ? 125 : 300;
  const daysLeft = withinWindow ? 30 - daysSince : 0;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <style>{GS}</style>
      <div style={{ background: C.bg, borderRadius: 8, padding: "40px 36px", maxWidth: 460, width: "100%", animation: "fadeUp 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </div>
        <h2 style={{ fontFamily: FFD, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>You've used your single report.</h2>
        <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.75, marginBottom: 24 }}>To run another report, you can purchase a new single report or upgrade to the annual unlimited plan.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <div style={{ border: "2px solid " + C.accent, borderRadius: 8, padding: "20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: FFD }}>Unlimited annual plan</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FFD }}>${upgradePrice}</p>
            </div>
            {withinWindow ? (
              <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 12 }}>
                Your $175 purchase is credited toward the $300 annual plan. You only pay the $125 difference. <strong style={{ color: C.accent }}>This offer expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.</strong>
              </p>
            ) : (
              <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 12 }}>
                Run unlimited reports for one year. No auto-renewal — you choose when to repurchase.
              </p>
            )}
            <button onClick={onUpgrade}
              style={{ background: C.accent, color: C.white, border: "none", borderRadius: 4, padding: "10px 20px", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF, width: "100%" }}>
              Upgrade for ${upgradePrice}
            </button>
          </div>

          <div style={{ border: "1px solid " + C.border, borderRadius: 8, padding: "20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: FFD }}>Single report</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FFD }}>$175</p>
            </div>
            <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 12 }}>One Evaluation or Stack Fit report.</p>
            <button onClick={onSingleReport}
              style={{ background: "transparent", color: C.accent, border: "1.5px solid " + C.accent, borderRadius: 4, padding: "10px 20px", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF, width: "100%" }}>
              Buy single report
            </button>
          </div>
        </div>

        <button onClick={onClose} style={{ background: "none", border: "none", color: C.textLight, fontSize: 13, cursor: "pointer", fontFamily: FF, width: "100%", textAlign: "center" }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── ACCOUNT PAGE ─────────────────────────────────────────────────────────────
function AccountPage({ user, onNewReport, onSignOut, onHome }) {
  const [activeTab, setActiveTab] = useState("reports");
  const [reports, setReports] = useState([]);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [{ data: reportData }, { data: purchaseData }] = await Promise.all([
      supabase.from("reports").select("id, report_type, title, created_at").order("created_at", { ascending: false }),
      supabase.from("purchases").select("*").order("purchased_at", { ascending: false }).limit(1).single(),
    ]);
    if (reportData) setReports(reportData);
    if (purchaseData) setPurchase(purchaseData);
    setLoading(false);
  };

  const viewReport = async (report) => {
    const { data } = await supabase.from("reports").select("email_html, title, report_type").eq("id", report.id).single();
    if (data) setActiveReport(data);
  };

  const downloadReport = async (report) => {
    const { data } = await supabase.from("reports").select("email_html, title").eq("id", report.id).single();
    if (!data?.email_html) return;
    const blob = new Blob([data.email_html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (data.title || "delphi-report").replace(/[^a-z0-9]/gi, "-").toLowerCase() + ".html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    await supabase.from("reports").delete().eq("user_id", user.id);
    await supabase.from("purchases").delete().eq("user_id", user.id);
    await supabase.auth.signOut();
    onSignOut();
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const typeLabel = (t) => t === "stack_fit" ? "Stack Fit" : "Evaluation";
  const typeColor = (t) => t === "stack_fit" ? C.stack : C.accent;
  const typeBg = (t) => t === "stack_fit" ? "rgba(74,111,165,0.08)" : "rgba(61,107,33,0.08)";

  const planLabel = purchase?.plan_type === "unlimited" ? "Unlimited annual plan" : purchase ? "Single report" : "No active plan";
  const validUntil = purchase?.valid_until ? formatDate(purchase.valid_until) : null;

  if (activeReport) return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{GS}</style>
      <div style={{ borderBottom: "1px solid " + C.border, background: C.sidebar, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setActiveReport(null)} style={{ background: "none", border: "none", color: C.textMid, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>&larr; Back to reports</button>
          <span style={{ color: C.border }}>|</span>
          <span style={{ fontSize: 14, color: C.textLight }}>{activeReport.title || "Report"}</span>
        </div>
        <button onClick={() => downloadReport({ id: activeReport.id })} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 4, color: C.textMid, fontSize: 12, fontWeight: 700, padding: "7px 14px", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF, cursor: "pointer" }}>Download</button>
      </div>
      <iframe srcDoc={activeReport.email_html} style={{ width: "100%", border: "none", minHeight: "calc(100vh - 53px)" }} title="Report" />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      <style>{GS}</style>
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: C.bg, borderRadius: 8, padding: "36px", maxWidth: 400, width: "100%" }}>
            <h2 style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Delete your account?</h2>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.75, marginBottom: 24 }}>This permanently deletes your account and all saved reports. This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, background: "transparent", border: "1px solid " + C.border, borderRadius: 4, color: C.textMid, fontSize: 13, fontWeight: 700, padding: "10px", fontFamily: FF }}>Cancel</button>
              <button onClick={deleteAccount} style={{ flex: 1, background: C.red, border: "none", borderRadius: 4, color: C.white, fontSize: 13, fontWeight: 700, padding: "10px", fontFamily: FF }}>Delete account</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ borderBottom: "1px solid " + C.border, background: C.sidebar, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: FFD }}>D</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FFD }}>Delphi</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setActiveTab("reports")} style={{ background: "none", border: "none", fontSize: 13, color: activeTab === "reports" ? C.accent : C.textLight, fontWeight: activeTab === "reports" ? 700 : 500, cursor: "pointer", fontFamily: FF }}>My Reports</button>
          <button onClick={() => setActiveTab("billing")} style={{ background: "none", border: "none", fontSize: 13, color: activeTab === "billing" ? C.accent : C.textLight, fontWeight: activeTab === "billing" ? 700 : 500, cursor: "pointer", fontFamily: FF }}>Billing</button>
          <span style={{ color: C.border }}>|</span>
          <span style={{ fontSize: 13, color: C.textLight }}>{user.email}</span>
          <button onClick={onNewReport} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 4, padding: "8px 16px", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>New Report</button>
          <button onClick={onSignOut} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 4, color: C.textLight, fontSize: 11, fontWeight: 700, padding: "7px 14px", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 36, height: 36, border: "3px solid " + C.border, borderTop: "3px solid " + C.accent, borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.9s linear infinite" }} />
            <p style={{ color: C.textLight, fontFamily: FF }}>Loading...</p>
          </div>
        ) : activeTab === "reports" ? (
          <>
            {reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", border: "1.5px dashed " + C.border, borderRadius: 8 }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: C.textMid, marginBottom: 8, fontFamily: FFD }}>No reports yet</p>
                <p style={{ fontSize: 15, color: C.textLight, marginBottom: 24, fontFamily: FF }}>Run your first evaluation to see it here.</p>
                <button onClick={onNewReport} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 4, padding: "12px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>Start a Report</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {reports.map(report => (
                  <div key={report.id} style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 6, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: typeColor(report.report_type), background: typeBg(report.report_type), borderRadius: 20, padding: "2px 10px" }}>{typeLabel(report.report_type)}</span>
                        <span style={{ fontSize: 12, color: C.textLight }}>{formatDate(report.created_at)}</span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FF, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{report.title || "Untitled Report"}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                      <button onClick={() => viewReport(report)} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 4, color: C.textMid, fontSize: 12, fontWeight: 700, padding: "7px 14px", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>View</button>
                      <button onClick={() => downloadReport(report)} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 4, color: C.textMid, fontSize: 12, fontWeight: 700, padding: "7px 14px", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>Download</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 8, padding: "24px 28px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.textLight, marginBottom: 16 }}>Current plan</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Email</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FF }}>{user.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Plan</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FF }}>{planLabel}</p>
                </div>
                {purchase && (
                  <>
                    <div>
                      <p style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Purchased</p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FF }}>{formatDate(purchase.purchased_at)}</p>
                    </div>
                    {validUntil && (
                      <div>
                        <p style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Valid until</p>
                        <p style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FF }}>{validUntil}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Reports run</p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FF }}>{reports.length}{purchase.plan_type === "unlimited" ? " of 20 this month" : ""}</p>
                    </div>
                  </>
                )}
              </div>
              <div style={{ background: C.card, borderRadius: 6, padding: "12px 16px", borderLeft: "3px solid " + C.border }}>
                <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, margin: 0 }}>Delphi plans do not auto-renew. If you have an annual plan and would like to continue after your plan expires, you will need to repurchase.</p>
              </div>
            </div>

            <div style={{ background: "rgba(192,57,43,0.04)", border: "0.5px solid rgba(192,57,43,0.2)", borderRadius: 8, padding: "20px 24px" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.red, marginBottom: 4 }}>Delete account</p>
              <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 14 }}>Permanently deletes your account and all saved reports. This cannot be undone.</p>
              <button onClick={() => setConfirmDelete(true)} style={{ background: "transparent", border: "1px solid " + C.red, borderRadius: 4, color: C.red, fontSize: 12, fontWeight: 700, padding: "8px 16px", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: FF }}>Delete my account</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialReportType, setInitialReportType] = useState(null);
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInEmail, setSignInEmail] = useState("");
  const [signInStatus, setSignInStatus] = useState("idle");
  const [signInError, setSignInError] = useState("");
  const [purchase, setPurchase] = useState(null);
  const [reportCount, setReportCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [pendingSessionId, setPendingSessionId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadPurchaseData(session.user.id);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadPurchaseData(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) { setCheckingPayment(true); verifyPayment(sessionId); }
  }, []);

  // Save purchase when user becomes available after payment
  useEffect(() => {
    if (!user) return;
    const sessionId = sessionStorage.getItem("completedSessionId");
    const priceType = sessionStorage.getItem("completedPriceType");
    const amountPaid = sessionStorage.getItem("completedAmountPaid");
    if (!sessionId || !priceType) return;
    const isUnlimited = priceType === "unlimited";
    supabase.from("purchases").insert({
      user_id: user.id,
      plan_type: priceType,
      amount_paid: parseInt(amountPaid) || 0,
      stripe_session: sessionId,
      valid_until: isUnlimited ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
    }).then(({ error }) => {
      if (error) { console.error("Deferred purchase insert error:", error); }
      else {
        console.log("Deferred purchase saved successfully");
        sessionStorage.removeItem("completedSessionId");
        sessionStorage.removeItem("completedPriceType");
        sessionStorage.removeItem("completedAmountPaid");
        loadPurchaseData(user.id);
      }
    });
  }, [user]);

  const loadPurchaseData = async (userId) => {
    const [{ data: purchaseData }, { count }] = await Promise.all([
      supabase.from("purchases").select("*").eq("user_id", userId).order("purchased_at", { ascending: false }).limit(1).single(),
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("user_id", userId),
    ]);
    if (purchaseData) setPurchase(purchaseData);
    if (count !== null) setReportCount(count);
  };

  const verifyPayment = async (sessionId) => {
    try {
      console.log("verifyPayment called, user:", user?.id, "sessionId:", sessionId);
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      console.log("verify-payment response:", data);
      if (data.paid) {
        const savedReportType = sessionStorage.getItem("pendingReportType") || null;
        sessionStorage.removeItem("pendingReportType");
        setPaymentStatus({ paid: true, mode: data.mode, email: data.customerEmail });
        setInitialReportType(savedReportType);
        if (user) {
          console.log("inserting purchase for user:", user.id, "priceType:", data.priceType);
          const isUnlimited = data.priceType === "unlimited";
          const { error } = await supabase.from("purchases").insert({
            user_id: user.id,
            plan_type: data.priceType || "single_report",
            amount_paid: data.amountPaid || 0,
            stripe_session: sessionId,
            valid_until: isUnlimited ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
          });
          if (error) console.error("Purchase insert error:", error);
          else console.log("Purchase inserted successfully");
          await loadPurchaseData(user.id);
        } else {
          console.log("No user yet — storing session data for later save");
          sessionStorage.setItem("completedSessionId", sessionId);
          sessionStorage.setItem("completedPriceType", data.priceType || "single_report");
          sessionStorage.setItem("completedAmountPaid", String(data.amountPaid || 0));
        }
        setPage("tool");
        window.history.replaceState({}, "", "/");
      }
    } catch (e) { console.error("Payment verification failed", e); }
    setCheckingPayment(false);
  };

  const handleNewReport = () => {
    if (!user) { setPage("tool"); return; }
    if (!purchase) { setPage("tool"); return; }
    if (purchase.plan_type === "unlimited") { setPage("tool"); return; }
    if (purchase.plan_type === "single_report" && reportCount === 0) { setPage("tool"); return; }
    setShowUpgrade(true);
  };

  const startCheckout = async (priceType, reportType) => {
    try {
      if (reportType) sessionStorage.setItem("pendingReportType", reportType);
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType, successUrl: window.location.origin, cancelUrl: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) { console.error("Checkout failed", e); alert("Payment setup failed. Please try again."); }
  };

  const handleSignIn = async () => {
    if (!signInEmail.trim()) return;
    setSignInStatus("sending");
    setSignInError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: signInEmail.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) { setSignInStatus("error"); setSignInError(error.message); }
    else setSignInStatus("sent");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPurchase(null);
    setReportCount(0);
    setPage("home");
  };

  const closeSignIn = () => { setShowSignIn(false); setSignInStatus("idle"); setSignInEmail(""); };

  if (window.location.pathname === "/feedback") return <FeedbackForm />;

  if (checkingPayment) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FF }}>
      <style>{GS}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: "3px solid " + C.border, borderTop: "3px solid " + C.accent, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontSize: 18, color: C.textMid }}>Confirming your payment...</p>
      </div>
    </div>
  );

  if (page === "account") return (
    <AccountPage user={user} onNewReport={() => { setPage("tool"); }} onSignOut={handleSignOut} onHome={() => setPage("home")} />
  );

  if (page === "tool") return (
    <Delphi paymentStatus={paymentStatus} startCheckout={startCheckout} onHome={() => setPage("home")} initialReportType={initialReportType} onMyReports={() => setPage("account")} />
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FF }}>
      {showSignIn && <SignInModal signInEmail={signInEmail} setSignInEmail={setSignInEmail} signInStatus={signInStatus} setSignInStatus={setSignInStatus} signInError={signInError} handleSignIn={handleSignIn} onClose={closeSignIn} />}
      {showUpgrade && <UpgradeModal purchase={purchase} onUpgrade={() => { setShowUpgrade(false); startCheckout("upgrade", null); }} onSingleReport={() => { setShowUpgrade(false); startCheckout("single_report", null); }} onClose={() => setShowUpgrade(false)} />}
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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#how-it-works" className="nav-link" style={{ fontSize: 14, color: C.textLight, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ fontSize: 14, color: C.textLight, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}>Pricing</a>
          {user ? (
            <>
              <button onClick={() => setPage("account")} className="nav-link" style={{ background: "none", border: "none", fontSize: 14, color: C.textLight, fontWeight: 500, cursor: "pointer", fontFamily: FF }}>My Account</button>
              <button onClick={handleSignOut} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 3, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: C.textMid, cursor: "pointer", fontFamily: FF }}>Sign out</button>
            </>
          ) : (
            <button onClick={() => setShowSignIn(true)} className="nav-link" style={{ background: "none", border: "none", fontSize: 14, color: C.textLight, fontWeight: 500, cursor: "pointer", fontFamily: FF }}>Sign in</button>
          )}
          <button onClick={user ? handleNewReport : () => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })} className="btn-primary" style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "11px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: FF, transition: "background 0.15s" }}>Get a Report</button>
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
          <button onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })} className="btn-primary" style={{ background: C.accent, color: C.white, border: "none", borderRadius: 3, padding: "16px 40px", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontFamily: FF, transition: "background 0.15s" }}>Start your evaluation — $175</button>
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
              { label: "Single report", price: "$175", desc: "One Evaluation or one Stack Fit report.", btn: "Get started", featured: false, priceType: "single_report" },
              { label: "Unlimited annual plan", price: "$300", desc: "Run unlimited reports for one year. No auto-renewal — you choose when to repurchase.", btn: "Get started", featured: true, priceType: "unlimited" },
            ].map((card, i) => (
              <div key={i} className="card-lift" style={{ background: card.featured ? C.accent : C.white, border: card.featured ? "1.5px solid " + C.accent : "1.5px solid " + C.border, borderRadius: 8, padding: "32px", display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                {card.featured && <div style={{ position: "absolute", top: -1, right: 20, background: C.accentDark, color: C.white, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 12px", borderRadius: "0 0 4px 4px" }}>Best value</div>}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: card.featured ? "rgba(255,255,255,0.6)" : C.textLight }}>{card.label}</p>
                <p style={{ fontSize: 44, fontWeight: 700, color: card.featured ? C.white : C.text, fontFamily: FFD, lineHeight: 1 }}>{card.price}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: card.featured ? "rgba(255,255,255,0.8)" : C.textMid, lineHeight: 1.6, flex: 1 }}>{card.desc}</p>
                <button onClick={() => startCheckout(card.priceType, "evaluation")} className={card.featured ? "btn-white" : "btn-primary"} style={{ background: card.featured ? C.white : C.accent, color: card.featured ? C.accent : C.white, border: "none", borderRadius: 3, padding: "12px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FF, cursor: "pointer", width: "100%", transition: "background 0.15s" }}>{card.btn}</button>
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
