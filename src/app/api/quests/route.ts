import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const classId = searchParams.get("classId");

    const currentUser = await getCurrentUser();

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (classId) {
      where.OR = [{ classId: null }, { classId: classId }];
    }

    const quests = await prisma.quest.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: {
        createdBy: {
          select: { name: true, role: true },
        },
      },
    });

    // Check today's completions for current student (for daily cap)
    let completedTodayQuestIds = new Set<string>();
    if (currentUser?.role === "STUDENT") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todaySubmissions = await prisma.submission.findMany({
        where: {
          studentId: currentUser.id,
          createdAt: { gte: startOfDay },
          status: { in: ["APPROVED", "PENDING"] },
        },
        select: { questId: true },
      });

      completedTodayQuestIds = new Set(todaySubmissions.map((s) => s.questId));
    }

    const questsWithStatus = quests.map((q) => ({
      ...q,
      completedToday: completedTodayQuestIds.has(q.id),
    }));

    return NextResponse.json({ quests: questsWithStatus });
  } catch (error) {
    console.error("Error fetching quests:", error);
    return NextResponse.json({ error: "Failed to fetch quests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, category, xpReward, impactType, impactAmount, impactUnit, isHighValue, dailyLimit, classId } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required quest fields" }, { status: 400 });
    }

    const quest = await prisma.quest.create({
      data: {
        title,
        description,
        category,
        xpReward: Number(xpReward) || 40,
        impactType: impactType || "waste_kg",
        impactAmount: Number(impactAmount) || 1.0,
        impactUnit: impactUnit || "kg",
        isHighValue: Boolean(isHighValue),
        dailyLimit: Number(dailyLimit) || 1,
        classId: classId || user.classId || null,
        createdById: user.id,
      },
    });

    return NextResponse.json({ success: true, quest });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json({ error: "Failed to create quest" }, { status: 500 });
  }
}
