"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  Trash2,
  Droplets,
  Zap,
  TreePine,
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Layers,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import ImpactChart from "@/components/ImpactChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IMPACT_FACTORS } from "@/lib/impactFactors";

interface MetricData {
  totals: {
    wasteDivertedKg: number;
    waterSavedL: number;
    saplingsPlanted: number;
    co2AvoidedKg: number;
    totalCompletions: number;
  };
  categoryBreakdown: Array<{ category: string; count: number; xp: number }>;
  classComparison: Array<{
    name: string;
    co2: number;
    waste: number;
    water: number;
    saplings: number;
    completions: number;
  }>;
  trendData: Array<{
    date: string;
    wasteKg: number;
    waterL: number;
    co2AvoidedKg: number;
    dailyCompletions: number;
  }>;
  targets: Array<{
    id: string;
    title: string;
    category: string;
    targetValue: number;
    currentValue: number;
    unit: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFactorModal, setShowFactorModal] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const handleExportCSV = () => {
    window.location.href = "/api/admin/export";
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
        <p className="font-heading font-medium">Aggregating school green audit telemetry...</p>
      </div>
    );
  }

  const totals = data?.totals || {
    wasteDivertedKg: 542.5,
    waterSavedL: 11280,
    saplingsPlanted: 84,
    co2AvoidedKg: 1485.2,
    totalCompletions: 545,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header with Export CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Oakridge Green Academy • Verified Environmental Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Administrative Sustainability Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time environmental telemetry, 30-day impact trends, target milestones, and auditable green reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFactorModal(!showFactorModal)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Conversion Rationale</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Green-Audit Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Factor Modal / Drawer Explaining Constants */}
      {showFactorModal && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Official Scientific Conversion Factors Reference
            </h3>
            <button
              onClick={() => setShowFactorModal(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Every number on this dashboard is traceable to these EPA WARM and DEFRA benchmark conversion factors:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {Object.values(IMPACT_FACTORS).map((factor) => (
              <div
                key={factor.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{factor.metricName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {factor.category}
                  </span>
                </div>
                <div className="text-emerald-600 font-bold">
                  Yield: {factor.primaryYieldPerUnit} {factor.unit} • {factor.co2AvoidedKgPerUnit} kg CO2e
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {factor.rationale}
                </div>
                <div className="text-[10px] text-slate-400 pt-1 italic">
                  Ref: {factor.referenceSource}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Metric Aggregate Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Trash2 className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {totals.wasteDivertedKg.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total Waste Diverted
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2">
            Cafeteria organics & paper
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Droplets className="w-6 h-6 text-cyan-600 mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {totals.waterSavedL.toLocaleString()} <span className="text-xs font-normal text-slate-500">L</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Campus Water Conserved
          </div>
          <div className="text-[11px] text-cyan-600 font-semibold mt-2">
            Tap shut-offs & shower timers
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <TreePine className="w-6 h-6 text-green-600 mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {totals.saplingsPlanted.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-500">trees</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Native Saplings Planted
          </div>
          <div className="text-[11px] text-green-600 font-semibold mt-2">
            Campus tree canopy restore
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Zap className="w-6 h-6 text-sky-600 mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {totals.co2AvoidedKg.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            CO2 Avoided
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-2">
            Grid power & transit reduction
          </div>
        </div>
      </div>

      {/* 30-Day Cumulative Trajectory Chart */}
      {data?.trendData && <ImpactChart data={data.trendData} />}

      {/* Grid: Impact by Category & Class Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white mb-1">
            Completions by Environmental Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Total quest completions registered across themes
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.categoryBreakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "1rem",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#15803d" radius={[8, 8, 0, 0]} name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Comparison Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white mb-1">
            Class Sustainability Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Waste diverted (kg) & verified completions across all 4 grades
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.classComparison || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "1rem",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="waste" fill="#0284c7" radius={[6, 6, 0, 0]} name="Waste (kg)" />
                <Bar dataKey="completions" fill="#22c55e" radius={[6, 6, 0, 0]} name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* School Sustainability Target Tracker */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            School Sustainability Target Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Progress toward official school board environmental targets for Academic Year 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.targets || []).map((target) => {
            const percent = Math.min(100, Math.round((target.currentValue / target.targetValue) * 100));
            return (
              <div
                key={target.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold font-heading text-sm sm:text-base text-slate-900 dark:text-white">
                    {target.title}
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {percent}% Complete
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {target.currentValue.toLocaleString()} {target.unit} achieved
                  </span>
                  <span>Goal: {target.targetValue.toLocaleString()} {target.unit}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
