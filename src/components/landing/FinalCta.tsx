import { Reveal } from "./motion-primitives";
import { t } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export default function FinalCta({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="demo" className="relative overflow-hidden bg-ink py-24">
      {/* background illustration */}
      <div className="absolute inset-0 -z-0 bg-grid opacity-[0.06]" />
      <div className="absolute -left-24 top-0 -z-0 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -right-24 bottom-0 -z-0 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />

      {/* floating dashboard chips */}
      <MotionChip className="left-[8%] top-[18%]" delay={0} label={t(dict, "landing.cta.chip1")} />
      <MotionChip className="right-[10%] top-[24%]" delay={1} label={t(dict, "landing.cta.chip2")} />
      <MotionChip className="left-[14%] bottom-[16%]" delay={1.6} label={t(dict, "landing.cta.chip3")} />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-200">
            {t(dict, "landing.cta.eyebrow")}
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t(dict, "landing.cta.title")}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            {t(dict, "landing.cta.desc")}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#demo"
              data-demo-trigger
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-brand transition-all hover:bg-brand-400"
            >
              {t(dict, "landing.cta.demo")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/platform"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t(dict, "landing.cta.download")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MotionChip({
  className,
  delay,
  label,
}: {
  className: string;
  delay: number;
  label: string;
}) {
  return (
    <div
      className={`absolute hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur md:block ${className}`}
      style={{ animation: `floaty 6s ease-in-out ${delay}s infinite` }}
    >
      {label}
    </div>
  );
}
