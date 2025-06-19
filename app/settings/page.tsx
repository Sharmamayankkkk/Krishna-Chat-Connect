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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Camera, Save, Bell, Volume2, Shield, Smartphone, Menu, Palette, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserType {
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

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    spiritualName: "",
    bio: "",
    location: "",
    status: "",
  })
  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      soundEnabled: true,
      mentionOnly: false,
    },
    privacy: {
      showOnlineStatus: true,
      allowDirectMessages: true,
      showLastSeen: true,
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      compactMode: false,
    },
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setCurrentUser(parsedUser)
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

  if (!currentUser) return null

  const handleSaveProfile = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...formData,
      }
      setCurrentUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-4 shadow-sm">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Manage your profile and preferences</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                {/* Profile Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                            {currentUser.name
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
                          <h2 className="text-2xl font-bold">{currentUser.spiritualName || currentUser.name}</h2>
                          <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <Badge className={`text-white ${getRoleBadgeColor(currentUser.role)}`}>
                              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="border-blue-200 text-blue-700">
                              {currentUser.title}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{currentUser.email}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Joined{" "}
                          {new Date(currentUser.joinedAt).toLocaleDateString("en-US", {
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

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.pushEnabled}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "pushEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.emailEnabled}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "emailEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label>Sound Notifications</Label>
                          <p className="text-sm text-gray-500">Play sound for new messages</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.soundEnabled}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "soundEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mention Only</Label>
                        <p className="text-sm text-gray-500">Only notify when mentioned directly</p>
                      </div>
                      <Switch
                        checked={settings.notifications.mentionOnly}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "mentionOnly", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy and visibility</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Online Status</Label>
                        <p className="text-sm text-gray-500">Let others see when you're online</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showOnlineStatus}
                        onCheckedChange={(checked) => handleSettingChange("privacy", "showOnlineStatus", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Direct Messages</Label>
                        <p className="text-sm text-gray-500">Allow others to send you direct messages</p>
                      </div>
                      <Switch
                        checked={settings.privacy.allowDirectMessages}
                        onCheckedChange={(checked) => handleSettingChange("privacy", "allowDirectMessages", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Last Seen</Label>
                        <p className="text-sm text-gray-500">Show when you were last active</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showLastSeen}
                        onCheckedChange={(checked) => handleSettingChange("privacy", "showLastSeen", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {currentUser.role === "user" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Messaging Permissions</CardTitle>
                      <CardDescription>Your current messaging restrictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Current Permissions</h4>
                        <p className="text-sm text-blue-700">
                          As a {currentUser.title}, you can message other {currentUser.title}s freely. To message{" "}
                          {currentUser.gender === "male" ? "Matajis" : "Prabhujis"}, approval from administrators is
                          required for spiritual guidance purposes.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize how the app looks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={settings.appearance.theme}
                        onValueChange={(value) => handleSettingChange("appearance", "theme", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select
                        value={settings.appearance.fontSize}
                        onValueChange={(value) => handleSettingChange("appearance", "fontSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-gray-500">Show more content in less space</p>
                      </div>
                      <Switch
                        checked={settings.appearance.compactMode}
                        onCheckedChange={(checked) => handleSettingChange("appearance", "compactMode", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
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
