"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Activity, Send, Download, Train, Bot, MessageSquare, Stethoscope, AlertCircle, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PassengerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [emergencyActive, setEmergencyActive] = useState(false)
  // Messages are now handled by the dedicated AI Assistant page

  // PNR states
  const [pnr, setPnr] = useState("")
  const [pnrData, setPnrData] = useState<any>(null)
  const [loadingPNR, setLoadingPNR] = useState(false)

  const navigation = [{ label: "Dashboard", href: "/dashboard/passenger", icon: <Activity className="w-5 h-5" /> }]

  const vitals = [
    { label: "Blood Pressure", value: "120/80", status: "normal", emoji: "💓" },
    { label: "Heart Rate", value: "72 bpm", status: "normal", emoji: "❤️" },
    { label: "SpO2", value: "98%", status: "normal", emoji: "💨" },
    { label: "Temperature", value: "37.2°C", status: "normal", emoji: "🌡️" },
  ]

  const prescriptions = [
    { id: 1, medication: "Aspirin", dosage: "500mg", frequency: "Twice daily", date: "2024-10-20" },
    { id: 2, medication: "Vitamin D", dosage: "1000 IU", frequency: "Once daily", date: "2024-10-18" },
  ]

  // Chat functionality moved to dedicated AI Assistant page

  // Mock PNR Fetch
  const handleFetchPNR = () => {
    if (!pnr.trim()) return
    setLoadingPNR(true)
    setTimeout(() => {
      setPnrData({
        trainName: "Express 12A",
        trainNumber: "12951",
        coach: "C3",
        seat: "45",
        date: "2025-11-02",
        from: "New Delhi",
        to: "Mumbai Central",
        status: "Confirmed",
      })
      setLoadingPNR(false)
    }, 1500)
  }

  return (
    <DashboardLayout title="🚑 Passenger Portal" role="passenger" navigation={navigation}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="emergency">🚨 Emergency</TabsTrigger>
          <TabsTrigger value="messages">🤖 AI Assistant</TabsTrigger>
          <TabsTrigger value="vitals">📊 Vitals</TabsTrigger>
          <TabsTrigger value="prescriptions">💊 Prescriptions</TabsTrigger>
        </TabsList>

        {/* ================= OVERVIEW TAB ================= */}
        <TabsContent value="overview" className="space-y-6">
          {/* 🔹 PNR Section */}
          <Card className="border-border bg-gradient-to-br from-green-50 to-transparent hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Train className="w-5 h-5 text-green-600" /> PNR Status
              </CardTitle>
              <CardDescription>Enter your PNR to view train and coach details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your 10-digit PNR number"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  maxLength={10}
                  className="transition-all focus:ring-2"
                />
                <Button onClick={handleFetchPNR} disabled={loadingPNR} className="bg-primary hover:bg-primary/90">
                  {loadingPNR ? "Fetching..." : "Fetch Details"}
                </Button>
              </div>

              {pnrData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                  <Card className="border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Train</p>
                    <p className="font-semibold text-foreground">
                      🚆 {pnrData.trainName} ({pnrData.trainNumber})
                    </p>
                  </Card>
                  <Card className="border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Coach & Seat</p>
                    <p className="font-semibold text-foreground">🪑 {pnrData.coach}, Seat {pnrData.seat}</p>
                  </Card>
                  <Card className="border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold text-foreground">📅 {pnrData.date}</p>
                  </Card>
                  <Card className="border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="font-semibold text-foreground">🚉 {pnrData.from}</p>
                  </Card>
                  <Card className="border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="font-semibold text-foreground">🎯 {pnrData.to}</p>
                  </Card>
                  <Card className="border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className="bg-[var(--success)] animate-pulse">{pnrData.status}</Badge>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 🔹 Emergency + Chat Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border bg-gradient-to-br from-red-50 to-transparent hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">🚨 Emergency Assistance</CardTitle>
                <CardDescription>Request immediate medical help</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className={`w-full transition-all duration-300 ${
                    emergencyActive
                      ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  onClick={() => setEmergencyActive(!emergencyActive)}
                >
                  {emergencyActive ? "❌ Cancel Request" : "🆘 Request Help"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-blue-50 to-transparent hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">💬 Live Chat</CardTitle>
                <CardDescription>Connect with medical staff</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:bg-primary/10 transition-colors"
                  onClick={() => setActiveTab("messages")}
                >
                  💭 Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 🔹 Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-lg font-semibold text-foreground">✅ Stable</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Train Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">🚂 Express 12A</p>
                <p className="text-xs text-muted-foreground">Coach C, Seat 45</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Station</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">🏁 Central Station</p>
                <p className="text-xs text-muted-foreground">45 minutes away</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= EMERGENCY TAB ================= */}
<TabsContent value="emergency" className="space-y-6">
  <Card className="border-red-200 bg-red-50/40 border text-center py-10">
    <CardHeader>
      <CardTitle className="flex justify-center items-center gap-2 text-lg text-red-600">
        🚨 Emergency Medical Request
      </CardTitle>
      <CardDescription className="text-muted-foreground">
        You’ll be redirected to the detailed emergency form.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button
        onClick={() => window.location.href = "/dashboard/passenger/emergency"}
        className="w-full bg-destructive hover:bg-destructive/90 transition-all"
      >
        🆘 Open Emergency Request Form
      </Button>
    </CardContent>
  </Card>
</TabsContent>

        {/* ================= MESSAGES TAB ================= */}
        <TabsContent value="messages" className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Bot className="w-6 h-6" />
                🤖 AI Medical Assistant
              </CardTitle>
              <CardDescription className="text-blue-700">
                Get instant health guidance from our AI-powered medical assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Dr. AI is Ready to Help</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Our AI assistant can help with health questions, symptom assessment, and provide preliminary medical guidance.
                </p>
                <Link href="/dashboard/passenger/messages">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
                    Start Chat with Dr. AI
                    <MessageSquare className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Stethoscope className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Health Assessment</h4>
                  <p className="text-xs text-gray-600">Symptom evaluation and guidance</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Emergency Support</h4>
                  <p className="text-xs text-gray-600">Immediate assistance protocols</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">24/7 Available</h4>
                  <p className="text-xs text-gray-600">Always ready to help</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= VITALS TAB ================= */}
        <TabsContent value="vitals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Current Vital Signs</CardTitle>
              <CardDescription>Real-time health monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vitals.map((vital) => (
                  <div
                    key={vital.label}
                    className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-50 to-transparent"
                  >
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      {vital.emoji} {vital.label}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{vital.value}</p>
                      <Badge className="bg-green-500 animate-pulse">{vital.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= PRESCRIPTIONS TAB ================= */}
        <TabsContent value="prescriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>💊 E-Prescriptions</CardTitle>
              <CardDescription>Your digital prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 mb-2 border border-border rounded-lg flex items-center justify-between hover:shadow-md transition-all bg-gradient-to-r from-green-50 to-transparent"
                >
                  <div>
                    <p className="font-semibold flex items-center gap-2">💊 {rx.medication}</p>
                    <p className="text-sm text-muted-foreground">
                      {rx.dosage} • {rx.frequency}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">📅 {rx.date}</p>
                  </div>
                  <Button size="sm" variant="outline" className="hover:bg-primary/10">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
