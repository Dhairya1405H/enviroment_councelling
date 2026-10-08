import { PrismaClient } from "@prisma/client";
import { BADGE_DEFINITIONS } from "../src/lib/xpAndBadges";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning existing database...");
  await prisma.userBadge.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.target.deleteMany();
  await prisma.user.deleteMany();
  await prisma.class.deleteMany();
  await prisma.school.deleteMany();
  await prisma.badge.deleteMany();

  console.log("🏫 Creating School...");
  const school = await prisma.school.create({
    data: {
      name: "Oakridge Green Academy",
    },
  });

  console.log("🎖️ Seeding Badges...");
  for (const b of BADGE_DEFINITIONS) {
    await prisma.badge.create({
      data: {
        code: b.code,
        name: b.name,
        description: b.description,
        icon: b.icon,
        category: b.category,
        criteria: b.criteria,
      },
    });
  }

  console.log("🎯 Seeding School Sustainability Targets...");
  await prisma.target.createMany({
    data: [
      {
        schoolId: school.id,
        title: "Divert Cafeteria & Paper Waste",
        category: "WASTE",
        targetValue: 800,
        currentValue: 542.5,
        unit: "kg",
      },
      {
        schoolId: school.id,
        title: "Conserve Campus Water",
        category: "WATER",
        targetValue: 15000,
        currentValue: 11280.0,
        unit: "L",
      },
      {
        schoolId: school.id,
        title: "Campus Native Tree Canopy",
        category: "PLANTS",
        targetValue: 120,
        currentValue: 84.0,
        unit: "trees",
      },
      {
        schoolId: school.id,
        title: "Avoided Greenhouse Gas Footprint",
        category: "ENERGY",
        targetValue: 2000,
        currentValue: 1485.2,
        unit: "kg CO2e",
      },
    ],
  });

  console.log("👩‍🏫 Seeding Classes and Teachers...");
  const classConfigs = [
    {
      name: "Grade 6 Earthkeepers",
      grade: "Grade 6",
      teacherName: "Ms. Priya Patel",
      teacherEmail: "teacher.patel@oakridge.edu",
      avatar: "🌿",
    },
    {
      name: "Grade 7 EcoRangers",
      grade: "Grade 7",
      teacherName: "Mr. Marcus Davis",
      teacherEmail: "teacher.davis@oakridge.edu",
      avatar: "🌲",
    },
    {
      name: "Grade 8 BioGuardians",
      grade: "Grade 8",
      teacherName: "Mr. Lucas Chen",
      teacherEmail: "teacher.chen@oakridge.edu",
      avatar: "🍁",
    },
    {
      name: "Grade 9 PlanetPioneers",
      grade: "Grade 9",
      teacherName: "Mrs. Sarah Miller",
      teacherEmail: "teacher.miller@oakridge.edu",
      avatar: "🌸",
    },
  ];

  const createdClasses = [];
  const createdTeachers = [];

  for (const cfg of classConfigs) {
    const teacher = await prisma.user.create({
      data: {
        email: cfg.teacherEmail,
        password: "password123",
        name: cfg.teacherName,
        role: "TEACHER",
        avatar: cfg.avatar,
      },
    });
    createdTeachers.push(teacher);

    const cls = await prisma.class.create({
      data: {
        name: cfg.name,
        grade: cfg.grade,
        schoolId: school.id,
        teacherId: teacher.id,
      },
    });
    createdClasses.push(cls);

    // Link teacher to class
    await prisma.user.update({
      where: { id: teacher.id },
      data: { classId: cls.id },
    });
  }

  console.log("🏛️ Seeding School Admin...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@oakridge.edu",
      password: "password123",
      name: "Principal Eleanor Vance",
      role: "ADMIN",
      avatar: "🦉",
    },
  });

  console.log("📜 Seeding Core Quests...");
  const questsData = [
    {
      title: "Sort Cafeteria Compost & Scraps",
      description: "Separate meal fruit peels and food waste into the green composting bin.",
      category: "WASTE",
      icon: "Apple",
      xpReward: 35,
      impactType: "waste_kg",
      impactAmount: 0.85,
      impactUnit: "kg",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Clean Recycling Bin Inspection",
      description: "Empty and check that classroom paper bins have no plastic or liquids.",
      category: "WASTE",
      icon: "Trash2",
      xpReward: 40,
      impactType: "waste_kg",
      impactAmount: 1.2,
      impactUnit: "kg",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "5-Minute Shower Challenge",
      description: "Time your morning shower to under 5 minutes to conserve hot water.",
      category: "WATER",
      icon: "Droplets",
      xpReward: 30,
      impactType: "water_l",
      impactAmount: 24.0,
      impactUnit: "L",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Running Tap Police",
      description: "Turn off faucets while lathering hands or brushing teeth at school or home.",
      category: "WATER",
      icon: "Waves",
      xpReward: 25,
      impactType: "water_l",
      impactAmount: 12.0,
      impactUnit: "L",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Classroom Phantom Energy Sweep",
      description: "Unplug projector strips, lab monitors, and chargers before leaving for the day.",
      category: "ENERGY",
      icon: "Zap",
      xpReward: 45,
      impactType: "energy_kwh",
      impactAmount: 0.75,
      impactUnit: "kWh",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Daylight Hours: Switch Off Lights",
      description: "Rely on natural window daylight during sunny afternoon classroom periods.",
      category: "ENERGY",
      icon: "Sun",
      xpReward: 30,
      impactType: "energy_kwh",
      impactAmount: 0.5,
      impactUnit: "kWh",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Zero-Plastic Packed Lunch",
      description: "Bring lunch in reusable stainless steel or silicone containers with zero cling wrap.",
      category: "PLASTIC_FREE",
      icon: "ShoppingBag",
      xpReward: 40,
      impactType: "plastic_items",
      impactAmount: 3.0,
      impactUnit: "items",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Reusable Bottle Refill Station",
      description: "Refill your reusable water bottle 3 times today without buying bottled drinks.",
      category: "PLASTIC_FREE",
      icon: "Coffee",
      xpReward: 30,
      impactType: "plastic_items",
      impactAmount: 2.0,
      impactUnit: "items",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Plant a Native Sapling or Bush",
      description: "Plant a native pollinator flower, shrub, or sapling in the school or home garden.",
      category: "PLANTS",
      icon: "TreePine",
      xpReward: 120,
      impactType: "saplings",
      impactAmount: 1.0,
      impactUnit: "trees",
      isHighValue: true, // Requires teacher sign-off
      dailyLimit: 1,
    },
    {
      title: "Garden Bed Weeding & Mulching",
      description: "Help care for school vegetable beds, weed invasive grasses, and apply mulch.",
      category: "PLANTS",
      icon: "Sprout",
      xpReward: 60,
      impactType: "saplings",
      impactAmount: 0.5,
      impactUnit: "beds",
      isHighValue: false,
      dailyLimit: 1,
    },
    {
      title: "Active Green Commute (Walk/Bike)",
      description: "Walk, bike, scooter, or take public transit/carpool for your school trip.",
      category: "TRANSPORT",
      icon: "Bike",
      xpReward: 50,
      impactType: "co2_kg",
      impactAmount: 0.68,
      impactUnit: "kg CO2e",
      isHighValue: false,
      dailyLimit: 1,
    },
  ];

  const createdQuests = [];
  for (const q of questsData) {
    const quest = await prisma.quest.create({
      data: {
        ...q,
        createdById: createdTeachers[1].id, // Created by Mr. Davis
      },
    });
    createdQuests.push(quest);
  }

  console.log("🎒 Seeding 40 Students across 4 Classes...");
  const firstNames = [
    "Maya", "Liam", "Sophia", "Noah", "Olivia", "Ethan", "Emma", "Jackson", "Ava", "Lucas",
    "Aria", "Oliver", "Chloe", "Mason", "Zoe", "Elijah", "Ella", "Logan", "Grace", "Aiden",
    "Harper", "James", "Lily", "Benjamin", "Hannah", "Alexander", "Mila", "Daniel", "Layla", "Henry",
    "Ella", "Sebastian", "Avery", "Jack", "Scarlett", "Owen", "Victoria", "Samuel", "Aurora", "David"
  ];
  const lastNames = [
    "Lin", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
    "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
    "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis",
    "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill"
  ];

  const createdStudents = [];
  const badgesList = await prisma.badge.findMany();

  // Maya Lin is student 0: Demo Student in Grade 7 EcoRangers
  for (let i = 0; i < 40; i++) {
    const classIdx = Math.floor(i / 10);
    const cls = createdClasses[classIdx];
    const isMaya = i === 0;

    const firstName = isMaya ? "Maya" : firstNames[i];
    const lastName = isMaya ? "Lin" : lastNames[i];
    const email = isMaya ? "student.maya@oakridge.edu" : `student.${firstName.toLowerCase()}.${lastName.toLowerCase()}@oakridge.edu`;

    const student = await prisma.user.create({
      data: {
        email,
        password: "password123",
        name: `${firstName} ${lastName}`,
        role: "STUDENT",
        avatar: ["🦊", "🐼", "🦁", "🐨", "🐯", "🐰", "🦉", "🦋", "🐬", "🐢"][i % 10],
        classId: cls.id,
        streak: isMaya ? 9 : (i % 8) + 1,
        totalXp: 0, // will accumulate with realistic submissions
      },
    });
    createdStudents.push(student);
  }

  console.log("📊 Seeding 30 Days of Realistic Submissions...");
  const now = new Date();
  let totalSubmissionsCount = 0;

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const dateForDay = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    
    // Each day, 8 to 18 students complete 1 or 2 quests
    const participatingCount = Math.floor(8 + Math.random() * 10);
    const shuffledStudents = [...createdStudents].sort(() => 0.5 - Math.random()).slice(0, participatingCount);

    for (const student of shuffledStudents) {
      const questsToComplete = Math.random() > 0.6 ? 2 : 1;
      for (let q = 0; q < questsToComplete; q++) {
        const quest = createdQuests[Math.floor(Math.random() * createdQuests.length)];
        const isPhoto = Math.random() > 0.3; // 70% photos, 30% logs

        // Status distribution: 82% approved, 12% pending (especially recent ones), 6% rejected
        let status = "APPROVED";
        if (dayOffset <= 2 && Math.random() < 0.4) {
          status = "PENDING";
        } else if (quest.isHighValue && dayOffset <= 5 && Math.random() < 0.3) {
          status = "PENDING";
        } else if (Math.random() < 0.05) {
          status = "REJECTED";
        }

        const isApproved = status === "APPROVED";
        const isPending = status === "PENDING";

        const submission = await prisma.submission.create({
          data: {
            studentId: student.id,
            questId: quest.id,
            status,
            proofType: isPhoto ? "PHOTO" : "LOG",
            photoUrl: isPhoto ? `/demo-proofs/${quest.category.toLowerCase()}_sample.jpg` : null,
            photoHash: isPhoto ? `hash_${student.id}_${dayOffset}_${quest.id}` : null,
            logText: !isPhoto ? `Logged my sustainable action: Completed "${quest.title}" carefully today with my study group.` : null,
            aiVerdict: isApproved ? "PASS" : (isPending ? "REVIEW" : "FAIL"),
            aiConfidence: isApproved ? 0.94 : (isPending ? 0.72 : 0.45),
            aiReason: isApproved
              ? "Verified action matches requirements"
              : (isPending ? "Requires teacher review verification" : "Photo unclear or out of context"),
            teacherComment: isApproved ? "Great job supporting our school eco goal!" : (status === "REJECTED" ? "Please resubmit with a clearer photo of your sorted tray." : null),
            reviewedById: isApproved ? createdTeachers[1].id : null,
            reviewedAt: isApproved ? dateForDay : null,
            createdAt: dateForDay,
          },
        });

        totalSubmissionsCount++;

        if (isApproved) {
          // Record XP Ledger entry
          await prisma.xpLedger.create({
            data: {
              studentId: student.id,
              amount: quest.xpReward,
              reason: `Completed quest: ${quest.title}`,
              submissionId: submission.id,
              createdAt: dateForDay,
            },
          });

          // Accumulate student XP
          await prisma.user.update({
            where: { id: student.id },
            data: {
              totalXp: { increment: quest.xpReward },
            },
          });
        }
      }
    }
  }

  console.log(`✅ Seeded ${totalSubmissionsCount} submissions over 30 days.`);

  // Award initial badges to students based on their accumulated achievements
  console.log("🏅 Granting earned badges...");
  for (const student of createdStudents) {
    const studentData = await prisma.user.findUnique({
      where: { id: student.id },
      include: {
        submissions: {
          where: { status: "APPROVED" },
          include: { quest: true },
        },
      },
    });

    if (!studentData) continue;

    const wasteCount = studentData.submissions.filter(s => s.quest.category === "WASTE" || s.quest.category === "PLASTIC_FREE").length;
    const waterCount = studentData.submissions.filter(s => s.quest.category === "WATER").length;
    const plantsCount = studentData.submissions.filter(s => s.quest.category === "PLANTS").length;
    const energyCount = studentData.submissions.filter(s => s.quest.category === "ENERGY").length;

    const badgesToGive = [];
    if (wasteCount >= 3) badgesToGive.push("zero_waste_warrior");
    if (waterCount >= 3) badgesToGive.push("water_saver");
    if (plantsCount >= 1) badgesToGive.push("tree_hugger");
    if (energyCount >= 3) badgesToGive.push("energy_ninja");
    if (studentData.streak >= 7) badgesToGive.push("streak_7_day");
    if (studentData.totalXp >= 400) badgesToGive.push("eco_champion");

    for (const code of badgesToGive) {
      const badge = badgesList.find(b => b.code === code);
      if (badge) {
        await prisma.userBadge.upsert({
          where: {
            userId_badgeId: {
              userId: student.id,
              badgeId: badge.id,
            },
          },
          update: {},
          create: {
            userId: student.id,
            badgeId: badge.id,
            unlockedAt: new Date(now.getTime() - Math.random() * 10 * 86400000),
          },
        });
      }
    }
  }

  // Ensure Maya Lin (demo student) has high XP, level 5+, and pending review quests for live demo
  const maya = await prisma.user.findFirst({ where: { email: "student.maya@oakridge.edu" } });
  if (maya) {
    // Add 2 pending submissions for Maya so teacher queue has fresh items
    const pendingQuests = [createdQuests[8], createdQuests[0]]; // Sapling & Compost
    for (const pq of pendingQuests) {
      await prisma.submission.create({
        data: {
          studentId: maya.id,
          questId: pq.id,
          status: "PENDING",
          proofType: "PHOTO",
          photoUrl: `/demo-proofs/${pq.category.toLowerCase()}_sample.jpg`,
          photoHash: `maya_recent_${pq.id}`,
          aiVerdict: "REVIEW",
          aiConfidence: 0.76,
          aiReason: pq.isHighValue ? "High-value ecological action: requires teacher sign-off" : "AI confidence 76%: sent for teacher confirmation",
          createdAt: new Date(),
        },
      });
    }

    // Give Maya 420+ XP if below
    if (maya.totalXp < 450) {
      await prisma.user.update({
        where: { id: maya.id },
        data: { totalXp: 480 },
      });
    }
  }

  console.log("🎉 Seed finished successfully!");
  console.log("Demo logins:");
  console.log("  🎒 Student: student.maya@oakridge.edu (password123)");
  console.log("  🍎 Teacher: teacher.davis@oakridge.edu (password123)");
  console.log("  🏛️ Admin:   admin@oakridge.edu (password123)");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
