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

const enterpriseGroups = [
  {
    group: "FONDASI LCA (ISO 14040/14044)",
    badge: "M0 – M2",
    desc: "Penetapan metodologi, hierarki multi-entitas korporat, dan struktur Bill of Materials (BOM).",
    items: [
      { code: "M0", name: "Goal & Scope Definition", desc: "Batas sistem ISO 14040 (Cradle-to-Gate) & unit fungsional." },
      { code: "M1", name: "Company Profile & Hierarki", desc: "Multi-entitas: Korporat Induk → Subholding → Site Pabrik." },
      { code: "M2", name: "Product Assessment & BOM", desc: "Life Cycle Inventory (LCI) & alokasi massa bahan baku." },
    ],
  },
  {
    group: "INVENTORI & DAMPAK LINGKUNGAN",
    badge: "M3 – M7",
    desc: "Kalkulasi energi, limbah, logistik transport, 11 dampak LCIA, dan emisi Scope 1, 2, 3.",
    items: [
      { code: "M3", name: "Energy Assessment", desc: "Bauran energi & faktor emisi grid nasional (ESDM)." },
      { code: "M4", name: "Waste Assessment", desc: "Limbah B3 & non-B3 sesuai Permen LHK 6/2021." },
      { code: "M5", name: "Transportation & Logistik", desc: "EmisiScope 3 Category 4 & 9 (Truck, Ship, Rail)." },
      { code: "M6", name: "LCIA Multi-Impact", desc: "11 Kategori Dampak ISO 14044 (GWP, AP, EP, ODP, WUD)." },
      { code: "M7", name: "Carbon Accounting", desc: "Scope 1, 2, 3 GHG Protocol & Perpres 98/2021." },
    ],
  },
  {
    group: "PELAPORAN & KEPATUHAN ENTERPRISE",
    badge: "M8 – M13",
    desc: "Indeks sirkularitas, pemetaan POJK 51, PROPER KLHK, SDGs, audit trail, & generator PDF.",
    items: [
      { code: "M8", name: "Circular Economy", desc: "Material Circularity Indicator (MCI) per produk." },
      { code: "M9", name: "Regulatory Compliance", desc: "Pemetaan otomatis ke POJK 51/2017 & PROPER KLHK." },
      { code: "M10", name: "ESG & Net Zero Roadmap", desc: "Skor E/S/G & target dekarbonisasi Net Zero 2050." },
      { code: "M11", name: "SDGs Dashboard", desc: "Pemetaan kontribusi ke 12 indikator TPB Nasional." },
      { code: "M12", name: "Audit Trail & Verification", desc: "Jejak verifikasi data immutable untuk auditor independen." },
      { code: "M13", name: "Reporting & Export PDF", desc: "Generator laporan resmi otomatis format OJK & GRI." },
    ],
  },
]

export default function FeatureModules({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="modules" className="bg-white py-24 border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="ARSITEKTUR 13 MODUL ENTERPRISE"
          title="Ekosistem Lengkap Pengukuran Karbon & LCA Standar Internasional"
          description="Terbagi menjadi 5 kelompok navigasi cerdas yang menghubungkan ingesti data operasional, kalkulasi metodologi ISO, hingga ekspor laporan resmi OJK & PROPER."
        />

        <div className="mt-14 space-y-10">
          {enterpriseGroups.map((g, gi) => (
            <div key={gi} className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
                <div>
                  <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">{g.badge}</span>
                  <h3 className="mt-2 text-xl font-bold text-ink">{g.group}</h3>
                  <p className="mt-0.5 text-sm text-neutral-500">{g.desc}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((item, ii) => (
                  <div key={ii} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs hover:border-brand-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-700">{item.code}</span>
                      <span className="text-[10px] font-semibold uppercase text-brand-600">Enterprise Ready</span>
                    </div>
                    <h4 className="mt-3 text-base font-bold text-ink">{item.name}</h4>
                    <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
