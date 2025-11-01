"use client"

import { useState, useEffect, useCallback } from "react"

export interface Alert {
  id: string
  type: "emergency" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export function useRealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Simulate real-time alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "emergency",
        title: "Critical Case Alert",
        message: "John Doe - Chest Pain (Coach C, Seat 45)",
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        actionUrl: "/dashboard/attendant/alerts",
      },
      {
        id: "2",
        type: "warning",
        title: "High Fever Case",
        message: "Jane Smith - Fever (Coach B, Seat 32)",
        timestamp: new Date(Date.now() - 12 * 60000),
        read: false,
        actionUrl: "/dashboard/attendant/alerts",
      },
      {
        id: "3",
        type: "info",
        title: "Device Sync Complete",
        message: "Blood Pressure Monitor synced successfully",
        timestamp: new Date(Date.now() - 30 * 60000),
        read: true,
      },
    ]

    setAlerts(mockAlerts)
    setUnreadCount(mockAlerts.filter((a) => !a.read).length)

    // Simulate new alerts every 30 seconds
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? "warning" : "info",
        title: "New Update",
        message: "System update received",
        timestamp: new Date(),
        read: false,
      }

      setAlerts((prev) => [newAlert, ...prev])
      setUnreadCount((prev) => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
    setUnreadCount(0)
  }, [])

  const clearAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  return {
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAlert,
  }
}
