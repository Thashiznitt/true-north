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
    const { email, theme, message } = await req.json();

    if (!theme || !message) {
      return NextResponse.json(
        { error: "Theme and message are required" },
        { status: 400 }
      );
    }

    const feedback = await prisma.betaFeedback.create({
      data: {
        email: email || null,
        theme,
        message,
      },
    });

    if (resend) {
      const fbHtml = `
<div style="font-family: -apple-system, sans-serif; background-color: #FAFAFA; padding: 20px;">
  <div style="background-color: #FFFFFF; border-radius: 8px; padding: 24px; border-left: 4px solid #D4AF37;">
    <h3 style="margin-top: 0; color: #111111;">New Beta Tester Feedback</h3>
    <ul style="list-style: none; padding: 0; color: #4A4A4A; font-size: 15px; margin-bottom: 20px;">
      <li style="margin-bottom: 12px;"><strong>Theme:</strong> ${theme}</li>
      <li style="margin-bottom: 12px;"><strong>User Email:</strong> ${email || "Anonymous"}</li>
      <li style="margin-bottom: 12px;"><strong>Date:</strong> ${new Date().toUTCString()}</li>
    </ul>
    <div style="background-color: #F5F5F5; padding: 16px; border-radius: 6px;">
      <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.5; white-space: pre-wrap;">${message}</p>
    </div>
  </div>
</div>`;

      await resend.emails.send({
        from: "True North <system@truenorth.you>",
        to: "remyngatia@gmail.com",
        subject: "💡 True North Feedback: " + theme,
        html: fbHtml,
      });
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Critical API Error in /feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
