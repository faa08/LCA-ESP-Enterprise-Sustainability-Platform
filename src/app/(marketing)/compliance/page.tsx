import type { Metadata } from "next";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import { PageHero, SiteScreenshot, StepList, CtaBand } from "@/components/site/blocks";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/motion-primitives";
import { ShieldCheck } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSite("en");
  return { title: `${s.compliancePage.heroTitle} · ensPR`, description: s.compliancePage.heroDesc };
}

export default async function CompliancePage() {
  const locale = await getLocaleFromCookie();
  const s = getSite(locale);
  const c = s.compliancePage;

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} desc={c.heroDesc} cta={s.nav.requestDemo} cta2="/platform">
        <div className="mt-12 max-w-4xl">
          <SiteScreenshot label="ensPR · Compliance" />
        </div>
      </PageHero>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex max-w-2xl flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{c.introEyebrow}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{c.introTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{c.introDesc}</p>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.frameworks.map((f) => (
              <RevealItem key={f.key}>
                <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">Aligned</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{f.name}</h3>
                  <p className="text-xs font-medium text-neutral-400">{f.full}</p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{f.desc}</p>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm leading-relaxed text-neutral-600">{f.how}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <StepList eyebrow={c.autoEyebrow} title={c.autoTitle} desc={c.autoDesc} steps={c.autoSteps} />

      <CtaBand site={s} />
    </>
  );
}
