"use client"

import { useState, useEffect } from "react"

export interface VitalReading {
  timestamp: Date
  heartRate: number
  bloodPressure: string
  spo2: number
  temperature: number
}

export function useLiveVitals(patientId?: string) {
  const [vitals, setVitals] = useState<VitalReading>({
    timestamp: new Date(),
    heartRate: 72,
    bloodPressure: "120/80",
    spo2: 98,
    temperature: 37.0,
  })

  useEffect(() => {
    // Simulate live vital updates every 5 seconds
    const interval = setInterval(() => {
      setVitals((prev) => ({
        timestamp: new Date(),
        heartRate: Math.max(60, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 4)),
        bloodPressure: `${Math.max(110, Math.min(150, Number.parseInt(prev.bloodPressure.split("/")[0]) + (Math.random() - 0.5) * 2))}/${Math.max(70, Math.min(100, Number.parseInt(prev.bloodPressure.split("/")[1]) + (Math.random() - 0.5) * 2))}`,
        spo2: Math.max(90, Math.min(100, prev.spo2 + (Math.random() - 0.5) * 1)),
        temperature: Math.max(36.5, Math.min(39, prev.temperature + (Math.random() - 0.5) * 0.2)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [patientId])

  return vitals
}
