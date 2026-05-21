import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export default async function handler(req, res) {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { priceType, successUrl, cancelUrl } = req.body;
    const price = PRICES[priceType];
    if (!price) return res.status(400).json({ error: "Invalid price type" });

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

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
