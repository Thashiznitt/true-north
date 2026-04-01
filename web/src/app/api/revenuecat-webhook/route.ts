import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const RC_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

function buildPaymentFailedEmail(name: string): string {
  const gold = "#C8A95A";
  const dark = "#111111";
  const muted = "#666666";
  const bg = "#FDFCFB";
  const card = "#FFFFFF";
  const border = "#E5E5EA";
  const displayName = name?.split(" ")[0] || "Explorer";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Payment issue on your True North account</title></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:${dark};padding:48px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${gold};">True North</p>
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#FDFCFB;">A small hiccup, ${displayName}.</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">We couldn't process your payment.</p>
  </td></tr>
  <tr><td style="height:4px;background:${gold};"></td></tr>
  <tr><td style="padding:48px;">
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      We weren't able to renew your True North subscription. This is usually a card issue and easy to fix. Your access remains active for now — please update your payment method before the grace period ends.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8EC;border:1px solid #F0D89A;border-radius:16px;margin-bottom:32px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:${dark};">How to fix this:</p>
        <p style="margin:0 0 6px;font-size:14px;color:${muted};">1. Open True North on your device</p>
        <p style="margin:0 0 6px;font-size:14px;color:${muted};">2. Go to Settings → Subscription</p>
        <p style="margin:0;font-size:14px;color:${muted};">3. Update your payment method via the App Store / Play Store</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td align="center">
        <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
          Open True North →
        </a>
      </td></tr>
    </table>
    <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">Need help? <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a></p>
  </td></tr>
  <tr><td style="background:${bg};border-top:1px solid ${border};padding:24px 48px;text-align:center;">
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${dark};letter-spacing:0.1em;">TRUE NORTH</p>
    <p style="margin:0;font-size:11px;color:${muted};">Your Digital Sanctuary · truenorth.you</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify RevenueCat webhook secret
    const secret = request.headers.get("X-RC-Webhook-Secret") ?? request.headers.get("authorization");
    if (RC_WEBHOOK_SECRET && secret !== RC_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const eventType: string = body.event?.type;
    const appUserId: string = body.event?.app_user_id;

    if (!eventType || !appUserId) {
      return NextResponse.json({ skipped: true, reason: "Missing event type or user ID" });
    }

    // Only handle billing/expiry events
    if (!["BILLING_ISSUE", "EXPIRATION", "CANCELLATION"].includes(eventType)) {
      return NextResponse.json({ skipped: true, reason: `Event ${eventType} not handled` });
    }

    // Look up user email from Supabase by user ID
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: user } = await supabase
      .from("users")
      .select("email, username")
      .eq("id", appUserId)
      .single();

    if (!user?.email || user.email.includes("@rescued-profile.local")) {
      return NextResponse.json({ skipped: true, reason: "No valid email for user" });
    }

    if (eventType === "BILLING_ISSUE") {
      const html = buildPaymentFailedEmail(user.username ?? "Explorer");
      await resend.emails.send({
        from: "True North <onboarding@resend.dev>",
        to: [user.email],
        subject: "Action needed: payment issue on your True North account",
        html,
      });
    }

    return NextResponse.json({ success: true, event: eventType, sentTo: user.email });
  } catch (err) {
    console.error("RevenueCat webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
