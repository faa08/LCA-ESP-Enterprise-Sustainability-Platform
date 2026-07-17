"use client"

import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const dicts: Record<Locale, Record<string, string>> = { id, en }

const airParams = ["SO₂", "NOx", "Particulate", "VOC"]
const waterParams = [
  { label: "pH", unit: "" },
  { label: "TSS", unit: "mg/L" },
  { label: "COD", unit: "mg/L" },
  { label: "BOD", unit: "mg/L" },
  { label: "Temperature", unit: "°C" },
]

export function EnvironmentalInputForm({ locale }: { locale: Locale }) {
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/environmental-monitoring" className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-50">
            <ArrowLeft className="h-4 w-4 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "env.title")}</h1>
            <p className="text-sm text-neutral-500">{t(dict, "env.desc")}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t(dict, "env.save")}
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "env.air")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {airParams.map((param, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-neutral-700">{param}</label>
              <input type="number" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="mg/Nm³" />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "env.air.source")}</label>
            <input type="text" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Stack 1" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "env.air.date")}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "env.air.facility")}</label>
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option>Plant A</option>
              <option>Plant B</option>
              <option>Plant C</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "env.water")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {waterParams.map((param, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-neutral-700">{param.label}</label>
              <input type="number" step="0.1" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder={param.unit} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "env.incident")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "env.incident.type")}</label>
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option>Spill</option>
              <option>Leak</option>
              <option>Exceedance</option>
              <option>Complaint</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "env.incident.severity")}</label>
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "env.incident.date")}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-neutral-700">{t(dict, "env.incident.desc")}</label>
          <textarea className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" rows={2} placeholder="..." />
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Link href="/environmental-monitoring" className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
          {t(dict, "env.cancel")}
        </Link>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t(dict, "env.save")}
        </button>
      </div>
    </div>
  )
}
