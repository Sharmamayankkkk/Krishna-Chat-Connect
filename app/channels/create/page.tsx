"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Hash, Lock, Globe, Users, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateChannelPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    isPrivate: false,
    allowCrossGender: false,
    moderationLevel: "standard",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate channel creation request
    setTimeout(() => {
      // In a real app, this would send to backend
      console.log("Channel creation request:", formData)

      // Show success message and redirect
      alert("Channel creation request submitted! Admins will review your request.")
      router.push("/")
    }, 1000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canCreateDirectly = ["gurudev", "admin"].includes(currentUser.role)

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
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Create Channel</h1>
            <p className="text-sm text-gray-500">Start a new discussion space for devotees</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>Channel Details</span>
                </CardTitle>
                <CardDescription>
                  {canCreateDirectly
                    ? "Create a new channel instantly with your admin privileges"
                    : "Submit a request to create a new channel. Admins will review your request."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Channel Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Channel Name *</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="e.g., bhajan-practice, book-study"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Channel names must be lowercase and use hyphens instead of spaces
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the purpose and topics for this channel..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spiritual">Spiritual Practice</SelectItem>
                        <SelectItem value="study">Scripture Study</SelectItem>
                        <SelectItem value="service">Temple Service</SelectItem>
                        <SelectItem value="events">Events & Festivals</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="youth">Youth Programs</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="general">General Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Privacy & Access</h3>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {formData.isPrivate ? (
                          <Lock className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Globe className="h-5 w-5 text-gray-600" />
                        )}
                        <div>
                          <Label htmlFor="private">Private Channel</Label>
                          <p className="text-sm text-gray-500">
                            {formData.isPrivate
                              ? "Only invited members can see and join this channel"
                              : "All community members can see and join this channel"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="private"
                        checked={formData.isPrivate}
                        onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label htmlFor="crossGender">Allow Cross-Gender Communication</Label>
                          <p className="text-sm text-gray-500">
                            Allow Matajis and Prabhujis to communicate in this channel
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="crossGender"
                        checked={formData.allowCrossGender}
                        onCheckedChange={(checked) => handleInputChange("allowCrossGender", checked)}
                      />
                    </div>
                  </div>

                  {/* Moderation Level */}
                  <div className="space-y-2">
                    <Label htmlFor="moderation">Moderation Level</Label>
                    <Select
                      value={formData.moderationLevel}
                      onValueChange={(value) => handleInputChange("moderationLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light - Basic spam protection</SelectItem>
                        <SelectItem value="standard">Standard - Moderate content filtering</SelectItem>
                        <SelectItem value="strict">Strict - High content moderation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guidelines */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Channel Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Maintain devotional atmosphere and Krishna conscious discussions</li>
                      <li>• Respect all community members regardless of their spiritual level</li>
                      <li>• Follow temple etiquette and spiritual principles</li>
                      <li>• Cross-gender channels require special approval and moderation</li>
                      <li>• Channel creators become default moderators</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/")}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    >
                      {isSubmitting ? "Submitting..." : canCreateDirectly ? "Create Channel" : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
