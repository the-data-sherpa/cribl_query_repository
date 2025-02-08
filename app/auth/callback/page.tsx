'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/'

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } catch (error) {
          console.error('Error exchanging code for session:', error)
        }
      }

      // Redirect to home page or the intended destination
      router.push(next)
      router.refresh()
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="mb-4">Completing sign in...</div>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
} 