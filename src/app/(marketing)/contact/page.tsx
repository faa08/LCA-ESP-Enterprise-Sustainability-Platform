import type { Metadata } from "next";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite } from "@/lib/site-content";
import { PageHero, CtaBand } from "@/components/site/blocks";
import { Reveal } from "@/components/landing/motion-primitives";
import { ContactForm } from "@/components/site/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSite("en");
  return { title: `${s.contact.heroTitle} · ensPR`, description: s.contact.heroDesc };
}

export default async function ContactPage() {
  const locale = await getLocaleFromCookie();
  const s = getSite(locale);
  const c = s.contact;

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} desc={c.heroDesc} />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <ContactForm site={s} />
          </Reveal>
        </div>
      </section>

      <CtaBand site={s} />
    </>
  );
}
