import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

import { buildTrueNorthEmailWrapper, COLORS } from "../../../lib/email-templates";

const TIER_LABELS: Record<string, { name: string; emoji: string; benefits: string[] }> = {
  compass: {
    name: "Compass",
    emoji: "🧭",
    benefits: [
      "Unlimited daily reflections & journal entries",
      "Access to all Sacred Circles",
      "Priority personalized spiritual guidance",
      "Premium App Themes & Wallpapers",
    ],
  },
  true_north: {
    name: "True North",
    emoji: "⭐",
    benefits: [
      "Everything in Compass",
      "Advanced goal tracking & insights",
      "Monthly 1-on-1 wellness check-in",
      "Premium App Themes & Wallpapers",
    ],
  },
  zenith: {
    name: "Zenith",
    emoji: "✨",
    benefits: [
      "Everything in True North",
      "Dedicated psychologist sessions",
      "Custom spiritual care plan",
      "Premium App Themes & Wallpapers",
    ],
  },
};

function buildSubscriptionSuccessEmail(name: string, email: string, tier: string): string {
  const { dark, muted, gold, border, bg } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";
  const tierInfo = TIER_LABELS[tier] ?? { name: tier, emoji: "✨", benefits: ["Premium access unlocked", "Premium App Themes & Wallpapers"] };

  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:${dark};letter-spacing:-0.5px;text-align:center;">
      You're a ${tierInfo.name} member.
    </h1>
    <p style="margin:0 0 32px;font-size:15px;color:${muted};text-align:center;">
      Your journey just leveled up, ${displayName}.
    </p>

    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 32px;">
      Thank you for subscribing to <strong style="color:${dark};">True North ${tierInfo.name}</strong>. Your commitment to growth and spiritual clarity is something we don't take lightly.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${gold};">What's unlocked for you</p>
          ${tierInfo.benefits.map(b => `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr>
              <td style="width:28px;vertical-align:top;padding-top:2px;"><span style="color:${gold};font-size:16px;">✦</span></td>
              <td style="font-size:14px;color:${dark};line-height:1.6;">${b}</td>
            </tr>
          </table>`).join("")}
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1A1A;border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">🎨</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#FDFCFB;">Check out your new aesthetic</p>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;">
            As a subscriber, you can now open your Profile → Themes to unlock gorgeous new fonts, color palettes, and completely custom background wallpapers!
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Open True North →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">Questions? <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a></p>
  `;

  return buildTrueNorthEmailWrapper(`True North ${tierInfo.name}`, tierInfo.emoji, bodyHtml);
}

function buildPaymentFailedEmail(name: string, email: string): string {
  const { dark, muted, gold, border, bg } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:${dark};text-align:center;">
      A small hiccup, ${displayName}.
    </h1>
    <p style="margin:0 0 32px;font-size:15px;color:${muted};text-align:center;">
      We couldn't process your payment.
    </p>

    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      We weren't able to renew your True North subscription — this is usually a card issue. Your access is still active for now, but please update your payment method to avoid any interruption.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8EC;border:1px solid #F0D89A;border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${dark};">What to do:</p>
          <p style="margin:0 0 6px;font-size:14px;color:${muted};">1. Open True North on your device</p>
          <p style="margin:0 0 6px;font-size:14px;color:${muted};">2. Go to Settings → Subscription</p>
          <p style="margin:0;font-size:14px;color:${muted};">3. Update your payment method</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Update Payment →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">Need help? <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a></p>
  `;

  return buildTrueNorthEmailWrapper("Payment Issue", "⚠️", bodyHtml);
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
        from: "True North <admin@truenorth.you>",
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
