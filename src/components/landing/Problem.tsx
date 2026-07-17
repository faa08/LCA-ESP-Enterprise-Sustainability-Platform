import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import { Database, Scale, FileClock, BrainCircuit } from "lucide-react";

const problems = [
  { icon: Database, t: "landing.problem.t1", d: "landing.problem.d1" },
  { icon: Scale, t: "landing.problem.t2", d: "landing.problem.d2" },
  { icon: FileClock, t: "landing.problem.t3", d: "landing.problem.d3" },
  { icon: BrainCircuit, t: "landing.problem.t4", d: "landing.problem.d4" },
];

export default function Problem({ dict }: { dict: Record<string, string> }) {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.problem.eyebrow")}
          title={t(dict, "landing.problem.title")}
          description={t(dict, "landing.problem.desc")}
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <RevealItem key={p.t}>
              <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{t(dict, p.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t(dict, p.d)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
