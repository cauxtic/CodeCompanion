"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { motion } from "framer-motion"
import { Code, Menu } from "lucide-react"
import { SiCodechef, SiCodeforces, SiGeeksforgeeks, SiLeetcode } from "react-icons/si"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

axios.defaults.withCredentials = true
const api_data = "https://codecompanion-tt6a.onrender.com/api/data"
const api_auth = "https://codecompanion-tt6a.onrender.com/api/auth"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Include credentials to make sure cookies are sent
        const response = await axios.get(`${api_auth}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setIsLoggedIn(false)
        } else {
          console.error("Error checking authentication:", error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()

    // Listen for auth state changes (optional)
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_state_changed') {
        checkAuthStatus()
      }
    })

    return () => {
      window.removeEventListener('storage', (e) => {
        if (e.key === 'auth_state_changed') {
          checkAuthStatus()
        }
      })
    }
  }, [])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${api_auth}/logout`, {}, {
        withCredentials: true // Include credentials to make sure cookies are sent
      })
      setIsLoggedIn(false)
      // Trigger a local storage event to notify other pages about the auth state change
      localStorage.setItem('auth_state_changed', Date.now().toString())
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/land" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">CodeTracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/land"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
            >
              Dashboard
            </Link>

            {isLoading ? (
              <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : isLoggedIn ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </Link>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold">CodeTracker</span>
                  </div>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/land"
                    className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                  >
                    Dashboard
                  </Link>

                  {isLoading ? (
                    <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  ) : isLoggedIn ? (
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start px-0 text-base font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <span className="block">Track your coding journey</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  all in one place
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Stay on top of your coding game with our aggregator dashboard. Track your progress, analyze your
                performance, and improve your skills across multiple platforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                {!isLoggedIn && (
                  <Button asChild size="lg" variant="outline">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                <img
                  src="/cover.png"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-xl"
                  width={800}
                  height={600}
                />
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Supported Platforms</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track your progress across all major competitive programming platforms in one unified dashboard.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeIn} className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                <SiLeetcode className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">LeetCode</h3>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <SiCodeforces className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Codeforces</h3>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20 mb-4">
                <SiCodechef className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">CodeChef</h3>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <SiGeeksforgeeks className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">GeeksForGeeks</h3>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose CodeTracker?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform offers everything you need to monitor and improve your competitive programming skills.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Track Your Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your ratings, rankings, and solved problems across all platforms in one unified dashboard.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Upcoming Contests</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay informed about upcoming contests from Codeforces, CodeChef, and other platforms so you never miss
                an opportunity.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Daily Problems</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access the problem of the day from LeetCode and GeeksForGeeks to maintain a consistent practice routine.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to elevate your coding journey?</h2>
            <p className="text-lg md:text-xl mb-8 text-indigo-100">
              Join thousands of developers who are tracking their progress and improving their skills with CodeTracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              {!isLoading && !isLoggedIn && (
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/signup">Create Account</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Code className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl text-white">CodeTracker</span>
            </div>

            <div className="flex gap-8">
              <a
                href="https://leetcode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                <SiLeetcode className="h-6 w-6" />
                <span className="sr-only">LeetCode</span>
              </a>
              <a
                href="https://codeforces.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                <SiCodeforces className="h-6 w-6" />
                <span className="sr-only">Codeforces</span>
              </a>
              <a
                href="https://codechef.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                <SiCodechef className="h-6 w-6" />
                <span className="sr-only">CodeChef</span>
              </a>
              <a
                href="https://geeksforgeeks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                <SiGeeksforgeeks className="h-6 w-6" />
                <span className="sr-only">GeeksForGeeks</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm mb-2">&copy; {new Date().getFullYear()} CodeTracker. All rights reserved.</p>
            <p className="text-sm mb-4">Created by Divyansh Omar</p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.linkedin.com/in/divyansh-omar-12b092281" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/cauxtic" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

