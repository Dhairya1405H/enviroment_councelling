"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, ArrowRight, UserCheck, Shield, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePersonaLogin = async (persona: "STUDENT" | "TEACHER" | "ADMIN") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (persona === "STUDENT") router.push("/student");
      else if (persona === "TEACHER") router.push("/teacher/review");
      else if (persona === "ADMIN") router.push("/admin");
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      const role = data.user.role;
      if (role === "STUDENT") router.push("/student");
      else if (role === "TEACHER") router.push("/teacher/review");
      else if (role === "ADMIN") router.push("/admin");
    } catch {
      setError("Failed to sign in");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition">
            <Leaf className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Sign In to <span className="text-emerald-600 dark:text-emerald-400">EcoQuest</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Oakridge Green Academy • Gamified Environmental Education Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Fast Demo Persona Switchers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                1-Click Demo Evaluation Logins
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handlePersonaLogin("STUDENT")}
                className="w-full p-3 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-left transition flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎒</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Maya Lin (Student Demo)
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Grade 7 EcoRangers • Quests, Badges & Streaks
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handlePersonaLogin("TEACHER")}
                className="w-full p-3 rounded-2xl border-2 border-amber-500/30 hover:border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-left transition flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Mr. Marcus Davis (Teacher Demo)
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-300">
                      Review Queue, Custom Quests & Class Radar
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition" />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handlePersonaLogin("ADMIN")}
                className="w-full p-3 rounded-2xl border-2 border-sky-500/30 hover:border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-left transition flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Principal Vance (Admin Demo)
                    </div>
                    <div className="text-[11px] text-sky-700 dark:text-sky-300">
                      Impact Telemetry, Targets & Green Audit CSV
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">
                Or sign in with email credentials
              </span>
            </div>
          </div>

          {/* Standard Email/Password Form */}
          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                School Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.maya@oakridge.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <div className="text-[11px] text-slate-400 mt-1">
                (Default seed password: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">password123</code>)
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            <Link href="/" className="hover:text-emerald-600 transition">
              ← Return to EcoQuest Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
