import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { AnimatedCounter } from "./AnimatedCounter";
import { t } from "@/lib/i18n";
import { Quote } from "lucide-react";

const cases = [
  {
    company: "PT Petrokimia Gresik",
    name: "Reza Hartono",
    quoteKey: "landing.testimonials.c1quote",
    roleKey: "landing.testimonials.c1role",
    beforeKey: "landing.testimonials.c1before",
    afterKey: "landing.testimonials.c1after",
    s1Key: "landing.testimonials.c1s1l",
    s2Key: "landing.testimonials.c1s2l",
    stats: [
      { v: 85, suffix: "%" },
      { v: 100, suffix: "%" },
    ],
  },
  {
    company: "Krakatau Steel",
    name: "Sandra Wijaya",
    quoteKey: "landing.testimonials.c2quote",
    roleKey: "landing.testimonials.c2role",
    beforeKey: "landing.testimonials.c2before",
    afterKey: "landing.testimonials.c2after",
    s1Key: "landing.testimonials.c2s1l",
    s2Key: "landing.testimonials.c2s2l",
    stats: [
      { v: 22, suffix: "%" },
      { v: 3, suffix: "x" },
    ],
  },
  {
    company: "Indocement",
    name: "Ahmad Prasetyo",
    quoteKey: "landing.testimonials.c3quote",
    roleKey: "landing.testimonials.c3role",
    beforeKey: "landing.testimonials.c3before",
    afterKey: "landing.testimonials.c3after",
    s1Key: "landing.testimonials.c3s1l",
    s2Key: "landing.testimonials.c3s2l",
    stats: [
      { v: 98, suffix: "%" },
      { v: 0, suffix: "" },
    ],
  },
];

export default function Testimonials({ dict }: { dict: Record<string, string> }) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.testimonials.eyebrow")}
          title={t(dict, "landing.testimonials.title")}
          description={t(dict, "landing.testimonials.desc")}
        />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {cases.map((c) => (
            <RevealItem key={c.company}>
              <figure className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <Quote className="h-7 w-7 text-brand-200" />
                <blockquote className="mt-4 text-sm leading-relaxed text-neutral-700">“{t(dict, c.quoteKey)}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink">{c.name}</div>
                    <div className="text-xs text-neutral-500">{t(dict, c.roleKey)} · {c.company}</div>
                  </div>
                </figcaption>
                <div className="mt-5 rounded-xl border border-neutral-100 bg-surface p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">{t(dict, "landing.testimonials.before")}</span>
                    <span className="text-neutral-400">{t(dict, "landing.testimonials.after")}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                    <span className="text-neutral-500 line-through decoration-neutral-300">{t(dict, c.beforeKey)}</span>
                    <span className="text-brand-600">{t(dict, c.afterKey)}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
                    {c.stats.map((s, i) => (
                      <div key={i}>
                        <div className="text-lg font-bold text-ink">
                          <AnimatedCounter value={s.v} suffix={s.suffix} />
                        </div>
                        <div className="text-[10px] leading-tight text-neutral-500">{t(dict, i === 0 ? c.s1Key : c.s2Key)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
