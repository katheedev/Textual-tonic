"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "./AuthProvider"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/basic-analysis", label: "Basic Analysis" },
    { href: "/advanced-analysis", label: "Advanced Analysis" },
    { href: "/history", label: "History" },
  ]

  return (
    <nav className="flex space-x-4 mt-4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button
            variant="ghost"
            className={cn(
              "transition-colors duration-300",
              pathname === item.href  ? "font-semibold bg-white text-black" : "border-b-2 border-transparent",
              "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {item.label}
          </Button>
        </Link>
      ))}
      <Button variant="ghost" onClick={logout}>
        Logout
      </Button>
    </nav>
  )
}

