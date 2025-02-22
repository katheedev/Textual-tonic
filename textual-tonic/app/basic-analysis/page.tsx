"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { Loader2 } from "lucide-react"

export default function Page() {
  const [text, setText] = useState("")
  const [result, setResult] = useState({sentiment:null,polarity:0,subjectivity:0})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { user } = useAuth()

  if (!user) {
    router.push("/login")
    return null // Return null to prevent rendering the rest of the component
  }

  const handleAnalysis = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("api/analyze-basic", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `text=${encodeURIComponent(text)}`,
      })
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        console.error("Analysis failed")
        // Optionally, you can set an error state here
      }
    } catch (e) {
      console.error("Error during analysis:", e)
      // Optionally, you can set an error state here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Sentiment Analysis</h2>
      <Textarea placeholder="Enter your text here..." value={text} onChange={(e) => setText(e.target.value)} rows={5} />
      <Button onClick={handleAnalysis} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze"
        )}
      </Button>
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {result && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Sentiment:</strong> {result.sentiment}
            </p>
            <p>
              <strong>Polarity:</strong> {result.polarity.toFixed(2)}
            </p>
            <p>
              <strong>Subjectivity:</strong> {result.subjectivity.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

