import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Goal } from "@prisma/client";

export async function POST(req: Request) {
  return handleOnboarding(req);
}

export async function PATCH(req: Request) {
  return handleOnboarding(req);
}

async function handleOnboarding(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { goal } = body;

    if (!goal || !Object.values(Goal).includes(goal as Goal)) {
      return NextResponse.json({ error: "Invalid goal specified" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { goal: goal as Goal },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error in onboarding API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
