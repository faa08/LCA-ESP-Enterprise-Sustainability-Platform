import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

const frameworks = [
  { n: "landing.compliance.f1", full: "landing.compliance.full1", d: "landing.compliance.cd1" },
  { n: "landing.compliance.f2", full: "landing.compliance.full2", d: "landing.compliance.cd2" },
  { n: "landing.compliance.f3", full: "landing.compliance.full3", d: "landing.compliance.cd3" },
  { n: "landing.compliance.f4", full: "landing.compliance.full4", d: "landing.compliance.cd4" },
  { n: "landing.compliance.f5", full: "landing.compliance.full5", d: "landing.compliance.cd5" },
  { n: "landing.compliance.f6", full: "landing.compliance.full6", d: "landing.compliance.cd6" },
];

export default function Compliance({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="compliance" className="relative overflow-hidden bg-surface py-24">
      <div className="absolute -left-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.compliance.eyebrow")}
          title={t(dict, "landing.compliance.title")}
          description={t(dict, "landing.compliance.desc")}
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((f) => (
            <RevealItem key={f.n}>
              <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                    {t(dict, "landing.compliance.aligned")}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{t(dict, f.n)}</h3>
                <p className="text-xs font-medium text-neutral-400">{t(dict, f.full)}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{t(dict, f.d)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
