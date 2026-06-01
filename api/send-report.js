export const config = { maxDuration: 30 };

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async function handler(req, res) {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, html, reportType } = req.body;
    if (!email || !html) {
      return res.status(400).json({ error: "Missing email or html" });
    }

    const reportLabel = reportType === "stack_fit" ? "Stack Fit Report" : "Evaluation Report";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Delphi <analysis@email.delphi.report>",
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
