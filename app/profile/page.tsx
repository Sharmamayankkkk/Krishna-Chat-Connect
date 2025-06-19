"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  spiritualName?: string
  role: string
  gender: string
  title: string
  avatar: string
  bio?: string
  location?: string
  joinedAt: string
  status?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    spiritualName: "",
    bio: "",
    location: "",
    status: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || "",
        spiritualName: parsedUser.spiritualName || "",
        bio: parsedUser.bio || "",
        location: parsedUser.location || "",
        status: parsedUser.status || "online",
      })
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...formData,
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                  <h2 className="text-2xl font-bold">{user.spiritualName || user.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge className={`text-white ${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {user.title}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Joined{" "}
                  {new Date(user.joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={
                  !isEditing
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    : ""
                }
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spiritualName">Spiritual Name</Label>
                <Input
                  id="spiritualName"
                  value={formData.spiritualName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, spiritualName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="e.g., Radha Devi Dasi, Govinda Das"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Your city or temple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">🟢 Online</SelectItem>
                    <SelectItem value="away">🟡 Away</SelectItem>
                    <SelectItem value="busy">🔴 Busy</SelectItem>
                    <SelectItem value="chanting">📿 Chanting</SelectItem>
                    <SelectItem value="studying">📚 Studying</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Tell others about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Share your spiritual journey, interests, or favorite Krishna conscious activities..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Role</Label>
                <p className="text-sm capitalize">{user.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Gender</Label>
                <p className="text-sm">{user.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                <p className="text-sm">{new Date(user.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {user.role === "user" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Messaging Permissions</h4>
                <p className="text-sm text-blue-700">
                  As a {user.title}, you can message other {user.title}s freely. To message{" "}
                  {user.gender === "male" ? "Matajis" : "Prabhujis"}, approval from administrators is required for
                  spiritual guidance purposes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
