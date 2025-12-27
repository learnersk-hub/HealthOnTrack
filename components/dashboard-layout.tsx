
"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Heart, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useRealTimeAlerts } from "@/lib/use-real-time-alerts"
import { NotificationCenter } from "@/components/notification-center"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  role: string
  navigation: Array<{
    label: string
    href: string
    icon: ReactNode
  }>
}

export function DashboardLayout({ children, title, role, navigation }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { alerts, unreadCount, markAsRead, markAllAsRead, clearAlert } = useRealTimeAlerts()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const sidebarVariants = {
    open: { width: 256, transition: { duration: 0.3, ease: "easeOut" } },
    closed: { width: 80, transition: { duration: 0.3, ease: "easeOut" } }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  const navItemVariants = {
    hover: { scale: 1.02, x: 4, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-teal-950/10">
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={sidebarOpen ? "open" : "closed"}
        animate={sidebarOpen ? "open" : "closed"}
        className="bg-sidebar/95 backdrop-blur-sm border-r border-sidebar-border flex flex-col shadow-lg"
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Heart className="w-6 h-6 text-primary" />
                  </motion.div>
                  <span className="font-bold text-sm text-sidebar-foreground">HOME</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="ml-auto bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </motion.div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <motion.div
              key={item.href}
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent/20 hover:text-sidebar-accent transition-all duration-200 text-sidebar-foreground group"
              >
                <span className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 py-3 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between shadow-sm"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-foreground"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground capitalize"
            >
              {role} Portal
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter
              alerts={alerts}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClearAlert={clearAlert}
            />
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </motion.div>
          </div>
        </motion.header>

        {/* Content */}
        <motion.main 
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-auto p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
