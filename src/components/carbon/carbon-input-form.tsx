"use client"

import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const dicts: Record<Locale, Record<string, string>> = { id, en }

const scope3Cats = [
  "carbon.scope3.transport",
  "carbon.scope3.suppliers",
  "carbon.scope3.travel",
  "carbon.scope3.waste",
  "carbon.scope3.commuting",
]

export function CarbonInputForm({ locale }: { locale: Locale }) {
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/carbon-accounting" className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-50">
            <ArrowLeft className="h-4 w-4 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "carbon.title")}</h1>
            <p className="text-sm text-neutral-500">{t(dict, "carbon.desc")}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t(dict, "carbon.save")}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "carbon.scope1")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {["fuel", "vehicles", "generators"].map((key) => (
              <div key={key}>
                <label className="text-sm font-medium text-neutral-700">{t(dict, `carbon.scope1.${key}`)}</label>
                <div className="mt-1 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "carbon.value")}</span>
                    <input type="number" className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="0" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "carbon.unit")}</span>
                    <select className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option>liter</option>
                      <option>m³</option>
                      <option>ton</option>
                      <option>GJ</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "carbon.scope2")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {["electricity", "steam"].map((key) => (
              <div key={key}>
                <label className="text-sm font-medium text-neutral-700">{t(dict, `carbon.scope2.${key}`)}</label>
                <div className="mt-1 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "carbon.value")}</span>
                    <input type="number" className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="0" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "carbon.unit")}</span>
                    <select className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option>kWh</option>
                      <option>MWh</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "carbon.scope3")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scope3Cats.map((catKey) => (
            <div key={catKey}>
              <label className="text-sm font-medium text-neutral-700">{t(dict, catKey)}</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-neutral-500">{t(dict, "carbon.value")}</span>
                  <input type="number" className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="0" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500">{t(dict, "carbon.unit")}</span>
                  <select className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                    <option>ton.km</option>
                    <option>km</option>
                    <option>ton</option>
                    <option>kWh</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "carbon.period")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "carbon.period_start")}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "carbon.period_end")}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "carbon.facility")}</label>
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option>Plant A</option>
              <option>Plant B</option>
              <option>Plant C</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-neutral-700">{t(dict, "carbon.notes")}</label>
          <textarea className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" rows={3} placeholder="..." />
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Link href="/carbon-accounting" className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
          {t(dict, "carbon.cancel")}
        </Link>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t(dict, "carbon.save")}
        </button>
      </div>
    </div>
  )
}
