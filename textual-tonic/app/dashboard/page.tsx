'use client'

import { useAuth } from '@/components/AuthProvider'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Textual Tonic, {user.username}!</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Perform quick sentiment analysis on your text.</p>
            <Link href="/basic-analysis">
              <Button>Start Basic Analysis</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get detailed sentiment metrics and linguistic analysis.</p>
            <Link href="/advanced-analysis">
              <Button>Start Advanced Analysis</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}