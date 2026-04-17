import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let prisma: PrismaClient;

export async function POST(req: NextRequest) {
  if (!prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  try {
    const { email, platform } = await req.json();

    if (!email || !platform) {
      return NextResponse.json(
        { error: "Email and platform are required" },
        { status: 400 }
      );
    }

    const tester = await prisma.betaTester.create({
      data: {
        email,
        platform,
      },
    });

    if (resend) {
      const emailHtml = `
<div align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; padding: 40px 0;">
  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); margin: 0 auto; text-align: left;">
    <tr>
      <td style="background-color: #111111; padding: 40px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 2px;">TRUE NORTH</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 48px 40px;">
        <h2 style="color: #111111; font-size: 24px; margin-top: 0; margin-bottom: 24px; font-weight: 600;">Welcome to the Inner Circle.</h2>
        <p style="color: #4A4A4A; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Thank you for joining the True North Beta Waitlist. You are among the visionary few chosen to experience the earliest iteration of our sanctuary.</p>
        <p style="color: #4A4A4A; font-size: 16px; line-height: 1.6; margin-bottom: 24px;"><strong>What is True North?</strong></p>
        <p style="color: #4A4A4A; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">True North is not just an application; it is a spiritual compass engineered to block out the noise of the modern world. We intertwine daily, deeply personalized affirmations with structured journaling and community reflection, empowering you to align your soul with your highest purpose regardless of your chosen faith path.</p>
        <p style="color: #4A4A4A; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">As a beta tester, your feedback will directly sculpt the architecture of this sacred space before we launch to the public. Keep a close eye on your inbox—your exclusive download link will be arriving soon.</p>
        <div style="text-align: center; margin: 40px 0;">
          <span style="background-color: #D4AF37; color: #FFFFFF; padding: 16px 32px; border-radius: 30px; font-size: 16px; font-weight: bold; letter-spacing: 1px; display: inline-block;">YOUR JOURNEY BEGINS SOON</span>
        </div>
        <div style="background-color: #FAFAFA; border: 1px solid #EEEEEE; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 40px;">
          <p style="color: #4A4A4A; font-size: 15px; margin-top: 0; margin-bottom: 16px;">Your voice dictates the structure of this sanctuary. Spot a bug or have an idea?</p>
          <a href="https://www.truenorth.you/feedback?email=${encodeURIComponent(email)}" style="color: #D4AF37; font-weight: 600; text-decoration: none; font-size: 15px;">Share Your Feedback →</a>
        </div>
        <p style="color: #888888; font-size: 15px; margin-bottom: 0;">With profound gratitude,<br/><strong>The True North Team</strong></p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #FAFAFA; padding: 32px 40px; text-align: center; border-top: 1px solid #EEEEEE;">
        <p style="color: #AAAAAA; font-size: 13px; margin: 0; line-height: 1.5;">© 2026 True North.<br/>Designed to guide you home.</p>
      </td>
    </tr>
  </table>
</div>`;

      await resend.emails.send({
        from: "True North <steve@truenorth.you>",
        to: email,
        subject: "Welcome to the True North Beta.",
        html: emailHtml,
      });
    }

    return NextResponse.json({ success: true, tester });
  } catch (error: any) {
    console.error("Critical API Error in /beta:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to join beta." },
      { status: 500 }
    );
  }
}
