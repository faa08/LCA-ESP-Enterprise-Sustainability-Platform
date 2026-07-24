"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  ShieldCheck,
  Radio,
  TrendingDown,
  Bell,
  CircleCheck,
} from "lucide-react";
import { Reveal } from "./motion-primitives";
import { AnimatedCounter } from "./AnimatedCounter";
import { t } from "@/lib/i18n";

const float = (delay: number, y = [0, -10, 0]) => ({
  animate: { y },
  transition: {
    duration: 5,
    delay,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  },
});

function Sparkline() {
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f8b5f" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f8b5f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 28 L16 22 L32 24 L48 14 L64 18 L80 8 L96 12 L120 4"
        fill="none"
        stroke="#0f8b5f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M0 28 L16 22 L32 24 L48 14 L64 18 L80 8 L96 12 L120 4 L120 36 L0 36 Z" fill="url(#spark)" />
    </svg>
  );
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/80 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs font-medium text-neutral-400">ensPR · Executive Dashboard</span>
      </div>

      <div className="grid grid-cols-3 gap-px bg-neutral-100">
        {[
          { label: "Analisis LCA", value: "11/11", unit: "ISO 14040", delta: "Cradle-to-Grave" },
          { label: "PROPER Rank", value: "HIJAU", unit: "KLHK", delta: "Proyeksi EMAS" },
          { label: "Karbon Kredit", value: "350", unit: "tCO₂e", delta: "SRN-PPI Ready" },
        ].map((m) => (
          <div key={m.label} className="bg-white px-3.5 py-4">
            <div className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">{m.label}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-semibold text-ink">{m.value}</span>
              <span className="text-[10px] text-neutral-400">{m.unit}</span>
            </div>
            <div className="mt-1 text-[10px] font-semibold text-brand-600">{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-px bg-neutral-100">
        <div className="col-span-3 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Carbon trend & LCA Hotspot</span>
            <span className="text-[11px] text-neutral-400">12 months</span>
          </div>
          <Sparkline />
        </div>
        <div className="col-span-2 bg-white p-4">
          <div className="text-xs font-semibold text-ink">Standar & Registri</div>
          <div className="mt-3 space-y-2">
            {["LCA ISO 14040/44", "PROPER KLHK", "SRN-PPI Karbon", "IDXCarbon"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <CircleCheck className="h-3.5 w-3.5 text-brand-500" />
                <span className="text-[10px] text-neutral-600">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <Radio className="h-3.5 w-3.5 text-brand-500" /> Realtime CEMS IoT & ERP Ingestion
        </div>
      </div>
    </div>
  );
}

export default function Hero({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="absolute -right-32 top-32 -z-10 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-8">
        {/* Left */}
        <div>
          <Reveal delay={0.05}>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t(dict, "landing.hero.headlinePre")}
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                {t(dict, "landing.hero.headlineHi")}
              </span>{" "}
              {t(dict, "landing.hero.headlinePost")}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
              {t(dict, "landing.hero.desc")}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#demo"
                data-demo-trigger
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-brand transition-all hover:bg-brand-600 hover:shadow-lg"
              >
                {t(dict, "landing.hero.ctaDemo")}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="/platform"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                {t(dict, "landing.hero.ctaExplore")}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {["ISO 14040/14044 (LCA)", "PROPER KLHK", "SRN-PPI Karbon", "IDXCarbon", "Perpres 98/2021", "PermenLHK"].map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-brand-200 bg-emerald-50/60 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right */}
        <div className="relative">
          <Reveal direction="left" delay={0.1}>
            <DashboardMockup />
          </Reveal>

          {/* floating glass cards */}
          <motion.div {...float(0)} className="absolute -left-6 top-10 hidden sm:block">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-ink">ISO 14001</div>
                  <div className="text-[11px] text-brand-600">Certified</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...float(0.8)} className="absolute -right-6 top-24 hidden sm:block">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                  <Leaf className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-ink">Carbon</div>
                  <div className="text-[11px] text-neutral-500">Scope 1–3 tracked</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...float(1.4)} className="absolute -left-4 bottom-10 hidden sm:block">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                  <Radio className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-ink">Live data</div>
                  <div className="text-[11px] text-neutral-500">Synced every 2s</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...float(2)} className="absolute -right-4 bottom-16 hidden sm:block">
            <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-soft backdrop-blur-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15 text-amber-500">
                <Bell className="h-4 w-4" />
              </span>
              <div className="pr-1">
                <div className="text-[11px] font-semibold text-ink">Anomaly detected</div>
                <div className="text-[10px] text-neutral-500">Stack 3 emissions spike</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...float(1.1, [0, 8, 0])}
            className="absolute right-10 top-1/2 hidden lg:block"
          >
            <div className="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                  <TrendingDown className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-brand-600">-8.4%</div>
                  <div className="text-[10px] text-neutral-500">vs last quarter</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
