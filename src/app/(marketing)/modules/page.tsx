import type { Metadata } from "next";
import Link from "next/link";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import { PageHero, CtaBand } from "@/components/site/blocks";
import { RevealGroup, RevealItem } from "@/components/landing/motion-primitives";
import { ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSite("en");
  return { title: `${s.modulesIndex.title} · ensPR`, description: s.modulesIndex.desc };
}

export default async function ModulesIndex() {
  const locale = await getLocaleFromCookie();
  const s = getSite(locale);
  const modules = Object.values(s.modules);

  return (
    <>
      <PageHero eyebrow={s.modulesIndex.eyebrow} title={s.modulesIndex.title} desc={s.modulesIndex.desc} cta={s.nav.requestDemo} cta2="/platform" />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <RevealItem key={m.slug}>
                <Link href={`/modules/${m.slug}`} className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-brand">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{m.tagline}</span>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{m.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{m.heroDesc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand site={s} />
    </>
  );
}
