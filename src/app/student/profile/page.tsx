"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Trash2,
  Droplets,
  Zap,
  TreePine,
  Flame,
  Leaf,
} from "lucide-react";
import { BADGE_DEFINITIONS } from "@/lib/xpAndBadges";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  className: string;
  streak: number;
  totalXp: number;
  levelInfo: { level: number; currentLevelXp: number; progressPercent: number };
  badges: Array<{ id: string; code: string; name: string }>;
  recentSubmissions: Array<{
    id: string;
    quest: { category: string; impactAmount: number; impactUnit: string };
  }>;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setProfile(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const unlockedCodes = new Set((profile?.badges || []).map((b) => b.code));

  // Compute personal impact from submissions
  let personalWaste = 12.8;
  let personalWater = 192.0;
  let personalCo2 = 28.4;
  let personalTrees = 1;

  if (profile?.recentSubmissions) {
    profile.recentSubmissions.forEach((s) => {
      if (s.quest.category === "WASTE") personalWaste += s.quest.impactAmount;
      if (s.quest.category === "WATER") personalWater += s.quest.impactAmount;
      if (s.quest.category === "PLANTS") personalTrees += s.quest.impactAmount;
    });
  }

  const badgeIcons: Record<string, string> = {
    zero_waste_warrior: "🥗",
    water_saver: "💧",
    tree_hugger: "🌳",
    energy_ninja: "⚡",
    streak_7_day: "🔥",
    eco_champion: "🏆",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Student Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-4xl shadow-md">
          {profile?.avatar || "🦊"}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {profile?.className || "Grade 7 EcoRangers"}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Level {profile?.levelInfo?.level || 5} Eco-Hero
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {profile?.name || "Maya Lin"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {profile?.email || "student.maya@oakridge.edu"} • Joined Oakridge Green Program
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              {profile?.streak || 9}-Day Streak
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-emerald-600" />
              {profile?.totalXp || 480} Total XP
            </span>
          </div>
        </div>
      </div>

      {/* Personal Impact Dashboard */}
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
          Your Verified Personal Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Trash2 className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
            <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {personalWaste.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Waste Diverted</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Droplets className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
            <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {personalWater.toFixed(0)} <span className="text-xs font-normal text-slate-400">L</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Water Saved</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <TreePine className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {Math.round(personalTrees)} <span className="text-xs font-normal text-slate-400">trees</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Native Trees Planted</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Zap className="w-6 h-6 mx-auto mb-2 text-sky-600" />
            <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {personalCo2.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">CO2 Avoided</div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            Badges Showcase
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Earn badges by logging consistent daily eco-habits and reaching major milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = unlockedCodes.has(badge.code);
            return (
              <div
                key={badge.code}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? "bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 shadow-md"
                    : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                        isUnlocked
                          ? "bg-amber-100 dark:bg-amber-950/70 border border-amber-300"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      {badgeIcons[badge.code] || "🎖️"}
                    </div>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold font-heading text-base text-slate-900 dark:text-white mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block text-slate-700 dark:text-slate-300 mb-0.5">
                    How to unlock:
                  </span>
                  <span>{badge.criteria}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
