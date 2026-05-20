const store = () => getStore({
  name: "reports",
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_BLOBS_TOKEN,
  consistency: "strong",
});

export const handler = async ({ body }) => {
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
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic error: ${await res.text()}`);

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
