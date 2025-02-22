"use client"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../components/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"


export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response  = await login(username, password)
      if (response.ok) {
        toast({
          title: "Login Success",
        })
      } else {
        const errorData = await response.json(); // Parse the JSON body
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message,
        })
        setError("Invalid username or password")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: JSON.stringify(error),
      })
      setError("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Textual Tonic</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p>
        Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

