"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, MessageSquare, FileText, AlertCircle, Send, Bot, User, Stethoscope, Mic, MicOff } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Message {
  id: number
  sender: string
  role: string
  message: string
  time: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const navigation = [
    { label: "Dashboard", href: "/dashboard/passenger", icon: <Activity className="w-5 h-5" /> },
    { label: "Emergency Request", href: "/dashboard/passenger/emergency", icon: <AlertCircle className="w-5 h-5" /> },
    { label: "AI Assistant", href: "/dashboard/passenger/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Vitals", href: "/dashboard/passenger/vitals", icon: <Heart className="w-5 h-5" /> },
    { label: "Prescriptions", href: "/dashboard/passenger/prescriptions", icon: <FileText className="w-5 h-5" /> },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          setIsListening(true)
          setSpeechError(null) // Clear any previous errors
        }

        recognition.onresult = (event: any) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setNewMessage(prev => prev + finalTranscript)
          }
        }

        recognition.onerror = (event: any) => {
          // Handle different types of errors appropriately
          switch (event.error) {
            case 'no-speech':
              // This is normal - user just didn't speak, don't show error
              console.log('No speech detected, continuing to listen...')
              setSpeechError(null)
              // Don't stop recording, just continue listening
              return
            case 'audio-capture':
              console.error('Microphone not accessible')
              setSpeechError('Microphone not accessible. Please check your microphone.')
              break
            case 'not-allowed':
              console.error('Microphone access denied')
              setSpeechError('Microphone access denied. Please allow microphone access.')
              break
            case 'network':
              console.error('Network error during speech recognition')
              setSpeechError('Network error. Please check your internet connection.')
              break
            case 'aborted':
              // User manually stopped, this is normal
              console.log('Speech recognition stopped by user')
              setSpeechError(null)
              break
            default:
              console.error('Speech recognition error:', event.error)
              setSpeechError('Speech recognition error. Please try again.')
              break
          }
          
          // Only stop recording for serious errors, not for no-speech or aborted
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setIsRecording(false)
            setIsListening(false)
          }
        }

        recognition.onend = () => {
          setIsListening(false)
          if (isRecording) {
            // Restart if still recording (with a small delay to prevent rapid restarts)
            setTimeout(() => {
              if (isRecording && recognitionRef.current) {
                try {
                  recognitionRef.current.start()
                } catch (error) {
                  console.log('Could not restart speech recognition:', error)
                  setIsRecording(false)
                }
              }
            }, 100)
          }
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording])

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setIsListening(false)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.log('Error stopping speech recognition:', error)
        }
      }
    } else {
      // Start recording
      setIsRecording(true)
      setSpeechError(null) // Clear any previous errors
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.error('Error starting speech recognition:', error)
          setIsRecording(false)
          setSpeechError('Could not start speech recognition. Please try again.')
        }
      }
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = {
      id: Date.now(),
      sender: "You",
      role: "Passenger",
      message: newMessage,
      time: currentTime,
    }
    
    setMessages((prev) => [...prev, userMsg])
    const messageToSend = newMessage
    setNewMessage("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: messageToSend,
          conversationHistory: messages.slice(-6) // Send last 6 messages for context
        }),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "Dr. AI",
        role: "Doctor",
        message: data.reply || "I apologize, but I'm having trouble processing your request right now. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error("AI Error:", error)
      const errorMsg = {
        id: Date.now() + 1,
        sender: "System",
        role: "Error",
        message: `⚠️ Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact train medical staff if urgent.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (sender: string) => {
    if (sender === "You") return <User className="w-4 h-4" />
    if (sender === "Dr. AI") return <Bot className="w-4 h-4" />
    return <Stethoscope className="w-4 h-4" />
  }

  const getMessageStyle = (sender: string) => {
    if (sender === "You") {
      return "bg-blue-500 text-white ml-auto"
    } else if (sender === "Dr. AI") {
      return "bg-green-100 text-green-900 border border-green-200"
    } else {
      return "bg-red-100 text-red-900 border border-red-200"
    }
  }

  return (
    <DashboardLayout title="AI Assistant" role="passenger" navigation={navigation}>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Info Banner */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">AI Assistant</h3>
                <p className="text-sm text-blue-700">
                  Get preliminary health guidance and support. For emergencies, contact train staff immediately.
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Available 24/7
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="border border-gray-200 flex flex-col h-[650px] shadow-lg rounded-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <Bot className="w-6 h-6" />
              Dr. AI - Assistant
            </CardTitle>
            <CardDescription className="text-blue-100">
              Describe your symptoms and get personalized health guidance
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-16 h-16 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to Dr. AI</h3>
                <p className="text-gray-500 max-w-md">
                  I'm here to help with your health concerns. Describe any symptoms or ask health-related questions to get started.
                </p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${getMessageStyle(msg.sender)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageIcon(msg.sender)}
                    <p className="text-sm font-semibold">{msg.sender}</p>
                    <span className="text-xs opacity-70 ml-auto">{msg.time}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow-sm border">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Dr. AI is analyzing...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
            {/* Recording indicator */}
            {isRecording && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {isListening ? "Listening... Speak now" : "Starting microphone..."}
                  </span>
                  <div className="ml-auto">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-red-400 rounded animate-pulse"></div>
                      <div className="w-1 h-6 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-5 bg-red-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-7 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Speech error indicator */}
            {speechError && !isRecording && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{speechError}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSpeechError(null)}
                    className="ml-auto h-6 px-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Input
                placeholder={isRecording ? "Speaking... (or type here)" : "Describe your symptoms or ask a health question..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                disabled={isTyping}
              />
              
              {/* Microphone Button */}
              {speechSupported && (
                <Button
                  onClick={toggleRecording}
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  className={`rounded-full shadow-md transition-all duration-200 ${
                    isRecording 
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  disabled={isTyping}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}

              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md"
                disabled={isTyping || !newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                This is preliminary guidance only. Contact train medical staff for emergencies.
              </p>
              {speechSupported && (
                <p className="text-xs text-gray-400">
                  {isRecording ? "🎤 Recording..." : "Click 🎤 to speak"}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}