"use client";

import { useDemo } from "./LandingInteractions";

export default function DemoModal() {
  const { isOpen, closeModal } = useDemo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" data-demo-close></div>
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <button
          onClick={closeModal}
          data-demo-close
          className="absolute right-4 top-4 text-neutral-400 transition hover:text-neutral-700"
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold text-neutral-900">Request a Demo</h3>
        <p className="mt-2 text-sm text-neutral-600">
          Leave your details and our enterprise team will reach out for a 30-minute platform walkthrough.
        </p>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
          <div>
            <label className="text-xs font-medium text-neutral-600">Full Name</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">Work Email</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600" placeholder="jane@company.com" type="email" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
