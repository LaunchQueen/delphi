import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async function handler(req, res) {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // FIXED: Now checks for standard card payments AND zero-dollar promo code completions
    const paid = 
      session.status === "complete" && 
      (session.payment_status === "paid" || session.payment_status === "no_payment_required");

    return res.status(200).json({
      paid,
      mode: session.mode,
      customerEmail: session.customer_details?.email ?? "",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
