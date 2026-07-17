import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import Link from "next/link";
import { ArrowRight, FlaskConical, Factory, Mountain, Cog, Zap, Flame } from "lucide-react";
import type { IndustriesLandingItem } from "@/lib/site-content";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";

const icons: Record<IndustriesLandingItem["icon"], typeof FlaskConical> = {
  chemical: FlaskConical,
  manufacturing: Factory,
  mining: Mountain,
  steel: Cog,
  utilities: Zap,
  oilgas: Flame,
};

export default async function Industries() {
  const locale = await getLocaleFromCookie();
  const site = getSite(locale);
  const items = site.industriesLanding;
  const labels = site.industriesLandingLabels;

  return (
    <section id="industries" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={site.industriesSection.eyebrow}
          title={site.industriesSection.title}
          description={site.industriesSection.desc}
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((ind) => {
            const Icon = icons[ind.icon];
            return (
              <RevealItem key={ind.slug}>
                <div className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-ink">{ind.name}</h3>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">{ind.desc}</p>

                  <div className="mt-5">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{labels.challenges}</div>
                    <ul className="mt-2 space-y-1.5">
                      {ind.challenges.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{labels.modules}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ind.modules.map((m) => (
                        <span key={m} className="rounded-full border border-neutral-200 bg-surface px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                          {site.modules[m]?.name ?? m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/industries/${ind.slug}`}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"
                  >
                    {labels.learnMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
