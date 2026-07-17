import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocaleFromCookie } from "@/lib/i18n";
import { getSite, moduleSlugs } from "@/lib/site-content";
import { ModuleDetail } from "@/components/site/ModuleDetail";

export function generateStaticParams() {
  return moduleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSite("en");
  const m = s.modules[slug];
  if (!m) return { title: "Module · ensPR" };
  return { title: `${m.name} · ensPR`, description: m.heroDesc };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocaleFromCookie();
  const site = getSite(locale);
  if (!site.modules[slug]) notFound();
  return <ModuleDetail site={site} slug={slug} />;
}
