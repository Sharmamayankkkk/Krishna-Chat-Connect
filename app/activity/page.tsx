"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  Bell,
  MessageCircle,
  UserPlus,
  Heart,
  Reply,
  Pin,
  Menu,
  Filter,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Activity {
  id: string
  type: "message" | "reaction" | "mention" | "join" | "pin"
  user: string
  avatar: string
  content: string
  channel?: string
  time: string
  isRead: boolean
}

export default function ActivityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activities] = useState<Activity[]>([
    {
      id: "1",
      type: "mention",
      user: "Radha Devi Dasi",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "mentioned you in #general: @MadanMohan please join us for evening arati",
      channel: "general",
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: "2",
      type: "reaction",
      user: "Govinda Das",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "reacted 🙏 to your message in #bhajans-kirtan",
      channel: "bhajans-kirtan",
      time: "5 minutes ago",
      isRead: false,
    },
    {
      id: "3",
      type: "join",
      user: "Krishna Das",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "joined #scripture-study",
      channel: "scripture-study",
      time: "10 minutes ago",
      isRead: true,
    },
    {
      id: "4",
      type: "pin",
      user: "Gopi Devi Dasi",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "pinned a message in #festivals-events",
      channel: "festivals-events",
      time: "1 hour ago",
      isRead: true,
    },
    {
      id: "5",
      type: "message",
      user: "Vrindavan Das",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "sent you a direct message",
      time: "2 hours ago",
      isRead: false,
    },
  ])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  if (!currentUser) return null

  const getActivityIcon = (type: string) => {
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
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const unreadCount = activities.filter((a) => !a.isRead).length

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Activity</h1>
              <p className="text-sm text-gray-500">Stay updated with community activity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>{unreadCount} unread</Badge>
            <Button variant="outline" size="sm">
              <MarkAsRead className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className={`hover:shadow-md transition-shadow ${!activity.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getActivityIcon(activity.type)}
                        <span className="font-medium text-gray-900">{activity.user}</span>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                        {!activity.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>

                      <p className="text-gray-700 text-sm">{activity.content}</p>

                      {activity.channel && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            #{activity.channel}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {activity.type === "mention" && (
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                      )}
                      {activity.type === "message" && (
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activities.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-500">When devotees interact with you, you'll see it here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
