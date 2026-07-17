"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { openModal: () => void; closeModal: () => void; isOpen: boolean };
const DemoCtx = createContext<Ctx>({ openModal: () => {}, closeModal: () => {}, isOpen: false });

export function useDemo() {
  return useContext(DemoCtx);
}

export default function LandingInteractions({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-demo-trigger], [data-demo-close]");
      if (!target) return;
      e.preventDefault();
      if (target.hasAttribute("data-demo-close")) closeModal();
      else openModal();
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <DemoCtx.Provider value={{ openModal, closeModal, isOpen }}>{children}</DemoCtx.Provider>
  );
}
