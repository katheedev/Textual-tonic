'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Page() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)

  const handleAnalysis = async () => {
    const response = await fetch('api/analyze-basic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(text)}`,
    })
    const data = await response.json()
    setResult(data)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Sentiment Analysis</h2>
      <Textarea
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <Button onClick={handleAnalysis}>Analyze</Button>
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Sentiment:</strong> {result.sentiment}</p>
            <p><strong>Polarity:</strong> {result.polarity.toFixed(2)}</p>
            <p><strong>Subjectivity:</strong> {result.subjectivity.toFixed(2)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}