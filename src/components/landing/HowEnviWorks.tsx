import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { Database, ShieldCheck, Brain, ClipboardCheck, LayoutDashboard, ArrowRight, ArrowDown } from "lucide-react";
import type { HowWorksStep } from "@/lib/site-content";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import Link from "next/link";

const icons: Record<HowWorksStep["icon"], typeof Database> = {
  database: Database,
  shield: ShieldCheck,
  brain: Brain,
  clipboard: ClipboardCheck,
  dashboard: LayoutDashboard,
};

export default async function HowEnviWorks() {
  const locale = await getLocaleFromCookie();
  const site = getSite(locale);
  const hw = site.howWorks;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={hw.label} title={hw.title} description={hw.subtitle} />

        <RevealGroup className="mt-16 lg:flex lg:items-stretch">
          {hw.steps.map((step, i) => {
            const Icon = icons[step.icon];
            const isLast = i === hw.steps.length - 1;
            return (
              <div key={step.title} className="contents">
                <RevealItem className="lg:flex-1">
                  <div className="group relative flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-soft">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-brand">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-bold text-neutral-400">
                        {i + 1}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.desc}</p>

                    <ul className="mt-4 space-y-1.5">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700 [animation:badge-pulse_2.4s_ease-in-out_infinite]">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      {step.badge}
                    </span>
                  </div>
                </RevealItem>

                {!isLast && (
                  <div className="flex items-center justify-center py-3 lg:w-10 lg:py-0">
                    <div className="relative flex h-8 w-px items-center justify-center lg:h-full lg:w-8">
                      <span className="absolute inset-0 hidden bg-gradient-to-b from-brand-200 via-brand-400 to-brand-200 bg-[length:200%_200%] opacity-60 [animation:flow_2.5s_linear_infinite] lg:block lg:w-px lg:bg-gradient-to-r" />
                      <span className="absolute inset-0 bg-gradient-to-b from-brand-200 via-brand-400 to-brand-200 bg-[length:200%_200%] opacity-60 [animation:flow_2.5s_linear_infinite] lg:hidden" />
                      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-500">
                        <ArrowDown className="h-4 w-4 lg:hidden" />
                        <ArrowRight className="hidden h-4 w-4 lg:block" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </RevealGroup>

        <RevealGroup className="mt-16">
          <RevealItem>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-surface px-8 py-12 text-center shadow-soft">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-100/50 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-100/40 blur-3xl" />
              <div className="relative">
                <h3 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{hw.summary.title}</h3>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">{hw.summary.desc}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/platform"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-brand transition-all hover:bg-brand-600"
                  >
                    {hw.summary.cta1}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-base font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
                  >
                    {hw.summary.cta2}
                  </Link>
                </div>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
