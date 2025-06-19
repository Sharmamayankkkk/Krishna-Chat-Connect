"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, MessageSquare, Shield, CheckCircle, XCircle, Crown, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
  gender: string
  title: string
  avatar: string
  status: string
  joinedAt: string
}

interface ChannelRequest {
  id: string
  name: string
  description: string
  requestedBy: string
  requestedAt: string
  status: "pending" | "approved" | "rejected"
}

interface MessageRequest {
  id: string
  from: string
  to: string
  reason: string
  requestedAt: string
  status: "pending" | "approved" | "rejected"
}

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [channelRequests, setChannelRequests] = useState<ChannelRequest[]>([])
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (!["gurudev", "admin", "coordinator"].includes(user.role)) {
        router.push("/")
        return
      }
      setCurrentUser(user)
    } else {
      router.push("/auth/login")
      return
    }

    // Mock data for demo
    setUsers([
      {
        id: "1",
        name: "Radha Devi Dasi",
        email: "radha@temple.org",
        role: "user",
        gender: "female",
        title: "Mataji",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        joinedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Govinda Das",
        email: "govinda@temple.org",
        role: "coordinator",
        gender: "male",
        title: "Prabhuji",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "away",
        joinedAt: "2024-01-10",
      },
      {
        id: "3",
        name: "Krishna Das",
        email: "krishna@temple.org",
        role: "user",
        gender: "male",
        title: "Prabhuji",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        joinedAt: "2024-01-20",
      },
    ])

    setChannelRequests([
      {
        id: "1",
        name: "youth-programs",
        description: "Channel for youth devotee programs and activities",
        requestedBy: "Govinda Das",
        requestedAt: "2024-01-25",
        status: "pending",
      },
      {
        id: "2",
        name: "book-distribution",
        description: "Coordinate book distribution activities",
        requestedBy: "Krishna Das",
        requestedAt: "2024-01-24",
        status: "pending",
      },
    ])

    setMessageRequests([
      {
        id: "1",
        from: "Krishna Das (Prabhuji)",
        to: "Radha Devi Dasi (Mataji)",
        reason: "Seeking guidance on temple service coordination",
        requestedAt: "2024-01-25",
        status: "pending",
      },
      {
        id: "2",
        from: "Radha Devi Dasi (Mataji)",
        to: "Govinda Das (Prabhuji)",
        reason: "Questions about upcoming festival preparations",
        requestedAt: "2024-01-24",
        status: "pending",
      },
    ])
  }, [router])

  const handleChannelRequest = (id: string, action: "approve" | "reject") => {
    setChannelRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req)),
    )
  }

  const handleMessageRequest = (id: string, action: "approve" | "reject") => {
    setMessageRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req)),
    )
  }

  const handleRoleChange = () => {
    if (selectedUser && newRole) {
      setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user)))
      setSelectedUser(null)
      setNewRole("")
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Developer Panel</h1>
              <p className="text-blue-100">Manage users, channels, and permissions</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white">
            <Crown className="h-3 w-3 mr-1" />
            {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Channels</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Message Requests</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Permissions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.name}</h3>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-white text-xs ${getRoleBadgeColor(user.role)}`}>{user.role}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.title}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            Change Role
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change User Role</DialogTitle>
                            <DialogDescription>Update the role for {user.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Current Role: {user.role}</Label>
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="coordinator">Coordinator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  {currentUser.role === "gurudev" && <SelectItem value="gurudev">Gurudev</SelectItem>}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleRoleChange} className="w-full">
                              Update Role
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Channel Requests</CardTitle>
                <CardDescription>Approve or reject channel creation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">#{request.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Requested by: {request.requestedBy}</span>
                            <span>Date: {new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleChannelRequest(request.id, "approve")}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleChannelRequest(request.id, "reject")}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cross-Gender Message Requests</CardTitle>
                <CardDescription>Approve messaging between Matajis and Prabhujis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messageRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">Message Request</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>From:</strong> {request.from}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>To:</strong> {request.to}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Requested: {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMessageRequest(request.id, "approve")}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMessageRequest(request.id, "reject")}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Overview of role-based permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-yellow-700 mb-2">🕉️ Gurudev</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Full system access</li>
                        <li>• Can assign any role</li>
                        <li>• Override all restrictions</li>
                        <li>• Access all channels</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-red-700 mb-2">👑 Admin</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Manage users and roles</li>
                        <li>• Approve channel requests</li>
                        <li>• Moderate all content</li>
                        <li>• Access admin panel</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-purple-700 mb-2">🎯 Coordinator</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Manage assigned channels</li>
                        <li>• Approve message requests</li>
                        <li>• Organize events</li>
                        <li>• Limited admin access</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-blue-700 mb-2">👤 User</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Message same gender freely</li>
                        <li>• Request cross-gender messaging</li>
                        <li>• Join approved channels</li>
                        <li>• Basic chat features</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Gender-Based Restrictions</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        • <strong>Matajis</strong> can message other Matajis freely
                      </p>
                      <p>
                        • <strong>Prabhujis</strong> can message other Prabhujis freely
                      </p>
                      <p>• Cross-gender messaging requires admin approval</p>
                      <p>• Spiritual guidance channels are moderated</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
