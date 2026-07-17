import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  LayoutDashboard,
  GitBranch,
  Sparkles,
  Leaf,
  Users,
  ShieldCheck,
} from "lucide-react";

function MiniPreview({ variant }: { variant: number }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200/70 bg-neutral-50 p-3">
      {variant === 0 && (
        <div className="space-y-2">
          <div className="h-2 w-1/2 rounded bg-neutral-200" />
          <div className="flex h-16 items-end gap-1.5">
            {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-brand-400/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      )}
      {variant === 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded bg-white p-2 text-[10px] text-neutral-500 shadow-sm">
            <span>Raw material</span>
            <span>→</span>
            <span>Product</span>
          </div>
          <div className="flex items-center justify-between rounded bg-white p-2 text-[10px] text-neutral-500 shadow-sm">
            <span>Use</span>
            <span>→</span>
            <span>End of life</span>
          </div>
        </div>
      )}
      {variant === 2 && (
        <div className="space-y-2">
          {["Anomaly: Stack 3 +18%", "Root cause: valve drift", "Action: schedule maintenance"].map(
            (t, i) => (
              <div key={i} className="flex items-center gap-2 rounded bg-white p-2 text-[10px] text-neutral-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {t}
              </div>
            ),
          )}
        </div>
      )}
      {variant === 3 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded bg-white p-2 text-[10px] shadow-sm">
            <span className="text-neutral-500">Scope 1–3</span>
            <span className="font-semibold text-brand-600">-8.4%</span>
          </div>
          <div className="h-10 rounded bg-gradient-to-r from-brand-200 to-brand-500/30" />
        </div>
      )}
      {variant === 4 && (
        <div className="space-y-2">
          {["Supplier A · 92", "Supplier B · 78", "Supplier C · 85"].map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded bg-white p-2 text-[10px] text-neutral-600 shadow-sm">
              <span>{t.split(" · ")[0]}</span>
              <span className="font-semibold text-brand-600">{t.split(" · ")[1]}</span>
            </div>
          ))}
        </div>
      )}
      {variant === 5 && (
        <div className="space-y-2">
          {["GRI", "TCFD", "ISO 14001", "CDP"].map((f) => (
            <div key={f} className="flex items-center justify-between rounded bg-white p-2 text-[10px] shadow-sm">
              <span className="text-neutral-600">{f}</span>
              <span className="font-semibold text-brand-600">Ready</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const modules = [
  { icon: LayoutDashboard, slug: "environmental-monitoring", t: "landing.modules.t1", d: "landing.modules.d1" },
  { icon: GitBranch, slug: "life-cycle-assessment", t: "landing.modules.t2", d: "landing.modules.d2" },
  { icon: Sparkles, slug: "ai-insights", t: "landing.modules.t3", d: "landing.modules.d3" },
  { icon: Leaf, slug: "carbon-accounting", t: "landing.modules.t4", d: "landing.modules.d4" },
  { icon: Users, slug: "supplier-sustainability", t: "landing.modules.t5", d: "landing.modules.d5" },
  { icon: ShieldCheck, slug: "compliance-management", t: "landing.modules.t6", d: "landing.modules.d6" },
];

export default function FeatureModules({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="modules" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.modules.eyebrow")}
          title={t(dict, "landing.modules.title")}
          description={t(dict, "landing.modules.desc")}
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <RevealItem key={m.t}>
              <Link href={`/modules/${m.slug}`} className="group relative block h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-brand">
                <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-brand-400 to-brand-600 transition-transform duration-300 group-hover:scale-x-100" />
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  <m.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{t(dict, m.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t(dict, m.d)}</p>
                <MiniPreview variant={i} />
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
