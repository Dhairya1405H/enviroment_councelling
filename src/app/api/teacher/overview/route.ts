import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { calculateLevel } from "@/lib/xpAndBadges";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Default to teacher's class or Grade 7
    let classId = user.classId;
    if (!classId) {
      const cls = await prisma.class.findFirst();
      classId = cls?.id || null;
    }

    const currentClass = await prisma.class.findUnique({
      where: { id: classId! },
      include: {
        students: {
          include: {
            submissions: {
              where: { status: "APPROVED" },
              take: 5,
            },
          },
        },
      },
    });

    if (!currentClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const students = currentClass.students;
    const totalStudents = students.length;

    // Active students: streak > 0 or has submissions in past 7 days
    const activeStudents = students.filter((s) => s.streak >= 2);
    const inactiveStudents = students.filter((s) => s.streak < 2);

    const participationRate = totalStudents > 0 ? Math.round((activeStudents.length / totalStudents) * 100) : 0;

    const studentStats = students.map((s) => ({
      id: s.id,
      name: s.name,
      avatar: s.avatar,
      streak: s.streak,
      totalXp: s.totalXp,
      level: calculateLevel(s.totalXp).level,
      isInactive: s.streak < 2,
    })).sort((a, b) => b.totalXp - a.totalXp);

    return NextResponse.json({
      className: currentClass.name,
      grade: currentClass.grade,
      totalStudents,
      participationRate,
      activeCount: activeStudents.length,
      inactiveCount: inactiveStudents.length,
      students: studentStats,
    });
  } catch (error) {
    console.error("Overview error:", error);
    return NextResponse.json({ error: "Failed to load class overview" }, { status: 500 });
  }
}
