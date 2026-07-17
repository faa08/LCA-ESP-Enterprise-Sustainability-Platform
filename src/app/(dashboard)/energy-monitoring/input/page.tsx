import InputPageGuard from "@/components/auth/input-guard"
import { EnergyInputForm } from "@/components/energy/energy-input-form"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function EnergyInputPage() {
  const locale = await getLocaleFromCookie()

  return (
    <InputPageGuard>
      <EnergyInputForm locale={locale} />
    </InputPageGuard>
  )
}
