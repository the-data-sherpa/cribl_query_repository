import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React
import { AuthProvider } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

