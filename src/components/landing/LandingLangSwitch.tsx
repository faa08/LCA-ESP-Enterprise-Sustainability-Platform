"use client";

import { useSyncExternalStore } from "react";

function applyLang(lang: "id" | "en") {
  document.cookie = `lang=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  window.location.href = window.location.pathname + "?t=" + Date.now();
}

function subscribe() {
  return () => {};
}

function getSnapshot(): "id" | "en" {
  if (typeof document === "undefined") return "id";
  const m = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/);
  return m?.[1] === "en" ? "en" : "id";
}

function getServerSnapshot(): "id" | "en" {
  return "id";
}

export default function LandingLangSwitch() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function switchLang(lang: "id" | "en") {
    applyLang(lang);
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-neutral-200 bg-white/70 p-0.5 backdrop-blur">
      {(["id", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
            locale === l ? "bg-brand-500 text-white" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
