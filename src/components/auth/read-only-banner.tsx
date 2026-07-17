import { Eye } from "lucide-react"
import { getRoleFromCookie } from "@/lib/role"
import { getLocaleFromCookie, getDictionary, t } from "@/lib/i18n"

export async function ReadOnlyBanner() {
  const role = await getRoleFromCookie()
  if (role !== "viewer") return null

  const locale = await getLocaleFromCookie()
  const dict = await getDictionary(locale)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200">
        <Eye className="h-4 w-4 text-neutral-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-800">
          {t(dict, "readonly.title")}
        </p>
        <p className="text-xs text-neutral-500">
          {t(dict, "readonly.desc")}
        </p>
      </div>
    </div>
  )
}
