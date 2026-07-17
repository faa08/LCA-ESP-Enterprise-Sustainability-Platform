import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/motion-primitives";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function PageHero({
  eyebrow,
  title,
  desc,
  cta,
  cta2,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  cta?: string;
  cta2?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-100 bg-surface">
      <div className="absolute -right-32 top-0 -z-0 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="absolute -left-32 -top-20 -z-0 h-96 w-96 rounded-full bg-brand-50/60 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">{title}</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">{desc}</p>
        </Reveal>
        {(cta || cta2) && (
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {cta && (
                <a href="#demo" data-demo-trigger className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-brand transition-all hover:bg-brand-600">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {cta2 && (
                <Link href={cta2} className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-600">
                  {cta2}
                </Link>
              )}
            </div>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export function SiteScreenshot({ label }: { label?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/80 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs font-medium text-neutral-400">{label ?? "ensPR"}</span>
      </div>
      <div className="relative h-64 bg-gradient-to-br from-neutral-50 to-brand-50/40 sm:h-80">
        <div className="absolute inset-6 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((c) => (
            <div key={c} className="rounded-xl border border-neutral-100 bg-white/80 p-3">
              <div className="h-2 w-1/2 rounded bg-neutral-200" />
              <div className="mt-3 h-12 rounded bg-brand-100/60" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-6 bottom-6 rounded-xl border border-neutral-100 bg-white/80 p-3">
          <div className="h-2 w-1/3 rounded bg-neutral-200" />
          <div className="mt-2 flex h-16 items-end gap-1.5">
            {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-brand-400/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureGrid({
  eyebrow,
  title,
  desc,
  items,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  items: { title: string; desc: string }[];
}) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={desc} />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <RevealItem key={it.title}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
                <div className="absolute inset-x-0 top-0 hidden h-1 bg-gradient-to-r from-brand-400 to-brand-600" />
                <h3 className="text-lg font-semibold text-ink">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{it.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function StepList({
  eyebrow,
  title,
  desc,
  steps,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  steps: { title: string; desc: string }[];
}) {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={desc} />
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <RevealItem key={s.title}>
              <div className="relative h-full rounded-2xl border border-neutral-200 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-brand">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function CtaBand({ site }: { site: SiteContent }) {
  return (
    <section id="demo" className="relative overflow-hidden bg-ink py-24">
      <div className="absolute inset-0 -z-0 bg-grid opacity-[0.06]" />
      <div className="absolute -left-24 top-0 -z-0 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -right-24 bottom-0 -z-0 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{site.nav.requestDemo}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">{site.contact.heroDesc}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#demo" data-demo-trigger className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-brand transition-all hover:bg-brand-400">
              {site.nav.requestDemo}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10">
              {site.nav.contact}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
