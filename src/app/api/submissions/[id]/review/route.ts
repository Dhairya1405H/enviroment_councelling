import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkAndAwardBadges } from "@/lib/xpAndBadges";
import { purgeStudentProofPhoto } from "@/lib/privacy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only teachers or admins can review submissions" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, comment } = body; // action: "APPROVE" | "REJECT"

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { quest: true, student: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      // Update submission
      const updatedSubmission = await prisma.submission.update({
        where: { id },
        data: {
          status: "APPROVED",
          teacherComment: comment || "Approved by teacher",
          reviewedById: user.id,
          reviewedAt: new Date(),
        },
      });

      // Create XP Ledger entry
      await prisma.xpLedger.create({
        data: {
          studentId: submission.studentId,
          amount: submission.quest.xpReward,
          reason: `Teacher approved: ${submission.quest.title}`,
          submissionId: submission.id,
        },
      });

      // Update student XP & streak
      await prisma.user.update({
        where: { id: submission.studentId },
        data: {
          totalXp: { increment: submission.quest.xpReward },
          streak: { increment: 1 },
          lastActiveDate: new Date(),
        },
      });

      // Child privacy compliance: purge student photo after teacher approval
      if (submission.photoUrl) {
        await purgeStudentProofPhoto(submission.photoUrl);
      }

      // Check badges
      const unlockedBadges = await checkAndAwardBadges(submission.studentId);

      return NextResponse.json({
        success: true,
        status: "APPROVED",
        awardedXp: submission.quest.xpReward,
        unlockedBadges,
      });
    } else {
      // REJECT
      await prisma.submission.update({
        where: { id },
        data: {
          status: "REJECTED",
          teacherComment: comment || "Proof did not meet criteria. Please try again!",
          reviewedById: user.id,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        status: "REJECTED",
      });
    }
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
