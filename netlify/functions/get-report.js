const { getStore } = require("@netlify/blobs");

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  if (httpMethod === "OPTIONS") return { statusCode: 204, headers: HEADERS, body: "" };

  const { jobId } = queryStringParameters ?? {};
  if (!jobId) return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Missing jobId" }) };

  try {
    const result = await getStore({ name: "reports", consistency: "strong" }).get(jobId, { type: "json" });
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(result ?? { status: "pending" }),
    };
  } catch {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ status: "pending" }) };
  }
};
