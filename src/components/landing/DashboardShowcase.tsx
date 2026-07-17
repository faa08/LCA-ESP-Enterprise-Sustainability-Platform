import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion-primitives";
import { t } from "@/lib/i18n";

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/80 px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
      <span className="ml-3 text-[11px] font-medium text-neutral-400">ensPR · {title}</span>
    </div>
  );
}

function ExecMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <WindowChrome title="Executive Dashboard" />
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { l: "Emissions", v: "1,284", d: "-8.4%" },
            { l: "Energy", v: "92.3", d: "-3.1%" },
            { l: "Compliance", v: "98%", d: "+2%" },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
              <div className="text-[10px] uppercase tracking-wide text-neutral-400">{k.l}</div>
              <div className="mt-1 text-lg font-semibold text-ink">{k.v}</div>
              <div className="text-[10px] font-semibold text-brand-600">{k.d}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
          <div className="mb-2 text-[11px] font-semibold text-ink">Carbon trend</div>
          <svg viewBox="0 0 240 60" className="h-16 w-full" preserveAspectRatio="none">
            <path d="M0 46 L30 38 L60 42 L90 26 L120 32 L150 16 L180 22 L210 10 L240 6" fill="none" stroke="#0f8b5f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EnvMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <WindowChrome title="Environmental Dashboard" />
      <div className="space-y-3 p-5">
        {["Air emissions", "Energy", "Water", "Waste"].map((l, i) => (
          <div key={l} className="flex items-center gap-3">
            <span className="w-24 text-[11px] font-medium text-neutral-500">{l}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${[78, 64, 52, 40][i]}%` }} />
            </div>
            <span className="w-10 text-right text-[11px] font-semibold text-neutral-600">{[78, 64, 52, 40][i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarbonMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <WindowChrome title="Carbon Accounting" />
      <div className="space-y-3 p-5">
        {["Scope 1", "Scope 2", "Scope 3"].map((s, i) => (
          <div key={s} className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-neutral-600">{s}</span>
              <span className="text-[11px] font-semibold text-brand-600">{[320, 540, 1480][i]} tCO₂e</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${[20, 34, 100][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LcaMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <WindowChrome title="Life Cycle Assessment" />
      <div className="space-y-2 p-5">
        {[
          "Raw material extraction",
          "Manufacturing",
          "Distribution",
          "Use phase",
          "End of life",
        ].map((s, i) => (
          <div key={s} className="flex items-center gap-3 rounded-lg bg-neutral-50/60 p-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/10 text-[10px] font-bold text-brand-600">{i + 1}</span>
            <span className="text-[11px] text-neutral-600">{s}</span>
            <span className="ml-auto text-[11px] font-semibold text-neutral-500">{[22, 31, 12, 18, 17][i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <WindowChrome title="Compliance Dashboard" />
      <div className="grid grid-cols-2 gap-3 p-5">
        {["ISO 14001", "GRI", "TCFD", "CDP"].map((f) => (
          <div key={f} className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none"><path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <div>
              <div className="text-[11px] font-semibold text-ink">{f}</div>
              <div className="text-[10px] text-brand-600">Aligned</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-soft">
      <WindowChrome title="AI Insights" />
      <div className="space-y-2 p-5">
        {[
          { t: "Anomaly detected · Stack 3 emissions +18%", c: "amber" },
          { t: "Root cause · valve drift confirmed", c: "brand" },
          { t: "Recommendation · schedule maintenance", c: "brand" },
          { t: "Forecast · Q3 target at risk by 4%", c: "amber" },
        ].map((n, i) => (
          <div key={i} className={`flex items-start gap-2 rounded-lg p-2.5 text-[11px] ${
            n.c === "amber" ? "bg-amber-50 text-amber-700" : "bg-brand-50 text-brand-700"
          }`}>
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span className="text-neutral-700">{n.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const rows = [
  { mock: <ExecMock />, t: "landing.showcase.r1t", d: "landing.showcase.r1d" },
  { mock: <EnvMock />, t: "landing.showcase.r2t", d: "landing.showcase.r2d" },
  { mock: <CarbonMock />, t: "landing.showcase.r3t", d: "landing.showcase.r3d" },
  { mock: <LcaMock />, t: "landing.showcase.r4t", d: "landing.showcase.r4d" },
  { mock: <ComplianceMock />, t: "landing.showcase.r5t", d: "landing.showcase.r5d" },
  { mock: <AiMock />, t: "landing.showcase.r6t", d: "landing.showcase.r6d" },
];

export default function DashboardShowcase({ dict }: { dict: Record<string, string> }) {
  return (
    <section id="showcase" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t(dict, "landing.showcase.eyebrow")}
          title={t(dict, "landing.showcase.title")}
          description={t(dict, "landing.showcase.desc")}
        />

        <div className="mt-16 space-y-16">
          {rows.map((row, i) => {
            const reverse = i % 2 === 1;
            return (
              <div key={row.t} className="grid items-center gap-10 lg:grid-cols-2">
                <Reveal direction={reverse ? "right" : "left"} className={reverse ? "lg:order-2" : ""}>
                  {row.mock}
                </Reveal>
                <Reveal direction={reverse ? "left" : "right"} className={reverse ? "lg:order-1" : ""}>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">{t(dict, row.t)}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-neutral-600">{t(dict, row.d)}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
