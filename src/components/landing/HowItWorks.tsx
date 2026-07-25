import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./motion-primitives";
import { t } from "@/lib/i18n";
import { Factory, Download, BrainCircuit, GitBranch, ShieldCheck, FileText, ArrowDown } from "lucide-react";

const steps = [
  { icon: Factory, title: "1. Ingest Data Operasional (Data Hub)", desc: "Operator Site menginput atau mengimpor data kuantitatif energi, limbah, logistik, dan lab di Data Hub sebagai Single Source of Truth." },
  { icon: BrainCircuit, title: "2. Process & Dual AI Failover", desc: "Mesin otomatis menghitung LCA ISO 14044 & Carbon Scopes 1-3. AI Co-Pilot (Groq + Gemini) menganalisis rekomendasi dekarbonisasi." },
  { icon: ShieldCheck, title: "3. Formulasi & Audit Governance", desc: "Sustainability Manager menyelaraskan M0 Goal & Scope, struktur BOM, serta memverifikasi log immutable di M12 Audit Trail." },
  { icon: FileText, title: "4. Ekspor Laporan Resmi OJK & PROPER", desc: "Generator otomatis di M13 menerbitkan berkas PDF siap-audit sesuai standar POJK 51/2017, PROPER KLHK, dan GRI 2021." },
];

export default function HowItWorks({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="how" className="relative overflow-hidden bg-surface py-24 border-t border-neutral-100">
      <div className="absolute -right-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="ALUR KERJA HIBRIDA ENTERPRISE"
          title="Bagaimana GreenLCA Bekerja untuk Industri Anda"
          description="Transformasi otomatisasi dari ingesti data mentah site hingga penerbitan laporan kepatuhan resmi."
        />

        <RevealGroup className="mt-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <RevealItem key={s.title} className="relative">
                <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">{s.desc}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
