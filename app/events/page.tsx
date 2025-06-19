"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search,
  Bell,
  BellOff,
  Star,
  StarOff,
  Menu,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: {
    name: string
    avatar: string
  }
  attendees: number
  maxAttendees?: number
  category: "festival" | "study" | "service" | "kirtan" | "general"
  isSubscribed: boolean
  isFavorite: boolean
  status: "upcoming" | "ongoing" | "completed"
}

export default function EventsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const router = useRouter()

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Janmashtami Celebration",
      description: "Grand celebration of Lord Krishna's appearance day with abhishek, bhajans, and feast",
      date: "2024-08-26",
      time: "4:00 AM - 11:00 PM",
      location: "Main Temple Hall",
      organizer: {
        name: "Govinda Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      attendees: 150,
      maxAttendees: 200,
      category: "festival",
      isSubscribed: true,
      isFavorite: true,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Bhagavad Gita Study Circle",
      description: "Weekly study of Chapter 9 - The Most Confidential Knowledge",
      date: "2024-02-15",
      time: "7:00 PM - 8:30 PM",
      location: "Study Room A",
      organizer: {
        name: "Gopi Devi Dasi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      attendees: 25,
      maxAttendees: 30,
      category: "study",
      isSubscribed: true,
      isFavorite: false,
      status: "upcoming",
    },
    {
      id: "3",
      title: "Temple Cleaning Seva",
      description: "Monthly deep cleaning and maintenance of temple premises",
      date: "2024-02-18",
      time: "8:00 AM - 12:00 PM",
      location: "Temple Grounds",
      organizer: {
        name: "Krishna Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      attendees: 40,
      category: "service",
      isSubscribed: false,
      isFavorite: false,
      status: "upcoming",
    },
    {
      id: "4",
      title: "Evening Kirtan",
      description: "Devotional singing and chanting session with harmonium and mridanga",
      date: "2024-02-14",
      time: "6:30 PM - 8:00 PM",
      location: "Kirtan Hall",
      organizer: {
        name: "Vrindavan Das",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      attendees: 60,
      category: "kirtan",
      isSubscribed: true,
      isFavorite: true,
      status: "ongoing",
    },
    {
      id: "5",
      title: "Radhastami Festival",
      description: "Celebration of Srimati Radharani's appearance day",
      date: "2024-01-20",
      time: "5:00 AM - 10:00 PM",
      location: "Main Temple Hall",
      organizer: {
        name: "Radha Devi Dasi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      attendees: 180,
      category: "festival",
      isSubscribed: true,
      isFavorite: true,
      status: "completed",
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

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || event.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const upcomingEvents = filteredEvents.filter((e) => e.status === "upcoming")
  const ongoingEvents = filteredEvents.filter((e) => e.status === "ongoing")
  const completedEvents = filteredEvents.filter((e) => e.status === "completed")

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "festival":
        return "bg-purple-100 text-purple-800"
      case "study":
        return "bg-blue-100 text-blue-800"
      case "service":
        return "bg-green-100 text-green-800"
      case "kirtan":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "border-l-blue-500"
      case "ongoing":
        return "border-l-green-500"
      case "completed":
        return "border-l-gray-400"
      default:
        return "border-l-gray-300"
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
              <h1 className="text-xl font-semibold text-gray-900">Events & Programs</h1>
              <p className="text-sm text-gray-500">Spiritual gatherings and community activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="upcoming" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <TabsList className="grid w-full sm:w-auto grid-cols-3">
                  <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
                  <TabsTrigger value="ongoing">Ongoing ({ongoingEvents.length})</TabsTrigger>
                  <TabsTrigger value="completed">Past ({completedEvents.length})</TabsTrigger>
                </TabsList>

                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="festival">Festivals</option>
                    <option value="study">Study Groups</option>
                    <option value="service">Service</option>
                    <option value="kirtan">Kirtan</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`hover:shadow-lg transition-shadow border-l-4 ${getStatusColor(event.status)}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                            {event.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>

                          <p className="text-gray-600 mb-4">{event.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {event.organizer.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">by {event.organizer.name}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>
                                  {event.attendees}
                                  {event.maxAttendees && `/${event.maxAttendees}`} attending
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant={event.isSubscribed ? "default" : "outline"}
                            size="sm"
                            className={event.isSubscribed ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {event.isSubscribed ? "Attending" : "Join Event"}
                          </Button>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              {event.isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              {event.isFavorite ? (
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="ongoing" className="space-y-4">
                {ongoingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`hover:shadow-lg transition-shadow border-l-4 ${getStatusColor(event.status)}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <Badge className="bg-green-100 text-green-800">Live Now</Badge>
                            <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                          </div>

                          <p className="text-gray-600 mb-4">{event.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {event.organizer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">by {event.organizer.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button className="bg-green-600 hover:bg-green-700" size="sm">
                            Join Now
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`hover:shadow-lg transition-shadow border-l-4 ${getStatusColor(event.status)} opacity-75`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <Badge variant="secondary">Completed</Badge>
                            <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                          </div>

                          <p className="text-gray-600 mb-4">{event.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {event.organizer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">by {event.organizer.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees} attended</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button variant="outline" size="sm">
                            View Photos
                          </Button>
                          <Button variant="outline" size="sm">
                            Feedback
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
