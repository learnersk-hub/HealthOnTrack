"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Stethoscope, BarChart3, ArrowRight, Shield, Zap, Clock, Ambulance } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function Home() {


  const roles = [
    {
      id: "passenger",
      title: "Passenger",
      description: "Request emergency medical assistance",
      icon: Users,
      href: "/login?role=passenger",
      features: ["Emergency requests", "Live chat", "Vital monitoring"],
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "attendant",
      title: "Attendant / Paramedic",
      description: "Manage patient cases and vitals",
      icon: Ambulance,
      href: "/login?role=attendant",
      features: ["Alert notifications", "Device integration", "Case management"],
      color: "from-teal-500/20 to-teal-600/20",
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Provide remote consultations",
      icon: Stethoscope,
      href: "/login?role=doctor",
      features: ["Consultation queue", "Vital monitoring", "Prescriptions"],
      color: "from-cyan-500/20 to-cyan-600/20",
    },
    {
      id: "admin",
      title: "Railway Admin",
      description: "Monitor system and analytics",
      icon: BarChart3,
      href: "/login?role=admin",
      features: ["Train health map", "Analytics", "Device monitoring"],
      color: "from-indigo-500/20 to-indigo-600/20",
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for sensitive medical data",
      stat: "HIPAA Compliant",
    },
    {
      icon: Zap,
      title: "Real-Time Response",
      description: "Instant alerts and live communication channels",
      stat: "<2s Response",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock medical support on every journey",
      stat: "Always On",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="relative container mx-auto px-4 py-24 md:py-40">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Railway Healthcare Platform</span>
              </div>

              <div className="mb-8">
                <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight tracking-tight cursor-default">
                  <span className="text-balance">Emergency Medical Care</span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    On Every Journey
                  </span>
                </h1>
              </div>

              <div className="mb-10">
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed cursor-default">
                  Comprehensive railway healthcare management system providing real-time medical support, telemedicine
                  consultations, and emergency response coordination for passengers and medical staff.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 px-8 h-12 text-base font-semibold">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Built for healthcare professionals and passengers who demand reliability and speed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                  <Card className="relative border-border hover:border-primary/50 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {benefit.stat}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </section>

        {/* Role Selection Section */}
        <section id="roles" className="container mx-auto px-4 py-20 md:py-28 border-t border-border">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Choose Your Role</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Select your role to access the appropriate dashboard and features tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Link key={role.id} href={role.href}>
                  <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary/50 h-full group overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <CardHeader className="relative">
                      <div className="p-3 w-fit rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{role.title}</CardTitle>
                      <CardDescription className="group-hover:text-muted-foreground transition-colors">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <ul className="space-y-3">
                        {role.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2 group-hover:text-foreground transition-colors"
                          >
                            <span className="text-primary font-bold mt-0.5">→</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Features Overview Section */}
        <section className="container mx-auto px-4 py-20 md:py-28 border-t border-border">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Platform Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comprehensive features designed for every stakeholder in the healthcare ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "For Passengers",
                icon: Users,
                items: [
                  "Emergency medical request forms",
                  "AI medical assistant chat",
                  "Real-time vital monitoring",
                  "Digital prescriptions",
                ],
              },
              {
                title: "For Medical Staff",
                icon: Ambulance,
                items: [
                  "Live alert notifications",
                  "IoT device integration",
                  "Telemedicine capabilities",
                  "Case management system",
                ],
              },
              {
                title: "For Doctors",
                icon: Stethoscope,
                items: [
                  "Pending consultation queue",
                  "Live vital monitoring",
                  "Video/audio consultations",
                  "Digital prescription system",
                ],
              },
              {
                title: "For Administrators",
                icon: BarChart3,
                items: ["Live train health map", "Analytics dashboard", "Device monitoring", "Inventory management"],
              },
            ].map((section, idx) => {
              const SectionIcon = section.icon
              return (
                <Card key={idx} className="border-border hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <SectionIcon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-primary">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3 text-sm">
                          <span className="text-accent font-bold mt-0.5">✓</span>
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 md:py-28 border-t border-border">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-12 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Join the healthcare revolution on railways. Access your role-specific dashboard and start providing or
                receiving medical care today.
              </p>
              <Link href="#roles">
                <Button size="lg" className="gap-2 px-8 h-12 text-base font-semibold">
                  Choose Your Role <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
