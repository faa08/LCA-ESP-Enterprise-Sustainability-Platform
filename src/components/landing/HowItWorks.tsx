import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import { Factory, Download, BrainCircuit, GitBranch, ShieldCheck, FileText, ArrowDown } from "lucide-react";

const steps = [
  { icon: Factory, t: "landing.how.s1", d: "landing.how.d1" },
  { icon: Download, t: "landing.how.s2", d: "landing.how.d2" },
  { icon: BrainCircuit, t: "landing.how.s3", d: "landing.how.d3" },
  { icon: GitBranch, t: "landing.how.s4", d: "landing.how.d4" },
  { icon: ShieldCheck, t: "landing.how.s5", d: "landing.how.d5" },
  { icon: FileText, t: "landing.how.s6", d: "landing.how.d6" },
];

export default function HowItWorks({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="how" className="relative overflow-hidden bg-surface py-24">
      <div className="absolute -right-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.how.eyebrow")}
          title={t(dict, "landing.how.title")}
          description={t(dict, "landing.how.desc")}
        />

        <RevealGroup className="mt-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <RevealItem key={s.t} className="relative">
                <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
                  <div className="flex items-center gap-4">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand">
                      <s.icon className="h-5 w-5" />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="text-lg font-semibold text-ink">{t(dict, s.t)}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">{t(dict, s.d)}</p>
                </div>
                {(i === 0 || i === 2 || i === 4) && (
                  <div className="absolute -bottom-5 left-1/2 z-10 hidden -translate-x-1/2 text-brand-400 lg:block">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                )}
              </RevealItem>
            ))}
          </div>
          {/* connecting line on large screens */}
          <div className="pointer-events-none absolute left-0 right-0 top-[120px] hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block" />
        </RevealGroup>
      </div>
    </section>
  );
}
