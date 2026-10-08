"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, CheckCircle2, Sparkles, BookOpen, AlertCircle } from "lucide-react";

export default function CreateCustomQuestPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("WASTE");
  const [xpReward, setXpReward] = useState("45");
  const [impactAmount, setImpactAmount] = useState("1.0");
  const [impactUnit, setImpactUnit] = useState("kg");
  const [isHighValue, setIsHighValue] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("1");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customQuests, setCustomQuests] = useState<any[]>([]);

  useEffect(() => {
    loadCustomQuests();
  }, []);

  const loadCustomQuests = async () => {
    try {
      const res = await fetch("/api/quests");
      const data = await res.json();
      setCustomQuests(data.quests || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          xpReward: Number(xpReward),
          impactAmount: Number(impactAmount),
          impactUnit,
          isHighValue,
          dailyLimit: Number(dailyLimit),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create quest");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTitle("");
      setDescription("");
      loadCustomQuests();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Create Custom Class Quests
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Publish tailored environmental challenges aligned with your science and sustainability curriculum.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation Form (Col 7) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
          >
            {success && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom quest successfully published to student library!</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Quest Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Science Lab Microscope Shutdown Audit"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description & Instructions
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what steps the students must carry out and what proof to submit..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Environmental Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                >
                  <option value="WASTE">WASTE (Composting, Sorting)</option>
                  <option value="WATER">WATER (Conservation, Audits)</option>
                  <option value="ENERGY">ENERGY (Power Downs, LEDs)</option>
                  <option value="PLASTIC_FREE">PLASTIC-FREE (Packaging, BYO)</option>
                  <option value="PLANTS">PLANTS (Gardening, Trees)</option>
                  <option value="TRANSPORT">TRANSPORT (Active Commutes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  XP Reward
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  required
                  value={xpReward}
                  onChange={(e) => setXpReward(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Impact Yield per Completion
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={impactAmount}
                  onChange={(e) => setImpactAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Impact Unit
                </label>
                <input
                  type="text"
                  required
                  value={impactUnit}
                  onChange={(e) => setImpactUnit(e.target.value)}
                  placeholder="kg, Litres, kWh, items"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  High Impact / Mandatory Teacher Review
                </div>
                <div className="text-[11px] text-slate-500">
                  Submissions will always queue for teacher review rather than auto-verifying
                </div>
              </div>
              <input
                type="checkbox"
                checked={isHighValue}
                onChange={(e) => setIsHighValue(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? "Publishing Quest..." : "Publish Quest to Class"}</span>
            </button>
          </form>
        </div>

        {/* Existing Quests Sidebar (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-bold font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Active School Quests ({customQuests.length})
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {customQuests.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">{q.title}</span>
                  <span className="text-emerald-600">+{q.xpReward} XP</span>
                </div>
                <p className="text-slate-500 line-clamp-2">{q.description}</p>
                <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-2">
                  <span>{q.category}</span>
                  <span>•</span>
                  <span>Yield: +{q.impactAmount} {q.impactUnit}</span>
                  {q.isHighValue && <span className="text-amber-600 font-bold">• High Value</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
