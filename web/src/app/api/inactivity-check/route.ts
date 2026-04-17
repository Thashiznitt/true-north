import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

import {
  buildMaxFreeTierEmail,
  buildMissingJournalEmail,
  buildMissingCirclesEmail,
  buildMonthlyWallpaperEmail,
  buildGoalsRefreshEmail,
  buildGoalsReviewEmail,
  buildZenithDriveAnnouncementEmail,
  buildZenithDriveReminderEmail,
  buildNurAbsenceEmail
} from "@/lib/email-templates";

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
  let maxFreeCount = 0;
  let monthlyEmailsCount = 0;
  const errors: string[] = [];

  const dayOfMonth = now.getDate();
  const isFirstOfMonth = dayOfMonth === 1;
  const is25thOfMonth = dayOfMonth === 25;
  const isEndOfMonth = dayOfMonth >= 28 && now.getMonth() !== new Date(now.getTime() + 24 * 60 * 60 * 1000 * 3).getMonth(); // roughly end of month

  try {
    const { data: activeUsers } = await supabase
      .from("users")
      .select("id, email, username, created_at, subscription_tier");

    if (activeUsers) {
      for (const user of activeUsers) {
        if (!user.email || user.email.includes("@rescued-profile.local")) continue;

        const displayName = user.username ?? "Explorer";
        const isFree = user.subscription_tier === "free";
        const isZenith = user.subscription_tier === "zenith";
        
        const userCreatedAt = new Date(user.created_at);

        // 1. ZENITH & MONTHLY BROADCASTS
        // -------------------------------------------------------------
        if (isFirstOfMonth) {
           // Wallpaper Drop (All)
           await resend.emails.send({
             from: "True North <admin@truenorth.you>",
             to: [user.email],
             subject: `Your Monthly Sanctuary Wallpaper is Here 🎨`,
             html: buildMonthlyWallpaperEmail(displayName),
           });
           
           // Goals Refresh (All)
           await resend.emails.send({
             from: "True North <admin@truenorth.you>",
             to: [user.email],
             subject: `Reset your Compass this Month 🧭`,
             html: buildGoalsRefreshEmail(displayName),
           });
           
           // Zenith Drive Announce
           if (isZenith) {
             await resend.emails.send({
               from: "True North <admin@truenorth.you>",
               to: [user.email],
               subject: `Prepare: Zenith Community Drive on the 25th 🌍`,
               html: buildZenithDriveAnnouncementEmail(displayName),
             });
           }
           monthlyEmailsCount++;
        }

        if (is25thOfMonth && isZenith) {
           await resend.emails.send({
             from: "True North <admin@truenorth.you>",
             to: [user.email],
             subject: `Today is the Zenith Community Drive 🕊️`,
             html: buildZenithDriveReminderEmail(displayName),
           });
        }

        if (isEndOfMonth) {
           await resend.emails.send({
             from: "True North <admin@truenorth.you>",
             to: [user.email],
             subject: `Did you stay aligned this month? 🗓️`,
             html: buildGoalsReviewEmail(displayName),
           });
        }

        // 2. LIFECYCLE ENGAGEMENT
        // -------------------------------------------------------------
        const { data: recentJournal } = await supabase
          .from("journal_entries")
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        // Max Free Tier Check (5 entries)
        if (isFree && recentJournal && recentJournal.length >= 5) {
            const { data: maxFreeLog } = await supabase.from("email_logs").select("id").eq("user_id", user.id).eq("email_type", "max_free_tier").limit(1);
            if (!maxFreeLog || maxFreeLog.length === 0) {
                const { error } = await resend.emails.send({
                    from: "True North <admin@truenorth.you>",
                    to: [user.email],
                    subject: `You've reached your free reflection limit 🕯️`,
                    html: buildMaxFreeTierEmail(displayName),
                });
                if (!error) {
                    await supabase.from("email_logs").insert({ user_id: user.id, email_type: "max_free_tier" });
                    maxFreeCount++;
                }
            }
        }

        // Missing Journal Check (7 days)
        const hasRecentJournal = recentJournal && recentJournal.length > 0 && new Date(recentJournal[0].created_at).getTime() >= new Date(sevenDaysAgo).getTime();
        const isOldEnough7 = (now.getTime() - userCreatedAt.getTime()) > 7 * 24 * 60 * 60 * 1000;
        
        if (!hasRecentJournal && isOldEnough7) {
          const { data: recentEmailLog } = await supabase
            .from("email_logs")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", "missing_journal")
            .gte("sent_at", sevenDaysAgo)
            .limit(1);

          if (!recentEmailLog || recentEmailLog.length === 0) {
            const { error } = await resend.emails.send({
              from: "True North <admin@truenorth.you>",
              to: [user.email],
              subject: `We've been thinking about you, ${user.username?.split(" ")[0] ?? "Explorer"} 🌿`,
              html: buildMissingJournalEmail(displayName),
            });

            if (!error) {
              await supabase.from("email_logs").insert({ user_id: user.id, email_type: "missing_journal" });
              reengagementCount++;
            } else {
              errors.push(`Missing journal fail to ${user.email}: ${error.message}`);
            }
          }
        }

        // Missing Circles Check (Subscribed members only)
        if (!isFree && isOldEnough7) {
          const { data: circleMembership } = await supabase
            .from("circle_members")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);

          if (!circleMembership || circleMembership.length === 0) {
            const { data: circleEmailLog } = await supabase
              .from("email_logs")
              .select("id")
              .eq("user_id", user.id)
              .eq("email_type", "missing_circles")
              .limit(1);

            if (!circleEmailLog || circleEmailLog.length === 0) {
              const { error } = await resend.emails.send({
                from: "True North <admin@truenorth.you>",
                to: [user.email],
                subject: `Find your people on True North 🤝`,
                html: buildMissingCirclesEmail(displayName),
              });

              if (!error) {
                await supabase.from("email_logs").insert({ user_id: user.id, email_type: "missing_circles" });
                circlesCount++;
              } else {
                errors.push(`Circles nudge fail to ${user.email}: ${error.message}`);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      maxFreeEmailsSent: maxFreeCount,
      missingJournalEmailsSent: reengagementCount,
      missingCirclesSent: circlesCount,
      monthlyBroadcastsSent: monthlyEmailsCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Inactivity check error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
