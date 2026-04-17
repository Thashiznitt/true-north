import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

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

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Critical API Error in /feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
