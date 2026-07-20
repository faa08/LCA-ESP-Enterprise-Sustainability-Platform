"use client"

import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, FileCheck, BookOpen, Award, ScrollText, FolderOpen, Upload, Search, Filter, MoreHorizontal } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

export default function Documents() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  const documentCategories = [
    { icon: FileCheck, nameKey: "documents.permit", color: "text-blue-600 bg-blue-50" },
    { icon: BookOpen, nameKey: "documents.sop", color: "text-emerald-600 bg-emerald-50" },
    { icon: FileText, nameKey: "documents.audit", color: "text-amber-600 bg-amber-50" },
    { icon: Award, nameKey: "documents.certificate", color: "text-purple-600 bg-purple-50" },
    { icon: ScrollText, nameKey: "documents.policy", color: "text-rose-600 bg-rose-50" },
    { icon: FolderOpen, nameKey: "documents.reports", color: "text-cyan-600 bg-cyan-50" },
  ]

  const properDocs = [
    { key: "documents.proper.ukl" },
    { key: "documents.proper.tps" },
    { key: "documents.proper.manifest" },
    { key: "documents.proper.form" },
    { key: "documents.proper.monitoring" },
    { key: "documents.proper.permit_pl" },
    { key: "documents.proper.permit_parmen" },
  ]

  const allDocs: { name: string; folderKey: string; type: string; status: "active" | "draft" | "expired"; size: string; date: string }[] = []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "documents.proper_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "documents.proper_desc")}</p>
        </CardHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {properDocs.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5">
              <span className="text-sm text-neutral-800">{t(dict, d.key)}</span>
              <Badge variant="neutral">{t(dict, "common.no_data")}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={t(dict, "documents.search")}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
          <Filter className="h-4 w-4" />
          {t(dict, "common.filter")}
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Upload className="h-4 w-4" />
          {t(dict, "common.upload")}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documentCategories.map((cat, i) => (
          <Card key={i} className="group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{t(dict, cat.nameKey)}</p>
                <p className="text-xs text-neutral-500">{t(dict, "common.no_data")}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>{t(dict, "documents.all")}</CardTitle>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>{t(dict, "documents.sort_by")}</span>
          </div>
        </div>
        <div className="mt-4">
          {allDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.name")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.folder")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.type")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.size")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.status")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.date")}</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {allDocs.map((doc, i) => (
                    <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-neutral-400" />
                          <span className="font-medium text-neutral-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-600">{t(dict, doc.folderKey)}</td>
                      <td className="px-3 py-2.5">
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">{doc.type}</span>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-600">{doc.size}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={doc.status === "active" ? "success" : doc.status === "draft" ? "neutral" : "danger"}>
                          {t(dict, "common." + doc.status)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-neutral-500">{doc.date}</td>
                      <td className="px-3 py-2.5">
                        <MoreHorizontal className="h-4 w-4 cursor-pointer text-neutral-400 hover:text-neutral-600" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
          )}
        </div>
      </Card>
    </div>
  )
}
