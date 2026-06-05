import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const PRICE_TYPES = {
  "price_1TcsDNCzdpqwekegzRjP3fUF": "single_report",
  "price_1TcsceCzdpqwekegMLNrJcxG": "single_report",
  "price_1Tf0C6CzdpqwekegeiNPwIza": "unlimited",
};

export default async function handler(req, res) {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { sessionId, authToken } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const paid =
      session.status === "complete" &&
      (session.payment_status === "paid" || session.payment_status === "no_payment_required");

    const priceId = session.line_items?.data?.[0]?.price?.id || "";
    const priceType = PRICE_TYPES[priceId] || "single_report";
    const amountPaid = session.amount_total || 0;

    // Save purchase to Supabase server-side if user is authenticated
    if (paid && authToken) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
      if (!authError && user) {
        const isUnlimited = priceType === "unlimited";
        await supabase.from("purchases").insert({
          user_id: user.id,
          plan_type: priceType,
          amount_paid: amountPaid,
          stripe_session: sessionId,
          valid_until: isUnlimited
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        });
      }
    }

    return res.status(200).json({
      paid,
      mode: session.mode,
      priceType,
      amountPaid,
      customerEmail: session.customer_details?.email ?? "",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
