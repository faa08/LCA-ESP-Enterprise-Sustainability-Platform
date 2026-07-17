import type { Metadata } from "next";
import Link from "next/link";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import { PageHero, CtaBand } from "@/components/site/blocks";
import { RevealGroup, RevealItem } from "@/components/landing/motion-primitives";
import { ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSite("en");
  return { title: `${s.industriesIndex.title} · ensPR`, description: s.industriesIndex.desc };
}

export default async function IndustriesIndex() {
  const locale = await getLocaleFromCookie();
  const s = getSite(locale);
  const industries = Object.values(s.industries);

  return (
    <>
      <PageHero eyebrow={s.industriesIndex.eyebrow} title={s.industriesIndex.title} desc={s.industriesIndex.desc} cta={s.nav.requestDemo} cta2="/platform" />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <RevealItem key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-brand">
                  <h3 className="text-xl font-semibold text-ink">{i.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{i.heroDesc}</p>
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
