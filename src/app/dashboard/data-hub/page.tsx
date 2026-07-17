"use client"

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
  Copy,
  CircleSlash,
  ArrowRight,
  MoreHorizontal,
  ShieldAlert,
  ClipboardList,
} from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

/* ---------- Representative single-source-of-truth data ---------- */

const kpis = [
  { key: "datahub.kpi.devices", value: "128", diff: "+12 this month", icon: Cpu },
  { key: "datahub.kpi.imports", value: "342", diff: "QTD", icon: FileSpreadsheet },
  { key: "datahub.kpi.sources", value: "11", diff: "3 IoT · 4 API", icon: Plug },
  { key: "datahub.kpi.validation", value: "96.4%", diff: "3.6% needs review", icon: ShieldAlert },
]

const sources = [
  {
    key: "datahub.source.manual.title",
    desc: "datahub.source.manual.desc",
    icon: PencilLine,
    status: "ready" as const,
  },
  {
    key: "datahub.source.excel.title",
    desc: "datahub.source.excel.desc",
    icon: FileSpreadsheet,
    status: "ready" as const,
  },
  {
    key: "datahub.source.iot.title",
    desc: "datahub.source.iot.desc",
    icon: Radio,
    status: "connected" as const,
  },
  {
    key: "datahub.source.api.title",
    desc: "datahub.source.api.desc",
    icon: Plug,
    status: "available" as const,
  },
]

const recentImports = [
  { file: "emissions_q2.xlsx", module: "Carbon Accounting", by: "Tim IT", time: "10:42", status: "success" as const },
  { file: "water_log.csv", module: "Water Monitoring", by: "Anita", time: "09:18", status: "failed" as const },
  { file: "energy_meter_mar.xlsx", module: "Energy Monitoring", by: "Tim IT", time: "08:55", status: "processing" as const },
  { file: "lca_petrokimia.xlsx", module: "Life Cycle Assessment", by: "Sandra", time: "Yesterday", status: "success" as const },
  { file: "waste_manifest.csv", module: "Waste Management", by: "Budi", time: "Yesterday", status: "success" as const },
]

const devices = [
  { name: "Steam Meter #A12", plant: "Plant A", module: "Energy Monitoring", sync: "2m ago", status: "online" as const },
  { name: "Stack Analyzer B3", plant: "Plant B", module: "Environmental Monitoring", sync: "5m ago", status: "online" as const },
  { name: "Flow Sensor C7", plant: "Plant C", module: "Water Monitoring", sync: "11m ago", status: "online" as const },
  { name: "Bin Scale D2", plant: "Plant A", module: "Waste Management", sync: "1h ago", status: "offline" as const },
  { name: "Power Meter A04", plant: "Plant A", module: "Energy Monitoring", sync: "3m ago", status: "online" as const },
]

const validation = [
  { key: "datahub.validation.errors", value: "7", icon: XCircle, tone: "danger" as const },
  { key: "datahub.validation.warnings", value: "23", icon: AlertTriangle, tone: "warning" as const },
  { key: "datahub.validation.duplicates", value: "14", icon: Copy, tone: "neutral" as const },
  { key: "datahub.validation.missing", value: "9", icon: CircleSlash, tone: "neutral" as const },
]

const timeline = [
  { key: "datahub.timeline.excel", detail: "emissions_q2.xlsx", time: "10:42", icon: FileSpreadsheet, tone: "success" as const },
  { key: "datahub.timeline.iot", detail: "Meter Plant A synced", time: "10:40", icon: Radio, tone: "info" as const },
  { key: "datahub.timeline.manual", detail: "Manual entry · Water", time: "09:18", icon: PencilLine, tone: "brand" as const },
  { key: "datahub.timeline.api", detail: "SAP ERP connected", time: "08:02", icon: Plug, tone: "success" as const },
]

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
          <Button variant="secondary" size="lg">
            <PencilLine className="h-4 w-4" /> {t(dict, "datahub.action.manual_entry")}
          </Button>
          <Button variant="secondary" size="lg">
            <Upload className="h-4 w-4" /> {t(dict, "datahub.action.import_excel")}
          </Button>
          <Button size="lg">
            <Radio className="h-4 w-4" /> {t(dict, "datahub.action.connect_iot")}
          </Button>
        </div>
      </div>

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
              {recentImports.map((row) => (
                <TableRow key={row.file}>
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
        </div>
      </section>

      {/* Section 5 — Connected devices */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-primary">{t(dict, "datahub.devices.title")}</h2>
        <div className="enterprise-card overflow-hidden p-0">
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
                  v.tone === "danger" && "border-red-200 dark:border-red-900",
                  v.tone === "warning" && "border-amber-200 dark:border-amber-900",
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
          <ol className="relative space-y-5 border-l border-token pl-6">
            {timeline.map((item) => (
              <li key={item.key} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface",
                    item.tone === "success" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-950",
                    item.tone === "info" && "bg-sky-100 text-sky-600 dark:bg-sky-950",
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
        </div>
      </section>
    </div>
  )
}
