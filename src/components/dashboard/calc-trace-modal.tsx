"use client"

import { createPortal } from "react-dom"
import { useState, useEffect } from "react"
import { X, Database, ArrowRight, Calculator, CheckCircle2, AlertCircle, Layers } from "lucide-react"

export interface TraceStep {
  /** Label for the data source node */
  source: string
  /** Sub-label / value for source */
  sourceValue?: string
  /** Icon color for source node */
  sourceColor?: "blue" | "purple" | "orange" | "teal"
  /** Transformation or formula description */
  formula: string
  /** Result of this step */
  result: string
  /** Status indicator */
  status?: "ok" | "warn" | "empty"
}

export interface TraceGroup {
  /** Group title, e.g. "Scope 1 — Emisi Langsung" */
  title: string
  /** Short description of this group */
  description: string
  /** Icon component */
  icon: React.ReactNode
  /** Steps inside this group */
  steps: TraceStep[]
}

interface CalcTraceModalProps {
  /** Modal title, e.g. "Rincian Kalkulasi Emisi Karbon" */
  title: string
  /** Short subtitle */
  subtitle?: string
  /** Grouped list of calculation steps */
  groups: TraceGroup[]
  isOpen: boolean
  onClose: () => void
}

const sourceColors: Record<string, string> = {
  blue:   "bg-blue-50 border-blue-200 text-blue-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
  teal:   "bg-teal-50 border-teal-200 text-teal-700",
}

const statusMeta = {
  ok:    { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  warn:  { icon: AlertCircle,  color: "text-amber-600 bg-amber-50" },
  empty: { icon: AlertCircle,  color: "text-neutral-400 bg-neutral-50" },
}

export function CalcTraceModal({ title, subtitle, groups, isOpen, onClose }: CalcTraceModalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-4">
      <div className="relative my-8 w-full max-w-3xl shrink-0 rounded-2xl border border-neutral-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">{title}</h2>
              {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Data Source Banner */}
        <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-3">
          <Database className="h-3.5 w-3.5 text-neutral-500" />
          <p className="text-xs font-medium text-neutral-600">
            Semua data bersumber dari <strong>Data Hub</strong> (Modul 3–5) yang Anda masukkan, lalu dikalkulasi menggunakan mesin perhitungan{" "}
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">GreenLCA Calc-Engine</span>
          </p>
        </div>

        {/* Groups */}
        <div className="max-h-[65vh] overflow-y-auto divide-y divide-neutral-100">
          {groups.map((group, gi) => (
            <div key={gi} className="px-6 py-4 space-y-3">
              {/* Group Header */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  {group.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{group.title}</p>
                  <p className="text-xs text-neutral-500">{group.description}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {group.steps.map((step, si) => {
                  const srcColor = sourceColors[step.sourceColor ?? "blue"]
                  const meta = statusMeta[step.status ?? "ok"]
                  const StatusIcon = meta.icon
                  return (
                    <div key={si} className="flex items-stretch gap-2 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
                      {/* Source */}
                      <div className={`flex min-w-[130px] flex-col justify-center rounded-lg border px-3 py-1.5 ${srcColor}`}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Data Hub</p>
                        <p className="text-xs font-bold leading-tight">{step.source}</p>
                        {step.sourceValue && (
                          <p className="mt-0.5 text-[10px] font-mono opacity-80">{step.sourceValue}</p>
                        )}
                      </div>

                      {/* Arrow + Formula */}
                      <div className="flex flex-1 flex-col items-center justify-center gap-0.5">
                        <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                        <p className="text-center text-[10px] text-neutral-500 leading-tight px-1">{step.formula}</p>
                      </div>

                      {/* Result */}
                      <div className={`flex min-w-[110px] flex-col items-end justify-center gap-1 rounded-lg px-3 py-1.5 ${meta.color}`}>
                        <StatusIcon className="h-3 w-3 shrink-0" />
                        <p className="text-right text-xs font-bold leading-tight">{step.result}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-6 py-3">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-neutral-400" />
            <p className="text-xs text-neutral-500">Formula mengacu pada standar <strong>GHG Protocol</strong>, <strong>ISO 14044</strong>, dan faktor emisi <strong>KLHK</strong></p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/** Trigger button to place next to a key result */
export function TraceCalcButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:border-emerald-400 hover:bg-emerald-100"
    >
      <Calculator className="h-3 w-3" />
      Lihat Cara Hitung
    </button>
  )
}
