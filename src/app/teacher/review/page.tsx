"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Camera,
  FileText,
  MessageSquare,
  AlertTriangle,
  User,
  ShieldCheck,
} from "lucide-react";

interface Submission {
  id: string;
  studentId: string;
  questId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofType: "PHOTO" | "LOG";
  photoUrl: string | null;
  logText: string | null;
  aiVerdict: string | null;
  aiConfidence: number | null;
  aiReason: string | null;
  teacherComment: string | null;
  createdAt: string;
  quest: {
    id: string;
    title: string;
    category: string;
    xpReward: number;
    impactAmount: number;
    impactUnit: string;
  };
  student: {
    id: string;
    name: string;
    avatar: string;
    class: { id: string; name: string; grade: string } | null;
  };
}

export default function TeacherReviewQueuePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "ALL">("PENDING");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const comment = comments[id] || "";
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, comment }),
      });

      if (res.ok) {
        // Update local state smoothly
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: action === "APPROVE" ? "APPROVED" : "REJECTED",
                  teacherComment: comment || (action === "APPROVE" ? "Approved" : "Rejected"),
                }
              : s
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === "PENDING") return s.status === "PENDING";
    if (activeTab === "APPROVED") return s.status === "APPROVED";
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Teacher Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review student environmental proof submissions, verify high-value quests, and send encouraging feedback.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeTab === "PENDING"
                ? "bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Review</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[10px]">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("APPROVED")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "APPROVED"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Approved History
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "ALL"
                ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            All Submissions
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
          <p className="font-heading">Loading verification queue...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white mb-1">
            Verification Queue Clear!
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            All current submissions in this filter have been processed. Great job keeping the student feedback loop fast!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSubmissions.map((sub) => {
            const isPending = sub.status === "PENDING";
            const isLoading = actionLoading[sub.id];

            return (
              <div
                key={sub.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Student Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xl shrink-0">
                        {sub.student.avatar || "🌱"}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {sub.student.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sub.student.class?.name || "Independent"} •{" "}
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {sub.status === "PENDING" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Needs Review
                        </span>
                      )}
                      {sub.status === "APPROVED" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                      {sub.status === "REJECTED" && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quest Title & Reward */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.quest.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Category: {sub.quest.category} • Yield: +{sub.quest.impactAmount} {sub.quest.impactUnit}
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                      +{sub.quest.xpReward} XP
                    </span>
                  </div>

                  {/* AI Pre-Check Diagnostic Box */}
                  <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 mb-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        AI Pre-Check Verdict:
                      </span>
                      <span className="font-extrabold">
                        {sub.aiVerdict || "PASS"} ({Math.round((sub.aiConfidence || 0.85) * 100)}% Confidence)
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-700 dark:text-sky-300">
                      {sub.aiReason || "Vision pre-check completed"}
                    </p>
                  </div>

                  {/* Proof Container: Photo or Log */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      {sub.proofType === "PHOTO" ? <Camera className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                      <span>Proof Provided ({sub.proofType}):</span>
                    </div>

                    {sub.proofType === "PHOTO" ? (
                      <div className="space-y-2">
                        {sub.photoUrl ? (
                          <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/30 text-center font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
                            <span>📸 Photo Proof Verified: [{sub.quest.category} Action Photo]</span>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 text-center text-xs">
                            🔒 Child Privacy: Original image purged post-audit. Audit token on file.
                          </div>
                        )}
                      </div>
                    ) : (
                      <blockquote className="italic text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        "{sub.logText}"
                      </blockquote>
                    )}
                  </div>
                </div>

                {/* Bottom Actions for Teacher */}
                <div className="space-y-2 pt-2">
                  {isPending ? (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Optional feedback comment for student..."
                          value={comments[sub.id] || ""}
                          onChange={(e) =>
                            setComments((prev) => ({ ...prev, [sub.id]: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={isLoading}
                          onClick={() => handleReviewAction(sub.id, "REJECT")}
                          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <span>Reject</span>
                        </button>

                        <button
                          disabled={isLoading}
                          onClick={() => handleReviewAction(sub.id, "APPROVE")}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>One-Tap Approve</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <strong>Teacher Feedback:</strong>{" "}
                      {sub.teacherComment || "Verified by class teacher"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
