"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Code, Loader2, Save } from "lucide-react"
import { SiCodechef, SiCodeforces, SiGeeksforgeeks, SiLeetcode } from "react-icons/si"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

axios.defaults.withCredentials = true
const api_data = "https://codecompanion-tt6a.onrender.com/api/data"
const api_auth = "https://codecompanion-tt6a.onrender.com/api/auth"

export default function EditProfilePage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState({
    leetCode: "",
    codeforces: "",
    codechef: "",
    geeksForGeeks: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${api_data}/profile`,{
          withCredentials: true, 
        })
        setFormValues({
          leetCode: response.data.leetCode || "",
          codeforces: response.data.codeforces || "",
          codechef: response.data.codechef || "",
          geeksForGeeks: response.data.geeksForGeeks || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await axios.post(`${api_data}/usernames`, {
        codeforces: formValues.codeforces,
        codechef: formValues.codechef,
        leetcode: formValues.leetCode,
        gfg: formValues.geeksForGeeks,
      },  {
        withCredentials: true, 
      })

      setSuccess("Profile updated successfully!")

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      if (error.response?.data?.msg) {
        setError(error.response.data.msg)
      } else {
        setError("An error occurred while updating your profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const platformFields = [
    {
      name: "leetCode",
      label: "LeetCode Username",
      icon: <SiLeetcode className="h-5 w-5 text-orange-500" />,
      placeholder: "Enter your LeetCode username",
      url: "https://leetcode.com/",
    },
    {
      name: "codeforces",
      label: "Codeforces Username",
      icon: <SiCodeforces className="h-5 w-5 text-blue-500" />,
      placeholder: "Enter your Codeforces username",
      url: "https://codeforces.com/profile/",
    },
    {
      name: "codechef",
      label: "CodeChef Username",
      icon: <SiCodechef className="h-5 w-5 text-amber-500" />,
      placeholder: "Enter your CodeChef username",
      url: "https://www.codechef.com/users/",
    },
    {
      name: "geeksForGeeks",
      label: "GeeksForGeeks Username",
      icon: <SiGeeksforgeeks className="h-5 w-5 text-green-500" />,
      placeholder: "Enter your GeeksForGeeks username",
      url: "https://auth.geeksforgeeks.org/user/",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Code className="h-6 w-6" />
                <CardTitle className="text-2xl font-bold">Edit Your Profile</CardTitle>
              </div>
              <CardDescription className="text-indigo-100">
                Connect your coding platform accounts to track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-500 text-green-700 dark:text-green-400">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {isFetching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {platformFields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name} className="flex items-center gap-2">
                          {field.icon}
                          {field.label}
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={formValues[field.name as keyof typeof formValues]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="bg-white dark:bg-gray-950"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <a
                            href={field.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            Visit {field.label.split(" ")[0]}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

