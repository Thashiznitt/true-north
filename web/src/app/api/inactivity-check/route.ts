import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildReengagementEmail(name: string, daysSince: number): string {
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
<title>We've been thinking about you</title></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:${dark};padding:48px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${gold};">True North</p>
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#FDFCFB;">We've been thinking about you, ${displayName}.</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">It's been ${daysSince} days since your last reflection.</p>
  </td></tr>
  <tr><td style="height:4px;background:${gold};"></td></tr>
  <tr><td style="padding:48px;">
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Life gets busy — we understand. But even a few quiet minutes of reflection can shift your entire day. Your sanctuary is still here, waiting.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:${gold};letter-spacing:0.1em;text-transform:uppercase;">Pick up where you left off</p>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${dark};">📖 &nbsp;Write a journal entry</td>
        </tr><tr>
          <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${dark};">🤖 &nbsp;Ask Nur something on your mind</td>
        </tr><tr>
          <td style="padding:10px 0;font-size:14px;color:${dark};">🌿 &nbsp;Check in with your goals</td>
        </tr></table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td align="center">
        <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
          Return to Your Sanctuary →
        </a>
      </td></tr>
    </table>
    <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">Questions? <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a></p>
  </td></tr>
  <tr><td style="background:${bg};border-top:1px solid ${border};padding:24px 48px;text-align:center;">
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${dark};letter-spacing:0.1em;">TRUE NORTH</p>
    <p style="margin:0;font-size:11px;color:${muted};">Your Digital Sanctuary · truenorth.you</p>
    <p style="margin:8px 0 0;font-size:10px;color:#AAAAAA;">You're getting this because you haven't journalled recently. <a href="https://www.truenorth.you" style="color:#AAAAAA;">Manage preferences</a></p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

function buildCirclesNudgeEmail(name: string): string {
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
<title>Find your Circle on True North</title></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:${dark};padding:48px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${gold};">True North</p>
    <p style="margin:0 0 10px;font-size:36px;">🤝</p>
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#FDFCFB;">You haven't found your Circle yet, ${displayName}.</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">Community makes the journey richer.</p>
  </td></tr>
  <tr><td style="height:4px;background:${gold};"></td></tr>
  <tr><td style="padding:48px;">
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Sacred Circles are small, intentional communities of people walking similar paths. Whether it's faith, wellness, career, or family — there's a Circle for you.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:${gold};letter-spacing:0.1em;text-transform:uppercase;">Why join a Circle?</p>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${dark};">🧭 &nbsp;Share reflections with like-minded people</td>
        </tr><tr>
          <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:14px;color:${dark};">💬 &nbsp;Get encouragement on your journey</td>
        </tr><tr>
          <td style="padding:10px 0;font-size:14px;color:${dark};">🌟 &nbsp;Hold each other accountable to your goals</td>
        </tr></table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td align="center">
        <a href="https://www.truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
          Explore Circles →
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

// Called by Vercel cron job daily at 08:00 EAT (05:00 UTC)
export async function GET(request: NextRequest) {
  // Protect from public calls
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const now = new Date();
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let reengagementCount = 0;
  let circlesCount = 0;
  const errors: string[] = [];

  try {
    // ── Re-engagement: users with no journal entry in 4+ days ──────
    // Get all users who have notifications enabled
    const { data: activeUsers } = await supabase
      .from("users")
      .select("id, email, username, created_at");

    if (activeUsers) {
      for (const user of activeUsers) {
        if (!user.email || user.email.includes("@rescued-profile.local")) continue;

        // Check last journal entry
        const { data: recentJournal } = await supabase
          .from("journal_entries")
          .select("created_at")
          .eq("user_id", user.id)
          .gte("created_at", fourDaysAgo)
          .limit(1);

        const hasRecentJournal = recentJournal && recentJournal.length > 0;

        // Only nudge users older than 4 days (not brand new)
        const userCreatedAt = new Date(user.created_at);
        const isOldEnough = (now.getTime() - userCreatedAt.getTime()) > 4 * 24 * 60 * 60 * 1000;

        if (!hasRecentJournal && isOldEnough) {
          // Check we haven't sent a re-engagement email in the last 4 days
          const { data: recentEmailLog } = await supabase
            .from("email_logs")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", "inactivity")
            .gte("sent_at", fourDaysAgo)
            .limit(1);

          if (!recentEmailLog || recentEmailLog.length === 0) {
            // Get last journal for "days since" message
            const { data: lastJournal } = await supabase
              .from("journal_entries")
              .select("created_at")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1);

            const daysSince = lastJournal?.[0]
              ? Math.floor((now.getTime() - new Date(lastJournal[0].created_at).getTime()) / (1000 * 60 * 60 * 24))
              : Math.floor((now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));

            const { error } = await resend.emails.send({
              from: "True North <onboarding@resend.dev>",
              to: [user.email],
              subject: `We've been thinking about you, ${user.username?.split(" ")[0] ?? "Explorer"} 🌿`,
              html: buildReengagementEmail(user.username ?? "Explorer", daysSince),
            });

            if (!error) {
              await supabase.from("email_logs").insert({
                user_id: user.id,
                email_type: "inactivity",
              });
              reengagementCount++;
            } else {
              errors.push(`Re-engagement to ${user.email}: ${error.message}`);
            }
          }
        }

        // ── Circles nudge: joined 7+ days ago, no circle membership ─
        const isOldEnoughForCircles = (now.getTime() - userCreatedAt.getTime()) > 7 * 24 * 60 * 60 * 1000;

        if (isOldEnoughForCircles) {
          const { data: circleMembership } = await supabase
            .from("circle_members")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);

          const hasNoCircle = !circleMembership || circleMembership.length === 0;

          if (hasNoCircle) {
            const { data: circleEmailLog } = await supabase
              .from("email_logs")
              .select("id")
              .eq("user_id", user.id)
              .eq("email_type", "circles_nudge")
              .limit(1);

            // Only send circles nudge once ever
            if (!circleEmailLog || circleEmailLog.length === 0) {
              const { error } = await resend.emails.send({
                from: "True North <onboarding@resend.dev>",
                to: [user.email],
                subject: `Find your people on True North 🤝`,
                html: buildCirclesNudgeEmail(user.username ?? "Explorer"),
              });

              if (!error) {
                await supabase.from("email_logs").insert({
                  user_id: user.id,
                  email_type: "circles_nudge",
                });
                circlesCount++;
              } else {
                errors.push(`Circles nudge to ${user.email}: ${error.message}`);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      reengagementEmailsSent: reengagementCount,
      circlesNudgeEmailsSent: circlesCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Inactivity check error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
