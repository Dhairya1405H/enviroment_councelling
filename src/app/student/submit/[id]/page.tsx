"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Lock,
  Clock,
  ShieldCheck,
} from "lucide-react";
import BadgeCelebration from "@/components/BadgeCelebration";

interface QuestDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  impactAmount: number;
  impactUnit: string;
  isHighValue: boolean;
}

export default function SubmitQuestProofPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [quest, setQuest] = useState<QuestDetail | null>(null);
  const [proofType, setProofType] = useState<"PHOTO" | "LOG">("PHOTO");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [logText, setLogText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewQueued, setReviewQueued] = useState(false);

  // Celebration state
  const [celebrationBadge, setCelebrationBadge] = useState<string | null>(null);
  const [awardedXp, setAwardedXp] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function loadQuest() {
      try {
        const res = await fetch("/api/quests");
        const data = await res.json();
        const found = (data.quests || []).find((q: any) => q.id === id);
        if (found) setQuest(found);
      } catch (e) {
        console.error(e);
      }
    }
    loadQuest();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSamplePhoto = () => {
    // Generate a unique canvas data URL with quest category stamp
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#065f46";
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`EcoQuest Proof: ${quest?.category || "Action"}`, 30, 140);
      ctx.font = "14px sans-serif";
      ctx.fillText(`Timestamp: ${new Date().toLocaleTimeString()}`, 30, 180);
      const dataUrl = canvas.toDataURL("image/png");
      setPhotoDataUrl(dataUrl);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    if (proofType === "PHOTO" && !photoDataUrl) {
      setErrorMessage("Please capture or upload a proof photo.");
      setSubmitting(false);
      return;
    }

    if (proofType === "LOG" && logText.trim().length < 20) {
      setErrorMessage("Please write at least 2 sentences describing your environmental action.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questId: id,
          proofType,
          photoDataUrl,
          logText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.reason || data.error || "Submission failed");
        setSubmitting(false);
        return;
      }

      if (data.status === "APPROVED") {
        setAwardedXp(data.awardedXp);
        if (data.unlockedBadges && data.unlockedBadges.length > 0) {
          setCelebrationBadge(data.unlockedBadges[0]);
        } else {
          setCelebrationBadge(null);
        }
      } else {
        // PENDING review queue
        setReviewQueued(true);
      }
    } catch {
      setErrorMessage("Network error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  if (!quest) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
        <p className="font-heading">Loading quest details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Link
        href="/student/quests"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quest Library</span>
      </Link>

      {/* Quest Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {quest.category}
          </span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            +{quest.xpReward} XP Reward
          </span>
        </div>

        <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
          {quest.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {quest.description}
        </p>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>School Impact Yield:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            +{quest.impactAmount} {quest.impactUnit}
          </span>
        </div>
      </div>

      {/* Queued for Review Banner */}
      {reviewQueued ? (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900 text-amber-600 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-amber-900 dark:text-amber-200">
              Submitted to Teacher Review Queue!
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-1 max-w-md mx-auto">
              {quest.isHighValue
                ? "This is a high-value community quest (e.g. sapling planting). Your teacher has been notified to verify your proof."
                : "Your action has been logged and sent to your class teacher for quick verification sign-off."}
            </p>
          </div>
          <Link
            href="/student"
            className="inline-block px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Return to Dashboard
          </Link>
        </div>
      ) : (
        /* Submission Form */
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
        >
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode Switcher: Photo vs Activity Log */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Choose Proof Format:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProofType("PHOTO")}
                className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition ${
                  proofType === "PHOTO"
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Photo Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("LOG")}
                className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition ${
                  proofType === "LOG"
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Activity Log (No Camera)</span>
              </button>
            </div>
          </div>

          {/* Photo Upload Mode */}
          {proofType === "PHOTO" ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                {photoDataUrl ? (
                  <div className="space-y-3">
                    <img
                      src={photoDataUrl}
                      alt="Proof preview"
                      className="max-h-48 mx-auto rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl(null)}
                      className="text-xs text-rose-600 hover:underline font-bold"
                    >
                      Remove & Choose Another Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <label className="cursor-pointer font-bold text-xs sm:text-sm text-emerald-600 hover:text-emerald-700">
                        <span>Click to upload a proof photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleUseSamplePhoto}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition"
                      >
                        ⚡ Simulate Fast Camera Snapshot (Demo)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Log Text Mode */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Describe Your Sustainable Action:
              </label>
              <textarea
                rows={4}
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                placeholder="Example: I sorted all leftover food from my lunch into the campus compost bin and made sure no plastic wrappers were mixed in..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Must be at least 2 sentences describing your context and environmental impact.
              </p>
            </div>
          )}

          {/* Child Privacy Guarantee notice */}
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 text-[11px] flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-sky-600" />
            <span>
              <strong>Child Privacy Guarantee:</strong> In compliance with school safety standards, uploaded photos are temporary verification tokens and are permanently purged from server disks once verified.
            </span>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Running AI Pre-Check & Duplicate Hashing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Proof for AI & Teacher Verification</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Celebration Modal on Auto-Approval */}
      {(celebrationBadge || awardedXp) && (
        <BadgeCelebration
          badgeName={celebrationBadge}
          xpAwarded={awardedXp}
          onClose={() => {
            setCelebrationBadge(null);
            setAwardedXp(undefined);
            router.push("/student");
          }}
        />
      )}
    </div>
  );
}
