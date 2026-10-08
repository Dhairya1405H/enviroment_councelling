"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Users,
  Target,
  Sparkles,
  Flame,
  Medal,
  CheckCircle2,
} from "lucide-react";

interface ClassRanking {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
  totalXp: number;
  avgXp: number;
}

interface StudentRanking {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  className: string;
  totalXp: number;
  streak: number;
  level: number;
}

interface SchoolTarget {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"classes" | "students">("classes");
  const [classRankings, setClassRankings] = useState<ClassRanking[]>([]);
  const [studentRankings, setStudentRankings] = useState<StudentRanking[]>([]);
  const [targets, setTargets] = useState<SchoolTarget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboards() {
      try {
        const res = await fetch("/api/leaderboards");
        const data = await res.json();
        setClassRankings(data.classRankings || []);
        setStudentRankings(data.studentRankings || []);
        setTargets(data.targets || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboards();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Leaderboards & Campus Targets
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Celebrate top classes, student eco-heroes, and collective school sustainability milestones.
        </p>
      </div>

      {/* School Team Goal Progress Bar Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-700/15 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Oakridge Green Academy • Community Team Goals
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading mt-0.5">
              Campus Environmental Targets
            </h2>
          </div>
          <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            Term 1 Active Target
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {targets.map((tgt) => {
            const percent = Math.min(100, Math.round((tgt.currentValue / tgt.targetValue) * 100));
            return (
              <div
                key={tgt.id}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2"
              >
                <div className="text-xs font-bold line-clamp-1">{tgt.title}</div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-lg font-extrabold font-heading text-amber-300">
                    {tgt.currentValue.toLocaleString()} {tgt.unit}
                  </span>
                  <span className="text-emerald-100 text-[11px]">
                    of {tgt.targetValue.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-300 h-full rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-right text-[10px] text-emerald-100 font-bold">
                  {percent}% achieved
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard View Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setTab("classes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            tab === "classes"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Class vs Class Cup</span>
        </button>

        <button
          onClick={() => setTab("students")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            tab === "students"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>School-Wide Top Students</span>
        </button>
      </div>

      {/* Main Leaderboard Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
          <p className="font-heading">Loading rankings...</p>
        </div>
      ) : tab === "classes" ? (
        /* Class vs Class Standings */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold font-heading text-slate-900 dark:text-white">
              Inter-Class Sustainability Standings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by total verified class XP accumulated this term
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {classRankings.map((cls, idx) => (
              <div
                key={cls.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  idx === 0 ? "bg-amber-50/40 dark:bg-amber-950/20" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      idx === 0
                        ? "bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30 text-lg"
                        : idx === 1
                        ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        : idx === 2
                        ? "bg-amber-700/30 text-amber-900 dark:text-amber-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                  </div>

                  <div>
                    <div className="font-bold font-heading text-sm sm:text-base text-slate-900 dark:text-white">
                      {cls.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {cls.studentCount} students enrolled • Avg: {cls.avgXp} XP/student
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                    {cls.totalXp.toLocaleString()} XP
                  </div>
                  <div className="text-[11px] text-slate-400">Class Total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* School-Wide Student Rankings */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold font-heading text-slate-900 dark:text-white">
              Individual Top Eco-Heroes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students leading Oakridge Academy in verified sustainability achievements
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentRankings.map((student) => (
              <div
                key={student.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      student.rank <= 3
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold"
                        : "text-slate-400"
                    }`}
                  >
                    #{student.rank}
                  </span>

                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xl shrink-0">
                    {student.avatar || "🌱"}
                  </div>

                  <div>
                    <div className="font-bold font-heading text-xs sm:text-sm text-slate-900 dark:text-white">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{student.className}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        {student.streak}d streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                    {student.totalXp.toLocaleString()} XP
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    Level {student.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
