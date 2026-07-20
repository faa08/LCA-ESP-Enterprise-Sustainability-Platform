"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import {
  Database,
  FileSpreadsheet,
  Cpu,
  Plug,
  PencilLine,
  Upload,
  Radio,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  MoreHorizontal,
  ShieldAlert,
  ClipboardList,
  Server,
  Settings2,
} from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useIndustryId } from "@/lib/use-industry-id"
import { INDUSTRIES, EMISSIONS_PARAMS, LIMBAH_B3_PARAMS, OTHER_PARAMS, type ProperParam } from "@/lib/proper"
import { getMeasurements, saveMeasurements, recordImport, useImportLog } from "@/lib/measurements"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

/* ---------- Ingestion: Manual / Excel / IoT / ERP ---------- */

const CONFIG_PREFIX = "enspr_source_"

function loadConfig(kind: string): Record<string, string> {
  if (typeof window === "undefined") return {}
  const raw = localStorage.getItem(CONFIG_PREFIX + kind)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function allParams(industryId: string | null): ProperParam[] {
  const industry = INDUSTRIES.find((i) => i.id === industryId)
  const air = industry ? industry.params.filter((p) => p.category === "air_limbah") : []
  return [...air, ...EMISSIONS_PARAMS, ...LIMBAH_B3_PARAMS, ...OTHER_PARAMS]
}

// Parse CSV text: expects columns "code,value" or "parameter,value" (header optional).
function parseCsv(text: string): Record<string, string> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const out: Record<string, string> = {}
  if (lines.length === 0) return out
  const header = lines[0].toLowerCase()
  const hasHeader = header.includes("code") || header.includes("parameter") || header.includes("value")
  const start = hasHeader ? 1 : 0
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].split(/[,;\t]/)
    if (cols.length < 2) continue
    const code = cols[0].trim().toLowerCase()
    const val = cols[1].trim()
    out[code] = val
  }
  return out
}

function IngestPanel() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null

  const [tab, setTab] = useState<"manual" | "excel" | "iot" | "erp">("manual")
  const [excelText, setExcelText] = useState("")
  const [excelMsg, setExcelMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null)
  const [iotCfg, setIotCfg] = useState<Record<string, string>>(() => loadConfig("iot"))
  const [erpCfg, setErpCfg] = useState<Record<string, string>>(() => loadConfig("erp"))
  const [cfgSaved, setCfgSaved] = useState(false)

  const params = allParams(industryId)

  const applyImport = (raw: Record<string, string>) => {
    if (!industryId) {
      setExcelMsg({ tone: "err", text: t(dict, "datahub.ingest.need_industry") })
      return
    }
    const store = { ...getMeasurements(industryId) }
    let matched = 0
    let unmatched = 0
    for (const [code, val] of Object.entries(raw)) {
      const found = params.find((p) => p.code === code)
      if (found) {
        store[found.code] = val
        matched++
      } else {
        unmatched++
      }
    }
    if (matched === 0) {
      setExcelMsg({ tone: "err", text: t(dict, "datahub.ingest.no_match") })
      return
    }
    saveMeasurements(industryId, store)
    recordImport(industryId, {
      source: "excel",
      file: t(dict, "datahub.ingest.excel"),
      module: industry ? industry.name : t(dict, "datahub.page_title"),
      by: "Operator",
      status: "success",
      count: matched,
    })
    setExcelMsg({
      tone: "ok",
      text: t(dict, "datahub.ingest.imported").replace("{n}", String(matched)) + (unmatched ? ` (${unmatched} ${t(dict, "datahub.ingest.unmatched")})` : ""),
    })
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => applyImport(parseCsv(String(reader.result)))
    reader.readAsText(file)
  }

  const saveCfg = (kind: "iot" | "erp", cfg: Record<string, string>) => {
    localStorage.setItem(CONFIG_PREFIX + kind, JSON.stringify(cfg))
    if (industryId) {
      recordImport(industryId, {
        source: kind,
        file: kind === "iot" ? (cfg.endpoint || "IoT") : (cfg.url || "ERP"),
        module: industry ? industry.name : t(dict, "datahub.page_title"),
        by: "Operator",
        status: "success",
        count: 0,
      })
    }
    setCfgSaved(true)
    setTimeout(() => setCfgSaved(false), 2000)
  }

  const tabBtn = (key: "manual" | "excel" | "iot" | "erp", icon: typeof Cpu, labelKey: string) => (
    <button
      onClick={() => setTab(key)}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        tab === key ? "bg-[color:var(--brand)] text-white" : "text-neutral-600 hover:bg-neutral-100",
      )}
    >
      {(() => {
        const Icon = icon
        return <Icon className="h-4 w-4" />
      })()}
      {t(dict, labelKey)}
    </button>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(dict, "datahub.ingest.title")}</CardTitle>
        <p className="mt-1 text-sm text-neutral-500">{t(dict, "datahub.ingest.desc")}</p>
      </CardHeader>
      <div className="flex flex-wrap gap-2 px-5">
        {tabBtn("manual", PencilLine, "datahub.ingest.manual")}
        {tabBtn("excel", FileSpreadsheet, "datahub.ingest.excel")}
        {tabBtn("iot", Radio, "datahub.ingest.iot")}
        {tabBtn("erp", Server, "datahub.ingest.erp")}
      </div>

      <div className="px-5 pb-5 pt-1">
        {!industry && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t(dict, "datahub.ingest.need_industry")}
          </div>
        )}

        {industry && tab === "manual" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-neutral-600">{t(dict, "datahub.ingest.manual_desc")}</p>
            <Link href="/dashboard/input">
              <Button>
                <PencilLine className="h-4 w-4" /> {t(dict, "datahub.ingest.open_manual")}
              </Button>
            </Link>
          </div>
        )}

        {industry && tab === "excel" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-neutral-600">{t(dict, "datahub.ingest.excel_desc")}</p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={onFile}
              className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--brand)] file:px-4 file:py-2 file:text-white hover:file:opacity-90"
            />
            <textarea
              value={excelText}
              onChange={(e) => setExcelText(e.target.value)}
              placeholder="code,value&#10;ph,7.5&#10;bod,45&#10;tsp,120"
              className="h-28 w-full rounded-lg border border-neutral-200 p-3 font-mono text-xs text-neutral-700 focus:border-emerald-500 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <Button onClick={() => applyImport(parseCsv(excelText))} variant="secondary">
                <Upload className="h-4 w-4" /> {t(dict, "datahub.ingest.apply")}
              </Button>
              {excelMsg && (
                <span className={cn("flex items-center gap-1 text-xs font-medium", excelMsg.tone === "ok" ? "text-emerald-600" : "text-red-600")}>
                  {excelMsg.tone === "ok" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  {excelMsg.text}
                </span>
              )}
            </div>
          </div>
        )}

        {industry && tab === "iot" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-neutral-600">{t(dict, "datahub.ingest.iot_endpoint")}</label>
              <input
                value={iotCfg.endpoint ?? ""}
                onChange={(e) => setIotCfg((c) => ({ ...c, endpoint: e.target.value }))}
                placeholder="mqtt://plant-a.local:1883"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">{t(dict, "datahub.ingest.iot_topic")}</label>
              <input
                value={iotCfg.topic ?? ""}
                onChange={(e) => setIotCfg((c) => ({ ...c, topic: e.target.value }))}
                placeholder="factory/emissions/+"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={() => saveCfg("iot", iotCfg)}>
                <Settings2 className="h-4 w-4" /> {cfgSaved ? t(dict, "datahub.ingest.saved") : t(dict, "datahub.ingest.save_cfg")}
              </Button>
            </div>
          </div>
        )}

        {industry && tab === "erp" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-neutral-600">{t(dict, "datahub.ingest.erp_url")}</label>
              <input
                value={erpCfg.url ?? ""}
                onChange={(e) => setErpCfg((c) => ({ ...c, url: e.target.value }))}
                placeholder="https://sap.pabrik.id/api/emissions"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">{t(dict, "datahub.ingest.erp_token")}</label>
              <input
                value={erpCfg.token ?? ""}
                onChange={(e) => setErpCfg((c) => ({ ...c, token: e.target.value }))}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={() => saveCfg("erp", erpCfg)}>
                <Settings2 className="h-4 w-4" /> {cfgSaved ? t(dict, "datahub.ingest.saved") : t(dict, "datahub.ingest.save_cfg")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

/* ---------- Status helpers ---------- */

const statusBadge = (locale: Locale, status: "success" | "processing" | "failed") => {
  const dict = dicts[locale]
  if (status === "success") return <Badge variant="success"><CheckCircle2 className="h-3 w-3" />{t(dict, "datahub.status.success")}</Badge>
  if (status === "processing") return <Badge variant="warning"><Clock className="h-3 w-3" />{t(dict, "datahub.status.processing")}</Badge>
  return <Badge variant="danger"><XCircle className="h-3 w-3" />{t(dict, "datahub.status.failed")}</Badge>
}

const sourceBadge = (locale: Locale, status: "ready" | "connected" | "available") => {
  const dict = dicts[locale]
  if (status === "ready") return <Badge variant="success"><CheckCircle2 className="h-3 w-3" />{t(dict, "datahub.sources.ready")}</Badge>
  if (status === "connected") return <Badge variant="brand"><Radio className="h-3 w-3" />{t(dict, "datahub.sources.connected")}</Badge>
  return <Badge variant="neutral"><Plug className="h-3 w-3" />{t(dict, "datahub.sources.available")}</Badge>
}

const deviceStatus = (status: "online" | "offline") =>
  status === "online"
    ? <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online</Badge>
    : <Badge variant="danger"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Offline</Badge>

/* ---------- Page ---------- */

export default function DataHubPage() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null
  const importLog = useImportLog(industryId ?? "")

  // Reactive read of saved source configs.
  const [iotCfg, setIotCfg] = useState<Record<string, string>>({})
  const [erpCfg, setErpCfg] = useState<Record<string, string>>({})
  useEffect(() => {
    const read = () => {
      setIotCfg(loadConfig("iot"))
      setErpCfg(loadConfig("erp"))
    }
    read()
    window.addEventListener("storage", read)
    const interval = setInterval(read, 1000)
    return () => {
      window.removeEventListener("storage", read)
      clearInterval(interval)
    }
  }, [])

  const measurements = getMeasurements(industryId)
  const allParamsList = allParams(industryId)
  const enteredCount = allParamsList.filter((p) => measurements[p.code] !== undefined && measurements[p.code] !== "").length
  const coverage = allParamsList.length ? Math.round((enteredCount / allParamsList.length) * 100) : 0
  const reviewCount = allParamsList.length - enteredCount

  const iotConnected = Boolean(iotCfg.endpoint)
  const erpConnected = Boolean(erpCfg.url)
  const sourcesConfigured = (iotConnected ? 1 : 0) + (erpConnected ? 1 : 0)

  const kpis = [
    { key: "datahub.kpi.devices", value: iotConnected ? "1" : "0", diff: iotConnected ? t(dict, "datahub.sources.connected") : t(dict, "datahub.sources.none"), icon: Cpu },
    { key: "datahub.kpi.imports", value: String(importLog.length), diff: "log", icon: FileSpreadsheet },
    { key: "datahub.kpi.sources", value: String(2 + sourcesConfigured), diff: `${sourcesConfigured} IoT/ERP`, icon: Plug },
    { key: "datahub.kpi.validation", value: `${coverage}%`, diff: t(dict, "datahub.validation.coverage"), icon: ShieldAlert },
  ]

  const sources = [
    { key: "datahub.source.manual.title", desc: "datahub.source.manual.desc", icon: PencilLine, status: "ready" as const },
    { key: "datahub.source.excel.title", desc: "datahub.source.excel.desc", icon: FileSpreadsheet, status: "ready" as const },
    { key: "datahub.source.iot.title", desc: "datahub.source.iot.desc", icon: Radio, status: iotConnected ? ("connected" as const) : ("available" as const) },
    { key: "datahub.source.api.title", desc: "datahub.source.api.desc", icon: Plug, status: erpConnected ? ("connected" as const) : ("available" as const) },
  ]

  const devices = useMemo(
    () =>
      iotConnected
        ? [
            {
              name: iotCfg.topic ? `Topic: ${iotCfg.topic}` : "IoT Source",
              plant: industry ? industry.name : "—",
              module: "Emissions Monitoring",
              sync: t(dict, "datahub.devices.live"),
              status: "online" as const,
            },
          ]
        : [],
    [iotConnected, iotCfg.topic, industry, dict],
  )

  const validation: { key: string; value: string; icon: typeof Cpu; tone: "danger" | "warning" | "neutral" }[] = [
    { key: "datahub.validation.entered", value: String(enteredCount), icon: CheckCircle2, tone: "neutral" },
    { key: "datahub.validation.coverage", value: `${coverage}%`, icon: ShieldAlert, tone: "neutral" },
    { key: "datahub.validation.toreview", value: String(reviewCount), icon: AlertTriangle, tone: reviewCount > 0 ? "warning" : "neutral" },
    { key: "datahub.validation.configured", value: String(sourcesConfigured), icon: Plug, tone: "neutral" },
  ]

  const timeline = importLog.slice(0, 6).map((e) => ({
    key: e.source === "excel" ? "datahub.timeline.excel" : e.source === "iot" ? "datahub.timeline.iot" : e.source === "manual" ? "datahub.timeline.manual" : "datahub.timeline.api",
    detail: e.file,
    time: e.time,
    icon: e.source === "excel" ? FileSpreadsheet : e.source === "iot" ? Radio : e.source === "manual" ? PencilLine : Plug,
    tone: (e.status === "success" ? "success" : e.status === "processing" ? "info" : "brand") as "success" | "info" | "brand",
  }))

  return (
    <div className="space-y-8">
      {/* Section 1 — Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-soft-border)] bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-medium text-[color:var(--brand)]">
            <Database className="h-3.5 w-3.5" />
            {t(dict, "datahub.single_source")}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">{t(dict, "datahub.page_title")}</h1>
          <p className="mt-1 max-w-xl text-sm text-secondary">{t(dict, "datahub.page_desc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/input">
            <Button variant="secondary" size="lg">
              <PencilLine className="h-4 w-4" /> {t(dict, "datahub.action.manual_entry")}
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            <Upload className="h-4 w-4" /> {t(dict, "datahub.action.import_excel")}
          </Button>
          <Button size="lg">
            <Radio className="h-4 w-4" /> {t(dict, "datahub.action.connect_iot")}
          </Button>
        </div>
      </div>

      {/* Ingestion panel — Manual / Excel / IoT / ERP */}
      <IngestPanel />

      {/* Section 2 — Quick statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.key} className="enterprise-card group p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary">{t(dict, kpi.key)}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand)] transition-colors group-hover:bg-[color:var(--brand)] group-hover:text-white">
                <kpi.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-primary">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted">{kpi.diff}</p>
          </div>
        ))}
      </div>

      {/* Section 3 — Data sources */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-primary">{t(dict, "datahub.sources.title")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sources.map((s) => (
            <div key={s.key} className="enterprise-card group flex flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand)] transition-colors group-hover:bg-[color:var(--brand)] group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                {sourceBadge(locale, s.status)}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-primary">{t(dict, s.key)}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-secondary">{t(dict, s.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Recent imports */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-primary">{t(dict, "datahub.recent.title")}</h2>
          <Button variant="ghost" size="sm">
            {t(dict, "datahub.recent.view")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="enterprise-card overflow-hidden p-0">
          {importLog.length === 0 ? (
            <p className="p-6 text-sm text-muted">{t(dict, "datahub.recent.empty")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t(dict, "datahub.recent.file")}</TableHead>
                  <TableHead>{t(dict, "datahub.recent.module")}</TableHead>
                  <TableHead>{t(dict, "datahub.recent.by")}</TableHead>
                  <TableHead>{t(dict, "datahub.recent.time")}</TableHead>
                  <TableHead>{t(dict, "datahub.recent.status")}</TableHead>
                  <TableHead className="text-right">{t(dict, "datahub.recent.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importLog.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.file}</TableCell>
                    <TableCell className="text-secondary">{row.module}</TableCell>
                    <TableCell className="text-secondary">{row.by}</TableCell>
                    <TableCell className="text-muted">{row.time}</TableCell>
                    <TableCell>{statusBadge(locale, row.status)}</TableCell>
                    <TableCell className="text-right">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-[color:var(--brand)]">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Section 5 — Connected devices */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-primary">{t(dict, "datahub.devices.title")}</h2>
        <div className="enterprise-card overflow-hidden p-0">
          {devices.length === 0 ? (
            <p className="p-6 text-sm text-muted">{t(dict, "datahub.devices.none")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t(dict, "datahub.devices.device")}</TableHead>
                  <TableHead>{t(dict, "datahub.devices.plant")}</TableHead>
                  <TableHead>{t(dict, "datahub.devices.module")}</TableHead>
                  <TableHead>{t(dict, "datahub.devices.sync")}</TableHead>
                  <TableHead>{t(dict, "datahub.devices.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-secondary">{d.plant}</TableCell>
                    <TableCell className="text-secondary">{d.module}</TableCell>
                    <TableCell className="text-muted">{d.sync}</TableCell>
                    <TableCell>{deviceStatus(d.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Section 6 — Data validation */}
      <section>
        <div className="enterprise-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-primary">{t(dict, "datahub.validation.title")}</h2>
              <p className="mt-1 text-sm text-secondary">
                {t(dict, "datahub.single_source")}
              </p>
            </div>
            <Button>
              <ClipboardList className="h-4 w-4" /> {t(dict, "datahub.validation.review")}
            </Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {validation.map((v) => (
              <div
                key={v.key}
                className={cn(
                  "rounded-xl border border-token bg-surface-2 p-4",
                  v.tone === "danger" && "border-red-200",
                  v.tone === "warning" && "border-amber-200",
                )}
              >
                <div className="flex items-center gap-2 text-muted">
                  <v.icon
                    className={cn(
                      "h-4 w-4",
                      v.tone === "danger" && "text-red-500",
                      v.tone === "warning" && "text-amber-500",
                      v.tone === "neutral" && "text-muted",
                    )}
                  />
                  <span className="text-xs font-medium uppercase tracking-wide">{t(dict, v.key)}</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-primary">{v.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Import history timeline */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-primary">{t(dict, "datahub.timeline.title")}</h2>
        <div className="enterprise-card p-6">
          {timeline.length === 0 ? (
            <p className="text-sm text-muted">{t(dict, "datahub.timeline.empty")}</p>
          ) : (
            <ol className="relative space-y-5 border-l border-token pl-6">
              {timeline.map((item, idx) => (
                <li key={idx} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface",
                      item.tone === "success" && "bg-emerald-100 text-emerald-600",
                      item.tone === "info" && "bg-sky-100 text-sky-600",
                      item.tone === "brand" && "bg-[color:var(--brand-soft)] text-[color:var(--brand)]",
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-primary">{t(dict, item.key)}</p>
                      <p className="text-xs text-muted">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted">{item.time}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}
