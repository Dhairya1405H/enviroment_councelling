"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, Sparkles, X } from "lucide-react";

interface BadgeCelebrationProps {
  badgeName: string | null;
  xpAwarded?: number;
  onClose: () => void;
}

export function triggerConfetti() {
  if (typeof window === "undefined") return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#15803d", "#22c55e", "#0284c7", "#facc15", "#f59e0b"],
    });
  } catch {
    // fallback if confetti fails
  }
}

export default function BadgeCelebration({
  badgeName,
  xpAwarded,
  onClose,
}: BadgeCelebrationProps) {
  useEffect(() => {
    if (badgeName || xpAwarded) {
      triggerConfetti();
    }
  }, [badgeName, xpAwarded]);

  if (!badgeName && !xpAwarded) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          aria-label="Close celebration modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-500 shadow-inner">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>QUEST VERIFIED!</span>
        </div>

        {badgeName ? (
          <>
            <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Badge Unlocked!
            </h3>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-lg mb-4">
              🎖️ {badgeName}
            </div>
          </>
        ) : (
          <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Awesome Work!
          </h3>
        )}

        {xpAwarded ? (
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            You earned{" "}
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              +{xpAwarded} XP
            </span>{" "}
            for your class leaderboard!
          </div>
        ) : null}

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95"
        >
          Keep Going! 🌿
        </button>
      </div>
    </div>
  );
}
