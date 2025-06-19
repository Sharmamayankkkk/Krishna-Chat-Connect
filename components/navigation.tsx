"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { NotificationSystem } from "@/components/notification-system"
import {
  Home,
  Bookmark,
  Plus,
  Calendar,
  Shield,
  Users,
  Hash,
  Settings,
  Phone,
  PhoneMissed,
  Pin,
  Bell,
  ChevronDown,
  ChevronRight,
  Dot,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface NavigationProps {
  currentUser: any
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Navigation({ currentUser, sidebarOpen, setSidebarOpen }: NavigationProps) {
  const pathname = usePathname()
  const [channelsCollapsed, setChannelsCollapsed] = useState(false)
  const [dmsCollapsed, setDmsCollapsed] = useState(false)

  const channels = [
    {
      id: "general",
      name: "general",
      isActive: pathname === "/",
      pinnedCount: 2,
      description: "Main community discussion",
      memberCount: 108,
    },
    {
      id: "bhajans",
      name: "bhajans-kirtan",
      unreadCount: 3,
      hasCall: true,
      description: "Devotional music and chanting",
      memberCount: 45,
    },
    {
      id: "scripture",
      name: "scripture-study",
      unreadCount: 5,
      description: "Bhagavad Gita and Srimad Bhagavatam study",
      memberCount: 67,
    },
    {
      id: "festivals",
      name: "festivals-events",
      unreadCount: 2,
      description: "Temple festivals and celebrations",
      memberCount: 89,
    },
    {
      id: "prasadam",
      name: "prasadam-recipes",
      description: "Sacred food preparation and recipes",
      memberCount: 34,
    },
    {
      id: "service",
      name: "seva-opportunities",
      unreadCount: 1,
      description: "Temple service and volunteer work",
      memberCount: 56,
    },
    {
      id: "youth",
      name: "youth-devotees",
      description: "Young devotees community",
      memberCount: 23,
    },
  ]

  const directMessages = [
    {
      id: "1",
      name: "Radhanath Swami",
      spiritualName: "His Holiness Radhanath Swami",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "gurudev",
      lastMessage: "Hare Krishna! How is your sadhana progressing?",
      lastMessageTime: "2m ago",
      isTyping: false,
    },
    {
      id: "2",
      name: "Bhakti Charu Swami",
      spiritualName: "His Holiness Bhakti Charu Swami",
      status: "away",
      unreadCount: 1,
      missedCalls: 2,
      avatar: "/placeholder.svg?height=32&width=32",
      role: "gurudev",
      lastMessage: "The morning program was beautiful today",
      lastMessageTime: "1h ago",
      isTyping: false,
    },
    {
      id: "3",
      name: "Indradyumna Swami",
      spiritualName: "His Holiness Indradyumna Swami",
      status: "offline",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "gurudev",
      lastMessage: "Thank you for the festival photos",
      lastMessageTime: "1d ago",
      isTyping: false,
    },
    {
      id: "4",
      name: "Sacinandana Swami",
      spiritualName: "His Holiness Sacinandana Swami",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "gurudev",
      lastMessage: "Let's discuss the upcoming retreat",
      lastMessageTime: "5m ago",
      isTyping: true,
    },
    {
      id: "5",
      name: "Radha Devi Dasi",
      spiritualName: "Radha Devi Dasi",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "coordinator",
      lastMessage: "The deity decorations look wonderful!",
      lastMessageTime: "10m ago",
      isTyping: false,
    },
    {
      id: "6",
      name: "Govinda Das",
      spiritualName: "Govinda Das",
      status: "away",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "admin",
      lastMessage: "Can you help with the sound system?",
      lastMessageTime: "30m ago",
      isTyping: false,
    },
  ]

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "gurudev":
        return "🕉️"
      case "admin":
        return "👑"
      case "coordinator":
        return "🎯"
      default:
        return ""
    }
  }

  const isActive = (path: string) => pathname === path

  const totalUnreadDMs = directMessages.reduce((sum, dm) => sum + (dm.unreadCount || 0), 0)
  const totalUnreadChannels = channels.reduce((sum, channel) => sum + (channel.unreadCount || 0), 0)
  const onlineDMs = directMessages.filter((dm) => dm.status === "online").length

  return (
    <div
      className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-700 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}
    >
      <div className="flex flex-col h-full">
        {/* Enhanced Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-800 to-blue-800">
          <div className="flex items-center justify-between mb-3">
            <Logo size="md" showText={true} className="text-white" />
            <NotificationSystem currentUser={currentUser} />
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white/20">
              <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                {(currentUser?.spiritualName || currentUser?.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium truncate text-white">
                  {currentUser?.spiritualName || currentUser?.name}
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs border-white/30 text-blue-100 bg-white/10">
                  {currentUser?.title || currentUser?.role || "Devotee"}
                </Badge>
                <span className="text-xs text-blue-200">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-1">
              <div className="px-2 mb-3">
                <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Navigation</h3>
              </div>

              <Link href="/">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                    isActive("/") ? "bg-white/20 border-l-2 border-white" : ""
                  }`}
                >
                  <Home className="mr-3 h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>

              <Link href="/activity">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                    isActive("/activity") ? "bg-white/20 border-l-2 border-white" : ""
                  }`}
                >
                  <Bell className="mr-3 h-4 w-4" />
                  <span>Activity</span>
                </Button>
              </Link>

              <Link href="/saved">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                    isActive("/saved") ? "bg-white/20 border-l-2 border-white" : ""
                  }`}
                >
                  <Bookmark className="mr-3 h-4 w-4" />
                  <span>Saved Items</span>
                </Button>
              </Link>

              <Link href="/events">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                    isActive("/events") ? "bg-white/20 border-l-2 border-white" : ""
                  }`}
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  <span>Events</span>
                </Button>
              </Link>

              <Link href="/directory">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                    isActive("/directory") ? "bg-white/20 border-l-2 border-white" : ""
                  }`}
                >
                  <Users className="mr-3 h-4 w-4" />
                  <span>Directory</span>
                </Button>
              </Link>

              {["gurudev", "admin", "coordinator"].includes(currentUser?.role) && (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                      isActive("/admin") ? "bg-white/20 border-l-2 border-white" : ""
                    }`}
                  >
                    <Shield className="mr-3 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Button>
                </Link>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Enhanced Channels Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-3 group">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setChannelsCollapsed(!channelsCollapsed)}
                  >
                    {channelsCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                  <Hash className="h-4 w-4 text-blue-300" />
                  <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Channels</h3>
                  {totalUnreadChannels > 0 && (
                    <Badge variant="destructive" className="h-4 px-1.5 text-xs animate-pulse">
                      {totalUnreadChannels}
                    </Badge>
                  )}
                </div>
                <Link href="/channels/create">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-blue-200 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {!channelsCollapsed && (
                <div className="space-y-1 ml-2">
                  {channels.map((channel) => (
                    <Link key={channel.id} href={`/channels/${channel.id}`}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 group relative ${
                          channel.isActive ? "bg-white/20 border-l-2 border-white shadow-lg" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <Hash className="h-3 w-3 opacity-60 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm truncate font-medium">{channel.name}</span>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                {channel.hasCall && (
                                  <div className="flex items-center">
                                    <Phone className="h-3 w-3 text-green-400 animate-pulse" />
                                    <span className="text-xs text-green-300 ml-1">Live</span>
                                  </div>
                                )}
                                {channel.pinnedCount > 0 && (
                                  <div className="flex items-center">
                                    <Pin className="h-3 w-3 text-yellow-400" />
                                    <span className="text-xs text-yellow-300">{channel.pinnedCount}</span>
                                  </div>
                                )}
                                {channel.unreadCount && (
                                  <Badge variant="destructive" className="h-4 px-1.5 text-xs animate-bounce">
                                    {channel.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-blue-200 opacity-75 truncate">
                              {channel.memberCount} members
                              {channel.description && ` • ${channel.description.substring(0, 20)}...`}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Enhanced Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-3 group">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setDmsCollapsed(!dmsCollapsed)}
                  >
                    {dmsCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                  <Users className="h-4 w-4 text-blue-300" />
                  <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Direct Messages</h3>
                  <div className="flex items-center space-x-1">
                    {totalUnreadDMs > 0 && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-xs animate-pulse">
                        {totalUnreadDMs}
                      </Badge>
                    )}
                    {onlineDMs > 0 && (
                      <Badge
                        variant="outline"
                        className="h-4 px-1.5 text-xs border-green-400 text-green-300 bg-green-400/10"
                      >
                        {onlineDMs} online
                      </Badge>
                    )}
                  </div>
                </div>
                <Link href="/directory">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-blue-200 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {!dmsCollapsed && (
                <div className="space-y-1 ml-2">
                  {directMessages.map((dm) => (
                    <Link key={dm.id} href={`/messages/${dm.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 transition-all duration-200 p-2 h-auto group"
                      >
                        <div className="flex items-center space-x-3 w-full min-w-0">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-8 h-8 border border-white/20">
                              <AvatarImage src={dm.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs">
                                {dm.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-blue-800 ${getStatusColor(dm.status)} ${
                                dm.status === "online" ? "animate-pulse" : ""
                              }`}
                            ></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-1 min-w-0">
                                <span className="text-sm font-medium truncate">{dm.name}</span>
                                {dm.role && <span className="text-xs">{getRoleIcon(dm.role)}</span>}
                              </div>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                {dm.isTyping && (
                                  <div className="flex space-x-1">
                                    <Dot className="h-3 w-3 text-green-400 animate-bounce" />
                                    <Dot
                                      className="h-3 w-3 text-green-400 animate-bounce"
                                      style={{ animationDelay: "0.1s" }}
                                    />
                                    <Dot
                                      className="h-3 w-3 text-green-400 animate-bounce"
                                      style={{ animationDelay: "0.2s" }}
                                    />
                                  </div>
                                )}
                                {dm.missedCalls && (
                                  <div className="flex items-center">
                                    <PhoneMissed className="h-3 w-3 text-red-400" />
                                    <span className="text-xs text-red-300 ml-1">{dm.missedCalls}</span>
                                  </div>
                                )}
                                {dm.unreadCount && (
                                  <Badge variant="destructive" className="h-4 px-1.5 text-xs animate-bounce">
                                    {dm.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-200 opacity-75 truncate flex-1">
                                {dm.isTyping ? "typing..." : dm.lastMessage}
                              </span>
                              <span className="text-xs text-blue-300 opacity-60 flex-shrink-0 ml-2">
                                {dm.lastMessageTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Enhanced Settings Footer */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-blue-800 to-indigo-800">
          <Link href="/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:bg-white/10 transition-all duration-200 ${
                isActive("/settings") ? "bg-white/20 border-l-2 border-white" : ""
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
