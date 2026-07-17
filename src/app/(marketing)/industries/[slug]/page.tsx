import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite, industrySlugs } from "@/lib/site-content";
import { IndustryDetail } from "@/components/site/IndustryDetail";

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSite("en");
  const ind = s.industries[slug];
  if (!ind) return { title: "Industry · ensPR" };
  return { title: `${ind.name} · ensPR`, description: ind.heroDesc };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocaleFromCookie();
  const site = getSite(locale);
  if (!site.industries[slug]) notFound();
  return <IndustryDetail site={site} slug={slug} />;
}
