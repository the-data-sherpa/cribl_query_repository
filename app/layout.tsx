import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React
import { AuthProvider } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cribl Query Repository",
  description: "A repository for Cribl Stream and Search queries",
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
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

