import { Reveal } from "./motion-primitives";
import type { SiteContent } from "@/lib/site-content";

export default function LandingFooter({ site }: { site: SiteContent }) {
  const f = site.footer;
  const columns = [
    { title: f.col1, links: f.col1l },
    { title: f.col2, links: f.col2l },
    { title: f.col3, links: f.col3l },
    { title: f.col4, links: f.col4l },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.6fr_repeat(4,1fr)]">
        <Reveal>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-brand">e</span>
              <span className="text-lg font-semibold tracking-tight text-ink">ensPR</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">{f.desc}</p>
          </div>
        </Reveal>

        {columns.map((col) => (
          <Reveal key={col.title}>
            <div>
              <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-neutral-500 transition-colors hover:text-brand-600">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-neutral-100 px-6 pt-6 text-xs text-neutral-400 sm:flex-row">
        <span>© {new Date().getFullYear()} ensPR. {f.copyright}</span>
        <div className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-neutral-700">{f.privacy}</a>
          <a href="#" className="transition-colors hover:text-neutral-700">{f.terms}</a>
          <a href="#" className="transition-colors hover:text-neutral-700">{f.security}</a>
        </div>
      </div>
    </footer>
  );
}
