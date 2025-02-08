'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { toggleFavorite } from '@/lib/db'

export default function FavoriteButton({ queryId }: { queryId: string }) {
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    // Check if query is favorited
    async function checkFavorite() {
      if (!user) return
      const { data } = await supabase
        .from('favorites')
        .select()
        .match({ query_id: queryId })
        .single()
      
      setIsFavorited(!!data)
    }
    
    checkFavorite()
  }, [queryId, user])

  async function handleToggleFavorite() {
    if (!user) return
    try {
      const newState = await toggleFavorite(queryId)
      setIsFavorited(newState)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  if (!user) return null

  return (
    <button
      onClick={handleToggleFavorite}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isFavorited ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={isFavorited ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  )
} 