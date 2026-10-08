import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IMPACT_FACTORS } from "@/lib/impactFactors";

export async function GET() {
  try {
    const approvedSubmissions = await prisma.submission.findMany({
      where: { status: "APPROVED" },
      include: {
        quest: true,
        student: {
          include: { class: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // 1. Calculate live aggregate metrics
    let totalWasteKg = 0;
    let totalWaterL = 0;
    let totalSaplings = 0;
    let totalCo2AvoidedKg = 0;

    const categoryBreakdown: Record<string, { count: number; xp: number; co2: number }> = {
      WASTE: { count: 0, xp: 0, co2: 0 },
      WATER: { count: 0, xp: 0, co2: 0 },
      ENERGY: { count: 0, xp: 0, co2: 0 },
      PLASTIC_FREE: { count: 0, xp: 0, co2: 0 },
      PLANTS: { count: 0, xp: 0, co2: 0 },
      TRANSPORT: { count: 0, xp: 0, co2: 0 },
    };

    const classStats: Record<string, { name: string; co2: number; waste: number; water: number; saplings: number; completions: number }> = {};

    approvedSubmissions.forEach((sub) => {
      const q = sub.quest;
      const cat = q.category;

      // Primary metrics
      if (cat === "WASTE") {
        totalWasteKg += q.impactAmount;
        totalCo2AvoidedKg += q.impactAmount * IMPACT_FACTORS.COMPOST_FOOD_WASTE.co2AvoidedKgPerUnit;
      } else if (cat === "WATER") {
        totalWaterL += q.impactAmount;
        totalCo2AvoidedKg += q.impactAmount * (IMPACT_FACTORS.WATER_CONSERVATION_TAP.co2AvoidedKgPerUnit / 24);
      } else if (cat === "PLANTS") {
        totalSaplings += q.impactAmount;
        totalCo2AvoidedKg += q.impactAmount * IMPACT_FACTORS.NATIVE_SAPLING_PLANTED.co2AvoidedKgPerUnit;
      } else if (cat === "ENERGY") {
        totalCo2AvoidedKg += q.impactAmount * IMPACT_FACTORS.ENERGY_PHANTOM_KILLER.co2AvoidedKgPerUnit;
      } else if (cat === "PLASTIC_FREE") {
        totalWasteKg += q.impactAmount * 0.03;
        totalCo2AvoidedKg += q.impactAmount * (IMPACT_FACTORS.SINGLE_USE_PLASTIC_AVOIDED.co2AvoidedKgPerUnit / 3);
      } else if (cat === "TRANSPORT") {
        totalCo2AvoidedKg += q.impactAmount * (IMPACT_FACTORS.ACTIVE_GREEN_COMMUTE.co2AvoidedKgPerUnit / 3.2);
      }

      if (categoryBreakdown[cat]) {
        categoryBreakdown[cat].count += 1;
        categoryBreakdown[cat].xp += q.xpReward;
        categoryBreakdown[cat].co2 += Number((q.impactAmount * 0.5).toFixed(1));
      }

      // Class stats
      const className = sub.student.class?.name || "Independent";
      if (!classStats[className]) {
        classStats[className] = { name: className, co2: 0, waste: 0, water: 0, saplings: 0, completions: 0 };
      }
      classStats[className].completions += 1;
      if (cat === "WASTE") classStats[className].waste += q.impactAmount;
      if (cat === "WATER") classStats[className].water += q.impactAmount;
      if (cat === "PLANTS") classStats[className].saplings += q.impactAmount;
      classStats[className].co2 += Number((q.impactAmount * 0.4).toFixed(1));
    });

    // 2. 30-Day Trend Generator (grouping by date)
    const thirtyDaysMap: Record<string, { date: string; waste: number; water: number; co2: number; completions: number }> = {};
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(5, 10); // MM-DD
      thirtyDaysMap[key] = { date: key, waste: 0, water: 0, co2: 0, completions: 0 };
    }

    let runningCo2 = 0;
    let runningWaste = 0;
    let runningWater = 0;

    approvedSubmissions.forEach((sub) => {
      const key = sub.createdAt.toISOString().slice(5, 10);
      if (thirtyDaysMap[key]) {
        thirtyDaysMap[key].completions += 1;
        if (sub.quest.category === "WASTE") thirtyDaysMap[key].waste += sub.quest.impactAmount;
        if (sub.quest.category === "WATER") thirtyDaysMap[key].water += sub.quest.impactAmount;
      }
    });

    // Make cumulative for trend chart
    const trendData = Object.values(thirtyDaysMap).map((item) => {
      runningWaste += item.waste;
      runningWater += item.water;
      runningCo2 += item.completions * 0.8;
      return {
        date: item.date,
        wasteKg: Number(runningWaste.toFixed(1)),
        waterL: Number(runningWater.toFixed(0)),
        co2AvoidedKg: Number(runningCo2.toFixed(1)),
        dailyCompletions: item.completions,
      };
    });

    // Targets
    const targets = await prisma.target.findMany();

    return NextResponse.json({
      totals: {
        wasteDivertedKg: Number(totalWasteKg.toFixed(1)),
        waterSavedL: Number(totalWaterL.toFixed(0)),
        saplingsPlanted: Math.round(totalSaplings),
        co2AvoidedKg: Number(totalCo2AvoidedKg.toFixed(1)),
        totalCompletions: approvedSubmissions.length,
      },
      categoryBreakdown: Object.entries(categoryBreakdown).map(([category, val]) => ({
        category,
        count: val.count,
        xp: val.xp,
      })),
      classComparison: Object.values(classStats),
      trendData,
      targets,
    });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
