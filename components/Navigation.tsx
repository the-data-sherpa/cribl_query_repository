'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    try {
      await signOut()
      router.push('/auth/signin')
      router.refresh()
    } catch (error) {
      console.error('Failed to sign out:', error)
      // Optionally show an error message to the user
    }
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Query Repository
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href="/collections" className="text-gray-300 hover:text-white">
                My Collections
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="text-gray-300 hover:text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
} 