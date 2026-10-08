import type { Metadata, Viewport } from "next";
import { Fredoka, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoQuest - Gamified Environmental Education Platform for Schools",
  description:
    "Turn sustainability into daily habits for students aged 10-17. Complete eco-quests, earn XP and badges, compete as classes, and track verified school impact data.",
  keywords: [
    "sustainability",
    "eco-quests",
    "school environmental education",
    "gamification",
    "green schools",
    "carbon audit",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${atkinson.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
