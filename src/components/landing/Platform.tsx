import { SectionHeading } from "./SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import { LayoutDashboard, GitBranch, Sparkles, LineChart } from "lucide-react";

const pillars = [
  { icon: LayoutDashboard, t: "landing.platform.t1", d: "landing.platform.d1" },
  { icon: GitBranch, t: "landing.platform.t2", d: "landing.platform.d2" },
  { icon: Sparkles, t: "landing.platform.t3", d: "landing.platform.d3" },
  { icon: LineChart, t: "landing.platform.t4", d: "landing.platform.d4" },
];

export default function Platform({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="platform" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.platform.eyebrow")}
          title={t(dict, "landing.platform.title")}
          description={t(dict, "landing.platform.desc")}
        />

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-4">
          {pillars.map((p) => (
            <RevealItem key={p.t}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600" />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{t(dict, p.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t(dict, p.d)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <a
              href="#modules"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              {t(dict, "landing.platform.seeAll")}
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
