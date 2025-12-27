import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Stethoscope, BarChart3, Shield, Zap, Clock } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: "Emergency Medical Care",
      description: "Immediate response system for medical emergencies during railway journeys"
    },
    {
      icon: Users,
      title: "Multi-Role Platform",
      description: "Designed for passengers, medical staff, doctors, and railway administrators"
    },
    {
      icon: Stethoscope,
      title: "Telemedicine Integration",
      description: "Remote consultations and real-time medical monitoring capabilities"
    },
    {
      icon: BarChart3,
      title: "Analytics & Monitoring",
      description: "Comprehensive health analytics and system monitoring for administrators"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensuring patient data privacy and compliance"
    },
    {
      icon: Zap,
      title: "Real-Time Response",
      description: "Instant alerts and communication channels for emergency situations"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">HealthOnTrack</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionizing railway healthcare with comprehensive medical support, emergency response coordination, 
            and telemedicine capabilities for safer journeys.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                To provide comprehensive, accessible, and reliable healthcare services during railway travel. 
                We bridge the gap between passengers and medical professionals, ensuring that quality healthcare 
                is never more than a click away, regardless of location or time of day.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-border hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="p-3 w-fit rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <Card className="border-border bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-muted-foreground">Medical Support</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">&lt;2s</div>
                  <div className="text-muted-foreground">Response Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-muted-foreground">HIPAA Compliant</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Our Commitment</h2>
          <Card className="border-border">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We are committed to transforming railway healthcare through innovative technology, 
                  ensuring every passenger has access to quality medical care during their journey. 
                  Our platform connects passengers with qualified medical professionals, providing 
                  peace of mind and safety for millions of railway travelers.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold">HealthOnTrack Team</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}