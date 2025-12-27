"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Activity, Heart, MessageSquare, FileText, Upload, CheckCircle } from "lucide-react"

export default function EmergencyPage() {
  const [pnr, setPnr] = useState("")
  const [pnrData, setPnrData] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [fileName, setFileName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigation = [
    { label: "Dashboard", href: "/dashboard/passenger", icon: <Activity className="w-5 h-5" /> },
    { label: "AI Assistant", href: "/dashboard/passenger/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Emergency Request", href: "/dashboard/passenger/emergency", icon: <AlertCircle className="w-5 h-5" /> },
    { label: "Vitals", href: "/dashboard/passenger/vitals", icon: <Heart className="w-5 h-5" /> },
    { label: "Prescriptions", href: "/dashboard/passenger/prescriptions", icon: <FileText className="w-5 h-5" /> },
  ]

  // Mock fetch
  const handleFetchPNR = () => {
    setLoading(true)
    setTimeout(() => {
      setPnrData({
        name: "Ravi Sharma",
        train: "12309 Rajdhani Express",
        coach: "B2",
        seat: "34",
        date: "2025-11-01",
        from: "New Delhi",
        to: "Mumbai Central",
      })
      setLoading(false)
    }, 1200)
  }

  const handleSymptomChange = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be less than 5MB!")
        return
      }
      setFileName(file.name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setPnr("")
      setPnrData(null)
      setTitle("")
      setDescription("")
      setSymptoms([])
      setFileName("")
    }, 4000)
  }

  return (
    <DashboardLayout title="Emergency Request" role="passenger" navigation={navigation}>
      <div className="max-w-3xl space-y-6 mx-auto">

        {/* PNR Fetch Section */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Passenger Verification</CardTitle>
            <CardDescription>Enter your PNR to auto-fetch train and seat details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter your 10-digit PNR"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
              />
              <Button onClick={handleFetchPNR} disabled={!pnr || loading}>
                {loading ? "Fetching..." : "Fetch Details"}
              </Button>
            </div>

            {pnrData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-border rounded-lg bg-background/60 shadow-sm"
              >
                <p className="text-sm"><strong>Name:</strong> {pnrData.name}</p>
                <p className="text-sm"><strong>Train:</strong> {pnrData.train}</p>
                <p className="text-sm"><strong>Coach:</strong> {pnrData.coach}</p>
                <p className="text-sm"><strong>Seat:</strong> {pnrData.seat}</p>
                <p className="text-sm"><strong>Date:</strong> {pnrData.date}</p>
                <p className="text-sm"><strong>From:</strong> {pnrData.from}</p>
                <p className="text-sm"><strong>To:</strong> {pnrData.to}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Request Form */}
        {pnrData && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Emergency Request Form</CardTitle>
              <CardDescription>Provide details of your emergency</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Emergency Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Emergency Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Chest Pain, High Fever"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Detailed Description */}
                <div className="space-y-2">
                  <Label htmlFor="desc">Detailed Description</Label>
                  <Textarea
                    id="desc"
                    placeholder="Describe your symptoms in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32"
                    required
                  />
                </div>

                {/* Symptom Checklist */}
                <div className="space-y-2">
                  <Label>Select Symptoms (check all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Abdominal Pain",
                      "Allergic Reaction",
                      "Bleeding",
                      "Chest Pain",
                      "Difficulty Breathing",
                      "Dizziness",
                      "Fever",
                      "Loss of Consciousness",
                      "Nausea",
                    ].map((symptom) => (
                      <label key={symptom} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={symptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomChange(symptom)}
                        />
                        {symptom}
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Attachments (photos, documents)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Upload className="h-5 w-5" />
                      {fileName
                        ? `Selected: ${fileName}`
                        : "Click to upload files or drag and drop (max 5MB)"}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-destructive hover:bg-destructive/90"
                >
                  Submit Emergency Request
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Animated Popup */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 text-center max-w-md"
              >
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                <h2 className="text-2xl font-semibold mb-1 text-green-600">
                  Emergency Request Submitted!
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your request has been successfully sent to{" "}
                  <strong>Attendant Ramesh Kumar (ID: ATD-142)</strong>.
                </p>
                <Button onClick={() => setSubmitted(false)}>Close</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
