"use client"

import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { StatCard } from "@/components/ui/stat-card"
import { KpiProgress } from "@/components/ui/kpi-progress"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Cloud,
  Zap,
  Droplets,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Factory,
  AlertTriangle,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const dicts: Record<Locale, Record<string, string>> = { id, en }

const weeklyTrend = [
  { day: "Mon", emissions: 420, energy: 2800, water: 520 },
  { day: "Tue", emissions: 385, energy: 2650, water: 490 },
  { day: "Wed", emissions: 410, energy: 2900, water: 510 },
  { day: "Thu", emissions: 395, energy: 2750, water: 480 },
  { day: "Fri", emissions: 370, energy: 2500, water: 460 },
  { day: "Sat", emissions: 340, energy: 2200, water: 430 },
  { day: "Sun", emissions: 320, energy: 2100, water: 410 },
]

const monthlyEmissions = [
  { month: "Jan", scope1: 280, scope2: 420, scope3: 180 },
  { month: "Feb", scope1: 260, scope2: 400, scope3: 170 },
  { month: "Mar", scope1: 290, scope2: 430, scope3: 190 },
  { month: "Apr", scope1: 270, scope2: 410, scope3: 175 },
  { month: "May", scope1: 250, scope2: 390, scope3: 165 },
  { month: "Jun", scope1: 240, scope2: 380, scope3: 160 },
]

export function ExecutiveOverview({ locale }: { locale: Locale }) {
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t(dict, "dashboard.kpi.carbon")}
          value="2,847 tCO₂e"
          description={t(dict, "dashboard.kpi.carbon_desc")}
          change={t(dict, "dashboard.kpi.carbon_change")}
          changeType="positive"
          trend="down"
          icon={Cloud}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.energy")}
          value="18,420 MWh"
          description={t(dict, "dashboard.kpi.energy_desc")}
          change={t(dict, "dashboard.kpi.energy_change")}
          changeType="negative"
          trend="up"
          icon={Zap}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.water")}
          value="92,500 m³"
          description={t(dict, "dashboard.kpi.water_desc")}
          change={t(dict, "dashboard.kpi.water_change")}
          changeType="positive"
          trend="down"
          icon={Droplets}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.recycled")}
          value="64.2%"
          description={t(dict, "dashboard.kpi.recycled_desc")}
          change={t(dict, "dashboard.kpi.recycled_change")}
          changeType="positive"
          trend="up"
          icon={Recycle}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t(dict, "dashboard.kpi.compliance")}
          value="94/100"
          description={t(dict, "dashboard.kpi.compliance_desc")}
          change={t(dict, "dashboard.kpi.compliance_change")}
          changeType="positive"
          trend="up"
          icon={ShieldCheck}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.esg")}
          value="A-"
          description={t(dict, "dashboard.kpi.esg_desc")}
          change={t(dict, "dashboard.kpi.esg_change")}
          changeType="positive"
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.facilities")}
          value="12"
          description={t(dict, "dashboard.kpi.facilities_desc")}
          icon={Factory}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.issues")}
          value="8"
          description={t(dict, "dashboard.kpi.issues_desc")}
          change={t(dict, "dashboard.kpi.issues_change")}
          changeType="negative"
          trend="up"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.chart.weekly")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="emissions" stroke="#059669" strokeWidth={2} name="CO₂ (t)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="energy" stroke="#d97706" strokeWidth={2} name="Energy (MWh)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="water" stroke="#0284c7" strokeWidth={2} name="Water (m³)" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.chart.scope")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEmissions}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="scope1" fill="#059669" radius={[4, 4, 0, 0]} name="Scope 1" />
                <Bar dataKey="scope2" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Scope 2" />
                <Bar dataKey="scope3" fill="#a855f7" radius={[4, 4, 0, 0]} name="Scope 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.kpi.title")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <KpiProgress label={t(dict, "dashboard.kpi.carbon_red")} current={2847} target={3500} unit="tCO₂e" />
            <KpiProgress label={t(dict, "dashboard.kpi.renewable")} current={35} target={50} unit="%" />
            <KpiProgress label={t(dict, "dashboard.kpi.water_eff")} current={78} target={85} unit="%" />
            <KpiProgress label={t(dict, "dashboard.kpi.waste_div")} current={64} target={75} unit="%" />
            <KpiProgress label={t(dict, "dashboard.kpi.compliance_kpi")} current={94} target={100} unit="%" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.issues.title")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { facility: "Plant A - Production Hall 2", issue: "Air emission exceedance", severity: "critical" as const, date: "2h ago" },
              { facility: "Plant B - Wastewater Treatment", issue: "pH level out of range", severity: "high" as const, date: "5h ago" },
              { facility: "Plant C - Boiler Room", issue: "High energy consumption", severity: "medium" as const, date: "1d ago" },
              { facility: "Plant A - Cooling Tower", issue: "Water leak detected", severity: "high" as const, date: "2d ago" },
              { facility: "Plant B - Chemical Storage", issue: "Permit renewal pending", severity: "medium" as const, date: "3d ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between rounded-lg border border-neutral-100 p-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.facility}</p>
                  <p className="text-xs text-neutral-500">{item.issue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.severity === "critical" ? "danger" : item.severity === "high" ? "warning" : "neutral"}>
                    {item.severity}
                  </Badge>
                  <span className="text-xs text-neutral-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
