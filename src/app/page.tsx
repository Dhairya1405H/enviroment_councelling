"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSimulator from "@/components/HeroSimulator";
import ImpactChart from "@/components/ImpactChart";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Leaf,
  Droplets,
  Zap,
  Trash2,
  TreePine,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [totals, setTotals] = useState({
    wasteDivertedKg: 542.5,
    waterSavedL: 11280,
    saplingsPlanted: 84,
    co2AvoidedKg: 1485.2,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();
        if (json.totals) setTotals(json.totals);
        if (json.trendData) setChartData(json.trendData);
      } catch (err) {
        console.error("Failed to load metrics:", err);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Gamified Environmental Education for Schools</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white leading-[1.15]">
            Turn Sustainability Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
              Daily Habits.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Designed for students aged 10–17. Complete practical eco-quests, earn XP and badges, compete as classes, and empower your school with verified, scientifically-traceable environmental impact.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Explore Demo Accounts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Interactive Hero Simulator */}
        <div className="mt-8">
          <HeroSimulator />
        </div>
      </section>

      {/* How Verification Works (3 Steps) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
            How Quest Verification Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Rigorous, anti-cheat validation built specifically for school environments while honoring child privacy laws.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 font-heading font-extrabold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Snap Photo or Log Activity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Students take action: sorting compost, shutting running taps, or biking. Submit a photo proof or short written activity log (designed for students without a smartphone camera).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 font-heading font-extrabold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              AI Pre-Check & Anti-Cheat
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our automated engine analyzes image context and hashes. Duplicate photos are rejected instantly, standard actions auto-approve, and high-impact quests route to the teacher queue.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 font-heading font-extrabold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Teacher Review & Privacy Purge
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Teachers give 1-tap approvals with encouraging feedback. To safeguard student privacy, proof photos are automatically deleted from server storage upon verification.
            </p>
          </div>
        </div>
      </section>

      {/* The Three Roles Section */}
      <section id="roles" className="py-16 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Built for Every School Role
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              A unified system providing age-appropriate gamification, teacher oversight, and administrative sustainability reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Student Role */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-500/20 hover:border-emerald-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl mb-4">
                  🎒
                </div>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Students (Aged 10–17)
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                  Eco-Hero Student App
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Daily streak multiplier & level progression</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Six quest categories (Waste, Water, Energy, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Class vs Class and School-wide leaderboards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlockable badges & personal carbon footprint</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/student"
                className="mt-6 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl text-center transition"
              >
                View Student Demo (Maya) →
              </Link>
            </div>

            {/* Teacher Role */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-amber-500/20 hover:border-amber-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-2xl mb-4">
                  🍎
                </div>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Classroom Teachers
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                  Teacher Command Center
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>1-Tap Approve/Reject queue with AI confidence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Create custom curriculum-aligned class quests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Class participation & inactive student radar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Send friendly encouragement eco-nudges</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/teacher/review"
                className="mt-6 w-full py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-xl text-center transition"
              >
                View Teacher Demo (Mr. Davis) →
              </Link>
            </div>

            {/* Admin Role */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-sky-500/20 hover:border-sky-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-2xl mb-4">
                  🏛️
                </div>
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
                  School Administrators
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                  Green Audit Dashboard
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Live impact counters: kg waste, litres water, trees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>30-Day Recharts trajectories & class comparisons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>School-wide sustainability target trackers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Export CSV Green-Audit with conversion formulas</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/admin"
                className="mt-6 w-full py-2.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-300 font-bold text-xs rounded-xl text-center transition"
              >
                View Admin Demo (Principal) →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Impact Preview Section */}
      <section id="impact-preview" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
            Oakridge Academy Live Impact Preview
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Real data generated from 40 students over the last 30 days of sustainable actions.
          </p>
        </div>

        {/* Live Counters Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Trash2 className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {totals.wasteDivertedKg.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Waste Diverted</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Droplets className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {totals.waterSavedL.toFixed(0)} <span className="text-xs font-normal text-slate-500">L</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Water Conserved</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <TreePine className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {Math.round(totals.saplingsPlanted)} <span className="text-xs font-normal text-slate-500">trees</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Saplings Planted</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Zap className="w-6 h-6 mx-auto mb-2 text-sky-600" />
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {totals.co2AvoidedKg.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">CO2 Footprint Avoided</div>
          </div>
        </div>

        {/* Live Recharts component */}
        {chartData.length > 0 && <ImpactChart data={chartData} />}
      </section>

      {/* Demo Persona Switcher Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Try the Live Demo Accounts Now
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            Choose any role to instantly log in and test the student submission flow, the teacher review queue, or the admin carbon audit report.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-emerald-800 font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105"
            >
              Go to Demo Login Page →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>EcoQuest • Environmental Education for Schools</span>
          </div>
          <div>
            Built with Next.js, SQLite, and Prisma • EPA WARM & WaterSense Standard Conversion Factors
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Child Privacy Compliant (FERPA/COPPA)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
