import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TIER_LABELS: Record<string, { name: string; emoji: string; benefits: string[] }> = {
  compass: {
    name: "Compass",
    emoji: "🧭",
    benefits: [
      "Unlimited daily reflections & journal entries",
      "Access to all Sacred Circles",
      "Priority Nur AI responses",
    ],
  },
  true_north: {
    name: "True North",
    emoji: "⭐",
    benefits: [
      "Everything in Compass",
      "Advanced goal tracking & insights",
      "Monthly 1-on-1 wellness check-in",
    ],
  },
  zenith: {
    name: "Zenith",
    emoji: "✨",
    benefits: [
      "Everything in True North",
      "Dedicated psychologist sessions",
      "Custom spiritual care plan",
    ],
  },
};

function buildSubscriptionSuccessEmail(name: string, email: string, tier: string): string {
  const gold = "#C8A95A";
  const dark = "#111111";
  const muted = "#666666";
  const bg = "#FDFCFB";
  const card = "#FFFFFF";
  const border = "#E5E5EA";
  const displayName = name?.split(" ")[0] || "Explorer";
  const tierInfo = TIER_LABELS[tier] ?? { name: tier, emoji: "✨", benefits: ["Premium access unlocked"] };

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Welcome to True North ${tierInfo.name}</title></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:${dark};padding:48px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${gold};">True North</p>
    <p style="margin:0 0 10px;font-size:40px;">${tierInfo.emoji}</p>
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#FDFCFB;letter-spacing:-0.5px;">You're a ${tierInfo.name} member.</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">Your journey just levelled up, ${displayName}.</p>
  </td></tr>
  <tr><td style="height:4px;background:${gold};"></td></tr>
  <tr><td style="padding:48px;">
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 32px;">
      Thank you for subscribing to <strong style="color:${dark};">True North ${tierInfo.name}</strong>. Your commitment to growth and spiritual clarity is something we don't take lightly.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${gold};">What's unlocked for you</p>
        ${tierInfo.benefits.map(b => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
          <tr>
            <td style="width:28px;vertical-align:top;padding-top:2px;"><span style="color:${gold};font-size:16px;">✦</span></td>
            <td style="font-size:14px;color:${dark};line-height:1.6;">${b}</td>
          </tr>
        </table>`).join("")}
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td align="center">
        <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
          Open True North →
        </a>
      </td></tr>
    </table>
    <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">Questions? <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a></p>
  </td></tr>
  <tr><td style="background:${bg};border-top:1px solid ${border};padding:24px 48px;text-align:center;">
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${dark};letter-spacing:0.1em;">TRUE NORTH</p>
    <p style="margin:0;font-size:11px;color:${muted};">Your Digital Sanctuary · truenorth.you</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

function buildPaymentFailedEmail(name: string, email: string): string {
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
      We weren't able to renew your True North subscription — this is usually a card issue. Your access is still active for now, but please update your payment method to avoid any interruption.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8EC;border:1px solid #F0D89A;border-radius:16px;margin-bottom:32px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${dark};">What to do:</p>
        <p style="margin:0 0 6px;font-size:14px;color:${muted};">1. Open True North on your device</p>
        <p style="margin:0 0 6px;font-size:14px;color:${muted};">2. Go to Settings → Subscription</p>
        <p style="margin:0;font-size:14px;color:${muted};">3. Update your payment method</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td align="center">
        <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
          Update Payment →
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

// Supabase webhook on users UPDATE
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Supabase sends { record, old_record } on UPDATE
    const record = body.record;
    const oldRecord = body.old_record;

    if (!record || !oldRecord) {
      return NextResponse.json({ skipped: true, reason: "Not a valid webhook payload" });
    }

    const newTier: string = record.subscription_tier;
    const oldTier: string = oldRecord.subscription_tier;
    const email: string = record.email;
    const username: string = record.username ?? "Explorer";

    // Only act if tier actually changed
    if (newTier === oldTier) {
      return NextResponse.json({ skipped: true, reason: "Tier unchanged" });
    }

    if (!email || email.includes("@rescued-profile.local")) {
      return NextResponse.json({ skipped: true, reason: "No valid email" });
    }

    const isPaidTier = ["compass", "true_north", "zenith"].includes(newTier);

    if (isPaidTier) {
      const html = buildSubscriptionSuccessEmail(username, email, newTier);
      await resend.emails.send({
        from: "True North <onboarding@resend.dev>",
        to: [email],
        subject: `You're a True North ${TIER_LABELS[newTier]?.name ?? newTier} member ${TIER_LABELS[newTier]?.emoji ?? "✨"}`,
        html,
      });
    }

    return NextResponse.json({ success: true, tier: newTier, sentTo: email });
  } catch (err) {
    console.error("Subscription email error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
