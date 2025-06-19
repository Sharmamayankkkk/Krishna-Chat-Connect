"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import {
  Hash,
  Users,
  Settings,
  Pin,
  Bell,
  BellOff,
  Star,
  StarOff,
  UserPlus,
  UserMinus,
  Shield,
  Crown,
  Menu,
  ArrowLeft,
  Calendar,
  MessageCircle,
  Phone,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface ChannelMember {
  id: string
  name: string
  spiritualName?: string
  role: string
  gender: string
  title: string
  avatar: string
  status: "online" | "away" | "offline"
  joinedAt: string
  lastSeen?: string
  isOwner?: boolean
  isModerator?: boolean
}

interface ChannelInfo {
  id: string
  name: string
  description: string
  category: string
  isPrivate: boolean
  allowCrossGender: boolean
  createdAt: string
  createdBy: string
  memberCount: number
  messageCount: number
  pinnedCount: number
  guidelines: string[]
  moderators: string[]
}

export default function ChannelDetailPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()
  const params = useParams()
  const channelId = params.id as string

  const [channelInfo] = useState<ChannelInfo>({
    id: channelId,
    name: channelId === "general" ? "general" : channelId,
    description:
      channelId === "general"
        ? "Main discussion channel for all devotees. Share daily experiences, ask questions, and connect with the community."
        : `Discussion channel for ${channelId} related topics and activities.`,
    category: "Community",
    isPrivate: false,
    allowCrossGender: channelId === "general",
    createdAt: "2024-01-01",
    createdBy: "Govinda Das",
    memberCount: 108,
    messageCount: 1247,
    pinnedCount: 3,
    guidelines: [
      "Maintain devotional atmosphere in all discussions",
      "Respect all community members regardless of spiritual level",
      "Use appropriate titles (Prabhuji/Mataji) when addressing others",
      "Share Krishna conscious content and experiences",
      "Follow temple etiquette and spiritual principles",
      "Cross-gender interactions should be respectful and purposeful",
      "Report inappropriate content to moderators",
    ],
    moderators: ["govinda-das", "radha-devi-dasi"],
  })

  const [members] = useState<ChannelMember[]>([
    {
      id: "1",
      name: "Govinda Das",
      spiritualName: "Govinda Das",
      role: "admin",
      gender: "male",
      title: "Prabhuji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinedAt: "2024-01-01",
      lastSeen: "now",
      isOwner: true,
      isModerator: true,
    },
    {
      id: "2",
      name: "Radha Devi Dasi",
      spiritualName: "Radha Devi Dasi",
      role: "coordinator",
      gender: "female",
      title: "Mataji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinedAt: "2024-01-02",
      lastSeen: "5 minutes ago",
      isModerator: true,
    },
    {
      id: "3",
      name: "Krishna Das",
      spiritualName: "Krishna Das",
      role: "user",
      gender: "male",
      title: "Prabhuji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      joinedAt: "2024-01-15",
      lastSeen: "1 hour ago",
    },
    {
      id: "4",
      name: "Gopi Devi Dasi",
      spiritualName: "Gopi Devi Dasi",
      role: "user",
      gender: "female",
      title: "Mataji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      joinedAt: "2024-01-18",
      lastSeen: "2 hours ago",
    },
    {
      id: "5",
      name: "Vrindavan Das",
      spiritualName: "Vrindavan Das",
      role: "coordinator",
      gender: "male",
      title: "Prabhuji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinedAt: "2024-01-12",
      lastSeen: "now",
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  if (!currentUser) return null

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "gurudev":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-600"
      case "coordinator":
        return "bg-gradient-to-r from-purple-500 to-indigo-600"
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-600"
    }
  }

  const canManageChannel = () => {
    return (
      currentUser.role === "gurudev" || currentUser.role === "admin" || channelInfo.moderators.includes(currentUser.id)
    )
  }

  const canMessageMember = (member: ChannelMember) => {
    if (currentUser.role === "gurudev" || currentUser.role === "admin") return true
    if (currentUser.gender === member.gender) return true
    return false
  }

  const onlineMembers = members.filter((m) => m.status === "online")
  const awayMembers = members.filter((m) => m.status === "away")
  const offlineMembers = members.filter((m) => m.status === "offline")

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
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-gray-500" />
                <h1 className="text-xl font-semibold text-gray-900">{channelInfo.name}</h1>
              </div>
              <Badge variant="secondary" className="ml-0 sm:ml-2 mt-1 w-fit flex items-center space-x-1 bg-white text-gray-800 border border-gray-300">
                <Users className="w-3 h-3 mr-1" />
                {channelInfo.memberCount} members
              </Badge>
            </div>

          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={isSubscribed ? "text-blue-600" : ""}
            >
              {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-yellow-600" : ""}
            >
              {isFavorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
            </Button>
            {canManageChannel() && (
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members ({channelInfo.memberCount})</TabsTrigger>
                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Hash className="h-5 w-5" />
                        <span>Channel Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{channelInfo.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">Category</h4>
                          <p className="text-gray-600 text-sm">{channelInfo.category}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">Privacy</h4>
                          <p className="text-gray-600 text-sm">{channelInfo.isPrivate ? "Private" : "Public"}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Created {new Date(channelInfo.createdAt).toLocaleDateString()} by {channelInfo.createdBy}
                        </span>
                      </div>

                      {channelInfo.allowCrossGender && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            🤝 This channel allows respectful communication between Matajis and Prabhujis
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Channel Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{channelInfo.memberCount}</div>
                          <div className="text-sm text-blue-700">Members</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{onlineMembers.length}</div>
                          <div className="text-sm text-green-700">Online</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{channelInfo.messageCount}</div>
                          <div className="text-sm text-purple-700">Messages</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">{channelInfo.pinnedCount}</div>
                          <div className="text-sm text-yellow-700">Pinned</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest happenings in this channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Pin className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <strong>Gopi Devi Dasi</strong> pinned a message about Bhagavad Gita study group
                          </p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <UserPlus className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <strong>Krishna Das</strong> joined the channel
                          </p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <strong>Radha Devi Dasi</strong> shared morning arati schedule
                          </p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Online Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Online ({onlineMembers.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {onlineMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                              <div className="relative">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${getStatusColor(member.status)}`}
                                ></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <p className="text-sm font-medium truncate">{member.spiritualName || member.name}</p>
                                  {member.isOwner && <Crown className="h-3 w-3 text-yellow-500" />}
                                  {member.isModerator && !member.isOwner && (
                                    <Shield className="h-3 w-3 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{member.title}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {canMessageMember(member) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => router.push(`/messages/${member.id}`)}
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Away Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Away ({awayMembers.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {awayMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                              <div className="relative">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${getStatusColor(member.status)}`}
                                ></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <p className="text-sm font-medium truncate">{member.spiritualName || member.name}</p>
                                  {member.isOwner && <Crown className="h-3 w-3 text-yellow-500" />}
                                  {member.isModerator && !member.isOwner && (
                                    <Shield className="h-3 w-3 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{member.lastSeen}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {canMessageMember(member) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => router.push(`/messages/${member.id}`)}
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Offline Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>Offline ({offlineMembers.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {offlineMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                              <div className="relative">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${getStatusColor(member.status)}`}
                                ></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <p className="text-sm font-medium truncate">{member.spiritualName || member.name}</p>
                                  {member.isOwner && <Crown className="h-3 w-3 text-yellow-500" />}
                                  {member.isModerator && !member.isOwner && (
                                    <Shield className="h-3 w-3 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{member.lastSeen}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {canMessageMember(member) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => router.push(`/messages/${member.id}`)}
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Guidelines Tab */}
              <TabsContent value="guidelines" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Guidelines</CardTitle>
                    <CardDescription>
                      Please follow these guidelines to maintain a devotional atmosphere
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {channelInfo.guidelines.map((guideline, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm text-blue-900">{guideline}</p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">🙏 Spiritual Etiquette</h4>
                      <p className="text-sm text-yellow-800">
                        Remember that this is a sacred space for Krishna conscious devotees. Let your words reflect the
                        divine qualities of compassion, humility, and devotion. Hare Krishna!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Customize your notifications for this channel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">All Messages</p>
                          <p className="text-sm text-gray-500">Get notified for every message</p>
                        </div>
                        <Button variant="outline" size="sm">
                          {isSubscribed ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mentions Only</p>
                          <p className="text-sm text-gray-500">Only when you're mentioned</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mute Channel</p>
                          <p className="text-sm text-gray-500">Turn off all notifications</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Mute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Channel Actions</CardTitle>
                      <CardDescription>Manage your relationship with this channel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        {isFavorite ? (
                          <Star className="h-4 w-4 mr-2 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4 mr-2" />
                        )}
                        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Pin className="h-4 w-4 mr-2" />
                        View Pinned Messages
                      </Button>
                      <Separator />
                      <Button variant="destructive" className="w-full justify-start">
                        <UserMinus className="h-4 w-4 mr-2" />
                        Leave Channel
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {canManageChannel() && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Moderator Actions</CardTitle>
                      <CardDescription>Channel management options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Channel
                        </Button>
                        <Button variant="outline">
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </Button>
                        <Button variant="outline">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Moderators
                        </Button>
                        <Button variant="outline">
                          <Pin className="h-4 w-4 mr-2" />
                          Manage Pins
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
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
