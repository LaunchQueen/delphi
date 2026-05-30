export const config = { maxDuration: 300 };

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).set(HEADERS).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { system, prompt } = req.body;
  if (!system || !prompt) return res.status(400).json({ error: "Missing system or prompt" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 8000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: [
          {
            type: "text",
            text: system,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();

    // Log token usage to Vercel logs for cost monitoring
    if (data.usage) {
      console.log("Token usage:", JSON.stringify(data.usage));
    }

    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).json({ text });
  } catch (err) {
    Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(500).json({ error: err.message });
  }
}
