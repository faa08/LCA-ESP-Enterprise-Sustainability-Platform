import type { Metadata } from "next";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import { PageHero, SiteScreenshot, FeatureGrid, CtaBand } from "@/components/site/blocks";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/motion-primitives";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSite("en");
  return { title: `${s.about.heroTitle} · ensPR`, description: s.about.heroDesc };
}

export default async function AboutPage() {
  const locale = await getLocaleFromCookie();
  const s = getSite(locale);
  const a = s.about;

  return (
    <>
      <PageHero eyebrow={a.heroEyebrow} title={a.heroTitle} desc={a.heroDesc} cta={s.nav.requestDemo} cta2="/contact" />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{a.missionEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{a.missionTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{a.missionDesc}</p>
            </Reveal>
            <Reveal direction="left">
              <SiteScreenshot label="ensPR · About" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{a.storyEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{a.storyTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{a.storyDesc}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <FeatureGrid eyebrow={a.valuesTitle} title={a.valuesTitle} items={a.values} />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-ink">{a.statsTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {a.stats.map((st) => (
              <RevealItem key={st.label}>
                <div className="rounded-2xl border border-neutral-200 bg-surface p-6 text-center">
                  <div className="text-4xl font-bold text-brand-600">{st.value}</div>
                  <div className="mt-2 text-sm text-neutral-500">{st.label}</div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{a.teamEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{a.teamTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{a.teamDesc}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand site={s} />
    </>
  );
}
