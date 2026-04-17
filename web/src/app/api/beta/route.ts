import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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
