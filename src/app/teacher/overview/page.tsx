"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Flame,
  Award,
  BellRing,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

interface StudentStat {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  totalXp: number;
  level: number;
  isInactive: boolean;
}

interface OverviewData {
  className: string;
  grade: string;
  totalStudents: number;
  participationRate: number;
  activeCount: number;
  inactiveCount: number;
  students: StudentStat[];
}

export default function TeacherOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nudgedStudents, setNudgedStudents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/teacher/overview");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSendNudge = (studentId: string, name: string) => {
    setNudgedStudents((prev) => ({ ...prev, [studentId]: true }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
        <p className="font-heading">Loading class engagement radar...</p>
      </div>
    );
  }

  const overview = data || {
    className: "Grade 7 EcoRangers",
    grade: "Grade 7",
    totalStudents: 10,
    participationRate: 90,
    activeCount: 9,
    inactiveCount: 1,
    students: [],
  };

  const inactives = overview.students.filter((s) => s.isInactive);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Class Engagement Radar: {overview.className}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Monitor daily participation rates, identify inactive students, and send positive habit reinforcement.
        </p>
      </div>

      {/* Participation Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Weekly Participation Rate
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
            {overview.participationRate}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${overview.participationRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {overview.activeCount} of {overview.totalStudents} students took an action
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Active Eco-Streaks
          </div>
          <div className="text-3xl font-extrabold font-heading text-amber-500 flex items-center gap-2">
            <Flame className="w-7 h-7 fill-amber-500" />
            {overview.activeCount} Students
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Logging daily habits consistently without breaking streak
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Needs Friendly Nudge
          </div>
          <div className="text-3xl font-extrabold font-heading text-rose-500">
            {overview.inactiveCount} Students
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Inactive for 2+ consecutive days
          </div>
        </div>
      </div>

      {/* Inactive Student Radar Section */}
      {inactives.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h2 className="font-bold font-heading text-base text-amber-900 dark:text-amber-200">
                Inactive Students Alert Radar
              </h2>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                These students haven't submitted a quest proof recently. Send a 1-tap positive eco-nudge to encourage them!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {inactives.map((student) => {
              const isNudged = nudgedStudents[student.id];
              return (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 shadow-sm flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{student.avatar || "🌱"}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-400">Streak: 0 days</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendNudge(student.id, student.name)}
                    disabled={isNudged}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
                      isNudged
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                    }`}
                  >
                    {isNudged ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Nudge Sent!</span>
                      </>
                    ) : (
                      <>
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Eco-Nudge</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Class Roster */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold font-heading text-slate-900 dark:text-white">
              Student Participation Roster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted by accumulated XP and streak persistence
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {overview.students.length} Students Enrolled
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {overview.students.map((student, idx) => (
            <div
              key={student.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-bold text-slate-400">
                  #{idx + 1}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xl shrink-0">
                  {student.avatar || "🌱"}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {student.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                      <Flame className="w-3 h-3 fill-amber-500" />
                      {student.streak}d streak
                    </span>
                    <span>•</span>
                    <span>Level {student.level}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-heading font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                  {student.totalXp.toLocaleString()} XP
                </div>
                <div className="text-[10px] text-slate-400">
                  {student.isInactive ? (
                    <span className="text-rose-500 font-semibold">Inactive</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Active</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
