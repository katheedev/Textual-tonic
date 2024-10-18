'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuth } from './AuthProvider'

export default function Navigation() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <nav className="flex space-x-4 mt-4">
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <Link href="/basic-analysis">
        <Button variant="ghost">Basic Analysis</Button>
      </Link>
      <Link href="/advanced-analysis">
        <Button variant="ghost">Advanced Analysis</Button>
      </Link>
      <Link href="/history">
        <Button variant="ghost">History</Button>
      </Link>
      <Button variant="ghost" onClick={logout}>Logout</Button>
    </nav>
  )
}