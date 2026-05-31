export const config = { maxDuration: 30 };

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const LABELS = {
  tone: "Tone of the report",
  value: "Value of the content",
  accuracy: "Accuracy of the information",
  design: "Design",
  readability: "Ease of reading",
  usefulness: "Usefulness of the results",
  pay175: "Would pay $175 for this report",
  pay300: "Would pay $300/year for unlimited",
  share: "Would share with a colleague",
  compare: "How it compares to normal research",
};

export default async function handler(req, res) {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { answers, freeText } = req.body;

    const ratingsHtml = Object.entries(answers).map(([key, val]) => {
      const label = LABELS[key] || key;
      const isRating = typeof val === "number";
      return `
        <tr>
          <td style="padding:10px 16px;font-size:14px;color:#3E3830;border-bottom:1px solid #E0D8CE;font-family:Georgia,serif;">${label}</td>
          <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#3D6B21;border-bottom:1px solid #E0D8CE;font-family:Georgia,serif;">${isRating ? `${val} / 5` : val}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:36px;height:36px;border-radius:50%;background:#3D6B21;color:#fff;text-align:center;line-height:36px;font-size:16px;font-weight:700;">D</div>
      <span style="font-size:20px;font-weight:700;color:#1C1C1A;">Delphi — Beta Feedback</span>
    </div>

    <table style="width:100%;border-collapse:collapse;border:1px solid #E0D8CE;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#3D6B21;">
          <th style="padding:12px 16px;text-align:left;color:#fff;font-size:13px;font-family:Georgia,serif;">Question</th>
          <th style="padding:12px 16px;text-align:left;color:#fff;font-size:13px;font-family:Georgia,serif;">Response</th>
        </tr>
      </thead>
      <tbody>${ratingsHtml}</tbody>
    </table>

    ${freeText ? `
    <div style="background:#F2EDE6;border:1px solid #E0D8CE;border-radius:8px;padding:24px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7A7060;margin:0 0 12px;">Additional Comments</p>
      <p style="font-size:15px;color:#3E3830;line-height:1.8;margin:0;">${freeText.replace(/\n/g, "<br>")}</p>
    </div>` : ""}
  </div>
</body>
</html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Delphi Feedback <analysis@email.delphi.report>",
        to: ["maureen@launchactually.com"],
        subject: "New Delphi Beta Feedback",
        html,
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    return res.status(200).json({ sent: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
