import { getLocaleFromCookie, getDictionary } from "@/lib/i18n";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Platform from "@/components/landing/Platform";
import HowItWorks from "@/components/landing/HowItWorks";
import DashboardShowcase from "@/components/landing/DashboardShowcase";
import FeatureModules from "@/components/landing/FeatureModules";
import Industries from "@/components/landing/Industries";
import Compliance from "@/components/landing/Compliance";
import HowEnviWorks from "@/components/landing/HowEnviWorks";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";

export default async function Home() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  return (
    <>
      <main>
        <Hero dict={dict} />
        <Problem dict={dict} />
        <Platform dict={dict} />
        <HowItWorks dict={dict} />
        <DashboardShowcase dict={dict} />
        <FeatureModules dict={dict} />
        <Industries />
        <Compliance dict={dict} />
        <HowEnviWorks />
        <Faq dict={dict} />
        <FinalCta dict={dict} />
      </main>
    </>
  );
}
