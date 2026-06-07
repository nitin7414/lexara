import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface WordResult {
  wordId: string;
  correct: boolean;
  attempts: number;
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        streak: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { results } = body as { results: WordResult[] };

    if (!results || !Array.isArray(results)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const now = new Date();

    // 1. Update UserProgress for each word
    for (const res of results) {
      await prisma.userProgress.upsert({
        where: {
          userId_wordId: {
            userId: user.id,
            wordId: res.wordId,
          },
        },
        update: {
          stage: "TESTED",
          correct: res.correct,
          attempts: { increment: res.attempts },
          completedAt: now,
        },
        create: {
          userId: user.id,
          wordId: res.wordId,
          stage: "TESTED",
          correct: res.correct,
          attempts: res.attempts,
          completedAt: now,
        },
      });
    }

    // 2. Update UserStreak
    let currentStreak = 1;
    let longestStreak = 1;
    let totalDaysCompleted = 1;
    let shouldIncrementTotalDays = true;

    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

    if (user.streak) {
      const lastCompletedAt = user.streak.lastCompletedAt;
      longestStreak = user.streak.longestStreak;
      totalDaysCompleted = user.streak.totalDaysCompleted;

      if (lastCompletedAt) {
        const lastCompletedTime = new Date(lastCompletedAt);

        if (lastCompletedTime >= todayMidnight) {
          // Completed today already. Keep current streak, don't increment total days again.
          currentStreak = user.streak.currentStreak;
          shouldIncrementTotalDays = false;
        } else if (lastCompletedTime >= yesterdayMidnight && lastCompletedTime < todayMidnight) {
          // Completed yesterday. Increment streak by 1.
          currentStreak = user.streak.currentStreak + 1;
        } else {
          // Gap of > 1 day. Reset streak to 1.
          currentStreak = 1;
        }
      } else {
        // First completion ever.
        currentStreak = 1;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      if (shouldIncrementTotalDays) {
        totalDaysCompleted += 1;
      }

      await prisma.userStreak.update({
        where: { userId: user.id },
        data: {
          currentStreak,
          longestStreak,
          totalDaysCompleted,
          lastCompletedAt: now,
        },
      });
    } else {
      // Create user streak if it somehow doesn't exist
      await prisma.userStreak.create({
        data: {
          userId: user.id,
          currentStreak: 1,
          longestStreak: 1,
          totalDaysCompleted: 1,
          lastCompletedAt: now,
        },
      });
    }

    return NextResponse.json({
      success: true,
      currentStreak,
      longestStreak,
    });
  } catch (error) {
    console.error("Error in POST /api/streak/update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
