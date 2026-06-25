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
  "price_1TmF4OCzdpqwekegu4D3y6xt": "single_report",
  "price_1TmF4OCzdpqwekegu4D3y6xt": "single_report",
  "price_1TmF3NCzdpqwekegwyeEGMCO": "unlimited",
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
    const customerEmail = session.customer_details?.email ?? "";

    if (paid) {
      let userId = null;

      // Try to resolve user from auth token first
      if (authToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
        if (!authError && user) {
          userId = user.id;
        }
      }

      // No authenticated user — create or retrieve one from the Stripe email
      if (!userId && customerEmail) {
        // Check if a user with this email already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(u => u.email === customerEmail);

        if (existing) {
          userId = existing.id;
        } else {
          // Create a new user — email_confirm: true skips the confirmation email
          // They'll sign in via magic link when they want to access their reports
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
          });
          if (!createError && newUser?.user) {
            userId = newUser.user.id;
          } else {
            console.error("Failed to create user:", createError);
          }
        }
      }

      // Write purchase record if we have a user
      if (userId) {
        const isUnlimited = priceType === "unlimited";
        const { error: insertError } = await supabase.from("purchases").insert({
          user_id: userId,
          plan_type: priceType,
          amount_paid: amountPaid,
          stripe_session: sessionId,
          valid_until: isUnlimited
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        });
        if (insertError) {
          console.error("Failed to insert purchase:", insertError);
        }
      }
    }

    return res.status(200).json({
      paid,
      mode: session.mode,
      priceType,
      amountPaid,
      customerEmail,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
