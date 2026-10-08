"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  Camera,
  Target,
  Zap,
  Leaf,
  Layers,
} from "lucide-react";
import BadgeCelebration from "@/components/BadgeCelebration";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  totalXp: number;
  className: string;
  levelInfo: {
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercent: number;
  };
  badges: Array<{ id: string; code: string; name: string; description: string; icon: string }>;
  recentSubmissions: Array<{
    id: string;
    status: string;
    createdAt: string;
    aiVerdict: string;
    quest: { title: string; category: string; xpReward: number };
  }>;
}

interface Quest {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  impactAmount: number;
  impactUnit: string;
  isHighValue: boolean;
  completedToday: boolean;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, questsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/quests"),
        ]);
        const meData = await meRes.json();
        const questsData = await questsRes.json();
        setUser(meData.user);
        setQuests(questsData.quests || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
        <p className="font-heading font-medium">Loading your Eco-Hero profile...</p>
      </div>
    );
  }

  // Fallback demo user if not logged in
  const profile = user || {
    id: "demo",
    name: "Maya Lin",
    avatar: "🦊",
    streak: 9,
    totalXp: 480,
    className: "Grade 7 EcoRangers",
    levelInfo: { level: 5, currentLevelXp: 80, nextLevelXp: 100, progressPercent: 80 },
    badges: [
      { id: "1", code: "zero_waste_warrior", name: "Zero-Waste Warrior", description: "Compost & tray sorting champion", icon: "Trash2" },
      { id: "2", code: "water_saver", name: "Water Saver", description: "Saved 50+ Litres campus water", icon: "Droplets" },
      { id: "3", code: "streak_7_day", name: "7-Day Eco Streak", description: "7 consecutive days of actions", icon: "Flame" },
    ],
    recentSubmissions: [],
  };

  const todayQuests = quests.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Banner & XP Progress */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-700/15">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              {profile.avatar || "🦊"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                  {profile.className}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-amber-950" />
                  {profile.streak} Days Active Streak!
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100">
                You are on track to unlock the <span className="font-bold underline">Eco Champion</span> badge!
              </p>
            </div>
          </div>

          {/* Level & XP Card */}
          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Award className="w-4 h-4" />
                Level {profile.levelInfo?.level || 1}
              </span>
              <span className="text-white font-extrabold">
                {profile.totalXp} Total XP
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${profile.levelInfo?.progressPercent || 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-100">
              <span>{profile.levelInfo?.currentLevelXp} XP in this tier</span>
              <span>{100 - (profile.levelInfo?.currentLevelXp || 0)} XP to Level {(profile.levelInfo?.level || 1) + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Quests & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Today's Recommended Quests (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Today's Recommended Quests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a practical daily eco-habit, snap proof, and earn instant XP.
              </p>
            </div>
            <Link
              href="/student/quests"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayQuests.map((quest) => (
              <div
                key={quest.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {quest.category}
                    </span>
                    <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  <h3 className="font-bold font-heading text-slate-900 dark:text-white text-base mb-1 group-hover:text-emerald-600 transition-colors">
                    {quest.title}
                  </h3>

                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Impact:{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      +{quest.impactAmount} {quest.impactUnit}
                    </span>
                  </div>
                </div>

                <div>
                  {quest.completedToday ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Completed Today</span>
                    </div>
                  ) : (
                    <Link
                      href={`/student/submit/${quest.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Submit Proof</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Submissions Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Your Recent Activity & Review Status
            </h3>

            {profile.recentSubmissions && profile.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {profile.recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {sub.quest.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {sub.quest.category} • +{sub.quest.xpReward} XP
                      </div>
                    </div>

                    <div className="text-right">
                      {sub.status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : sub.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                          <Clock className="w-3 h-3" />
                          Teacher Queue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[11px]">
                          Needs Revision
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">
                No recent submissions yet today. Try an eco-quest above!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Badges & Team Standings (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Badges Trophy Shelf */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Badge Collection
              </h3>
              <Link
                href="/student/profile"
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                All ({profile.badges.length}/6)
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {profile.badges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-center flex flex-col items-center justify-center gap-1.5"
                  title={badge.description}
                >
                  <span className="text-2xl">🎖️</span>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-white line-clamp-1">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/student/profile"
              className="block w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Inspect Badge Criteria →
            </Link>
          </div>

          {/* Quick Class Leaderboard Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/40 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Class Cup Standings
              </h3>
              <Link
                href="/student/leaderboard"
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Full Board
              </Link>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your class <span className="font-bold text-emerald-700 dark:text-emerald-300">Grade 7 EcoRangers</span> is battling for 1st place this week!
            </p>

            <Link
              href="/student/leaderboard"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>View Class vs Class Rankings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
