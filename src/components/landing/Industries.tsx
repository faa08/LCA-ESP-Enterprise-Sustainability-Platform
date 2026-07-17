import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlaskConical, Mountain, Factory, Cog, Zap } from "lucide-react";

const industries = [
  { icon: FlaskConical, slug: "chemical", n: "landing.industries.i1", d: "landing.industries.d1", c: "landing.industries.c1" },
  { icon: Factory, slug: "manufacturing", n: "landing.industries.i4", d: "landing.industries.d4", c: "landing.industries.c4" },
  { icon: Mountain, slug: "mining", n: "landing.industries.i2", d: "landing.industries.d2", c: "landing.industries.c2" },
  { icon: Cog, slug: "steel", n: "landing.industries.i3", d: "landing.industries.d3", c: "landing.industries.c3" },
  { icon: Zap, slug: "utilities", n: "landing.industries.i6", d: "landing.industries.d6", c: "landing.industries.c6" },
];

export default function Industries({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="industries" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.industries.eyebrow")}
          title={t(dict, "landing.industries.title")}
          description={t(dict, "landing.industries.desc")}
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <RevealItem key={ind.n}>
              <Link href={`/industries/${ind.slug}`} className="group block h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <ind.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-ink">{t(dict, ind.n)}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{t(dict, ind.d)}</p>
                <div className="mt-4 rounded-xl border border-neutral-100 bg-surface px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{t(dict, "landing.industries.keyChallenge")}</div>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">{t(dict, ind.c)}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
