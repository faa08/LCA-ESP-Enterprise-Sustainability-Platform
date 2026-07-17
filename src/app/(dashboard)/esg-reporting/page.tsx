"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, Download, FileSpreadsheet, Printer, Globe, Users, Award } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const scoreHistory = [
  { year: "2021", environmental: 58, social: 62, governance: 55 },
  { year: "2022", environmental: 65, social: 68, governance: 60 },
  { year: "2023", environmental: 72, social: 74, governance: 68 },
  { year: "2024", environmental: 78, social: 76, governance: 72 },
  { year: "2025", environmental: 82, social: 80, governance: 78 },
  { year: "2026", environmental: 85, social: 82, governance: 80 },
]

export default function ESGReporting() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "esg.score")} value="A-" description={t(dict, "esg.rating")} change={t(dict, "esg.upgraded").replace("{n}", "BBB")} changeType="positive" trend="up" icon={TrendingUp} />
        <StatCard title={t(dict, "esg.reports_gen")} value="24" description={t(dict, "common.ytd")} icon={FileText} />
        <StatCard title={t(dict, "esg.indicators")} value="142/147" description={t(dict, "esg.reported").replace("{n}", "3")} change="+3 this quarter" changeType="positive" trend="up" icon={FileText} />
        <StatCard title={t(dict, "esg.metrics")} value="9/11" description={t(dict, "esg.disclosed")} icon={Globe} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "esg.chart_trend")}</CardTitle>
        </CardHeader>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#a3a3a3" />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="environmental" stroke="#059669" strokeWidth={2} name={t(dict, "esg.environmental")} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="social" stroke="#0ea5e9" strokeWidth={2} name={t(dict, "esg.social")} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="governance" stroke="#a855f7" strokeWidth={2} name={t(dict, "esg.governance")} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { labelKey: "esg.env_score", value: "85/100", change: "+3 YoY", color: "bg-emerald-500" },
          { labelKey: "esg.social_score", value: "82/100", change: "+2 YoY", color: "bg-blue-500" },
          { labelKey: "esg.gov_score", value: "80/100", change: "+2 YoY", color: "bg-purple-500" },
        ].map((item, i) => (
          <Card key={i}>
            <div className="text-center">
              <p className="text-sm text-neutral-500">{t(dict, item.labelKey)}</p>
              <p className="mt-1 text-3xl font-bold text-neutral-900">{item.value}</p>
              <p className="mt-1 text-xs text-emerald-600">{item.change}</p>
              <div className="mt-3 h-2 rounded-full bg-neutral-100">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${parseInt(item.value)}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "esg.reports_available")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { name: "Sustainability Report 2025", type: "PDF", status: "published" as const, date: "Mar 2026" },
              { name: "GRI Content Index", type: "Excel", status: "published" as const, date: "Mar 2026" },
              { name: "CDP Climate Change Response", type: "PDF", status: "draft" as const, date: "In Progress" },
              { name: "TCFD Report 2025", type: "PDF", status: "published" as const, date: "Feb 2026" },
              { name: "ESG Data Pack", type: "Excel", status: "draft" as const, date: "In Progress" },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  {report.type === "PDF" ? <Printer className="h-4 w-4 text-neutral-400" /> : <FileSpreadsheet className="h-4 w-4 text-neutral-400" />}
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{report.name}</p>
                    <p className="text-xs text-neutral-500">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={report.status === "published" ? "success" : "neutral"}>{t(dict, "common." + report.status)}</Badge>
                  <Download className="h-4 w-4 text-neutral-400 hover:text-neutral-600 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-400">
            <FileText className="mr-2 h-4 w-4" />
            {t(dict, "esg.generate")}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "esg.certs")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { name: "ISO 14001:2015", issuer: "SGS", rating: "" },
              { name: "ISO 45001:2018", issuer: "TUV Rheinland", rating: "" },
              { name: "ISO 50001:2018", issuer: "SGS", rating: "" },
              { name: "PROPER Rating", issuer: "Kemen LHK", rating: "Green" },
              { name: "S&P Global CSA", issuer: "S&P Global", rating: "Top 15%" },
            ].map((cert, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{cert.name}</p>
                    <p className="text-xs text-neutral-500">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cert.rating && <Badge variant="success">{cert.rating}</Badge>}
                  <Badge variant="success">{t(dict, "common.active")}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
