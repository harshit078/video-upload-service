"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react"
import { signInWithGoogle, signInWithEmail, registerWithEmail } from "@/lib/firebase"
import { useAuth } from "@/lib/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface AuthRouteProps {
  isAuthenticated: boolean
  children: React.ReactNode
}

interface FormData {
  email: string
  password: string
  name?: string
}

export const AuthRoute = ({ isAuthenticated, children }: AuthRouteProps) => {
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  })
  
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (activeTab === "login") {
        await signInWithEmail(formData.email, formData.password)
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
      } else {
        if (!formData.name) {
          throw new Error("Name is required for registration")
        }
        await registerWithEmail(formData.email, formData.password)
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        })
      }
      navigate("/")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during authentication",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      navigate("/")
    } catch (error) {
      console.error("Error signing in with Google:", error)
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const renderAuthButton = () => (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition-all duration-200 group"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          {activeTab === "login" ? "Sign in" : "Create account"}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </>
      )}
    </Button>
  )

  const renderFormFields = () => (
    <CardContent className="p-0 space-y-5 mt-6">
      {activeTab === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">Name</Label>
          <div className="relative group">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="pl-10 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
              required
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">Email</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            className="pl-10 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative group">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="pl-10 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
            required
          />
        </div>
        {activeTab === "register" && (
          <p className="text-xs text-slate-500 mt-1">Password must be at least 8 characters long</p>
        )}
      </div>
    </CardContent>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-screen max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-white/40"
      >
        {/* Illustration Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500/10 to-blue-600/20 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 z-0"></div>
          <div className="absolute inset-0 opacity-70 z-10">
            <video src="/video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Auth Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8 text-center">
            <h1 className="text-5xl text-center font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              VidStore
            </h1>
            <p className="text-slate-600 mt-2">Securely share your videos with anyone</p>
          </motion.div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8 p-1 bg-slate-100 rounded-lg">
              <TabsTrigger
                value="login"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {["login", "register"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <motion.div
                  initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit}>
                    <Card className="border-none shadow-none bg-transparent">
                      <CardHeader className="p-0">
                        <CardTitle className="text-2xl font-bold text-slate-800">
                          {tab === "login" ? "Welcome back" : "Create account"}
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                          {tab === "login"
                            ? "Enter your credentials to access your account"
                            : "Enter your information to get started"}
                        </CardDescription>
                      </CardHeader>

                      {renderFormFields()}

                      <CardFooter className="flex flex-col space-y-5 p-0 mt-6">
                        {renderAuthButton()}
                        
                        <div className="relative w-full">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"></span>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">or continue with</span>
                          </div>
                        </div>

                        <div className="grid w-[100%] gap-4">
                          <Button
                            variant="outline"
                            type="button"
                            className="bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 transition-all duration-200"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                          >
                            <img src="/googleicon.svg" alt="Google" className="w-4 h-4 mr-2" />
                            Google
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </form>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
