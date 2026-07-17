import { getLocaleFromCookie, getDictionary } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import SiteNav from "@/components/landing/SiteNav";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingInteractions from "@/components/landing/LandingInteractions";
import DemoModal from "@/components/landing/DemoModal";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const site = getSite(locale);

  return (
    <LandingInteractions>
      <div className="min-h-screen bg-white text-ink antialiased">
        <SiteNav site={site} />
        <main>{children}</main>
        <LandingFooter site={site} />
        <DemoModal />
      </div>
    </LandingInteractions>
  );
}
