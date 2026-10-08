import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/xpAndBadges";

export async function GET() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      class: true,
      userBadges: {
        include: { badge: true },
      },
      submissions: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { quest: true },
      },
    },
  });

  if (!fullUser) {
    return NextResponse.json({ user: null });
  }

  const levelInfo = calculateLevel(fullUser.totalXp);

  return NextResponse.json({
    user: {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      avatar: fullUser.avatar,
      streak: fullUser.streak,
      totalXp: fullUser.totalXp,
      levelInfo,
      className: fullUser.class?.name ?? null,
      badges: fullUser.userBadges.map((ub) => ub.badge),
      recentSubmissions: fullUser.submissions,
    },
  });
}
