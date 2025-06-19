"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bell,
  MessageCircle,
  UserPlus,
  Heart,
  Reply,
  Pin,
  Phone,
  Calendar,
  Settings,
  Check,
  X,
  Volume2,
  VolumeX,
} from "lucide-react"

interface Notification {
  id: string
  type: "message" | "mention" | "reaction" | "join" | "pin" | "call" | "event" | "system"
  title: string
  content: string
  user?: {
    name: string
    avatar: string
  }
  channel?: string
  time: string
  isRead: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

interface NotificationSystemProps {
  currentUser: any
}

export function NotificationSystem({ currentUser }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "mention",
      title: "You were mentioned",
      content: "mentioned you in #general: @MadanMohan please join us for evening arati",
      user: {
        name: "Radha Devi Dasi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      channel: "general",
      time: "2 minutes ago",
      isRead: false,
      priority: "high",
      actionUrl: "/channels/general",
    },
    {
      id: "2",
      type: "reaction",
      title: "New reaction",
      content: "reacted 🙏 to your message in #bhajans-kirtan",
      user: {
        name: "Govinda Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      channel: "bhajans-kirtan",
      time: "5 minutes ago",
      isRead: false,
      priority: "medium",
      actionUrl: "/channels/bhajans-kirtan",
    },
    {
      id: "3",
      type: "call",
      title: "Missed call",
      content: "tried to call you",
      user: {
        name: "Krishna Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "10 minutes ago",
      isRead: false,
      priority: "high",
      actionUrl: "/messages/3",
    },
    {
      id: "4",
      type: "event",
      title: "Upcoming event",
      content: "Janmashtami celebration starts in 1 hour",
      time: "1 hour ago",
      isRead: true,
      priority: "medium",
      actionUrl: "/events",
    },
    {
      id: "5",
      type: "system",
      title: "Welcome message",
      content: "Welcome to Krishna Connect! Complete your profile to get started.",
      time: "1 day ago",
      isRead: true,
      priority: "low",
      actionUrl: "/settings",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const highPriorityCount = notifications.filter((n) => !n.isRead && n.priority === "high").length

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance every second to simulate a new notification
        addNotification({
          id: Date.now().toString(),
          type: "message",
          title: "New message",
          content: "sent you a message",
          user: {
            name: "Vrindavan Das",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          time: "now",
          isRead: false,
          priority: "medium",
          actionUrl: "/messages/2",
        })
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: `${notification.user?.name || "System"}: ${notification.content}`,
        icon: "/logo.png",
        tag: notification.id,
      })
    }

    // Play sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay restrictions
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return <Reply className="h-4 w-4 text-blue-500" />
      case "reaction":
        return <Heart className="h-4 w-4 text-red-500" />
      case "join":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "pin":
        return <Pin className="h-4 w-4 text-yellow-500" />
      case "message":
        return <MessageCircle className="h-4 w-4 text-purple-500" />
      case "call":
        return <Phone className="h-4 w-4 text-orange-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-indigo-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50/30"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/30"
      case "low":
        return "border-l-gray-500 bg-gray-50/30"
      default:
        return ""
    }
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant={highPriorityCount > 0 ? "destructive" : "default"}
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 p-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="h-8 w-8 p-0"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                {highPriorityCount > 0 && ` (${highPriorityCount} urgent)`}
              </p>
            )}
          </div>

          <ScrollArea className="max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                      !notification.isRead ? getPriorityColor(notification.priority) : "border-l-transparent"
                    }`}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl
                      }
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <div className="flex items-center space-x-1">
                            {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {notification.user && (
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {notification.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <p className="text-xs text-gray-600 truncate">{notification.content}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {notification.channel && (
                            <Badge variant="outline" className="text-xs">
                              #{notification.channel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsOpen(false)}>
                View all activity
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden audio element for notification sounds */}
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>
    </>
  )
}
