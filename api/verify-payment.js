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
  "price_1TmF3NCzdpqwekegwyeEGMCO": "unlimited",
  "price_1To7gsCzdpqwekegyEg3IwZm": "unlimited",
};

async function sendConfirmationEmail(customerEmail, priceType) {
  const isUnlimited = priceType === "unlimited";
  const isUpgrade = priceType === "upgrade";
  const planLabel = isUnlimited ? "Unlimited Annual Plan" : "Single Report";
  const price = isUnlimited ? "$500" : "$300";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1C1C1A; background: #FAF7F2;">

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
        <div style="width: 36px; height: 36px; background: #3D6B21; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">D</div>
        <span style="font-size: 20px; font-weight: 700; color: #1C1C1A;">Delphi</span>
      </div>

      <h1 style="font-size: 26px; font-weight: 700; margin: 0 0 16px; line-height: 1.2; color: #1C1C1A;">Your purchase is confirmed.</h1>

      <p style="font-size: 16px; line-height: 1.8; color: #3E3830; margin: 0 0 28px;">
        You've purchased the <strong>${planLabel}</strong> (${price}). Here's everything you need to know before you start.
      </p>

      <p style="font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #3D6B21; margin: 0 0 12px;">How to start</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="width: 34px; vertical-align: top; padding: 0 12px 12px 0;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #3D6B21; color: white; font-size: 12px; font-weight: 700; text-align: center; line-height: 22px;">1</div>
          </td>
          <td style="font-size: 15px; color: #3E3830; line-height: 1.6; padding-bottom: 12px;">If you're still on the questionnaire, just keep going. Answer a few questions about your team, stack, and situation, and your report generates in under 60 seconds.</td>
        </tr>
        <tr>
          <td style="width: 34px; vertical-align: top; padding: 0 12px 0 0;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #3D6B21; color: white; font-size: 12px; font-weight: 700; text-align: center; line-height: 22px;">2</div>
          </td>
          <td style="font-size: 15px; color: #3E3830; line-height: 1.6;">If you've left the page, go to <a href="https://delphi.report" style="color: #3D6B21; text-decoration: underline;"><strong>delphi.report</strong></a> and click <strong>Get a Report</strong> to pick up where you left off.</td>
        </tr>
      </table>

      <div style="background: #F2EDE6; border-radius: 6px; padding: 18px 22px; margin-bottom: 24px; border-left: 3px solid #3D6B21;">
        <p style="font-size: 14px; font-weight: 700; color: #1C1C1A; margin: 0 0 6px;">Complete the questionnaire in one sitting.</p>
        <p style="font-size: 14px; color: #3E3830; line-height: 1.7; margin: 0;">If you leave mid-questionnaire, your answers won't be saved and you'll need to start over. Your purchase will still be there waiting for you.</p>
      </div>

      <p style="font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #3D6B21; margin: 0 0 10px;">If you need to come back later</p>
      <p style="font-size: 15px; color: #3E3830; line-height: 1.8; margin: 0 0 28px;">Go to <a href="https://delphi.report" style="color: #3D6B21; text-decoration: underline;">delphi.report</a> and click <strong>Sign In</strong>. Enter the email you used to purchase and we'll send you a link — no password required. Once you're signed in, click <strong>New Report</strong> to get started.</p>

      ${!isUnlimited ? `
      <div style="background: #F2EDE6; border-radius: 6px; padding: 18px 22px; margin-bottom: 28px; border-left: 3px solid #C4BAB0;">
        <p style="font-size: 14px; font-weight: 700; color: #1C1C1A; margin: 0 0 6px;">Need to run more than one report?</p>
        <p style="font-size: 14px; color: #3E3830; line-height: 1.7; margin: 0;">Within 30 days of your purchase, you can upgrade to the unlimited annual plan for $200 — your $300 is credited toward it. After 30 days, the full $500 applies. To upgrade, sign in and click New Report.</p>
      </div>
      ` : ""}

      <p style="font-size: 13px; color: #7A7060; margin: 0; padding-top: 24px; border-top: 1px solid #E0D8CE;">
        Questions? Reach us at <a href="mailto:support@delphi.report" style="color: #3D6B21;">support@delphi.report</a>
      </p>

    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Delphi <analysis@email.delphi.report>",
      to: customerEmail,
      subject: "Your Delphi purchase is confirmed",
      html,
    }),
  });
}

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

      if (authToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
        if (!authError && user) {
          userId = user.id;
        }
      }

      if (!userId && customerEmail) {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(u => u.email === customerEmail);
        if (existing) {
          userId = existing.id;
        } else {
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

      if (customerEmail) {
        try {
          await sendConfirmationEmail(customerEmail, priceType);
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
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
