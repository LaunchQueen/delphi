const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const PRICES = {
  single_report: { amount: 17500, name: "Delphi Report — Single Evaluation", mode: "payment" },
  annual:        { amount: 30000, name: "Delphi — Annual Subscription",       mode: "subscription" },
  fractional:    { amount: 3000,  name: "Delphi — Fractional Stack Report",   mode: "payment" },
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  try {
    const { priceType, successUrl, cancelUrl } = JSON.parse(event.body);
    const price = PRICES[priceType];
    if (!price) return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Invalid price type" }) };

    const session = await stripe.checkout.sessions.create({
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
    });

    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
