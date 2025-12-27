"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()
  const initialRole = searchParams.get("role") as "passenger" | "attendant" | "doctor" | "admin" | null
  const signupSuccess = searchParams.get("signup") === "success"
  const [selectedRole, setSelectedRole] = useState<string>(initialRole || "")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (signupSuccess) {
      setError("Signup successful! Please login with your credentials.")
    }
  }, [signupSuccess])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedRole) {
      setError("Please select a role")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    setLoading(true)

    try {
      await login(email, password, selectedRole as "passenger" | "attendant" | "doctor" | "admin")
      // Route to appropriate dashboard
      const dashboardRoutes: Record<string, string> = {
        passenger: "/dashboard/passenger",
        attendant: "/dashboard/attendant",
        doctor: "/dashboard/doctor",
        admin: "/dashboard/admin",
      }
      router.push(dashboardRoutes[selectedRole] || "/dashboard/passenger")
    } catch (error: any) {
      console.error("Login failed:", error)
      setError(error.message || "Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-primary">HealthOnTrack</span>
            </div>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access your role-specific dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passenger">Passenger</SelectItem>
                    <SelectItem value="attendant">Attendant / Paramedic</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="admin">Railway Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading || !selectedRole}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Link href="/" className="text-sm text-primary hover:underline">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
