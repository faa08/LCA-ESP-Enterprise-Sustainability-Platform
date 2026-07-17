import { RolePicker } from "@/components/auth/role-picker"
import { getLocaleFromCookie } from "@/lib/i18n"

export default async function SelectRolePage() {
  const locale = await getLocaleFromCookie()
  return <RolePicker locale={locale} />
}
