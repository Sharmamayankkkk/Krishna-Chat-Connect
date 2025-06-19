"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Search, MessageCircle, Phone, Video, UserPlus, Menu, MapPin, Calendar, Crown, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  spiritualName?: string
  email: string
  role: string
  gender: string
  title: string
  avatar: string
  status: string
  location?: string
  bio?: string
  joinedAt: string
  lastSeen?: string
}

export default function DirectoryPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterGender, setFilterGender] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Radha Devi Dasi",
      spiritualName: "Radha Devi Dasi",
      email: "radha@temple.org",
      role: "coordinator",
      gender: "female",
      title: "Mataji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      location: "Vrindavan Temple",
      bio: "Dedicated to Krishna consciousness and temple service. Leading devotional programs.",
      joinedAt: "2024-01-15",
      lastSeen: "now",
    },
    {
      id: "2",
      name: "Govinda Das",
      spiritualName: "Govinda Das",
      email: "govinda@temple.org",
      role: "admin",
      gender: "male",
      title: "Prabhuji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      location: "Mayapur Temple",
      bio: "Temple administrator and kirtan leader. Organizing festivals and events.",
      joinedAt: "2024-01-10",
      lastSeen: "2 hours ago",
    },
    {
      id: "3",
      name: "Krishna Das",
      spiritualName: "Krishna Das",
      email: "krishna@temple.org",
      role: "user",
      gender: "male",
      title: "Prabhuji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      location: "New Vrindavan",
      bio: "Book distribution and outreach programs. Spreading Krishna consciousness.",
      joinedAt: "2024-01-20",
      lastSeen: "5 minutes ago",
    },
    {
      id: "4",
      name: "Gopi Devi Dasi",
      spiritualName: "Gopi Devi Dasi",
      email: "gopi@temple.org",
      role: "user",
      gender: "female",
      title: "Mataji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      location: "Alachua Temple",
      bio: "Bhagavad Gita teacher and children's program coordinator.",
      joinedAt: "2024-01-18",
      lastSeen: "1 day ago",
    },
    {
      id: "5",
      name: "Vrindavan Das",
      spiritualName: "Vrindavan Das",
      email: "vrindavan@temple.org",
      role: "coordinator",
      gender: "male",
      title: "Prabhuji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      location: "Bhaktivedanta Manor",
      bio: "Youth programs and spiritual education coordinator.",
      joinedAt: "2024-01-12",
      lastSeen: "now",
    },
    {
      id: "6",
      name: "Bhakti Devi Dasi",
      spiritualName: "Bhakti Devi Dasi",
      email: "bhakti@temple.org",
      role: "user",
      gender: "female",
      title: "Mataji",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      location: "Radhadesh Temple",
      bio: "Deity worship and temple maintenance. Devotional service enthusiast.",
      joinedAt: "2024-01-22",
      lastSeen: "30 minutes ago",
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.spiritualName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesGender = filterGender === "all" || user.gender === filterGender
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesGender && matchesStatus
  })

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

  const canMessage = (targetUser: User) => {
    if (currentUser.role === "gurudev" || currentUser.role === "admin") return true
    if (currentUser.gender === targetUser.gender) return true
    return false // Would need approval for cross-gender messaging
  }

  const handleMessage = (userId: string) => {
    router.push(`/messages/${userId}`)
  }

  const handleConnect = (userId: string) => {
    // Add connection logic here
    console.log("Connecting with user:", userId)
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Devotee Directory</h1>
              <p className="text-sm text-gray-500">Discover and connect with fellow devotees</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{filteredUsers.length} devotees</span>
          </Badge>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Find Devotees</span>
                </CardTitle>
                <CardDescription>Search and filter to find devotees in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <Input
                      placeholder="Search by name, spiritual name, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="gurudev">Gurudev</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="user">Devotee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterGender} onValueChange={setFilterGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="male">Prabhuji</SelectItem>
                      <SelectItem value="female">Mataji</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-lg">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{user.spiritualName || user.name}</h3>
                          {user.role !== "user" && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`text-white text-xs ${getRoleBadgeColor(user.role)}`}>{user.role}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {user.title}
                          </Badge>
                        </div>

                        {user.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{user.bio}</p>

                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {canMessage(user) ? (
                            <Button size="sm" onClick={() => handleMessage(user.id)} className="flex-1">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConnect(user.id)}
                              className="flex-1"
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Request
                            </Button>
                          )}

                          {user.status === "online" && (
                            <>
                              <Button size="sm" variant="outline" className="px-2">
                                <Phone className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="px-2">
                                <Video className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No devotees found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or filters</p>
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
