"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { SiCodeforces, SiCodechef, SiLeetcode, SiGeeksforgeeks } from "react-icons/si"
import {
  Award,
  Calendar,
  Code,
  ExternalLink,
  Globe,
  LogOut,
  MapPin,
  Menu,
  Star,
  Trophy,
  User,
  UserCircle,
  ChevronRight,
  Settings,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

axios.defaults.withCredentials = true
const api = "http://localhost:5000/api/data"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Helper function to format date
const formatDate = (timestamp: number) => {
  if (!timestamp) return "N/A"

  const date = new Date(timestamp * 1000)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string) => {
  if (!difficulty) return "bg-gray-500"

  const lowerDifficulty = difficulty.toLowerCase()
  if (lowerDifficulty.includes("easy") || lowerDifficulty === "school" || lowerDifficulty === "basic")
    return "bg-green-500"
  if (lowerDifficulty.includes("medium")) return "bg-yellow-500"
  if (lowerDifficulty.includes("hard")) return "bg-red-500"
  return "bg-blue-500"
}

// Helper function to get platform color
const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "codeforces":
      return "bg-gradient-to-r from-blue-600 to-blue-400"
    case "codechef":
      return "bg-gradient-to-r from-amber-600 to-amber-400"
    case "leetcode":
      return "bg-gradient-to-r from-orange-600 to-orange-400"
    case "gfg":
      return "bg-gradient-to-r from-green-600 to-green-400"
    default:
      return "bg-gradient-to-r from-indigo-600 to-purple-600"
  }
}

interface ProfileData {
  leetCode?: string
  codeforces?: string
  codechef?: string
  geeksForGeeks?: string
  error?: string
}

interface CodeforcesData {
  rank?: string
  rating?: number
  maxRating?: number
  maxRank?: string
  country?: string
  city?: string
  organization?: string
  lastOnlineTimeSeconds?: number
  error?: string
}

interface CodechefData {
  stars?: number
  rating?: number
  highest_rating?: number
  name?: string
  country?: string
  global_rank?: string
  country_rank?: string
  error?: string
}

interface LeetcodeData {
  ranking?: number
  totalSolved?: number
  easySolved?: number
  mediumSolved?: number
  hardSolved?: number
  acceptanceRate?: string
  error?: string
}

interface GfgData {
  totalProblemsSolved?: number
  School?: number
  Basic?: number
  Easy?: number
  Medium?: number
  Hard?: number
  userName?: string
  error?: string
}

interface GfgPOTD {
  problem_name?: string
  problem_url?: string
  difficulty?: string
  accuracy?: number
  error?: string
}

interface LeetcodePOTD {
  data?: {
    activeDailyCodingChallengeQuestion?: {
      question?: {
        title?: string
        titleSlug?: string
        difficulty?: string
        acRate?: number
      }
    }
  }
  error?: string
}

interface Contest {
  id: number
  name: string
  startTimeSeconds: number
  durationSeconds: number
}

interface CodechefContest {
  contest_code: string
  contest_name: string
  contest_start_date_iso: string
  contest_end_date_iso: string
}

interface CodechefContests {
  future_contests?: CodechefContest[]
  error?: string
}

interface CodeforcesContests {
  [key: number]: Contest
  error?: string
}

export default function Dashboard() {
  const [profiles, setProfiles] = useState<ProfileData>({})
  const [codeforcesData, setCodeforcesData] = useState<CodeforcesData>({})
  const [codechefData, setCodechefData] = useState<CodechefData>({})
  const [leetcodeData, setLeetcodeData] = useState<LeetcodeData>({})
  const [gfgData, setGfgData] = useState<GfgData>({})
  const [gfgPOTD, setGfgPOTD] = useState<GfgPOTD>({})
  const [leetcodePOTD, setLeetcodePOTD] = useState<LeetcodePOTD>({})
  const [codechefContests, setCodechefContests] = useState<CodechefContests>({})
  const [codeforcesContests, setCodeforcesContests] = useState<CodeforcesContests>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/logout`)
      setIsLoggedIn(false)
      window.location.href = "/land"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth")
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true)
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setIsLoggedIn(false)
        }
      })

    const fetchData = async () => {
      setLoading(true)
      try {
        const profileResponse = await axios.get(`${api}/profile`)
        setProfiles(profileResponse.data)
      } catch (error) {
        console.error("Error fetching profile data:", error)
        setProfiles({ error: "Could not fetch profile data" })
      }

      try {
        const codeforcesResponse = await axios.get(`${api}/codeforces`)
        setCodeforcesData(codeforcesResponse.data)
      } catch (error) {
        console.error("Error fetching Codeforces data:", error)
        setCodeforcesData({ error: "Username is either not set or wrong" })
      }

      try {
        const codechefResponse = await axios.get(`${api}/codechef`)
        setCodechefData(codechefResponse.data)
      } catch (error) {
        console.error("Error fetching Codechef data:", error)
        setCodechefData({ error: "Username is either not set or wrong" })
      }

      try {
        const leetcodeResponse = await axios.get(`${api}/leetcode`)
        setLeetcodeData(leetcodeResponse.data)
      } catch (error) {
        console.error("Error fetching Leetcode data:", error)
        setLeetcodeData({ error: "Username is either not set or wrong" })
      }

      try {
        const gfgResponse = await axios.get(`${api}/gfg`)
        setGfgData(gfgResponse.data)
      } catch (error) {
        console.error("Error fetching GFG data:", error)
        setGfgData({ error: "Username is either not set or wrong" })
      }

      try {
        const gfgPOTDResponse = await axios.get(`${api}/gfg/potd`)
        setGfgPOTD(gfgPOTDResponse.data)
      } catch (error) {
        console.error("Error fetching GFG POTD:", error)
        setGfgPOTD({ error: "Could not fetch GFG POTD data" })
      }

      try {
        const leetcodePOTDResponse = await axios.get(`${api}/leetcode/potd`)
        setLeetcodePOTD(leetcodePOTDResponse.data)
      } catch (error) {
        console.error("Error fetching Leetcode POTD:", error)
        setLeetcodePOTD({ error: "Could not fetch Leetcode POTD data" })
      }

      try {
        const codechefContestsResponse = await axios.get(`${api}/codechef/contests`)
        setCodechefContests(codechefContestsResponse.data)
      } catch (error) {
        console.error("Error fetching Codechef contests:", error)
        setCodechefContests({ error: "Could not fetch Codechef contests data" })
      }

      try {
        const codeforcesContestsResponse = await axios.get(`${api}/codeforces/contests`)
        setCodeforcesContests(codeforcesContestsResponse.data)
      } catch (error) {
        console.error("Error fetching Codeforces contests:", error)
        setCodeforcesContests({ error: "Could not fetch Codeforces contests data" })
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <ProfileSection profiles={profiles} isLoggedIn={isLoggedIn} loading={loading} />
        </motion.div>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="platforms" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Platforms
            </TabsTrigger>
            <TabsTrigger value="contests" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Upcoming Contests
            </TabsTrigger>
            <TabsTrigger value="problems" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Problems of the Day
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="platforms">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
              >
                <motion.div variants={slideUp}>
                  <PlatformCard
                    platform="codeforces"
                    icon={<SiCodeforces className="h-6 w-6" />}
                    title="Codeforces"
                    data={codeforcesData}
                    loading={loading}
                    url="https://codeforces.com"
                  />
                </motion.div>

                <motion.div variants={slideUp}>
                  <PlatformCard
                    platform="codechef"
                    icon={<SiCodechef className="h-6 w-6" />}
                    title="CodeChef"
                    data={codechefData}
                    loading={loading}
                    url="https://www.codechef.com"
                  />
                </motion.div>

                <motion.div variants={slideUp}>
                  <PlatformCard
                    platform="leetcode"
                    icon={<SiLeetcode className="h-6 w-6" />}
                    title="LeetCode"
                    data={leetcodeData}
                    loading={loading}
                    url="https://leetcode.com"
                  />
                </motion.div>

                <motion.div variants={slideUp}>
                  <PlatformCard
                    platform="gfg"
                    icon={<SiGeeksforgeeks className="h-6 w-6" />}
                    title="GeeksForGeeks"
                    data={gfgData}
                    loading={loading}
                    url={`https://auth.geeksforgeeks.org/user/${gfgData.userName || ""}`}
                  />
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="contests">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={slideUp}>
                  <ContestsCard
                    platform="codeforces"
                    title="Codeforces Contests"
                    contests={codeforcesContests}
                    loading={loading}
                    url="https://codeforces.com/contests"
                  />
                </motion.div>

                <motion.div variants={slideUp}>
                  <ContestsCard
                    platform="codechef"
                    title="CodeChef Contests"
                    contests={codechefContests}
                    loading={loading}
                    url="https://codechef.com/contests"
                  />
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="problems">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={slideUp}>
                  <ProblemCard
                    platform="leetcode"
                    title="LeetCode Problem of the Day"
                    problem={leetcodePOTD?.data?.activeDailyCodingChallengeQuestion?.question}
                    loading={loading}
                    url={
                      leetcodePOTD?.data?.activeDailyCodingChallengeQuestion?.question?.titleSlug
                        ? `https://leetcode.com/problems/${leetcodePOTD.data.activeDailyCodingChallengeQuestion.question.titleSlug}`
                        : "#"
                    }
                  />
                </motion.div>

                <motion.div variants={slideUp}>
                  <ProblemCard
                    platform="gfg"
                    title="GeeksForGeeks Problem of the Day"
                    problem={gfgPOTD}
                    loading={loading}
                    url={gfgPOTD?.problem_url || "#"}
                  />
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

interface NavbarProps {
  isLoggedIn: boolean
  handleLogout: () => void
}

const Navbar = ({ isLoggedIn, handleLogout }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <Code className="h-6 w-6 text-indigo-600" />
                  <span className="text-lg">CodeTracker</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 p-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-indigo-600">
                  <Code className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/land"
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Homepage
                </Link>
                {isLoggedIn ? (
                  <a
                    href="#"
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </a>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <UserCircle className="h-4 w-4" />
                      Sign up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-xl hidden md:inline-block">CodeTracker</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/land" className="text-sm font-medium transition-colors hover:text-indigo-600">
            Homepage
          </Link>
          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="text-sm font-medium transition-colors hover:text-indigo-600"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium transition-colors hover:text-indigo-600">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium transition-colors hover:text-indigo-600">
                Sign up
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>
                    <UserCircle className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/edit" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              {isLoggedIn && (
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

interface ProfileSectionProps {
  profiles: ProfileData
  isLoggedIn: boolean
  loading: boolean
}

const ProfileSection = ({ profiles, isLoggedIn, loading }: ProfileSectionProps) => {
  if (loading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCircle className="h-6 w-6" />
              {isLoggedIn ? "Your Coding Profile" : "Welcome to CodeTracker"}
            </CardTitle>
            <CardDescription className="text-indigo-100 mt-1">
              {isLoggedIn ? "Track your progress across multiple platforms" : "Please log in to view your profile"}
            </CardDescription>
          </div>
          {isLoggedIn && (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/edit" className="flex items-center gap-1">
                <Settings className="h-4 w-4 mr-1" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 bg-white dark:bg-gray-950">
        {isLoggedIn ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProfileItem
              platform="LeetCode"
              username={profiles.leetCode}
              icon={<SiLeetcode className="h-5 w-5 text-orange-500" />}
            />
            <ProfileItem
              platform="Codeforces"
              username={profiles.codeforces}
              icon={<SiCodeforces className="h-5 w-5 text-blue-500" />}
            />
            <ProfileItem
              platform="CodeChef"
              username={profiles.codechef}
              icon={<SiCodechef className="h-5 w-5 text-amber-500" />}
            />
            <ProfileItem
              platform="GeeksForGeeks"
              username={profiles.geeksForGeeks}
              icon={<SiGeeksforgeeks className="h-5 w-5 text-green-500" />}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <UserCircle className="h-16 w-16 text-indigo-200 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Log in to track your progress across multiple coding platforms in one place
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ProfileItemProps {
  platform: string
  username?: string
  icon: React.ReactNode
}

const ProfileItem = ({ platform, username, icon }: ProfileItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{platform}</p>
        <p className="text-sm text-muted-foreground truncate">{username || "Not connected"}</p>
      </div>
      {username && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  )
}

interface PlatformCardProps {
  platform: string
  icon: React.ReactNode
  title: string
  data: any
  loading: boolean
  url: string
}

const PlatformCard = ({ platform, icon, title, data, loading, url }: PlatformCardProps) => {
  if (loading) {
    return (
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderPlatformData = () => {
    if (data.error) {
      return <p className="text-red-500 text-sm">{data.error}</p>
    }

    switch (platform) {
      case "codeforces":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {data.rank || "Unrated"}
                </Badge>
                <h3 className="text-2xl font-bold">{data.rating || "N/A"}</h3>
                <p className="text-sm text-muted-foreground">Current Rating</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Max Rating</p>
                <p className="font-medium">{data.maxRating || "N/A"}</p>
                <Badge variant="secondary" className="mt-1">
                  {data.maxRank || "Unrated"}
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {data.country && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Country</span>
                  </div>
                  <span className="text-sm font-medium">{data.country}</span>
                </div>
              )}

              {data.city && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">City</span>
                  </div>
                  <span className="text-sm font-medium">{data.city}</span>
                </div>
              )}

              {data.organization && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Organization</span>
                  </div>
                  <span className="text-sm font-medium truncate max-w-[150px]">{data.organization}</span>
                </div>
              )}

              {data.lastOnlineTimeSeconds && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last Online</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(data.lastOnlineTimeSeconds)}</span>
                </div>
              )}
            </div>
          </>
        )

      case "codechef":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: data.stars || 0 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="text-2xl font-bold">{data.rating || "N/A"}</h3>
                <p className="text-sm text-muted-foreground">Current Rating</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Highest Rating</p>
                <p className="font-medium">{data.highest_rating || "N/A"}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {data.name && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Name</span>
                  </div>
                  <span className="text-sm font-medium">{data.name}</span>
                </div>
              )}

              {data.country && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Country</span>
                  </div>
                  <span className="text-sm font-medium">{data.country}</span>
                </div>
              )}

              {data.global_rank && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Global Rank</span>
                  </div>
                  <span className="text-sm font-medium">{data.global_rank}</span>
                </div>
              )}

              {data.country_rank && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Country Rank</span>
                  </div>
                  <span className="text-sm font-medium">{data.country_rank}</span>
                </div>
              )}
            </div>
          </>
        )

      case "leetcode":
        return (
          <>
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{data.ranking || "N/A"}</h3>
              <p className="text-sm text-muted-foreground">Global Ranking</p>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Total Solved</span>
                  <span className="text-sm font-medium">{data.totalSolved || 0}</span>
                </div>
                <Progress value={data.totalSolved} max={2500} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Easy</p>
                  <p className="font-medium">{data.easySolved || 0}</p>
                </div>
                <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/30 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Medium</p>
                  <p className="font-medium">{data.mediumSolved || 0}</p>
                </div>
                <div className="rounded-md bg-red-100 dark:bg-red-900/30 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Hard</p>
                  <p className="font-medium">{data.hardSolved || 0}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Acceptance Rate</span>
              </div>
              <span className="text-sm font-medium">{data.acceptanceRate || "N/A"}</span>
            </div>
          </>
        )

      case "gfg":
        return (
          <>
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{data.totalProblemsSolved || 0}</h3>
              <p className="text-sm text-muted-foreground">Total Problems Solved</p>
            </div>

            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-2">
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="font-medium">{data.School || 0}</p>
                </div>
                <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-2">
                  <p className="text-xs text-muted-foreground">Basic</p>
                  <p className="font-medium">{data.Basic || 0}</p>
                </div>
                <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/30 p-2">
                  <p className="text-xs text-muted-foreground">Easy</p>
                  <p className="font-medium">{data.Easy || 0}</p>
                </div>
                <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/30 p-2">
                  <p className="text-xs text-muted-foreground">Medium</p>
                  <p className="font-medium">{data.Medium || 0}</p>
                </div>
                <div className="rounded-md bg-red-100 dark:bg-red-900/30 p-2 col-span-2">
                  <p className="text-xs text-muted-foreground">Hard</p>
                  <p className="font-medium">{data.Hard || 0}</p>
                </div>
              </div>
            </div>
          </>
        )

      default:
        return <p>No data available</p>
    }
  }

  return (
    <Card className="h-full overflow-hidden border-none shadow-lg">
      <CardHeader className={`${getPlatformColor(platform)} text-white pb-3`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Visit {title}</span>
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 bg-white dark:bg-gray-950">{renderPlatformData()}</CardContent>
    </Card>
  )
}

interface ContestsCardProps {
  platform: string
  title: string
  contests: any
  loading: boolean
  url: string
}

const ContestsCard = ({ platform, title, contests, loading, url }: ContestsCardProps) => {
  if (loading) {
    return (
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderContests = () => {
    if (platform === "codeforces") {
      if (!contests || !Array.isArray(contests)) {
        return <p className="text-muted-foreground text-center py-4">No upcoming contests</p>
      }

      return (
        <ScrollArea className="h-[400px] pr-4">
          {contests
            .slice()
            .reverse()
            .slice(0, 5)
            .map((contest: Contest, index: number) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">{contest.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(contest.startTimeSeconds)}</p>
                        <Badge variant="outline" className="mt-2">
                          {Math.floor(contest.durationSeconds / 3600)} hours
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0" asChild>
                        <a
                          href={`https://codeforces.com/contests/${contest.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </ScrollArea>
      )
    } else if (platform === "codechef") {
      if (
        !contests ||
        !contests.future_contests ||
        !Array.isArray(contests.future_contests) ||
        contests.future_contests.length === 0
      ) {
        return <p className="text-muted-foreground text-center py-4">No upcoming contests</p>
      }

      return (
        <ScrollArea className="h-[400px] pr-4">
          {contests.future_contests.slice(0, 5).map((contest: CodechefContest, index: number) => (
            <motion.div
              key={contest.contest_code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{contest.contest_name}</h4>
                      <div className="grid grid-cols-2 gap-x-4 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Start</p>
                          <p className="text-xs">{new Date(contest.contest_start_date_iso).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">End</p>
                          <p className="text-xs">{new Date(contest.contest_end_date_iso).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0" asChild>
                      <a
                        href={`https://www.codechef.com/contests/${contest.contest_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </ScrollArea>
      )
    }

    return <p className="text-muted-foreground text-center py-4">No contest data available</p>
  }

  return (
    <Card className="h-full overflow-hidden border-none shadow-lg">
      <CardHeader className={`${getPlatformColor(platform)} text-white pb-3`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {title}
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View all contests</span>
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 bg-white dark:bg-gray-950">{renderContests()}</CardContent>
    </Card>
  )
}

interface ProblemCardProps {
  platform: string
  title: string
  problem: any
  loading: boolean
  url: string
}

const ProblemCard = ({ platform, title, problem, loading, url }: ProblemCardProps) => {
  if (loading) {
    return (
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  const renderProblemData = () => {
    if (!problem) {
      return <p className="text-muted-foreground text-center py-4">No problem data available</p>
    }

    if (platform === "leetcode") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{problem.title || "No title available"}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty || "Unknown"}</Badge>
              <span className="text-sm text-muted-foreground">
                Acceptance: {problem.acRate !== undefined ? problem.acRate.toFixed(2) : "N/A"}%
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              asChild
              className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500"
            >
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Solve Problem
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )
    } else if (platform === "gfg") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{problem.problem_name || "No title available"}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty || "Unknown"}</Badge>
              <span className="text-sm text-muted-foreground">
                Accuracy: {problem.accuracy !== undefined ? problem.accuracy.toFixed(2) : "N/A"}%
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500"
            >
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Solve Problem
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )
    }

    return <p className="text-muted-foreground text-center py-4">No problem data available</p>
  }

  return (
    <Card className="h-full overflow-hidden border-none shadow-lg">
      <CardHeader className={`${getPlatformColor(platform)} text-white pb-3`}>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 bg-white dark:bg-gray-950">{renderProblemData()}</CardContent>
    </Card>
  )
}

