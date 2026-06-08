import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Friendship } from "@prisma/client";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user with streak details
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        streak: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-create friendships with dummy friends if user has no friendships
    let friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: user.id },
          { friendId: user.id }
        ]
      }
    });

    if (friendships.length === 0) {
      const dummyUsers = await prisma.user.findMany({
        where: { clerkId: { in: ["dummy_duobird", "dummy_ankiflash", "dummy_lexischolar", "dummy_vocapro"] } }
      });
      for (const dummy of dummyUsers) {
        try {
          await prisma.friendship.upsert({
            where: {
              userId_friendId: {
                userId: user.id,
                friendId: dummy.id
              }
            },
            update: {},
            create: {
              userId: user.id,
              friendId: dummy.id
            }
          });
        } catch (e) {
          // Ignore unique constraint issues
        }
      }
      // Re-fetch friendships
      friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { userId: user.id },
            { friendId: user.id }
          ]
        }
      });
    }

    // 1. Streak
    const currentStreak = user.streak?.currentStreak || 0;

    // 2. Word count (words marked as TESTED)
    const totalWordsLearned = await prisma.userProgress.count({
      where: {
        userId: user.id,
        stage: "TESTED",
      },
    });

    // 3. Accuracy %
    const progressRecords = await prisma.userProgress.findMany({
      where: { userId: user.id },
    });
    const totalAttempts = progressRecords.reduce((sum, p) => sum + p.attempts, 0);
    const totalCorrect = progressRecords.filter((p) => p.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

    // 4. Rank among friends
    // Find all friend user IDs
    const friendIds = friendships.map((f: Friendship) =>
      f.userId === user.id ? f.friendId : f.userId
    );
    const candidateIds = [user.id, ...friendIds];

    // Fetch weekly XP for all candidates
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

    // Sort by XP descending
    xpData.sort((a, b) => b.xp - a.xp);
    const userRankIndex = xpData.findIndex((x) => x.id === user.id);
    const rank = userRankIndex !== -1 ? userRankIndex + 1 : 1;

    return NextResponse.json({
      streak: currentStreak,
      longestStreak: user.streak?.longestStreak || 0,
      wordCount: totalWordsLearned,
      rank,
      accuracy,
    });
  } catch (error) {
    console.error("Error in user stats API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
