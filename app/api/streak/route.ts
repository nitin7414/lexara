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
      include: {
        streak: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Streak values
    const currentStreak = user.streak?.currentStreak || 0;
    const longestStreak = user.streak?.longestStreak || 0;
    const totalDays = user.streak?.totalDaysCompleted || 0;

    // 2. Total words learned (excluding battle-session)
    const totalWords = await prisma.userProgress.count({
      where: {
        userId: user.id,
        stage: "TESTED",
        NOT: {
          wordId: "battle-session",
        },
      },
    });

    // 2b. Battle Wins & Losses
    const battleWins = await prisma.userProgress.count({
      where: {
        userId: user.id,
        wordId: "battle-session",
        correct: true,
      },
    });

    const battleLosses = await prisma.userProgress.count({
      where: {
        userId: user.id,
        wordId: "battle-session",
        correct: false,
      },
    });

    // 3. Accuracy % (excluding battle-session)
    const progressRecords = await prisma.userProgress.findMany({
      where: {
        userId: user.id,
        NOT: {
          wordId: "battle-session",
        },
      },
    });
    const totalAttempts = progressRecords.reduce((sum, p) => sum + p.attempts, 0);
    const totalCorrect = progressRecords.filter((p) => p.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

    // 3b. Total XP
    const totalXP = totalCorrect * 10 + battleWins * 50 + battleLosses * 10;

    // 3c. Global/Friend Rank
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: user.id },
          { friendId: user.id },
        ],
      },
    });
    const friendIds = friendships.map((f) =>
      f.userId === user.id ? f.friendId : f.userId
    );
    const candidateIds = [user.id, ...friendIds];

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const xpData = await Promise.all(
      candidateIds.map(async (id) => {
        const correctCount = await prisma.userProgress.count({
          where: {
            userId: id,
            correct: true,
            completedAt: {
              gte: startOfWeek,
            },
          },
        });
        return { id, xp: correctCount * 10 };
      })
    );

    xpData.sort((a, b) => b.xp - a.xp);
    const userRankIndex = xpData.findIndex((x) => x.id === user.id);
    const rank = userRankIndex !== -1 ? userRankIndex + 1 : 1;

    // 4. Last 14 Days History (boolean array for the calendar grid)
    // Index 0 is 13 days ago, Index 13 is today
    const last14Days: boolean[] = [];
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const startOfDay = new Date(now);
      startOfDay.setDate(now.getDate() - i);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      const count = await prisma.userProgress.count({
        where: {
          userId: user.id,
          stage: "TESTED",
          completedAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      last14Days.push(count > 0);
    }

    return NextResponse.json({
      name: user.name || user.email.split("@")[0],
      email: user.email,
      goal: user.goal,
      imageUrl: user.imageUrl,
      currentStreak,
      longestStreak,
      totalDays,
      totalWords,
      accuracy,
      last14Days,
      battleWins,
      totalXP,
      rank,
    });
  } catch (error) {
    console.error("Error in GET /api/streak:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
