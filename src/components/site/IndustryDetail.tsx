import Link from "next/link";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite, type SiteContent } from "@/lib/site-content";
import { PageHero, SiteScreenshot, FeatureGrid, StepList, CtaBand } from "@/components/site/blocks";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/motion-primitives";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { ArrowRight } from "lucide-react";

export function IndustryDetail({ site, slug }: { site: SiteContent; slug: string }) {
  const ind = site.industries[slug];
  if (!ind) return null;
  const moduleNames = ind.modules
    .map((ms) => site.modules[ms]?.name)
    .filter(Boolean) as string[];

  return (
    <>
      <PageHero eyebrow="Industry" title={ind.heroTitle} desc={ind.heroDesc} cta={site.nav.requestDemo} cta2="/industries">
        <div className="mt-12 max-w-4xl">
          <SiteScreenshot label={`ensPR · ${ind.name}`} />
        </div>
      </PageHero>

      <FeatureGrid eyebrow="Challenges" title="The challenges you face" items={ind.challenges} />
      <FeatureGrid eyebrow="How ensPR helps" title="How ensPR solves them" items={ind.solutions} />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Relevant modules</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Built for your operation</h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ind.modules.map((ms) => {
              const m = site.modules[ms];
              if (!m) return null;
              return (
                <RevealItem key={ms}>
                  <Link href={`/modules/${ms}`} className="group flex h-full items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-soft">
                    <span className="text-sm font-semibold text-ink">{m.name}</span>
                    <ArrowRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-soft sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Case study</span>
              <blockquote className="mt-4 text-xl font-medium leading-relaxed text-ink">“{ind.caseStudy.quote}”</blockquote>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                <figcaption>
                  <div className="text-sm font-semibold text-ink">{ind.caseStudy.name}</div>
                  <div className="text-xs text-neutral-500">{ind.caseStudy.role} · {ind.caseStudy.company}</div>
                </figcaption>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-600">{ind.caseStudy.metricValue}</div>
                  <div className="text-xs text-neutral-500">{ind.caseStudy.metricLabel}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand site={site} />
    </>
  );
}
