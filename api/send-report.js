export const config = { maxDuration: 30 };

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function sectionsToHtml(sections, reportType) {
  const accentColor = reportType === "stack_fit" ? "#4A6FA5" : "#3D6B21";
  const reportLabel = reportType === "stack_fit" ? "Stack Fit Report" : "Evaluation Report";

  const sectionHtml = sections.map(section => {
    const contentHtml = section.content.map(line => {
      const clean = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      if (line.trim().startsWith("|")) return "";
      if (/^#{1,3}\s/.test(line)) return `<h3 style="font-size:16px;font-weight:700;color:#1C1C1A;margin:20px 0 8px;font-family:Georgia,serif;">${line.replace(/^#+\s/, "")}</h3>`;
      return `<p style="font-size:15px;line-height:1.8;color:#3E3830;margin:0 0 12px;font-family:Georgia,serif;">${clean}</p>`;
    }).join("");

    return `
      <div style="margin-bottom:40px;padding-bottom:32px;border-bottom:1px solid #E0D8CE;">
        <h2 style="font-size:20px;font-weight:700;color:${accentColor};margin:0 0 16px;font-family:Georgia,serif;">${section.title}</h2>
        ${contentHtml}
      </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,serif;">
  <div style="max-width:680px;margin:0 auto;padding:48px 24px;">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:36px;height:36px;border-radius:50%;background:${accentColor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;text-align:center;line-height:36px;">D</div>
      <span style="font-size:22px;font-weight:700;color:#1C1C1A;">Delphi</span>
    </div>
    <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7A7060;margin:0 0 40px 48px;">${reportLabel}</p>

    <hr style="border:none;border-top:1px solid #E0D8CE;margin-bottom:40px;">

    <!-- Report sections -->
    ${sectionHtml}

    <!-- Footer -->
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E0D8CE;">
      <p style="font-size:13px;color:#7A7060;line-height:1.7;margin:0 0 8px;">Delphi is funded by subscribers, not vendors. No platform pays for placement, recommendation, or access. Ever.</p>
      <p style="font-size:12px;color:#7A7060;line-height:1.7;margin:0;">Delphi reports are generated using AI and publicly available information. They are for informational purposes only and do not constitute professional, legal, or financial advice. Vendor pricing, product capabilities, and market positioning change frequently — verify all claims directly with vendors before making any purchasing decision.</p>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, sections, reportType } = req.body;
    if (!email || !sections || !sections.length) {
      return res.status(400).json({ error: "Missing email or report sections" });
    }

    const reportLabel = reportType === "stack_fit" ? "Stack Fit Report" : "Evaluation Report";
    const html = sectionsToHtml(sections, reportType);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Delphi <analysis@delphi.report>",
        to: [email],
        subject: `Your Delphi ${reportLabel}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return res.status(200).json({ sent: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
