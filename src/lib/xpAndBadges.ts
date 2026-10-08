import { prisma } from "./prisma";

export interface LevelInfo {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

/**
 * Calculates level based on 100 XP per level
 */
export function calculateLevel(totalXp: number): LevelInfo {
  const level = Math.floor(totalXp / 100) + 1;
  const currentLevelXp = totalXp % 100;
  const nextLevelXp = 100;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));

  return {
    level,
    totalXp,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
  };
}

export const BADGE_DEFINITIONS = [
  {
    code: "zero_waste_warrior",
    name: "Zero-Waste Warrior",
    description: "Complete 3 waste diversion or composting quests",
    icon: "Trash2",
    category: "WASTE",
    criteria: "Divert cafeteria scraps and sort school recycling 3 times",
  },
  {
    code: "water_saver",
    name: "Water Saver",
    description: "Save 50+ Litres through conservation quests",
    icon: "Droplets",
    category: "WATER",
    criteria: "Turn off running faucets and log 3 water conservation actions",
  },
  {
    code: "tree_hugger",
    name: "Tree Hugger",
    description: "Plant a native sapling or restore school biodiversity",
    icon: "TreePine",
    category: "PLANTS",
    criteria: "Plant 1 native sapling or complete 2 garden biodiversity quests",
  },
  {
    code: "energy_ninja",
    name: "Energy Ninja",
    description: "Eliminate phantom loads in classroom labs",
    icon: "Zap",
    category: "ENERGY",
    criteria: "Power down switches and eliminate phantom energy 3 times",
  },
  {
    code: "streak_7_day",
    name: "7-Day Eco Streak",
    description: "Log sustainable habits for 7 consecutive days",
    icon: "Flame",
    category: "GENERAL",
    criteria: "Maintain an uninterrupted 7-day sustainability streak",
  },
  {
    code: "eco_champion",
    name: "Eco Champion",
    description: "Reach Level 5 and complete 10+ school quests",
    icon: "Award",
    category: "GENERAL",
    criteria: "Earn 400+ XP across multiple eco categories",
  },
];

/**
 * Checks and awards new badges after a quest approval
 */
export async function checkAndAwardBadges(studentId: string): Promise<string[]> {
  const newlyUnlockedBadgeNames: string[] = [];

  // Get student data and submissions
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      submissions: {
        where: { status: "APPROVED" },
        include: { quest: true },
      },
      userBadges: {
        include: { badge: true },
      },
    },
  });

  if (!student) return [];

  const existingBadgeCodes = new Set(student.userBadges.map((ub) => ub.badge.code));
  const approvedSubmissions = student.submissions;

  // Count by category
  const counts = {
    waste: approvedSubmissions.filter((s) => s.quest.category === "WASTE" || s.quest.category === "PLASTIC_FREE").length,
    water: approvedSubmissions.filter((s) => s.quest.category === "WATER").length,
    plants: approvedSubmissions.filter((s) => s.quest.category === "PLANTS").length,
    energy: approvedSubmissions.filter((s) => s.quest.category === "ENERGY").length,
    total: approvedSubmissions.length,
  };

  const badgesToAward: string[] = [];

  if (!existingBadgeCodes.has("zero_waste_warrior") && counts.waste >= 3) {
    badgesToAward.push("zero_waste_warrior");
  }
  if (!existingBadgeCodes.has("water_saver") && counts.water >= 3) {
    badgesToAward.push("water_saver");
  }
  if (!existingBadgeCodes.has("tree_hugger") && counts.plants >= 1) {
    badgesToAward.push("tree_hugger");
  }
  if (!existingBadgeCodes.has("energy_ninja") && counts.energy >= 3) {
    badgesToAward.push("energy_ninja");
  }
  if (!existingBadgeCodes.has("streak_7_day") && student.streak >= 7) {
    badgesToAward.push("streak_7_day");
  }
  if (!existingBadgeCodes.has("eco_champion") && (student.totalXp >= 400 || counts.total >= 10)) {
    badgesToAward.push("eco_champion");
  }

  for (const code of badgesToAward) {
    const badge = await prisma.badge.findUnique({ where: { code } });
    if (badge) {
      await prisma.userBadge.create({
        data: {
          userId: student.id,
          badgeId: badge.id,
        },
      });
      newlyUnlockedBadgeNames.push(badge.name);
    }
  }

  return newlyUnlockedBadgeNames;
}
