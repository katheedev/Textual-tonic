"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function Page() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        router.push("/login") // Redirect to the login page
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        })
      }
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-primary">
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}

