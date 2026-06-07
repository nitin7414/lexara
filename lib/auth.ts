import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      streak: true,
    },
  });

  if (!user) {
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.lexara.com`;
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
        
        user = await prisma.user.upsert({
          where: { clerkId: userId },
          update: {},
          create: {
            clerkId: userId,
            email: email,
            name: name,
            imageUrl: clerkUser.imageUrl || null,
            role: "INDEPENDENT",
            streak: {
              create: {
                currentStreak: 0,
                longestStreak: 0,
                totalDaysCompleted: 0,
              },
            },
          },
          include: {
            streak: true,
          },
        });
      }
    } catch (error) {
      console.error("Error auto-syncing Clerk user to database:", error);
    }
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}
