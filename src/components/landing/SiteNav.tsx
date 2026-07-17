"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import LandingLangSwitch from "./LandingLangSwitch";
import { getSite, type SiteContent } from "@/lib/site-content";

const platformLinks = [
  { label: "Overview", href: "/platform", desc: "The unified platform" },
  { label: "Architecture", href: "/platform#architecture", desc: "Open, enterprise-grade" },
  { label: "AI Engine", href: "/platform#ai", desc: "Explainable intelligence" },
  { label: "Integrations", href: "/platform#integrations", desc: "Connect your stack" },
  { label: "Security", href: "/platform#security", desc: "Governance by design" },
  { label: "Roadmap", href: "/platform#roadmap", desc: "What's next" },
];

export default function SiteNav({ site }: { site: SiteContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const modules = Object.values(site.modules).map((m) => ({
    label: m.name,
    href: `/modules/${m.slug}`,
    desc: m.tagline,
  }));

  const industries = Object.values(site.industries).map((i) => ({
    label: i.name,
    href: `/industries/${i.slug}`,
  }));

  const menus: Record<string, { title: string; href: string; items: { label: string; href: string; desc?: string }[] }> = {
    platform: { title: site.nav.platform, href: "/platform", items: platformLinks },
    modules: { title: site.nav.modules, href: "/modules", items: modules },
    industries: { title: site.nav.industries, href: "/industries", items: industries },
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl" : "border-b border-transparent bg-white/0"
      }`}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-brand">e</span>
            <span className="text-lg font-semibold tracking-tight text-ink">ensPR</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {Object.entries(menus).map(([key, menu]) => (
              <div key={key} onMouseEnter={() => setOpen(key)}>
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-ink"
                  onClick={() => setOpen(open === key ? null : key)}
                >
                  {menu.title}
                  <ChevronDown className={`h-4 w-4 transition-transform ${open === key ? "rotate-180" : ""}`} />
                </button>
              </div>
            ))}
            <a href="/compliance" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-ink">
              {site.nav.compliance}
            </a>
            <a href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-ink">
              {site.nav.about}
            </a>
            <a href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-ink">
              {site.nav.contact}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LandingLangSwitch />
          <Link href="/login" className="hidden text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-600 sm:block">
            {site.nav.signIn}
          </Link>
          <a href="/contact" data-demo-trigger className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-600 hover:shadow-lg">
            {site.nav.requestDemo}
          </a>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 hidden border-t border-neutral-200 bg-white shadow-soft lg:block"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-6 py-6 md:grid-cols-3">
              {menus[open].items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
                  onClick={() => setOpen(null)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{item.label}</div>
                    {item.desc && <div className="mt-0.5 text-xs text-neutral-500">{item.desc}</div>}
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
