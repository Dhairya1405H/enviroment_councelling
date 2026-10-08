import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { verifySubmission } from "@/lib/aiVerification";
import { checkAndAwardBadges } from "@/lib/xpAndBadges";
import { purgeStudentProofPhoto } from "@/lib/privacy";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "PENDING", "APPROVED", etc.
    const classId = searchParams.get("classId");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    if (user.role === "STUDENT") {
      where.studentId = user.id;
    } else if (user.role === "TEACHER") {
      // Teacher sees submissions from their class or all classes if not assigned
      if (user.classId) {
        where.student = { classId: user.classId };
      }
    }

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        quest: true,
        student: {
          select: {
            id: true,
            name: true,
            avatar: true,
            class: { select: { id: true, name: true, grade: true } },
          },
        },
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to submit a quest proof" }, { status: 401 });
    }

    const body = await request.json();
    const { questId, proofType, photoDataUrl, logText } = body;

    if (!questId || !proofType) {
      return NextResponse.json({ error: "Quest and proof type are required" }, { status: 400 });
    }

    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // 1. Anti-Cheat: Daily Cap Check
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayCount = await prisma.submission.count({
      where: {
        studentId: user.id,
        questId: quest.id,
        createdAt: { gte: startOfToday },
        status: { in: ["APPROVED", "PENDING"] },
      },
    });

    if (todayCount >= quest.dailyLimit) {
      return NextResponse.json(
        {
          error: `Daily limit reached! You have already submitted this quest today (${quest.dailyLimit} allowed per day). Come back tomorrow!`,
        },
        { status: 400 }
      );
    }

    // 2. Fetch existing photo hashes for duplicate detection
    let existingHashes: string[] = [];
    if (proofType === "PHOTO") {
      const pastHashes = await prisma.submission.findMany({
        where: { photoHash: { not: null } },
        select: { photoHash: true },
        take: 100,
      });
      existingHashes = pastHashes.map((p) => p.photoHash!).filter(Boolean);
    }

    // 3. AI Vision Pre-Check
    const aiResult = await verifySubmission({
      questId: quest.id,
      questTitle: quest.title,
      category: quest.category,
      isHighValue: quest.isHighValue,
      proofType,
      photoDataUrl,
      logText,
      studentId: user.id,
      existingHashes,
    });

    if (aiResult.result === "fail") {
      return NextResponse.json(
        {
          success: false,
          verdict: "fail",
          reason: aiResult.reason,
          confidence: aiResult.confidence,
        },
        { status: 400 }
      );
    }

    const isAutoApproved = aiResult.result === "pass";
    const status = isAutoApproved ? "APPROVED" : "PENDING";

    // 4. Create Submission Record
    const submission = await prisma.submission.create({
      data: {
        studentId: user.id,
        questId: quest.id,
        status,
        proofType,
        photoUrl: proofType === "PHOTO" ? (photoDataUrl ? "/uploads/verified_proof.png" : null) : null,
        photoHash: aiResult.photoHash,
        logText: proofType === "LOG" ? logText : null,
        aiVerdict: aiResult.result.toUpperCase(),
        aiConfidence: aiResult.confidence,
        aiReason: aiResult.reason,
        reviewedAt: isAutoApproved ? new Date() : null,
      },
    });

    let awardedXp = 0;
    let unlockedBadges: string[] = [];

    if (isAutoApproved) {
      awardedXp = quest.xpReward;

      // Create XP Ledger entry
      await prisma.xpLedger.create({
        data: {
          studentId: user.id,
          amount: quest.xpReward,
          reason: `Auto-verified completion: ${quest.title}`,
          submissionId: submission.id,
        },
      });

      // Update student XP & streak
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalXp: { increment: quest.xpReward },
          streak: { increment: 1 },
          lastActiveDate: new Date(),
        },
      });

      // Child privacy compliance: purge proof photo immediately after auto-verification
      if (submission.photoUrl) {
        await purgeStudentProofPhoto(submission.photoUrl);
      }

      // Check badge triggers
      unlockedBadges = await checkAndAwardBadges(user.id);
    }

    return NextResponse.json({
      success: true,
      status,
      verdict: aiResult.result,
      confidence: aiResult.confidence,
      reason: aiResult.reason,
      awardedXp,
      unlockedBadges,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
