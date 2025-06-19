"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import {
  Phone,
  Video,
  Info,
  Menu,
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  MoreVertical,
  Search,
  Pin,
  Star,
  StarOff,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ImageIcon,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface Message {
  id: string
  author: string
  avatar: string
  time: string
  content: string
  type: "message" | "system" | "call" | "voice" | "image"
  isOwn: boolean
  status?: "sent" | "delivered" | "read"
  reactions?: { emoji: string; count: number }[]
  replyTo?: {
    id: string
    author: string
    content: string
  }
  images?: string[]
  voiceData?: string
  duration?: number
}

interface UserInfo {
  id: string
  name: string
  spiritualName?: string
  role: string
  gender: string
  title: string
  avatar: string
  status: "online" | "away" | "offline"
  lastSeen?: string
  bio?: string
  location?: string
  joinedAt: string
}

interface CallParticipant {
  id: string
  name: string
  avatar: string
  isMuted: boolean
  isVideoOn: boolean
}

export default function PersonalChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [activeCall, setActiveCall] = useState<CallParticipant[] | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [userInfo] = useState<UserInfo>({
    id: userId,
    name: "Radha Devi Dasi",
    spiritualName: "Radha Devi Dasi",
    role: "coordinator",
    gender: "female",
    title: "Mataji",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastSeen: "now",
    bio: "Dedicated to Krishna consciousness and temple service. Leading devotional programs and helping new devotees in their spiritual journey.",
    location: "Vrindavan Temple",
    joinedAt: "2024-01-15",
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: "Radha Devi Dasi",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Yesterday at 6:00 PM",
      content: "Hare Krishna! 🙏 How was your morning sadhana today?",
      type: "message",
      isOwn: false,
      status: "read",
    },
    {
      id: "2",
      author: "You",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Yesterday at 6:15 PM",
      content:
        "Hare Krishna Mataji! It was wonderful. I completed 16 rounds and attended Mangala Arati. How about yours?",
      type: "message",
      isOwn: true,
      status: "read",
    },
    {
      id: "3",
      author: "Radha Devi Dasi",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Yesterday at 6:20 PM",
      content:
        "That's beautiful! I'm so happy to hear about your dedication. I also completed my rounds and had a wonderful meditation on the holy names. Krishna is so merciful! 🌸",
      type: "message",
      isOwn: false,
      status: "read",
      reactions: [{ emoji: "🙏", count: 1 }],
    },
    {
      id: "4",
      author: "You",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 8:00 AM",
      content:
        "Mataji, I wanted to ask about the upcoming Janmashtami preparations. How can I help with the arrangements?",
      type: "message",
      isOwn: true,
      status: "delivered",
    },
    {
      id: "5",
      author: "Radha Devi Dasi",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 8:05 AM",
      content:
        "How wonderful that you want to serve! We need help with decorations, prasadam preparation, and organizing the cultural program. Which area interests you most?",
      type: "message",
      isOwn: false,
      status: "read",
    },
    {
      id: "6",
      author: "You",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 8:10 AM",
      content: "I would love to help with the cultural program! I can assist with organizing the bhajan sessions.",
      type: "message",
      isOwn: true,
      status: "sent",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  if (!currentUser) return null

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: "You",
        avatar: currentUser.avatar,
        time: `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        content: currentMessage,
        type: "message",
        isOwn: true,
        status: "sent",
      }
      setMessages([...messages, newMessage])
      setCurrentMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }

      // Simulate message status updates
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      }, 3000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value)
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  const startCall = (type: "voice" | "video") => {
    const participants: CallParticipant[] = [
      {
        id: "1",
        name: userInfo.name,
        avatar: userInfo.avatar,
        isMuted: false,
        isVideoOn: type === "video",
      },
    ]
    setActiveCall(participants)
  }

  const endCall = () => {
    setActiveCall(null)
    setIsMuted(false)
    setIsVideoOn(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return "✓"
      case "delivered":
        return "✓✓"
      case "read":
        return "✓✓"
      default:
        return ""
    }
  }

  const canMessage = () => {
    if (currentUser.role === "gurudev" || currentUser.role === "admin") return true
    if (currentUser.gender === userInfo.gender) return true
    return false // Would need approval for cross-gender messaging
  }

  if (!canMessage()) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navigation currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pin className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Approval Required</h3>
              <p className="text-gray-600 mb-4">
                Cross-gender messaging requires approval from administrators for spiritual guidance purposes.
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                Request Permission
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                    {userInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(userInfo.status)}`}
                ></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{userInfo.spiritualName || userInfo.name}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {userInfo.title}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {userInfo.status === "online" ? "Online" : `Last seen ${userInfo.lastSeen}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-yellow-600" : ""}
            >
              {isFavorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => startCall("voice")}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => startCall("video")}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUserInfo(!showUserInfo)}>
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Active Call Bar */}
        {activeCall && (
          <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Call with {userInfo.name}</span>
              </div>
              <div className="flex -space-x-2">
                {activeCall.map((participant) => (
                  <Avatar key={participant.id} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/20 ${isMuted ? "bg-red-500" : ""}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button variant>{isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/20 ${!isVideoOn ? "bg-red-500" : ""}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-red-500" onClick={endCall}>
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex space-x-3 max-w-xs lg:max-w-md ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      {!message.isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {message.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.isOwn ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.images && (
                            <div className="mt-2 grid gap-2">
                              {message.images.map((image, idx) => (
                                <img
                                  key={idx}
                                  src={image || "/placeholder.svg"}
                                  alt="Shared image"
                                  className="rounded-lg max-w-full h-auto"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          className={`flex items-center space-x-2 mt-1 ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <span className="text-xs text-gray-500">{message.time}</span>
                          {message.isOwn && message.status && (
                            <span
                              className={`text-xs ${message.status === "read" ? "text-blue-500" : "text-gray-400"}`}
                            >
                              {getMessageStatusIcon(message.status)}
                            </span>
                          )}
                        </div>
                        {message.reactions && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {message.reactions.map((reaction, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs hover:bg-blue-50 border-blue-200"
                              >
                                {reaction.emoji} {reaction.count}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {userInfo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="relative border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${userInfo.spiritualName || userInfo.name}`}
                    className="w-full px-4 py-3 pr-24 border-0 resize-none focus:outline-none rounded-lg min-h-[44px] max-h-[120px]"
                    rows={1}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${isRecording ? "bg-red-100 text-red-600" : ""}`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={sendMessage} size="sm" className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Sidebar */}
          {showUserInfo && (
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xl">
                      {userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{userInfo.spiritualName || userInfo.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Badge variant="outline">{userInfo.title}</Badge>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(userInfo.status)}`}></div>
                    <span className="text-sm text-gray-500 capitalize">{userInfo.status}</span>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {userInfo.bio && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">About</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{userInfo.bio}</p>
                    </div>
                  )}

                  {userInfo.location && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{userInfo.location}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Member Since</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(userInfo.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Shared Files</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Bhagavad Gita Chapter 9 Notes</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <ImageIcon className="h-4 w-4 text-green-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Temple Festival Photos</p>
                          <p className="text-xs text-gray-500">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => startCall("voice")}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => startCall("video")}>
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
