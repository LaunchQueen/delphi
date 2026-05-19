const { getStore } = require("@netlify/blobs");

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const store = () => getStore({ name: "reports", consistency: "strong" });

exports.handler = async ({ body }) => {
  const { jobId, system, prompt } = JSON.parse(body);

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    await store().setJSON(jobId, { status: "done", text });
  } catch (err) {
    await store().setJSON(jobId, { status: "error", error: err.message });
  }
};
