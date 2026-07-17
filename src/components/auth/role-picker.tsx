import { setManagerRole, setViewerRole } from "@/app/actions/role"
import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { Leaf, UserCog, Users } from "lucide-react"

const dicts: Record<Locale, Record<string, string>> = { id, en }

export function RolePicker({ locale }: { locale: Locale }) {
  const dict = dicts[locale]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-semibold text-neutral-900">{t(dict, "brand.name")}</span>
              <span className="ml-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">{t(dict, "brand.subtitle")}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">{t(dict, "role_picker.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "role_picker.subtitle")}</p>
        </div>

        <div className="space-y-3">
          <form action={setManagerRole}>
            <button
              type="submit"
              className="flex w-full items-center gap-4 rounded-xl border-2 border-emerald-200 bg-white p-5 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <UserCog className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{t(dict, "role_picker.it.title")}</p>
                <p className="text-sm text-neutral-500">{t(dict, "role_picker.it.desc")}</p>
              </div>
            </button>
          </form>

          <form action={setViewerRole}>
            <button
              type="submit"
              className="flex w-full items-center gap-4 rounded-xl border-2 border-neutral-200 bg-white p-5 text-left transition-all hover:border-neutral-400 hover:bg-neutral-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                <Users className="h-6 w-6 text-neutral-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{t(dict, "role_picker.viewer.title")}</p>
                <p className="text-sm text-neutral-500">{t(dict, "role_picker.viewer.desc")}</p>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
