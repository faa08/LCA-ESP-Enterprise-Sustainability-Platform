import { setAdminRole, setManagerRole, setOperatorRole, setViewerRole } from "@/app/actions/role"
import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { Leaf, ShieldAlert, UserCog, Database, Eye } from "lucide-react"

const dicts: Record<Locale, Record<string, string>> = { id, en }

export function RolePicker({ locale }: { locale: Locale }) {
  const dict = dicts[locale]

  const roles = [
    {
      action: setAdminRole,
      icon: ShieldAlert,
      iconBg: "bg-purple-100 text-purple-700",
      borderHover: "hover:border-purple-500 hover:bg-purple-50/50",
      title: "Admin Korporat",
      subtitle: "Full Control: Tata Kelola Grup Entitas & Kunci Parameter Metodologi ISO 14040",
      badge: "Full Control",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      action: setManagerRole,
      icon: UserCog,
      iconBg: "bg-blue-100 text-blue-700",
      borderHover: "hover:border-blue-500 hover:bg-blue-50/50",
      title: "Sustainability Manager",
      subtitle: "Analisis LCA, Penetapan Target Net Zero & Pelaporan Resmi OJK/PROPER/GRI",
      badge: "Manager / Analyst",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      action: setOperatorRole,
      icon: Database,
      iconBg: "bg-emerald-100 text-emerald-700",
      borderHover: "hover:border-emerald-500 hover:bg-emerald-50/50",
      title: "Operator Site / Staff Input",
      subtitle: "Pusat Ingest Data Operasional (Data Hub: Energi, Limbah, Lab, Berkas Pendukung)",
      badge: "Data Ingestion (Data Hub)",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      action: setViewerRole,
      icon: Eye,
      iconBg: "bg-neutral-100 text-neutral-700",
      borderHover: "hover:border-neutral-400 hover:bg-neutral-50/50",
      title: "Auditor Eksternal / Viewer",
      subtitle: "Akses Read-Only: Pemantauan Dashboard, Jejak Audit & Ekspor Data Laporan",
      badge: "Read-Only / Auditor",
      badgeColor: "bg-neutral-100 text-neutral-800",
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-8">
        <div className="mb-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-xs">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-neutral-900">{t(dict, "brand.name")}</span>
              <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">{t(dict, "brand.subtitle")}</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Pilih Peran Pengguna (Role-Based Access)</h1>
          <p className="mt-1 text-xs text-neutral-500">Pilih peran sesuai tanggung jawab tata kelola data di organisasi Anda</p>
        </div>

        <div className="space-y-3">
          {roles.map((r, i) => (
            <form key={i} action={r.action}>
              <button
                type="submit"
                className={`flex w-full items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 text-left transition-all shadow-2xs ${r.borderHover}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${r.iconBg}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-bold text-sm text-neutral-900">{r.title}</p>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${r.badgeColor}`}>{r.badge}</span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{r.subtitle}</p>
                </div>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}

