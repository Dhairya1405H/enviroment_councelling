import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/xpAndBadges";

export async function GET() {
  try {
    // 1. Class vs Class rankings
    const classes = await prisma.class.findMany({
      include: {
        students: {
          select: { id: true, totalXp: true },
        },
      },
    });

    const classRankings = classes.map((c) => {
      const studentCount = c.students.length || 1;
      const totalXp = c.students.reduce((sum, s) => sum + s.totalXp, 0);
      const avgXp = Math.round(totalXp / studentCount);
      return {
        id: c.id,
        name: c.name,
        grade: c.grade,
        studentCount: c.students.length,
        totalXp,
        avgXp,
      };
    }).sort((a, b) => b.totalXp - a.totalXp);

    // 2. School-wide top students
    const topStudents = await prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { totalXp: "desc" },
      take: 15,
      include: {
        class: { select: { name: true } },
      },
    });

    const studentRankings = topStudents.map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      avatar: s.avatar,
      className: s.class?.name || "Independent",
      totalXp: s.totalXp,
      streak: s.streak,
      level: calculateLevel(s.totalXp).level,
    }));

    // 3. School Team Goals
    const targets = await prisma.target.findMany();

    return NextResponse.json({
      classRankings,
      studentRankings,
      targets,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboards" }, { status: 500 });
  }
}
