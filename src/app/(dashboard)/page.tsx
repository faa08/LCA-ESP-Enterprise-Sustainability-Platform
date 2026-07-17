import { ReadOnlyBanner } from "@/components/auth/read-only-banner"
import { ExecutiveOverview } from "@/components/dashboard/executive-overview"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function ExecutiveOverviewPage() {
  const locale = await getLocaleFromCookie()

  return (
    <div className="space-y-6">
      <ReadOnlyBanner />
      <ExecutiveOverview locale={locale} />
    </div>
  )
}
