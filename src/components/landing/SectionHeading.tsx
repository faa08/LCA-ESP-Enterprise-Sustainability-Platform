import type { ReactNode } from "react";
import { Reveal } from "./motion-primitives";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
}) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "items-start text-left";
  return (
    <Reveal>
      <div className={`flex max-w-2xl flex-col ${alignment}`}>
        {eyebrow && (
          <span
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              light ? "text-brand-200" : "text-brand-600"
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/70" : "text-neutral-600"}`}>
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
