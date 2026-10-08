import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IMPACT_FACTORS } from "@/lib/impactFactors";

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      where: { status: "APPROVED" },
      include: {
        quest: true,
        student: {
          include: { class: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const lines: string[] = [];

    // Header 1: Platform & School Metadata
    lines.push(`"ECOQUEST GREEN-AUDIT REPORT - OAKRIDGE GREEN ACADEMY"`);
    lines.push(`"Generated At: ${new Date().toISOString()}"`);
    lines.push(`"Total Verified Completions: ${submissions.length}"`);
    lines.push("");

    // Section 1: Official Conversion Factors Used
    lines.push(`"SECTION 1: SCIENTIFIC CONVERSION FACTORS & FORMULAS USED"`);
    lines.push(`"Factor ID","Category","Action / Metric","Primary Yield / Unit","CO2 Avoided (kg / Unit)","Benchmark Source","Educational Rationale"`);

    Object.values(IMPACT_FACTORS).forEach((f) => {
      lines.push(
        `"${f.id}","${f.category}","${f.metricName}","${f.primaryYieldPerUnit} ${f.unit}","${f.co2AvoidedKgPerUnit} kg CO2e","${f.referenceSource.replace(/"/g, '""')}","${f.rationale.replace(/"/g, '""')}"`
      );
    });

    lines.push("");

    // Section 2: Aggregated Class Sustainability Impact
    lines.push(`"SECTION 2: CLASS VERIFIED IMPACT TOTALS"`);
    lines.push(`"Class Name","Grade","Completions Count","Total XP"`);

    const classes = await prisma.class.findMany({
      include: {
        students: {
          include: {
            submissions: { where: { status: "APPROVED" }, include: { quest: true } },
          },
        },
      },
    });

    classes.forEach((c) => {
      const completions = c.students.reduce((sum, s) => sum + s.submissions.length, 0);
      const totalXp = c.students.reduce((sum, s) => sum + s.totalXp, 0);
      lines.push(`"${c.name}","${c.grade}",${completions},${totalXp}`);
    });

    lines.push("");

    // Section 3: Verified Action Audit Trail
    lines.push(`"SECTION 3: VERIFIED STUDENT ACTION AUDIT TRAIL"`);
    lines.push(`"Submission ID","Date","Student ID","Class","Quest Title","Category","Proof Type","AI Verdict","AI Confidence","XP Awarded"`);

    submissions.forEach((s) => {
      lines.push(
        `"${s.id}","${s.createdAt.toISOString()}","${s.studentId.slice(0, 8)}","${s.student.class?.name || "Independent"}","${s.quest.title.replace(/"/g, '""')}","${s.quest.category}","${s.proofType}","${s.aiVerdict || "PASS"}","${s.aiConfidence ? (s.aiConfidence * 100).toFixed(0) + "%" : "N/A"}",${s.quest.xpReward}`
      );
    });

    const csvContent = lines.join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="EcoQuest_Green_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate CSV audit report" }, { status: 500 });
  }
}
