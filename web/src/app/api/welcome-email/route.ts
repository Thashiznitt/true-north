import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildWelcomeEmail(name: string, email: string): string {
  const gold = "#C8A95A";
  const dark = "#111111";
  const muted = "#666666";
  const bg = "#FDFCFB";
  const card = "#FFFFFF";
  const border = "#E5E5EA";
  const displayName = name && name !== "Sacred Voyager" ? name.split(" ")[0] : "Explorer";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to True North</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:${dark};padding:48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${gold};">True North</p>
              <h1 style="margin:0 0 12px;font-size:32px;font-weight:700;color:#FDFCFB;letter-spacing:-0.5px;line-height:1.2;">
                Welcome, ${displayName}.
              </h1>
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;">
                Your digital sanctuary for reflection,<br/>growth, and spiritual clarity.
              </p>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr><td style="height:4px;background:linear-gradient(90deg, ${gold}, #E8C97A, ${gold});"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px;">

              <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 32px;">
                You've taken the first step toward something meaningful. True North is here to walk alongside you — offering guided reflection, goal alignment, and a community that cares.
              </p>

              <!-- What's inside card -->
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
                        <td style="padding:12px 0;border-bottom:1px solid ${border};">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${dark};">🕊️ &nbsp;Spiritual Clarity</p>
                          <p style="margin:4px 0 0;font-size:13px;color:${muted};">Tools designed around your faith and beliefs</p>
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

              <!-- Download links -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding-right:8px;width:50%;">
                    <a href="https://play.google.com/store/apps/details?id=com.truenorth.app" style="display:block;background:${dark};color:#FDFCFB;font-size:13px;font-weight:600;padding:14px 20px;border-radius:12px;text-decoration:none;text-align:center;">
                      📱 Google Play
                    </a>
                  </td>
                  <td style="padding-left:8px;width:50%;">
                    <a href="https://apps.apple.com/app/true-north/id6759246707" style="display:block;background:${dark};color:#FDFCFB;font-size:13px;font-weight:600;padding:14px 20px;border-radius:12px;text-decoration:none;text-align:center;">
                      🍏 App Store
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">
                Questions? Reach us at <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a> — we're always here.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${bg};border-top:1px solid ${border};padding:24px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${dark};letter-spacing:0.1em;">TRUE NORTH</p>
              <p style="margin:0;font-size:11px;color:${muted};">Your Digital Sanctuary &nbsp;·&nbsp; truenorth.you &nbsp;·&nbsp; admin@truenorth.you</p>
              <p style="margin:12px 0 0;font-size:10px;color:#AAAAAA;">
                You're receiving this because you created an account at True North.<br/>
                &copy; ${new Date().getFullYear()} True North. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
      from: "True North <onboarding@resend.dev>",
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
