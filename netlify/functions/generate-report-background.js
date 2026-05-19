const { createClient } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { jobId, system, prompt } = body;
  if (!jobId || !system || !prompt) {
    return { statusCode: 400, body: "Missing jobId, system, or prompt" };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  // Store "pending" status immediately
  const store = createClient({
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN,
    name: "delphi-reports",
  });

  await store.set(jobId, JSON.stringify({ status: "pending" }));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        stream: true,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
          },
        ],
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      await store.set(jobId, JSON.stringify({ status: "error", error: err }));
      return { statusCode: 500, body: err };
    }

    // Collect streamed response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta"
            ) {
              fullText += parsed.delta.text;
            }
          } catch (e) {
            // skip malformed chunks
          }
        }
      }
    }

    // Store completed report
    await store.set(jobId, JSON.stringify({ status: "complete", text: fullText }));
    return { statusCode: 200, body: "done" };

  } catch (err) {
    await store.set(jobId, JSON.stringify({ status: "error", error: err.message }));
    return { statusCode: 500, body: err.message };
  }
};
