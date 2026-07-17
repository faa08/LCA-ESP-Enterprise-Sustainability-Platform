import type { Metadata } from "next";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import { PageHero, SiteScreenshot, FeatureGrid, StepList, CtaBand } from "@/components/site/blocks";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/motion-primitives";

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === "en" || lang === "id" ? lang : "en";
  const s = getSite(locale);
  return {
    title: `${s.nav.platform} · ensPR`,
    description: s.platform.heroDesc,
  };
}

export default async function PlatformPage() {
  const locale = await getLocaleFromCookie();
  const s = getSite(locale);
  const p = s.platform;

  return (
    <>
      <PageHero eyebrow={p.heroEyebrow} title={p.heroTitle} desc={p.heroDesc} cta={p.heroCta} cta2={p.heroCta2}>
        <div className="mt-12 max-w-4xl">
          <SiteScreenshot label="ensPR · Platform" />
        </div>
      </PageHero>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{p.introEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{p.introTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{p.introDesc}</p>
            </Reveal>
            <Reveal direction="left">
              <SiteScreenshot label="ensPR · Operations" />
            </Reveal>
          </div>
        </div>
      </section>

      <FeatureGrid eyebrow={p.pillarsTitle} title={p.pillarsTitle} desc={p.pillarsDesc} items={[
        { title: "Unified visibility", desc: "One operational dashboard for emissions, energy, waste, water, and compliance — in real time." },
        { title: "Life cycle intelligence", desc: "End-to-end impact analysis from raw material to end of life." },
        { title: "AI that explains", desc: "Root-cause analysis and prioritized recommendations you can act on." },
        { title: "Audit-ready reporting", desc: "Automated GRI, TCFD, CDP, and ISO 14001-aligned disclosures." },
      ]} />

      <section id="architecture" className="bg-surface py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{p.archEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{p.archTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{p.archDesc}</p>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.archLayers.map((l) => (
              <RevealItem key={l.title}>
                <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-ink">{l.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{l.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="ai" className="bg-white py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{p.aiEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{p.aiTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{p.aiDesc}</p>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.aiFeatures.map((f) => (
              <RevealItem key={f.title}>
                <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{f.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="integrations" className="bg-surface py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{p.integEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{p.integTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{p.integDesc}</p>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 flex flex-wrap gap-3">
            {p.integList.map((i) => (
              <RevealItem key={i}>
                <span className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600">{i}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="security" className="bg-white py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{p.secEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{p.secTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{p.secDesc}</p>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.secList.map((f) => (
              <RevealItem key={f.title}>
                <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{f.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="roadmap" className="bg-surface py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{p.roadmapEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{p.roadmapTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{p.roadmapDesc}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {p.roadmapItems.map((r) => (
              <Reveal key={r.q}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-ink">{r.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand site={s} />
    </>
  );
}
