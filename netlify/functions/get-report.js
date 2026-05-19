const { createClient } = require("@netlify/blobs");

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const jobId = event.queryStringParameters?.jobId;
  if (!jobId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing jobId" }) };
  }

  try {
    const store = createClient({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN,
      name: "delphi-reports",
    });

    const result = await store.get(jobId);
    if (!result) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: "pending" }),
      };
    }

    const data = JSON.parse(result);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
