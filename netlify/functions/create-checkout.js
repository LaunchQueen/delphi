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
    const { priceType, successUrl, cancelUrl } = JSON.parse(event.body);

    // Price IDs - replace with your actual Stripe price IDs after creating products
    const PRICES = {
      single_report: { amount: 17500, name: "Delphi Report — Single Evaluation", mode: "payment" },
      annual: { amount: 30000, name: "Delphi — Annual Subscription", mode: "subscription" },
      fractional: { amount: 3000, name: "Delphi — Fractional Stack Report", mode: "payment" },
    };

    const price = PRICES[priceType];
    if (!price) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid price type" }) };
    }

    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: price.name },
          unit_amount: price.amount,
          ...(price.mode === "subscription" ? { recurring: { interval: "year" } } : {}),
        },
        quantity: 1,
      }],
      mode: price.mode,
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
