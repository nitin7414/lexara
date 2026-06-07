import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine the active WordPack
    let wordPack = null;

    if (user.organizationId) {
      wordPack = await prisma.wordPack.findFirst({
        where: { organizationId: user.organizationId },
      });
    }

    if (!wordPack) {
      wordPack = await prisma.wordPack.findFirst({
        where: {
          goal: user.goal || "ACADEMIC",
          isDefault: true,
        },
      });
    }

    // Fallback if no specific pack found
    if (!wordPack) {
      wordPack = await prisma.wordPack.findFirst();
    }

    if (!wordPack) {
      return NextResponse.json({ words: [] });
    }

    // Check words completed today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const progressToday = await prisma.userProgress.findMany({
      where: {
        userId: user.id,
        stage: "TESTED",
        completedAt: {
          gte: startOfToday,
        },
      },
      select: { wordId: true },
    });

    if (progressToday.length >= 5) {
      return NextResponse.json({ alreadyCompleted: true });
    }

    const completedWordIds = progressToday.map((p) => p.wordId);

    // Fetch up to 5 words from the pack that the user hasn't tested today
    let dailyWords = await prisma.word.findMany({
      where: {
        wordPackId: wordPack.id,
        id: { notIn: completedWordIds },
      },
      take: 5,
    });

    // If we have fewer than 5 words because of the filter, fill it up with other words in the pack
    if (dailyWords.length < 5) {
      const needed = 5 - dailyWords.length;
      const additionalWords = await prisma.word.findMany({
        where: {
          wordPackId: wordPack.id,
          id: {
            notIn: [...completedWordIds, ...dailyWords.map((w) => w.id)],
          },
        },
        take: needed,
      });
      dailyWords = [...dailyWords, ...additionalWords];
    }

    return NextResponse.json({
      words: dailyWords,
      goal: user.goal,
    });
  } catch (error) {
    console.error("Error in GET /api/words:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
