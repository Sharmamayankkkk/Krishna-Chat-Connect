"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  Bookmark,
  Star,
  MessageCircle,
  Hash,
  Calendar,
  FileText,
  ImageIcon,
  Video,
  Music,
  ExternalLink,
  Trash2,
  Search,
  Filter,
  Menu,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SavedItem {
  id: string
  type: "message" | "file" | "link" | "event"
  title: string
  content: string
  author?: {
    name: string
    avatar: string
  }
  channel?: string
  savedAt: string
  originalDate: string
  url?: string
  fileType?: "image" | "document" | "audio" | "video"
  tags: string[]
}

export default function SavedItemsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const router = useRouter()

  const [savedItems] = useState<SavedItem[]>([
    {
      id: "1",
      type: "message",
      title: "Morning Arati Schedule",
      content:
        "Hare Krishna devotees! 🙏 May this beautiful morning bring Krishna's blessings to all. Don't forget our morning Mangala Arati at 4:30 AM tomorrow.",
      author: {
        name: "Radha Devi Dasi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      channel: "general",
      savedAt: "2024-02-10",
      originalDate: "2024-02-08",
      tags: ["arati", "schedule", "morning"],
    },
    {
      id: "2",
      type: "file",
      title: "Bhagavad Gita Chapter 9 Study Notes",
      content: "Comprehensive notes on The Most Confidential Knowledge chapter",
      author: {
        name: "Gopi Devi Dasi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      channel: "scripture-study",
      savedAt: "2024-02-09",
      originalDate: "2024-02-07",
      fileType: "document",
      tags: ["bhagavad-gita", "study", "chapter-9"],
    },
    {
      id: "3",
      type: "event",
      title: "Janmashtami Celebration",
      content: "Grand celebration of Lord Krishna's appearance day with abhishek, bhajans, and feast",
      author: {
        name: "Govinda Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      savedAt: "2024-02-08",
      originalDate: "2024-08-26",
      tags: ["festival", "janmashtami", "celebration"],
    },
    {
      id: "4",
      type: "file",
      title: "Temple Kirtan Recordings",
      content: "Beautiful bhajan recordings from last week's kirtan session",
      author: {
        name: "Vrindavan Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      channel: "bhajans-kirtan",
      savedAt: "2024-02-07",
      originalDate: "2024-02-05",
      fileType: "audio",
      tags: ["kirtan", "bhajans", "music"],
    },
    {
      id: "5",
      type: "link",
      title: "ISKCON Official Website",
      content: "International Society for Krishna Consciousness official portal",
      savedAt: "2024-02-06",
      originalDate: "2024-02-06",
      url: "https://iskcon.org",
      tags: ["iskcon", "official", "website"],
    },
    {
      id: "6",
      type: "file",
      title: "Festival Decoration Photos",
      content: "Beautiful photos from Radhastami festival decorations",
      author: {
        name: "Krishna Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      channel: "festivals-events",
      savedAt: "2024-02-05",
      originalDate: "2024-01-20",
      fileType: "image",
      tags: ["radhastami", "decorations", "photos"],
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

  const filteredItems = savedItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  const messages = filteredItems.filter((item) => item.type === "message")
  const files = filteredItems.filter((item) => item.type === "file")
  const links = filteredItems.filter((item) => item.type === "link")
  const events = filteredItems.filter((item) => item.type === "event")

  const getItemIcon = (item: SavedItem) => {
    switch (item.type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "file":
        switch (item.fileType) {
          case "image":
            return <ImageIcon className="h-5 w-5 text-green-500" />
          case "audio":
            return <Music className="h-5 w-5 text-purple-500" />
          case "video":
            return <Video className="h-5 w-5 text-red-500" />
          default:
            return <FileText className="h-5 w-5 text-orange-500" />
        }
      case "link":
        return <ExternalLink className="h-5 w-5 text-indigo-500" />
      case "event":
        return <Calendar className="h-5 w-5 text-pink-500" />
      default:
        return <Bookmark className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800"
      case "file":
        return "bg-green-100 text-green-800"
      case "link":
        return "bg-indigo-100 text-indigo-800"
      case "event":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <h1 className="text-xl font-semibold text-gray-900">Saved Items</h1>
              <p className="text-sm text-gray-500">Your bookmarked messages, files, and resources</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{filteredItems.length} items</Badge>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="all" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <TabsList className="grid w-full sm:w-auto grid-cols-5">
                  <TabsTrigger value="all">All ({filteredItems.length})</TabsTrigger>
                  <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
                  <TabsTrigger value="files">Files ({files.length})</TabsTrigger>
                  <TabsTrigger value="links">Links ({links.length})</TabsTrigger>
                  <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
                </TabsList>

                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search saved items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="message">Messages</option>
                    <option value="file">Files</option>
                    <option value="link">Links</option>
                    <option value="event">Events</option>
                  </select>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">{getItemIcon(item)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                            <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            {item.author && (
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={item.author.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {item.author.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{item.author.name}</span>
                              </div>
                            )}
                            {item.channel && (
                              <div className="flex items-center space-x-1">
                                <Hash className="h-3 w-3" />
                                <span>{item.channel}</span>
                              </div>
                            )}
                            <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                            <span>Original {new Date(item.originalDate).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.url && (
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Open
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                {messages.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <MessageCircle className="h-5 w-5 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3">{item.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {item.author && (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={item.author.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {item.author.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{item.author.name}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Hash className="h-3 w-3" />
                                <span>{item.channel}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View in Channel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                {files.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {getItemIcon(item)}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3">{item.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {item.author && (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={item.author.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {item.author.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{item.author.name}</span>
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {item.fileType}
                              </Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                {links.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <ExternalLink className="h-5 w-5 text-indigo-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3">{item.content}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{item.url}</span>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Visit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                {events.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Calendar className="h-5 w-5 text-pink-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3">{item.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {item.author && (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={item.author.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {item.author.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>by {item.author.name}</span>
                                </div>
                              )}
                              <span>Event date: {new Date(item.originalDate).toLocaleDateString()}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              View Event
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved items found</h3>
                  <p className="text-gray-500">Start saving messages, files, and links to access them here</p>
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
