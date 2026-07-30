"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export interface AppNotification {
  id: string
  title: string
  desc: string
  tone: "warning" | "danger" | "success" | "info"
  timestamp: number
  read: boolean
}

interface NotificationContextType {
  notifications: AppNotification[]
  addNotification: (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const addNotification = useCallback((notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    setNotifications((prev) => {
      // Prevent duplicate warnings of the same title within a short time (e.g. strict mode double render)
      const isDuplicate = prev.some((n) => n.title === notif.title && (Date.now() - n.timestamp < 2000))
      if (isDuplicate) return prev

      return [
        {
          ...notif,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          read: false,
        },
        ...prev,
      ]
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
