"use client";

import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Sparkles,
  Award,
  TrendingUp,
  RotateCcw,
  Zap,
  Flame,
  ArrowRight,
} from "lucide-react";
import { triggerConfetti } from "./BadgeCelebration";

interface DemoQuest {
  id: string;
  title: string;
  category: string;
  icon: string;
  xp: number;
  impactLabel: string;
  impactValue: string;
  co2Saved: string;
  badgeUnlock?: string;
  previewImage: string;
}

const DEMO_QUESTS: DemoQuest[] = [
  {
    id: "compost",
    title: "Compost Lunch Food Scraps",
    category: "WASTE",
    icon: "🍏",
    xp: 35,
    impactLabel: "Waste Diverted",
    impactValue: "+0.85 kg",
    co2Saved: "+0.62 kg CO2e",
    badgeUnlock: "Zero-Waste Warrior",
    previewImage: "🥗 Organic scraps sorted into the green school compost bin",
  },
  {
    id: "bottle",
    title: "Refill Reusable Hydration Bottle",
    category: "PLASTIC_FREE",
    icon: "💧",
    xp: 30,
    impactLabel: "Plastics Avoided",
    impactValue: "+3 single-use bottles",
    co2Saved: "+0.25 kg CO2e",
    badgeUnlock: "Water Saver",
    previewImage: "🚰 Reusable stainless steel bottle refilled at school station",
  },
  {
    id: "energy",
    title: "Switch Off Idle Computer Monitors",
    category: "ENERGY",
    icon: "⚡",
    xp: 45,
    impactLabel: "Electricity Saved",
    impactValue: "+0.75 kWh",
    co2Saved: "+0.42 kg CO2e",
    badgeUnlock: "Energy Ninja",
    previewImage: "🔌 Computer lab master switch powered down after class",
  },
  {
    id: "sapling",
    title: "Plant a Native Pollinator Sapling",
    category: "PLANTS",
    icon: "🌱",
    xp: 120,
    impactLabel: "Trees Planted",
    impactValue: "+1 Native Sapling",
    co2Saved: "+22.0 kg CO2e/yr",
    badgeUnlock: "Tree Hugger",
    previewImage: "🌳 Native pollinator sapling planted in campus garden bed",
  },
];

export default function HeroSimulator() {
  const [selectedQuest, setSelectedQuest] = useState<DemoQuest>(DEMO_QUESTS[0]);
  const [status, setStatus] = useState<"idle" | "scanning" | "verified">("idle");
  const [userXp, setUserXp] = useState(480);
  const [wasteCount, setWasteCount] = useState(542.5);
  const [co2Count, setCo2Count] = useState(1485.2);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);

  // Leaderboard mock state
  const [classes, setClasses] = useState([
    { name: "Grade 7 EcoRangers", xp: 12450, rank: 2, isUser: true },
    { name: "Grade 8 BioGuardians", xp: 12460, rank: 1, isUser: false },
    { name: "Grade 6 Earthkeepers", xp: 11100, rank: 3, isUser: false },
    { name: "Grade 9 PlanetPioneers", xp: 10890, rank: 4, isUser: false },
  ]);

  const handleSimulateSubmit = () => {
    setStatus("scanning");

    setTimeout(() => {
      setStatus("verified");
      setUserXp((prev) => prev + selectedQuest.xp);

      if (selectedQuest.category === "WASTE") {
        setWasteCount((prev) => Number((prev + 0.85).toFixed(1)));
      }
      setCo2Count((prev) => Number((prev + 0.6).toFixed(1)));

      if (selectedQuest.badgeUnlock) {
        setUnlockedBadge(selectedQuest.badgeUnlock);
        triggerConfetti();
      }

      // Simulate class leapfrogging to #1 on leaderboard
      setClasses([
        { name: "Grade 7 EcoRangers", xp: 12450 + selectedQuest.xp, rank: 1, isUser: true },
        { name: "Grade 8 BioGuardians", xp: 12460, rank: 2, isUser: false },
        { name: "Grade 6 Earthkeepers", xp: 11100, rank: 3, isUser: false },
        { name: "Grade 9 PlanetPioneers", xp: 10890, rank: 4, isUser: false },
      ]);
    }, 1200);
  };

  const handleReset = () => {
    setStatus("idle");
    setUserXp(480);
    setWasteCount(542.5);
    setCo2Count(1485.2);
    setUnlockedBadge(null);
    setClasses([
      { name: "Grade 7 EcoRangers", xp: 12450, rank: 2, isUser: true },
      { name: "Grade 8 BioGuardians", xp: 12460, rank: 1, isUser: false },
      { name: "Grade 6 Earthkeepers", xp: 11100, rank: 3, isUser: false },
      { name: "Grade 9 PlanetPioneers", xp: 10890, rank: 4, isUser: false },
    ]);
  };

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 rounded-3xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Simulator Header Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
          </span>
          <span className="font-heading font-bold text-sm tracking-wide">
            LIVE INTERACTIVE QUEST SIMULATOR
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl transition"
          title="Reset Simulator"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quest Selector & Camera Action */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Step 1: Pick an Eco-Quest to Try
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {DEMO_QUESTS.map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => {
                    setSelectedQuest(quest);
                    if (status === "verified") setStatus("idle");
                  }}
                  className={`p-3 text-left rounded-2xl border-2 transition-all flex items-start gap-2.5 ${
                    selectedQuest.id === quest.id
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-emerald-300 bg-slate-50/50 dark:bg-slate-800/40"
                  }`}
                >
                  <span className="text-2xl">{quest.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {quest.title}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      +{quest.xp} XP • {quest.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Camera / Action Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-sky-50/60 to-emerald-50/40 dark:from-slate-800/50 dark:to-emerald-950/20">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Step 2: Simulate Student Proof
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 mb-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-xl shrink-0">
                {selectedQuest.icon}
              </div>
              <div className="flex-1">
                <span className="font-semibold block text-slate-900 dark:text-white">
                  Photo Proof Preview:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {selectedQuest.previewImage}
                </span>
              </div>
            </div>

            {status === "idle" && (
              <button
                onClick={handleSimulateSubmit}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Camera className="w-4 h-4" />
                <span>Snap & Verify Proof Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {status === "scanning" && (
              <div className="py-3 px-4 rounded-xl bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
                <span>Running AI Pre-Check Vision & Duplicate Hash Analysis...</span>
              </div>
            )}

            {status === "verified" && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    AI Pre-Check Passed (95% Confidence)
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                    +{selectedQuest.xp} XP Credited!
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  🔒 Child privacy applied: proof photo purged from disk; cryptographic audit token stored.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Reaction Metrics & Class Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Live Instant Reactions
          </div>

          {/* Student Status HUD */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Maya Lin (Grade 7)
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                    9-Day Streak
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 transition-all">
                  {userXp} XP
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Level 5 Eco-Hero</div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${(userXp % 100)}%` }}
              />
            </div>

            {/* Unlocked Badge Alert in demo */}
            {unlockedBadge && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-xl flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200 animate-bounce">
                <Award className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold">Badge Unlocked:</span> {unlockedBadge}!
                </div>
              </div>
            )}
          </div>

          {/* Mini Class Leaderboard */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Class vs Class Leaderboard
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Live Rank</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {classes.map((cls) => (
                <div
                  key={cls.name}
                  className={`p-2 rounded-xl flex items-center justify-between transition-all duration-500 ${
                    cls.isUser
                      ? "bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-400 font-bold text-emerald-900 dark:text-emerald-200 scale-[1.02]"
                      : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center">
                      #{cls.rank}
                    </span>
                    <span>{cls.name}</span>
                    {cls.isUser && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold">{cls.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* School Impact Counters */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Waste Diverted</div>
              <div className="font-heading font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                {wasteCount} kg
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">CO2 Avoided</div>
              <div className="font-heading font-extrabold text-sm text-sky-700 dark:text-sky-300">
                {co2Count} kg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
