"use client"

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
} from "lucide-react"

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
const formatDate = (timestamp) => {
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
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return "bg-gray-500"

  const lowerDifficulty = difficulty.toLowerCase()
  if (lowerDifficulty.includes("easy") || lowerDifficulty === "school" || lowerDifficulty === "basic")
    return "bg-green-500"
  if (lowerDifficulty.includes("medium")) return "bg-yellow-500"
  if (lowerDifficulty.includes("hard")) return "bg-red-500"
  return "bg-blue-500"
}

// Helper function to get platform color
const getPlatformColor = (platform) => {
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
      return "bg-gradient-to-r from-purple-600 to-purple-400"
  }
}

const Dashboard = () => {
  const [profiles, setProfiles] = useState({})
  const [codeforcesData, setCodeforcesData] = useState({})
  const [codechefData, setCodechefData] = useState({})
  const [leetcodeData, setLeetcodeData] = useState({})
  const [gfgData, setGfgData] = useState({})
  const [gfgPOTD, setGfgPOTD] = useState({})
  const [leetcodePOTD, setLeetcodePOTD] = useState({})
  const [codechefContests, setCodechefContests] = useState({})
  const [codeforcesContests, setCodeforcesContests] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/logout`)
      setIsLoggedIn(false)
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
        setCodeforcesData({ error: "Could not fetch Codeforces data" })
      }

      try {
        const codechefResponse = await axios.get(`${api}/codechef`)
        setCodechefData(codechefResponse.data)
      } catch (error) {
        console.error("Error fetching Codechef data:", error)
        setCodechefData({ error: "Could not fetch Codechef data" })
      }

      try {
        const leetcodeResponse = await axios.get(`${api}/leetcode`)
        setLeetcodeData(leetcodeResponse.data)
      } catch (error) {
        console.error("Error fetching Leetcode data:", error)
        setLeetcodeData({ error: "Could not fetch Leetcode data" })
      }

      try {
        const gfgResponse = await axios.get(`${api}/gfg`)
        setGfgData(gfgResponse.data)
      } catch (error) {
        console.error("Error fetching GFG data:", error)
        setGfgData({ error: "Could not fetch GFG data" })
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <ProfileSection profiles={profiles} isLoggedIn={isLoggedIn} loading={loading} />
        </motion.div>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="contests">Upcoming Contests</TabsTrigger>
            <TabsTrigger value="problems">Problems of the Day</TabsTrigger>
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

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <Code className="h-5 w-5" />
                  Dashboard
                </a>
                <a href="/land" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Homepage
                </a>
                {isLoggedIn ? (
                  <a href="/logout" className="flex items-center gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </a>
                ) : (
                  <>
                    <a href="/login" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Login
                    </a>
                    <a href="/signup" className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      Sign up
                    </a>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="/dashboard" className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="font-bold text-xl hidden md:inline-block">CodeTracker</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/land" className="text-sm font-medium transition-colors hover:text-primary">
            Homepage
          </a>
          {isLoggedIn ? (
            <a
              href="/logout"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={handleLogout}
            >
              Logout
            </a>
          ) : (
            <>
              <a href="/login" className="text-sm font-medium transition-colors hover:text-primary">
                Login
              </a>
              <a href="/signup" className="text-sm font-medium transition-colors hover:text-primary">
                Sign up
              </a>
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
                <a href="/edit">Profile Settings</a>
              </DropdownMenuItem>
              {isLoggedIn && <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

const ProfileSection = ({ profiles, isLoggedIn, loading }) => {
  if (loading) {
    return (
      <Card>
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCircle className="h-6 w-6" />
              {isLoggedIn ? "Your Coding Profile" : "Welcome to CodeTracker"}
            </CardTitle>
            <CardDescription className="text-slate-100 mt-1">
              {isLoggedIn ? "Track your progress across multiple platforms" : "Please log in to view your profile"}
            </CardDescription>
          </div>
          {isLoggedIn && (
            <Button variant="secondary" size="sm" asChild>
              <a href="/edit" className="flex items-center gap-1">
                Edit Profile
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
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
            <UserCircle className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Log in to track your progress across multiple coding platforms in one place
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <a href="/login">Login</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/signup">Sign Up</a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const ProfileItem = ({ platform, username, icon }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{platform}</p>
        <p className="text-sm text-muted-foreground truncate">{username || "Not connected"}</p>
      </div>
    </div>
  )
}

const PlatformCard = ({ platform, icon, title, data, loading, url }) => {
  if (loading) {
    return (
      <Card className="h-full">
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
    <Card className="h-full overflow-hidden">
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
      <CardContent className="p-5">{renderPlatformData()}</CardContent>
    </Card>
  )
}

const ContestsCard = ({ platform, title, contests, loading, url }) => {
  if (loading) {
    return (
      <Card className="h-full">
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
            .map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <Card>
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
          {contests.future_contests.slice(0, 5).map((contest, index) => (
            <motion.div
              key={contest.contest_code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <Card>
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
    <Card className="h-full overflow-hidden">
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
      <CardContent className="p-5">{renderContests()}</CardContent>
    </Card>
  )
}

const ProblemCard = ({ platform, title, problem, loading, url }) => {
  if (loading) {
    return (
      <Card className="h-full">
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
            <Button asChild>
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
            <Button asChild>
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
    <Card className="h-full overflow-hidden">
      <CardHeader className={`${getPlatformColor(platform)} text-white pb-3`}>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">{renderProblemData()}</CardContent>
    </Card>
  )
}

export default Dashboard

