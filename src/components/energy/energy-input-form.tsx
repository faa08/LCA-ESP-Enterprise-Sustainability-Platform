"use client"

import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const dicts: Record<Locale, Record<string, string>> = { id, en }

export function EnergyInputForm({ locale }: { locale: Locale }) {
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/energy-monitoring" className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-50">
            <ArrowLeft className="h-4 w-4 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "energy.title")}</h1>
            <p className="text-sm text-neutral-500">{t(dict, "energy.desc")}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t(dict, "energy.save")}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.electricity")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {["usage", "peak", "offpeak"].map((key) => (
              <div key={key}>
                <label className="text-sm font-medium text-neutral-700">{t(dict, `energy.electricity.${key}`)}</label>
                <div className="mt-1 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "energy.value")}</span>
                    <input type="number" className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="0" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "energy.unit")}</span>
                    <select className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option>kWh</option>
                      <option>MWh</option>
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
            <CardTitle>{t(dict, "energy.fuel")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {["diesel", "biomass"].map((key) => (
              <div key={key}>
                <label className="text-sm font-medium text-neutral-700">{t(dict, `energy.fuel.${key}`)}</label>
                <div className="mt-1 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "energy.value")}</span>
                    <input type="number" className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="0" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">{t(dict, "energy.unit")}</span>
                    <select className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option>liter</option>
                      <option>ton</option>
                      <option>GJ</option>
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
          <CardTitle>{t(dict, "energy.renewable")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {["solar", "biogas"].map((key) => (
            <div key={key}>
              <label className="text-sm font-medium text-neutral-700">{t(dict, `energy.renewable.${key}`)}</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-neutral-500">{t(dict, "energy.value")}</span>
                  <input type="number" className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="0" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500">{t(dict, "energy.unit")}</span>
                  <select className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                    <option>kWh</option>
                    <option>MWh</option>
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
          <CardTitle>{t(dict, "energy.period")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "energy.period_start")}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "energy.period_end")}</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">{t(dict, "energy.facility")}</label>
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option>Plant A</option>
              <option>Plant B</option>
              <option>Plant C</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-neutral-700">{t(dict, "energy.notes")}</label>
          <textarea className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" rows={3} placeholder="..." />
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Link href="/energy-monitoring" className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
          {t(dict, "energy.cancel")}
        </Link>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t(dict, "energy.save")}
        </button>
      </div>
    </div>
  )
}
