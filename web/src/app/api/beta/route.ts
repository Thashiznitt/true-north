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
