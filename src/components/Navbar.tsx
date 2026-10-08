"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Leaf,
  Flame,
  Award,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface UserState {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  avatar?: string;
  streak?: number;
  totalXp?: number;
  levelInfo?: { level: number; progressPercent: number };
  className?: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    // Check initial dark mode
    const isDarkStored = localStorage.getItem("ecoquest_theme") === "dark";
    if (isDarkStored) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ecoquest_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ecoquest_theme", "dark");
      setIsDark(true);
    }
  };

  const handlePersonaSwitch = async (persona: "STUDENT" | "TEACHER" | "ADMIN") => {
    setPersonaDropdownOpen(false);
    setMobileMenuOpen(false);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      if (res.ok) {
        await fetchUser();
        if (persona === "STUDENT") router.push("/student");
        else if (persona === "TEACHER") router.push("/teacher/review");
        else if (persona === "ADMIN") router.push("/admin");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span className="font-heading font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                Eco<span className="text-emerald-600 dark:text-emerald-400">Quest</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                School Edition
              </span>
            </div>
          </Link>

          {/* Center Navigation Links based on role */}
          <div className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600 dark:text-slate-300">
            {user?.role === "STUDENT" && (
              <>
                <Link
                  href="/student"
                  className={`px-3 py-2 rounded-xl transition ${pathname === "/student" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/student/quests"
                  className={`px-3 py-2 rounded-xl transition ${pathname.startsWith("/student/quests") ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Quests
                </Link>
                <Link
                  href="/student/leaderboard"
                  className={`px-3 py-2 rounded-xl transition ${pathname === "/student/leaderboard" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Leaderboards
                </Link>
                <Link
                  href="/student/profile"
                  className={`px-3 py-2 rounded-xl transition ${pathname === "/student/profile" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Badges & Impact
                </Link>
              </>
            )}

            {user?.role === "TEACHER" && (
              <>
                <Link
                  href="/teacher/review"
                  className={`px-3 py-2 rounded-xl transition ${pathname.startsWith("/teacher/review") ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Review Queue
                </Link>
                <Link
                  href="/teacher/quests"
                  className={`px-3 py-2 rounded-xl transition ${pathname.startsWith("/teacher/quests") ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Custom Quests
                </Link>
                <Link
                  href="/teacher/overview"
                  className={`px-3 py-2 rounded-xl transition ${pathname.startsWith("/teacher/overview") ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  Class Radar
                </Link>
              </>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-xl transition ${pathname === "/admin" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  School Impact & Targets
                </Link>
              </>
            )}

            {!user && (
              <>
                <a href="#how-it-works" className="px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  How Verification Works
                </a>
                <a href="#roles" className="px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  3 Roles
                </a>
                <a href="#impact-preview" className="px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  School Impact
                </a>
              </>
            )}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student mini stats pill */}
            {user?.role === "STUDENT" && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs font-semibold">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  {user.streak ?? 0}d
                </span>
                <span className="h-3 w-px bg-amber-200 dark:bg-amber-800" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {user.totalXp ?? 0} XP
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px]">
                  Lvl {user.levelInfo?.level || 1}
                </span>
              </div>
            )}

            {/* Quick Persona Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Switch demo persona"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {user ? user.role : "Demo"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    1-Click Persona Switch
                  </div>
                  <button
                    onClick={() => handlePersonaSwitch("STUDENT")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">🎒 Maya Lin (Student)</div>
                      <div className="text-[11px] text-slate-500">Grade 7 EcoRangers • 480 XP</div>
                    </div>
                    {user?.role === "STUDENT" && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => handlePersonaSwitch("TEACHER")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">🍎 Mr. Davis (Teacher)</div>
                      <div className="text-[11px] text-slate-500">Grade 7 • Review Queue</div>
                    </div>
                    {user?.role === "TEACHER" && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => handlePersonaSwitch("ADMIN")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">🏛️ Principal Vance (Admin)</div>
                      <div className="text-[11px] text-slate-500">School Impact & Green Audit</div>
                    </div>
                    {user?.role === "ADMIN" && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Avatar or Login Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-lg shadow-sm"
                  title={`${user.name} (${user.role})`}
                >
                  {user.avatar || "🌱"}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95"
              >
                Log In
              </Link>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {user?.role === "STUDENT" && (
            <>
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Student Dashboard
              </Link>
              <Link
                href="/student/quests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Quest Library
              </Link>
              <Link
                href="/student/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Leaderboards
              </Link>
              <Link
                href="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Badges & Impact
              </Link>
            </>
          )}

          {user?.role === "TEACHER" && (
            <>
              <Link
                href="/teacher/review"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Review Queue
              </Link>
              <Link
                href="/teacher/quests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Create Custom Quests
              </Link>
              <Link
                href="/teacher/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Class Radar
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              School Green Audit & Metrics
            </Link>
          )}

          {!user && (
            <>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200"
              >
                How Verification Works
              </a>
              <a
                href="#roles"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200"
              >
                3 Roles
              </a>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
