"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface TrendPoint {
  date: string;
  wasteKg: number;
  waterL: number;
  co2AvoidedKg: number;
  dailyCompletions: number;
}

interface ImpactChartProps {
  data: TrendPoint[];
}

export default function ImpactChart({ data }: ImpactChartProps) {
  const [metric, setMetric] = useState<"co2AvoidedKg" | "wasteKg" | "waterL">("co2AvoidedKg");

  const metricConfig = {
    co2AvoidedKg: {
      label: "CO2 Avoided (kg)",
      color: "#0284c7",
      gradientId: "colorCo2",
      unit: "kg CO2e",
    },
    wasteKg: {
      label: "Waste Diverted (kg)",
      color: "#15803d",
      gradientId: "colorWaste",
      unit: "kg",
    },
    waterL: {
      label: "Water Conserved (Litres)",
      color: "#0ea5e9",
      gradientId: "colorWater",
      unit: "L",
    },
  };

  const currentConfig = metricConfig[metric];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
            School-Wide 30-Day Impact Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Traceable cumulative environmental savings logged across 40 students
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setMetric("co2AvoidedKg")}
            className={`px-3 py-1.5 rounded-xl transition ${
              metric === "co2AvoidedKg"
                ? "bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            CO2 Avoided
          </button>
          <button
            onClick={() => setMetric("wasteKg")}
            className={`px-3 py-1.5 rounded-xl transition ${
              metric === "wasteKg"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Waste Diverted
          </button>
          <button
            onClick={() => setMetric("waterL")}
            className={`px-3 py-1.5 rounded-xl transition ${
              metric === "waterL"
                ? "bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Water Saved
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "1rem",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
              formatter={(value: any) => [`${value} ${currentConfig.unit}`, currentConfig.label]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={currentConfig.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
