"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface HelpContextType {
  isOpen: boolean
  toggleHelp: () => void
  closeHelp: () => void
  openHelp: () => void
}

const HelpContext = createContext<HelpContextType | undefined>(undefined)

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleHelp = () => setIsOpen((prev) => !prev)
  const closeHelp = () => setIsOpen(false)
  const openHelp = () => setIsOpen(true)

  return (
    <HelpContext.Provider value={{ isOpen, toggleHelp, closeHelp, openHelp }}>
      {children}
    </HelpContext.Provider>
  )
}

export function useHelp() {
  const context = useContext(HelpContext)
  if (context === undefined) {
    throw new Error("useHelp must be used within a HelpProvider")
  }
  return context
}
