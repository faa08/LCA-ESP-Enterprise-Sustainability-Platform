"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import LandingLangSwitch from "./LandingLangSwitch";

const navItems = [
  { key: "landing.nav.platform", href: "#platform" },
  { key: "landing.nav.modules", href: "#modules" },
  { key: "landing.nav.how", href: "#how" },
  { key: "landing.nav.industries", href: "#industries" },
  { key: "landing.nav.compliance", href: "#compliance" },
];

export default function LandingNav({ dict }: { dict: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl"
          : "border-b border-transparent bg-white/0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-brand">
            e
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">ensPR</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ink"
            >
              {t(dict, item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LandingLangSwitch />
          <Link
            href="/select-role"
            className="hidden text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-600 sm:block"
          >
            {t(dict, "landing.nav.signin")}
          </Link>
          <a
            href="#demo"
            data-demo-trigger
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-600 hover:shadow-lg"
          >
            {t(dict, "landing.nav.requestDemo")}
          </a>
        </div>
      </div>
    </motion.header>
  );
}
