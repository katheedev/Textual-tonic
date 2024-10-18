import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Basic Analysis</CardTitle>
          <CardDescription>Quick sentiment analysis for everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Get a simple positive, negative, or neutral sentiment classification for your text.</p>
        </CardContent>
        <CardFooter>
          <Link href="/basic-analysis">
            <Button>Start Basic Analysis</Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analysis</CardTitle>
          <CardDescription>Detailed sentiment metrics for registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Get comprehensive sentiment metrics, including polarity scores, subjectivity, and readability indices.</p>
        </CardContent>
        <CardFooter>
          <Link href="/advanced-analysis">
            <Button>Start Advanced Analysis</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}