const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { sessionId } = JSON.parse(event.body);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" || session.status === "complete") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          paid: true,
          mode: session.mode,
          customerEmail: session.customer_details?.email || "",
        }),
      };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ paid: false }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
