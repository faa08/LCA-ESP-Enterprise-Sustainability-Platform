import InputPageGuard from "@/components/auth/input-guard"
import { WaterInputForm } from "@/components/water/water-input-form"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function WaterInputPage() {
  const locale = await getLocaleFromCookie()

  return (
    <InputPageGuard>
      <WaterInputForm locale={locale} />
    </InputPageGuard>
  )
}
