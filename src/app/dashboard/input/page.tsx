"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Database,
  Droplets,
  Factory,
  Flame,
  Recycle,
  Leaf,
  Zap,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CircleDashed,
  Save,
  Sparkles,
  RotateCcw,
  ArrowLeft,
} from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import {
  INDUSTRIES,
  EMISSIONS_PARAMS,
  LIMBAH_B3_PARAMS,
  CARBON_PARAMS,
  ENERGY_PARAMS,
  LCA_PARAMS,
  evaluateParam,
  type ComplianceStatus,
  type ProperParam,
  type ProperCategory,
} from "@/lib/proper"
import { useIndustryId } from "@/lib/use-industry-id"
import { recordImport } from "@/lib/measurements"
import { getRoleClient, isReadOnly } from "@/lib/role"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

type ValueMap = Record<string, string>

const STORAGE_PREFIX = "enspr_measurements_"

function statusTone(status: ComplianceStatus | "na") {
  if (status === "ok") return "success" as const
  if (status === "warn") return "warning" as const
  if (status === "fail") return "danger" as const
  return "neutral" as const
}

function statusLabel(dict: Record<string, string>, status: ComplianceStatus | "na") {
  if (status === "ok") return t(dict, "input.status.ok")
  if (status === "warn") return t(dict, "input.status.warn")
  if (status === "fail") return t(dict, "input.status.fail")
  return t(dict, "input.status.na")
}

function StatusBadge({
  dict,
  status,
}: {
  dict: Record<string, string>
  status: ComplianceStatus | "na"
}) {
  const tone = statusTone(status)
  const Icon =
    status === "ok" ? CheckCircle2 : status === "warn" ? AlertTriangle : status === "fail" ? XCircle : CircleDashed
  return (
    <Badge variant={tone}>
      <Icon className="h-3 w-3" />
      {statusLabel(dict, status)}
    </Badge>
  )
}

function limitText(p: ProperParam): string {
  if (p.kind === "checklist") return "—"
  if (p.kind === "range") return `${p.min} – ${p.max}`
  if (p.max !== undefined) return `≤ ${p.max}`
  return "—"
}

function ParamRow({
  dict,
  param,
  value,
  onChange,
}: {
  dict: Record<string, string>
  param: ProperParam
  value: string
  onChange: (code: string, v: string) => void
}) {
  if (param.kind === "checklist") {
    const checked = value === "true"
    return (
      <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">{param.name}</p>
          <p className="text-xs text-neutral-400">{t(dict, "input.param.limit")}: —</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-neutral-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => onChange(param.code, "true")}
              className={`px-3 py-1.5 ${checked ? "bg-emerald-600 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"}`}
            >
              {t(dict, "input.checklist.yes")}
            </button>
            <button
              type="button"
              onClick={() => onChange(param.code, "false")}
              className={`px-3 py-1.5 ${value === "false" ? "bg-red-600 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"}`}
            >
              {t(dict, "input.checklist.no")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-800">{param.name}</p>
        <p className="text-xs text-neutral-400">
          Satuan: {param.unit}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(param.code, e.target.value)}
          placeholder="—"
          className="w-28 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-right text-sm text-neutral-800 focus:border-emerald-500 focus:outline-none"
        />
        <span className="w-14 text-xs text-neutral-400">{param.unit}</span>
      </div>
    </div>
  )
}

function Section({
  dict,
  icon: Icon,
  title,
  params,
  values,
  onChange,
  note,
}: {
  dict: Record<string, string>
  icon: typeof Droplets
  title: string
  params: ProperParam[]
  values: ValueMap
  onChange: (code: string, v: string) => void
  note?: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand)]">
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <div className="px-5 pb-2">
        {params.length === 0 ? (
          <p className="py-4 text-sm text-neutral-400">—</p>
        ) : (
          params.map((p) => (
            <ParamRow key={p.code} dict={dict} param={p} value={values[p.code] ?? ""} onChange={onChange} />
          ))
        )}
        {note && <p className="pb-3 pt-2 text-xs italic text-amber-600">{note}</p>}
      </div>
    </Card>
  )
}

export default function InputPage() {
  const [locale, setLocale] = useState<Locale>("id")
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const industry = useMemo(() => INDUSTRIES.find((i) => i.id === industryId) ?? null, [industryId])

  const [values, setValues] = useState<ValueMap>({})
  const [saved, setSaved] = useState(true)

  // Load saved measurements when industry changes
  useEffect(() => {
    setLocale(getLocaleClient())
    if (!industryId) {
      setValues({})
      return
    }
    const stored = localStorage.getItem(STORAGE_PREFIX + industryId)
    if (stored) {
      try {
        setValues(JSON.parse(stored))
      } catch {
        setValues({})
      }
    } else {
      setValues({})
    }
    setSaved(true)
  }, [industryId])

  const role = getRoleClient()
  const readOnly = isReadOnly(role)

  const handleChange = (code: string, v: string) => {
    if (readOnly) return
    setValues((prev) => ({ ...prev, [code]: v }))
    setSaved(false)
  }

  const handleSave = () => {
    if (!industryId || readOnly) return
    localStorage.setItem(STORAGE_PREFIX + industryId, JSON.stringify(values))
    const count = Object.values(values).filter((v) => v !== "").length
    recordImport(industryId, {
      source: "manual",
      file: t(dict, "input.page_title"),
      module: industry ? industry.name : t(dict, "datahub.page_title"),
      by: "Operator",
      status: "success",
      count,
    })
    setSaved(true)
  }

  const handleReset = () => {
    setValues({})
    setSaved(true)
    if (industryId) localStorage.removeItem(STORAGE_PREFIX + industryId)
  }

  const handlePreset = () => {
    const all = [...airParams, ...EMISSIONS_PARAMS, ...LIMBAH_B3_PARAMS, ...CARBON_PARAMS, ...ENERGY_PARAMS, ...LCA_PARAMS]
    const preset: ValueMap = {}
    for (const p of all) {
      if (p.kind === "checklist") {
        preset[p.code] = "true"
      } else {
        preset[p.code] = String(p.mock)
      }
    }
    setValues(preset)
    setSaved(false)
  }

  const airParams = industry ? industry.params.filter((p) => p.category === "air_limbah") : []

  if (!industry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/dashboard/data-hub" className="inline-flex items-center gap-1 hover:text-[color:var(--brand)]">
            <ArrowLeft className="h-4 w-4" /> {t(dict, "sidebar.data_hub")}
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "input.page_title")}</CardTitle>
            <CardDescription>{t(dict, "input.page_desc")}</CardDescription>
          </CardHeader>
          <div className="px-5 pb-5">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {t(dict, "input.industry_prompt")}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-soft-border)] bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-medium text-[color:var(--brand)]">
            <Database className="h-3.5 w-3.5" />
            {t(dict, "input.from_datahub")}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">{t(dict, "input.page_title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">{t(dict, "input.page_desc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={handlePreset}>
            <Sparkles className="mr-1.5 h-4 w-4" /> Isi Preset Data Uji
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" /> {t(dict, "input.reset")}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" /> {saved ? t(dict, "input.saved") : t(dict, "input.save")}
          </Button>
        </div>
      </div>

      {/* Industry chip */}
      <div className="flex items-center gap-2 text-sm">
        <Factory className="h-4 w-4 text-neutral-400" />
        <span className="font-medium text-neutral-700">{industry.name}</span>
        <Badge variant={industry.isMock ? "neutral" : "success"}>
          {industry.isMock ? t(dict, "settings.industry_mock") : t(dict, "settings.industry_real")}
        </Badge>
        {!saved && <span className="text-xs font-medium text-amber-600">â€¢ {t(dict, "input.unsaved")}</span>}
      </div>

      {/* Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          dict={dict}
          icon={Droplets}
          title={t(dict, "input.section.air")}
          params={airParams}
          values={values}
          onChange={handleChange}
        />
        <Section
          dict={dict}
          icon={Flame}
          title={t(dict, "input.section.emisi")}
          params={EMISSIONS_PARAMS}
          values={values}
          onChange={handleChange}
        />
        <div className="lg:col-span-2">
          <Section
            dict={dict}
            icon={Recycle}
            title={t(dict, "input.section.b3")}
            params={LIMBAH_B3_PARAMS}
            values={values}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Auto-calculated KPI notice */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">Scope 1, 2, 3 · LCA · Energi — Dihitung Otomatis</p>
            <p className="mt-1 text-xs text-emerald-700">
              Parameter berikut tidak perlu diinput manual karena dihitung otomatis oleh ensPR dari data operasional di Data Hub:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Scope 1","Scope 2","Scope 3","GWP","Acidification","Eutrophication","Human Toxicity","Ecotoxicity","Water Use","Particulate Matter","Total Energi","Energi Terbarukan","Intensitas Energi"].map((k) => (
                <span key={k} className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">{k}</span>
              ))}
            </div>
            <Link href="/dashboard/data-hub" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
              Buka Data Hub untuk input data operasional →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

