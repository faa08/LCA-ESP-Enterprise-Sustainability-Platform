"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { t } from "@/lib/i18n";

const faqs = [
  { q: "landing.faq.q1", a: "landing.faq.a1" },
  { q: "landing.faq.q2", a: "landing.faq.a2" },
  { q: "landing.faq.q3", a: "landing.faq.a3" },
  { q: "landing.faq.q4", a: "landing.faq.a4" },
  { q: "landing.faq.q5", a: "landing.faq.a5" },
];

export default function Faq({ dict }: { dict: Record<string, string> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.faq.eyebrow")}
          title={t(dict, "landing.faq.title")}
          description={t(dict, "landing.faq.desc")}
        />

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-ink">{t(dict, f.q)}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-brand-600 transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-brand-50" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-600">{t(dict, f.a)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
