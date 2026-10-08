"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  CheckCircle2,
  Camera,
  Award,
  Sparkles,
  TreePine,
  Trash2,
  Droplets,
  Zap,
  ShoppingBag,
  Bike,
  ShieldAlert,
} from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  category: "WASTE" | "WATER" | "ENERGY" | "PLASTIC_FREE" | "PLANTS" | "TRANSPORT";
  xpReward: number;
  impactType: string;
  impactAmount: number;
  impactUnit: string;
  isHighValue: boolean;
  dailyLimit: number;
  completedToday: boolean;
}

const CATEGORIES = [
  { id: "ALL", label: "All Quests", icon: Sparkles },
  { id: "WASTE", label: "Waste", icon: Trash2 },
  { id: "WATER", label: "Water", icon: Droplets },
  { id: "ENERGY", label: "Energy", icon: Zap },
  { id: "PLASTIC_FREE", label: "Plastic-Free", icon: ShoppingBag },
  { id: "PLANTS", label: "Plants & Trees", icon: TreePine },
  { id: "TRANSPORT", label: "Transport", icon: Bike },
];

export default function QuestLibraryPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuests() {
      try {
        const res = await fetch("/api/quests");
        const data = await res.json();
        setQuests(data.quests || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadQuests();
  }, []);

  const filteredQuests = quests.filter((q) => {
    const matchesCategory = activeCategory === "ALL" || q.category === activeCategory;
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Eco-Quest Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Explore challenges across 6 sustainability themes. Earn XP, maintain your streak, and shrink your school footprint.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-emerald-600/20 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quests (e.g. compost, tap, bike)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
          <p className="font-heading">Loading quests...</p>
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="font-heading font-bold text-base mb-1">No quests found matching your filter</p>
          <p className="text-xs">Try selecting a different category or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {quest.category.replace("_", " ")}
                  </span>
                  <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    +{quest.xpReward} XP
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                  {quest.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {quest.description}
                </p>

                {/* Impact formula badge & high value flag */}
                <div className="space-y-1.5 mb-6 text-xs">
                  <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Verified Yield:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      +{quest.impactAmount} {quest.impactUnit}
                    </span>
                  </div>

                  {quest.isHighValue && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>High Impact: Teacher Verification Required</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {quest.completedToday ? (
                  <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Completed Today (Daily Limit: {quest.dailyLimit})</span>
                  </div>
                ) : (
                  <Link
                    href={`/student/submit/${quest.id}`}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Submit Proof Now</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
