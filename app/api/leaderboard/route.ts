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

    // Fetch friendships
    let friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: user.id },
          { friendId: user.id }
        ]
      }
    });

    // Auto-create friendships with seeded dummy friends if none exist
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

    const friendIds = friendships.map((f) =>
      f.userId === user.id ? f.friendId : f.userId
    );
    const candidateIds = [user.id, ...friendIds];

    const candidates = await prisma.user.findMany({
      where: { id: { in: candidateIds } },
      include: {
        streak: true,
      },
    });

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const leaderboardData = await Promise.all(
      candidates.map(async (u) => {
        const correctCount = await prisma.userProgress.count({
          where: {
            userId: u.id,
            correct: true,
            completedAt: {
              gte: startOfWeek,
            },
          },
        });

        return {
          id: u.id,
          clerkId: u.clerkId,
          name: u.name || u.email.split("@")[0],
          imageUrl: u.imageUrl,
          streak: u.streak?.currentStreak || 0,
          weeklyXP: correctCount * 10,
        };
      })
    );

    // Sort by weeklyXP descending, tie breaker is streak descending
    leaderboardData.sort((a, b) => {
      if (b.weeklyXP !== a.weeklyXP) {
        return b.weeklyXP - a.weeklyXP;
      }
      return b.streak - a.streak;
    });

    return NextResponse.json({
      leaderboard: leaderboardData,
      currentUserId: user.id,
      currentUserClerkId: user.clerkId,
    });
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
