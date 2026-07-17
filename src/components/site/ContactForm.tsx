"use client";

import type { SiteContent } from "@/lib/site-content";
import { Mail, MapPin, Globe } from "lucide-react";

export function ContactForm({ site }: { site: SiteContent }) {
  const c = site.contact;
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="rounded-3xl border border-neutral-200 bg-surface p-8">
        <h2 className="text-xl font-semibold text-ink">{c.infoTitle}</h2>
        <p className="mt-2 text-sm text-neutral-500">{c.infoDesc}</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Mail className="h-5 w-5" /></span>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-neutral-400">{c.salesLabel}</div>
              <div className="text-sm font-semibold text-ink">{c.salesValue}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><MapPin className="h-5 w-5" /></span>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-neutral-400">{c.hqLabel}</div>
              <div className="text-sm font-semibold text-ink">{c.hqValue}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Globe className="h-5 w-5" /></span>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-neutral-400">{c.regionsLabel}</div>
              <div className="text-sm font-semibold text-ink">{c.regionsValue}</div>
            </div>
          </div>
        </div>
      </div>

      <form className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-soft" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-neutral-600">{c.formName}</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">{c.formEmail}</label>
            <input type="email" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">{c.formCompany}</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">{c.formRole}</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-neutral-600">{c.formMessage}</label>
          <textarea rows={4} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
        </div>
        <button type="submit" className="mt-5 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-600">
          {c.formSubmit}
        </button>
        <p className="mt-3 text-center text-xs text-neutral-400">{c.formNote}</p>
      </form>
    </div>
  );
}
