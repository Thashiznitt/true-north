import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

import { buildTrueNorthEmailWrapper, COLORS } from "../../../lib/email-templates";

function buildWelcomeEmail(name: string, email: string): string {
  const { dark, muted, gold, border, bg } = COLORS;
  const displayName = name && name !== "Sacred Voyager" ? name.split(" ")[0] : "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Welcome to True North. We are a digital sanctuary designed to gently align your daily routines, spiritual growth, and community connections. We're here to hold space for what matters most.
    </p>

    <!-- App Features -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${gold};">What's inside</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid ${border};">
                <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">🌿 &nbsp;Daily Reflections</p>
                <p style="margin:4px 0 0;font-size:13px;color:${muted};">Guided prompts to keep you grounded every day</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid ${border};">
                <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">🧭 &nbsp;Goal Alignment</p>
                <p style="margin:4px 0 0;font-size:13px;color:${muted};">Set and track your most important life goals</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;">
                <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">🤝 &nbsp;Sacred Circles</p>
                <p style="margin:4px 0 0;font-size:13px;color:${muted};">Join communities that share your values</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="font-size:16px;line-height:1.8;color:${dark};margin:0 0 16px;font-weight:700;">
      Unlock Your Journey
    </p>
    <p style="font-size:14px;line-height:1.6;color:${muted};margin:0 0 24px;">
      Everyone's path is different. You can upgrade at any time right from your profile inside the app.
    </p>

    <!-- Tiers Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;overflow:hidden;">
      <tr>
        <td style="padding:20px;border-bottom:1px solid ${border};">
          <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">Free Tier</p>
          <p style="margin:4px 0 0;font-size:13px;color:${muted};">Ad-supported daily affirmations and limited circle access.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;border-bottom:1px solid ${border};">
          <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">Compass 🧭</p>
          <p style="margin:4px 0 0;font-size:13px;color:${muted};">Unlimited private journaling, standard spiritual guidance, and broader circle access.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;border-bottom:1px solid ${border};">
          <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">True North ⭐</p>
          <p style="margin:4px 0 0;font-size:13px;color:${muted};">Unlimited community engagement, personalized spiritual intelligence guidance, and circle creation abilities.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;background:#F9F6ED;">
          <p style="margin:0;font-size:14px;font-weight:700;color:${gold};">Zenith ✨</p>
          <p style="margin:4px 0 0;font-size:13px;color:${muted};">The elite experience. Custom care plans, plus invitations to monthly community impact drives and exclusive True North merchandise.</p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;letter-spacing:0.02em;">
            Open True North →
          </a>
        </td>
      </tr>
    </table>
  `;

  return buildTrueNorthEmailWrapper(`Welcome, ${displayName}.`, null, bodyHtml);
}

export async function POST(request: NextRequest) {
  try {
    // Supabase webhook sends the inserted row as `record`
    const body = await request.json();
    const record = body.record ?? body; // support both webhook format and direct call

    const email: string = record.email;
    const username: string = record.username ?? "Explorer";

    if (!email || email.includes("@rescued-profile.local")) {
      return NextResponse.json({ skipped: true, reason: "No valid email" });
    }

    const { error } = await resend.emails.send({
      from: "True North <admin@truenorth.you>",
      to: [email],
      subject: `Welcome to True North, ${username.split(" ")[0]} 🧭`,
      html: buildWelcomeEmail(username, email),
    });

    if (error) {
      console.error("Resend welcome email error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sentTo: email });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
