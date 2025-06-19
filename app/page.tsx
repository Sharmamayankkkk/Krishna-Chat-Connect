"use client"

import { CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Phone,
  Video,
  Info,
  Menu,
  Send,
  Paperclip,
  Smile,
  Users,
  Pin,
  PhoneMissed,
  ImageIcon,
  UserPlus,
  UserMinus,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Crown,
  Shield,
  Hash,
  Bell,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { NotificationSystem } from "@/components/notification-system"

interface Message {
  id: string
  author: string
  avatar: string
  time: string
  content: string
  type: "message" | "system" | "call" | "voice"
  reactions?: { emoji: string; count: number; users: string[] }[]
  isPinned?: boolean
  images?: string[]
  callType?: "voice" | "video"
  callStatus?: "missed" | "answered" | "ongoing"
  callDuration?: string
  voiceData?: string
  duration?: number
}

interface Channel {
  id: string
  name: string
  unreadCount?: number
  isActive?: boolean
  hasCall?: boolean
  pinnedCount?: number
}

interface DirectMessage {
  id: string
  name: string
  status: "online" | "away" | "offline"
  unreadCount?: number
  missedCalls?: number
}

interface CallParticipant {
  id: string
  name: string
  avatar: string
  isMuted: boolean
  isVideoOn: boolean
}

export default function KrishnaConnect() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showPinnedMessages, setShowPinnedMessages] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeCall, setActiveCall] = useState<CallParticipant[] | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const [groupManagement, setGroupManagement] = useState({
    showGroupDetails: false,
    showParticipants: false,
    showExitReport: false,
    showBlockUser: false,
    showPromoteUser: false,
    showInviteMembers: false,
    showManagePermissions: false,
  })

  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [blockReason, setBlockReason] = useState("")
  const [blockDetails, setBlockDetails] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [newPermissions, setNewPermissions] = useState<string[]>([])
  const [exitReason, setExitReason] = useState("")
  const [exitFeedback, setExitFeedback] = useState("")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: "System",
      avatar: "",
      time: "Yesterday at 11:30 PM",
      content: "Radha Devi Dasi joined the temple community. Welcome! 🙏",
      type: "system",
    },
    {
      id: "2",
      author: "Radha Devi Dasi",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 6:00 AM",
      content:
        "Hare Krishna devotees! 🙏 May this beautiful morning bring Krishna's blessings to all. Don't forget our morning Mangala Arati at 4:30 AM tomorrow.",
      type: "message",
      reactions: [
        { emoji: "🙏", count: 8, users: ["Govinda Das", "Krishna Das", "Gopi Devi Dasi"] },
        { emoji: "🌅", count: 5, users: ["Vrindavan Das", "Bhakti Devi"] },
      ],
      isPinned: true,
    },
    {
      id: "3",
      author: "Govinda Das",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 6:15 AM",
      content:
        "Thank you Mataji! I've uploaded the new bhajan recordings to our shared folder. Please listen and share your feedback for our upcoming Janmashtami celebration.",
      type: "message",
      reactions: [
        { emoji: "🎵", count: 6, users: ["Radha Devi Dasi", "Krishna Das"] },
        { emoji: "❤️", count: 4, users: ["Gopi Devi Dasi", "Vrindavan Das"] },
      ],
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: "4",
      author: "System",
      avatar: "",
      time: "Today at 6:25 AM",
      content: "Govinda Das started a voice call",
      type: "call",
      callType: "voice",
      callStatus: "missed",
      callDuration: "2:34",
    },
    {
      id: "5",
      author: "Vrindavan Das",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 6:30 AM",
      content:
        "Beautiful bhajans Prabhu! The melodies are so devotional. I'll help with the sound setup for the festival. Krishna will be pleased with our service.",
      type: "message",
    },
    {
      id: "6",
      author: "Gopi Devi Dasi",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 6:45 AM",
      content:
        "Reminder: Bhagavad Gita study group meets today at 7 PM. We'll be discussing Chapter 9 - The Most Confidential Knowledge. All devotees welcome! 📖",
      type: "message",
      reactions: [
        { emoji: "📚", count: 12, users: ["Everyone"] },
        { emoji: "🕉️", count: 7, users: ["Devotees"] },
      ],
      isPinned: true,
    },
    {
      id: "7",
      author: "Krishna Das",
      avatar: "/placeholder.svg?height=36&width=36",
      time: "Today at 7:00 AM",
      content:
        "Haribol! The temple kitchen needs volunteers for tomorrow's feast preparation. Cooking for Krishna is such a blissful service. Who can join? 🍽️",
      type: "message",
      reactions: [
        { emoji: "🙋‍♂️", count: 9, users: ["Volunteers"] },
        { emoji: "🍛", count: 6, users: ["Food lovers"] },
      ],
      images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
  ])

  const [channels] = useState<Channel[]>([
    { id: "general", name: "general", isActive: true, pinnedCount: 2 },
    { id: "bhajans", name: "bhajans-kirtan", unreadCount: 3, hasCall: true },
    { id: "scripture", name: "scripture-study", unreadCount: 5 },
    { id: "festivals", name: "festivals-events", unreadCount: 2 },
    { id: "prasadam", name: "prasadam-recipes" },
    { id: "service", name: "seva-opportunities", unreadCount: 1 },
    { id: "youth", name: "youth-devotees" },
  ])

  const [directMessages] = useState<DirectMessage[]>([
    { id: "1", name: "Radhanath Swami", status: "online" },
    { id: "2", name: "Bhakti Charu Swami", status: "away", unreadCount: 1, missedCalls: 2 },
    { id: "3", name: "Indradyumna Swami", status: "offline" },
    { id: "4", name: "Sacinandana Swami", status: "online" },
  ])

  const [groupDetails] = useState({
    id: "general",
    name: "General Discussion",
    description:
      "Main community discussion channel for all devotees to share experiences, ask questions, and connect with the Krishna consciousness community.",
    purpose: "Foster spiritual growth and community bonding through open dialogue",
    createdAt: "2024-01-01",
    createdBy: "Govinda Das",
    memberCount: 108,
    adminCount: 3,
    guidelines: [
      "Maintain devotional atmosphere in all discussions",
      "Respect all community members regardless of spiritual level",
      "Use appropriate titles (Prabhuji/Mataji) when addressing others",
      "Share Krishna conscious content and experiences",
      "Follow temple etiquette and spiritual principles",
    ],
    admins: [
      { id: "1", name: "Govinda Das", role: "admin", avatar: "/placeholder.svg?height=32&width=32", isOwner: true },
      {
        id: "2",
        name: "Radha Devi Dasi",
        role: "coordinator",
        avatar: "/placeholder.svg?height=32&width=32",
        isSubAdmin: true,
      },
    ],
    blockedUsers: [
      { id: "blocked1", name: "Former Member", reason: "Inappropriate behavior", blockedAt: "2024-01-20" },
    ],
  })

  const [participants] = useState([
    {
      id: "1",
      name: "Govinda Das",
      spiritualName: "Govinda Das",
      role: "admin",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      joinedAt: "2024-01-01",
      isOwner: true,
    },
    {
      id: "2",
      name: "Radha Devi Dasi",
      spiritualName: "Radha Devi Dasi",
      role: "coordinator",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      joinedAt: "2024-01-02",
      isSubAdmin: true,
    },
    {
      id: "3",
      name: "Krishna Das",
      spiritualName: "Krishna Das",
      role: "user",
      status: "away",
      avatar: "/placeholder.svg?height=32&width=32",
      joinedAt: "2024-01-15",
    },
    {
      id: "4",
      name: "Gopi Devi Dasi",
      spiritualName: "Gopi Devi Dasi",
      role: "user",
      status: "offline",
      avatar: "/placeholder.svg?height=32&width=32",
      joinedAt: "2024-01-18",
    },
    {
      id: "5",
      name: "Vrindavan Das",
      spiritualName: "Vrindavan Das",
      role: "coordinator",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      joinedAt: "2024-01-12",
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
  }, [])

  if (!currentUser) return null

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: currentUser.spiritualName || currentUser.name,
        avatar: currentUser.avatar,
        time: `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        content: currentMessage,
        type: "message",
      }
      setMessages([...messages, newMessage])
      setCurrentMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
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

  const togglePin = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg)))
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "You"] } : r,
              ),
            }
          } else {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1, users: ["You"] }],
            }
          }
        }
        return msg
      }),
    )
  }

  const startCall = (type: "voice" | "video") => {
    const participants: CallParticipant[] = [
      {
        id: "1",
        name: "Madan Mohan Das",
        avatar: "/placeholder.svg?height=36&width=36",
        isMuted: false,
        isVideoOn: type === "video",
      },
      {
        id: "2",
        name: "Radha Devi Dasi",
        avatar: "/placeholder.svg?height=36&width=36",
        isMuted: false,
        isVideoOn: type === "video",
      },
      { id: "3", name: "Govinda Das", avatar: "/placeholder.svg?height=36&width=36", isMuted: true, isVideoOn: false },
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

  const pinnedMessages = messages.filter((msg) => msg.isPinned)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      recorder.start()

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle voice message data
          const voiceMessage: Message = {
            id: Date.now().toString(),
            author: currentUser.spiritualName || currentUser.name,
            avatar: currentUser.avatar,
            time: `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            content: `🎤 Voice message (${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")})`,
            type: "voice",
            voiceData: URL.createObjectURL(event.data),
            duration: recordingTime,
          }
          setMessages((prev) => [...prev, voiceMessage])
        }
      }

      recorder.onstop = () => {
        clearInterval(timer)
        setIsRecording(false)
        setRecordingTime(0)
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
    }
  }

  const canManageGroup = () => {
    return (
      currentUser?.role === "gurudev" ||
      currentUser?.role === "admin" ||
      groupDetails.admins.some((admin) => admin.id === currentUser?.id)
    )
  }

  const handleGroupAction = (action: string, data?: any) => {
    setGroupManagement((prev) => ({
      ...prev,
      [action]: true,
    }))
    if (data) setSelectedUser(data)
  }

  const closeAllDialogs = () => {
    setGroupManagement({
      showGroupDetails: false,
      showParticipants: false,
      showExitReport: false,
      showBlockUser: false,
      showPromoteUser: false,
      showInviteMembers: false,
      showManagePermissions: false,
    })
    setSelectedUser(null)
    setBlockReason("")
    setBlockDetails("")
    setInviteEmail("")
    setInviteMessage("")
    setNewPermissions([])
    setExitReason("")
    setExitFeedback("")
  }

  const handleBlockUser = async () => {
    if (!selectedUser || !blockReason) return

    try {
      // Simulate API call
      console.log("Blocking user:", {
        userId: selectedUser.id,
        reason: blockReason,
        details: blockDetails,
        blockedBy: currentUser.id,
        timestamp: new Date().toISOString(),
      })

      // Update local state
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          author: "System",
          avatar: "",
          time: `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          content: `${selectedUser.name} has been blocked from the group`,
          type: "system",
        },
      ])

      closeAllDialogs()
    } catch (error) {
      console.error("Error blocking user:", error)
    }
  }

  const handlePromoteUser = async (permissions: string[]) => {
    if (!selectedUser) return

    try {
      console.log("Promoting user:", {
        userId: selectedUser.id,
        newRole: "coordinator",
        permissions: permissions,
        promotedBy: currentUser.id,
        timestamp: new Date().toISOString(),
      })

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          author: "System",
          avatar: "",
          time: `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          content: `${selectedUser.name} has been promoted to Sub-Administrator`,
          type: "system",
        },
      ])

      closeAllDialogs()
    } catch (error) {
      console.error("Error promoting user:", error)
    }
  }

  const handleInviteMembers = async () => {
    if (!inviteEmail) return

    try {
      console.log("Inviting member:", {
        email: inviteEmail,
        message: inviteMessage,
        invitedBy: currentUser.id,
        groupId: groupDetails.id,
        timestamp: new Date().toISOString(),
      })

      closeAllDialogs()
    } catch (error) {
      console.error("Error inviting member:", error)
    }
  }

  const handleLeaveGroupWithReport = async () => {
    try {
      console.log("Leaving group with report:", {
        userId: currentUser.id,
        groupId: groupDetails.id,
        reason: exitReason,
        feedback: exitFeedback,
        timestamp: new Date().toISOString(),
      })

      // Navigate away or show confirmation
      router.push("/")
    } catch (error) {
      console.error("Error leaving group:", error)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "coordinator":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Navigation currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">#</span>
                <h2 className="text-lg font-semibold text-gray-900">general</h2>
              </div>
              <Badge variant="secondary" className="mt-1 w-fit flex items-center space-x-1 bg-white text-gray-800 border border-gray-300">
                <Users className="w-3 h-3" />
                <span>108 members</span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationSystem currentUser={currentUser} />
            <Dialog open={showPinnedMessages} onOpenChange={setShowPinnedMessages}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Pin className="h-4 w-4" />
                  <span className="ml-1 text-xs">{pinnedMessages.length}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Pinned Messages</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="space-y-4">
                    {pinnedMessages.map((message) => (
                      <div key={message.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{message.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">{message.author}</span>
                            <span className="text-xs text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => startCall("voice")}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => startCall("video")}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleGroupAction("showGroupDetails")}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Active Call Bar */}
        {activeCall && (
          <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Group Call</span>
              </div>
              <div className="flex -space-x-2">
                {activeCall.map((participant) => (
                  <Avatar key={participant.id} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm">{activeCall.length} participants</span>
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

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div key={message.id} className="group">
                {message.type === "system" ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full flex items-center space-x-2">
                      {message.content.includes("joined") ? (
                        <UserPlus className="h-3 w-3" />
                      ) : message.content.includes("left") ? (
                        <UserMinus className="h-3 w-3" />
                      ) : null}
                      <span>{message.content}</span>
                    </div>
                  </div>
                ) : message.type === "call" ? (
                  <div className="flex items-center space-x-3 py-2">
                    <div
                      className={`p-2 rounded-full ${message.callStatus === "missed" ? "bg-red-100" : "bg-green-100"}`}
                    >
                      {message.callStatus === "missed" ? (
                        <PhoneMissed className="h-4 w-4 text-red-600" />
                      ) : (
                        <Phone className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {message.callStatus === "missed" ? "Missed call" : "Call ended"} • {message.callDuration}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-3 hover:bg-gray-50 -mx-4 px-4 py-1 rounded">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {message.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">{message.author}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                        {message.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-2">{message.content}</p>

                      {message.images && (
                        <div className="grid grid-cols-2 gap-2 mb-2 max-w-md">
                          {message.images.map((image, idx) => (
                            <img
                              key={idx}
                              src={image || "/placeholder.svg"}
                              alt="Shared image"
                              className="rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
                            />
                          ))}
                        </div>
                      )}

                      {message.reactions && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {message.reactions.map((reaction, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-blue-50 border-blue-200"
                              onClick={() => addReaction(message.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => addReaction(message.id, "👍")}
                          >
                            <Smile className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-start space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => togglePin(message.id)}>
                        <Pin className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm italic px-3">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span>A devotee is typing...</span>
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
                placeholder="Message #general"
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
                  onClick={isRecording ? stopRecording : startRecording}
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

        {isRecording && (
          <div className="flex items-center justify-center mt-2 text-red-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Group Details Dialog */}
        <Dialog open={groupManagement.showGroupDetails} onOpenChange={() => closeAllDialogs()}>
          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Hash className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{groupDetails.name}</h2>
                  <p className="text-sm text-gray-500 font-normal">
                    {groupDetails.memberCount} members • Created {new Date(groupDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="participants">Participants ({groupDetails.memberCount})</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab with enhanced statistics */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Info className="h-5 w-5" />
                        <span>Group Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">{groupDetails.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
                        <p className="text-gray-600 leading-relaxed">{groupDetails.purpose}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">Created</h4>
                          <p className="text-gray-900 font-medium">
                            {new Date(groupDetails.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">Created by</h4>
                          <p className="text-gray-900 font-medium">{groupDetails.createdBy}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Live Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600">{groupDetails.memberCount}</div>
                          <div className="text-sm text-blue-700 font-medium">Total Members</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                          <div className="text-3xl font-bold text-green-600">
                            {participants.filter((p) => p.status === "online").length}
                          </div>
                          <div className="text-sm text-green-700 font-medium">Online Now</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <div className="text-3xl font-bold text-purple-600">{groupDetails.adminCount}</div>
                          <div className="text-sm text-purple-700 font-medium">Administrators</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                          <div className="text-3xl font-bold text-yellow-600">{pinnedMessages.length}</div>
                          <div className="text-sm text-yellow-700 font-medium">Pinned Messages</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Group Guidelines & Rules</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {groupDetails.guidelines.map((guideline, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-blue-900 leading-relaxed">{guideline}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Participants Tab */}
              <TabsContent value="participants" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Group Participants</h3>
                    <p className="text-sm text-gray-500">Manage members, roles, and permissions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      {participants.length} total members
                    </Badge>
                    {canManageGroup() && (
                      <Button onClick={() => handleGroupAction("showInviteMembers")} size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  {participants.map((participant) => (
                    <Card key={participant.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(participant.status)}`}
                              ></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold text-gray-900">
                                  {participant.spiritualName || participant.name}
                                </p>
                                {participant.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                                {participant.isSubAdmin && <Shield className="h-4 w-4 text-blue-500" />}
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge className={getRoleBadgeColor(participant.role)} size="sm">
                                  {participant.isOwner
                                    ? "Owner"
                                    : participant.isSubAdmin
                                      ? "Sub-Admin"
                                      : participant.role}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Joined {new Date(participant.joinedAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`}></div>
                                  <span className="text-xs text-gray-500 capitalize">{participant.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {canManageGroup() && !participant.isOwner && (
                            <div className="flex items-center space-x-2">
                              {!participant.isSubAdmin && participant.role !== "admin" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleGroupAction("showPromoteUser", participant)}
                                >
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Promote
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGroupAction("showBlockUser", participant)}
                              >
                                <UserMinus className="h-4 w-4 mr-1" />
                                Block
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Enhanced Management Tab */}
              <TabsContent value="management" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Crown className="h-5 w-5" />
                        <span>Administrators</span>
                      </CardTitle>
                      <CardDescription>Manage group administrators and their permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {groupDetails.admins.map((admin) => (
                          <div
                            key={admin.id}
                            className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                  {admin.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium">{admin.name}</p>
                                  {admin.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <Badge className={getRoleBadgeColor(admin.role)} size="sm">
                                  {admin.isOwner ? "Owner" : admin.isSubAdmin ? "Sub-Admin" : admin.role}
                                </Badge>
                              </div>
                            </div>
                            {canManageGroup() && !admin.isOwner && (
                              <Button variant="outline" size="sm">
                                <UserMinus className="h-4 w-4 mr-1" />
                                Remove Admin
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <UserMinus className="h-5 w-5 text-red-500" />
                        <span>Blocked Users</span>
                      </CardTitle>
                      <CardDescription>Users who have been blocked from this group</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {groupDetails.blockedUsers.length > 0 ? (
                        <div className="space-y-3">
                          {groupDetails.blockedUsers.map((blockedUser) => (
                            <div key={blockedUser.id} className="p-3 border rounded-lg bg-red-50 border-red-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-red-900">{blockedUser.name}</p>
                                  <p className="text-sm text-red-700">Reason: {blockedUser.reason}</p>
                                  <p className="text-xs text-red-600">
                                    Blocked: {new Date(blockedUser.blockedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                {canManageGroup() && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-700 hover:bg-red-100"
                                  >
                                    Unblock
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <UserMinus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No blocked users</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* New Permissions Tab */}
              <TabsContent value="permissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Permission Management</CardTitle>
                    <CardDescription>Configure roles and permissions for group members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Role Permissions</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium text-purple-700 mb-2">Owner</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Full group control</li>
                              <li>• Manage all members</li>
                              <li>• Delete group</li>
                              <li>• Assign administrators</li>
                            </ul>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium text-blue-700 mb-2">Sub-Admin</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Manage members</li>
                              <li>• Pin/unpin messages</li>
                              <li>• Block users</li>
                              <li>• Moderate content</li>
                            </ul>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium text-green-700 mb-2">Member</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Send messages</li>
                              <li>• React to messages</li>
                              <li>• Join calls</li>
                              <li>• View group info</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Group Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Notification Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Pin className="h-4 w-4 mr-2" />
                        Manage Pinned Messages
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleGroupAction("showInviteMembers")}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Hash className="h-4 w-4 mr-2" />
                        Group Link Settings
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => handleGroupAction("showExitReport")}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Leave Group
                      </Button>
                      {canManageGroup() && (
                        <Button variant="destructive" className="w-full justify-start">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Delete Group
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Enhanced Exit Report Dialog */}
        <Dialog open={groupManagement.showExitReport} onOpenChange={() => closeAllDialogs()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserMinus className="h-5 w-5 text-red-500" />
                <span>Leave Group</span>
              </DialogTitle>
              <DialogDescription>
                We're sorry to see you go. Please help us improve by sharing your feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exitReason">Reason for leaving (optional)</Label>
                <Select value={exitReason} onValueChange={setExitReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="too-active">Too much activity</SelectItem>
                    <SelectItem value="not-relevant">Content not relevant</SelectItem>
                    <SelectItem value="time-constraints">Time constraints</SelectItem>
                    <SelectItem value="technical-issues">Technical issues</SelectItem>
                    <SelectItem value="personal-reasons">Personal reasons</SelectItem>
                    <SelectItem value="found-alternative">Found alternative group</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exitFeedback">Additional feedback (optional)</Label>
                <Textarea
                  id="exitFeedback"
                  placeholder="Share any suggestions, concerns, or improvements..."
                  value={exitFeedback}
                  onChange={(e) => setExitFeedback(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Leaving this group will remove your access to all messages and shared content.
                  You can rejoin if invited again.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => closeAllDialogs()}>
                  Cancel
                </Button>
                <Button onClick={handleLeaveGroupWithReport} className="bg-red-600 hover:bg-red-700">
                  Leave Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Block User Dialog */}
        <Dialog open={groupManagement.showBlockUser} onOpenChange={() => closeAllDialogs()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserMinus className="h-5 w-5 text-red-500" />
                <span>Block User</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to block {selectedUser?.name}? They will be removed from the group and cannot
                rejoin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blockReason">Reason for blocking *</Label>
                <Select value={blockReason} onValueChange={setBlockReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate-behavior">Inappropriate behavior</SelectItem>
                    <SelectItem value="spam">Spam or unwanted content</SelectItem>
                    <SelectItem value="harassment">Harassment or bullying</SelectItem>
                    <SelectItem value="violation">Community guidelines violation</SelectItem>
                    <SelectItem value="offensive-content">Offensive content</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blockDetails">Additional details (optional)</Label>
                <Textarea
                  id="blockDetails"
                  placeholder="Provide specific details about the incident..."
                  value={blockDetails}
                  onChange={(e) => setBlockDetails(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone easily. The user will be immediately removed
                  and blocked from rejoining the group.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => closeAllDialogs()}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleBlockUser} disabled={!blockReason}>
                  Block User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Promote User Dialog */}
        <Dialog open={groupManagement.showPromoteUser} onOpenChange={() => closeAllDialogs()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <span>Promote to Sub-Administrator</span>
              </DialogTitle>
              <DialogDescription>
                Promote {selectedUser?.name} to Sub-Administrator with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Select permissions for the new Sub-Administrator:</Label>
                <div className="space-y-2">
                  {[
                    {
                      id: "manage-members",
                      label: "Manage Members",
                      description: "Add, remove, and manage group members",
                    },
                    {
                      id: "moderate-content",
                      label: "Moderate Content",
                      description: "Pin messages, delete inappropriate content",
                    },
                    { id: "manage-calls", label: "Manage Calls", description: "Start, end, and manage group calls" },
                    {
                      id: "view-analytics",
                      label: "View Analytics",
                      description: "Access group statistics and reports",
                    },
                  ].map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={permission.id}
                        checked={newPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewPermissions([...newPermissions, permission.id])
                          } else {
                            setNewPermissions(newPermissions.filter((p) => p !== permission.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                          {permission.label}
                        </Label>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Sub-Administrators can help manage the group but cannot remove the owner or
                  other administrators.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => closeAllDialogs()}>
                  Cancel
                </Button>
                <Button onClick={() => handlePromoteUser(newPermissions)} disabled={newPermissions.length === 0}>
                  Promote User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Members Dialog */}
        <Dialog open={groupManagement.showInviteMembers} onOpenChange={() => closeAllDialogs()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-green-500" />
                <span>Invite Members</span>
              </DialogTitle>
              <DialogDescription>Invite new members to join the {groupDetails.name} group.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email address *</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="devotee@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteMessage">Personal message (optional)</Label>
                <Textarea
                  id="inviteMessage"
                  placeholder="Join our Krishna consciousness community..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  The invited member will receive an email with a link to join the group. They'll need to create an
                  account if they don't have one.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => closeAllDialogs()}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMembers} disabled={!inviteEmail}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
