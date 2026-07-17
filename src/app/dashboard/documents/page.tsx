"use client"

import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, FileCheck, BookOpen, Award, ScrollText, FolderOpen, Upload, Search, Filter, MoreHorizontal } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const documentCategories = [
  { icon: FileCheck, nameKey: "documents.permit", count: 12, color: "text-blue-600 bg-blue-50" },
  { icon: BookOpen, nameKey: "documents.sop", count: 24, color: "text-emerald-600 bg-emerald-50" },
  { icon: FileText, nameKey: "documents.audit", count: 18, color: "text-amber-600 bg-amber-50" },
  { icon: Award, nameKey: "documents.certificate", count: 9, color: "text-purple-600 bg-purple-50" },
  { icon: ScrollText, nameKey: "documents.policy", count: 15, color: "text-rose-600 bg-rose-50" },
  { icon: FolderOpen, nameKey: "documents.reports", count: 32, color: "text-cyan-600 bg-cyan-50" },
]

const allDocs = [
  { name: "Plant A - Environmental Permit 2026", folderKey: "documents.permit", type: "PDF", status: "active" as const, size: "2.4 MB", date: "2 days ago" },
  { name: "ISO 14001 Surveillance Audit Report", folderKey: "documents.audit", type: "PDF", status: "active" as const, size: "4.1 MB", date: "1 week ago" },
  { name: "Waste Management SOP v3", folderKey: "documents.sop", type: "DOCX", status: "draft" as const, size: "1.2 MB", date: "2 weeks ago" },
  { name: "GHG Verification Statement 2025", folderKey: "documents.certificate", type: "PDF", status: "active" as const, size: "0.8 MB", date: "3 weeks ago" },
  { name: "Environmental Policy 2026", folderKey: "documents.policy", type: "PDF", status: "active" as const, size: "0.5 MB", date: "1 month ago" },
  { name: "PROPER Self-Assessment Report", folderKey: "documents.reports", type: "XLSX", status: "active" as const, size: "3.2 MB", date: "1 month ago" },
  { name: "Water Discharge Permit - Plant B", folderKey: "documents.permit", type: "PDF", status: "expired" as const, size: "1.8 MB", date: "3 months ago" },
  { name: "Emergency Response Procedure", folderKey: "documents.sop", type: "PDF", status: "active" as const, size: "0.9 MB", date: "3 months ago" },
]

export default function Documents() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
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
                <p className="text-xs text-neutral-500">{t(dict, "documents.count").replace("{n}", String(cat.count))}</p>
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
        <div className="mt-4 overflow-x-auto">
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
      </Card>
    </div>
  )
}
