import InputPageGuard from "@/components/auth/input-guard"
import { EnvironmentalInputForm } from "@/components/environmental/environmental-input-form"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function EnvironmentalInputPage() {
  const locale = await getLocaleFromCookie()

  return (
    <InputPageGuard>
      <EnvironmentalInputForm locale={locale} />
    </InputPageGuard>
  )
}
