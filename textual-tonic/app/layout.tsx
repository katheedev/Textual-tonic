import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '../components/AuthProvider'
import Navigation from '../components/Navigation'
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Textual Tonic',
  description: 'User-friendly sentiment analysis tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground py-4">
              <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold">Textual Tonic</h1>
                <Navigation />
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-muted py-4 mt-8">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2023 Textual Tonic. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}