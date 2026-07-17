import InputPageGuard from "@/components/auth/input-guard"
import { WasteInputForm } from "@/components/waste/waste-input-form"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function WasteInputPage() {
  const locale = await getLocaleFromCookie()

  return (
    <InputPageGuard>
      <WasteInputForm locale={locale} />
    </InputPageGuard>
  )
}
