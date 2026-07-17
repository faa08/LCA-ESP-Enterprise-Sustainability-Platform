import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite, type SiteContent } from "@/lib/site-content";
import { PageHero, SiteScreenshot, FeatureGrid, StepList, CtaBand } from "@/components/site/blocks";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/motion-primitives";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { ArrowRight } from "lucide-react";

export function ModuleDetail({ site, slug }: { site: SiteContent; slug: string }) {
  const m = site.modules[slug];
  if (!m) return null;

  const gallery = m.gallery.map((g, i) => (
    <RevealItem key={g}>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
        <div className="relative h-44 bg-gradient-to-br from-neutral-50 to-brand-50/40">
          <div className="absolute inset-4 rounded-xl border border-neutral-100 bg-white/70 p-3">
            <div className="h-2 w-1/2 rounded bg-neutral-200" />
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {[40, 65, 50, 80, 60, 95, 70].map((h, j) => (
                <div key={j} className="flex-1 rounded-t bg-brand-400/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-600">{g}</div>
      </div>
    </RevealItem>
  ));

  return (
    <>
      <PageHero eyebrow={m.tagline} title={m.heroTitle} desc={m.heroDesc} cta={site.nav.requestDemo} cta2="/modules">
        <div className="mt-12 max-w-4xl">
          <SiteScreenshot label={`ensPR · ${m.name}`} />
        </div>
      </PageHero>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">{m.overview}</p>
          </Reveal>
        </div>
      </section>

      <FeatureGrid eyebrow="Benefits" title="Why teams choose it" items={m.benefits} />
      <FeatureGrid eyebrow="Features" title="Key features" items={m.features} />
      <StepList eyebrow="Workflow" title="How it works" steps={m.workflow} />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Integrations</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Connects to your stack</h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-8 flex flex-wrap gap-3">
            {m.integrations.map((i) => (
              <RevealItem key={i}>
                <span className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600">{i}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Gallery</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Screenshot gallery</h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{gallery}</RevealGroup>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">FAQ</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Questions</h2>
            </div>
          </Reveal>
          <div className="mt-8 space-y-3">
            {m.faqs.map((f) => (
              <Reveal key={f.q}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-base font-semibold text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand site={site} />
    </>
  );
}

export async function generateModuleParams() {
  const { moduleSlugs } = await import("@/lib/site-content");
  return moduleSlugs.map((slug) => ({ slug }));
}
