import InputPageGuard from "@/components/auth/input-guard"
import { CarbonInputForm } from "@/components/carbon/carbon-input-form"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function CarbonInputPage() {
  const locale = await getLocaleFromCookie()

  return (
    <InputPageGuard>
      <CarbonInputForm locale={locale} />
    </InputPageGuard>
  )
}
