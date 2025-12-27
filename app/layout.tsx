
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HealthOnTrack",
  description: "Railway Healthcare Management System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans antialiased min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-teal-950/10 transition-colors duration-300`}>
        <div className="min-h-full flex flex-col">
          <AuthProvider>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </AuthProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
